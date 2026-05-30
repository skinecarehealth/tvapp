import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

export const VideoPlayer = ({ src, poster }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Cleanup previous
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setIsLoading(true);
    setError(null);

    // Native video events - ADD THESE BEFORE setting src!
    const handleLoadedMetadata = () => {
      setIsLoading(false);
    };
    
    const handleError = () => {
      console.error('Video error:', video.error);
      let errorMsg = 'حدث خطأ أثناء تشغيل القناة';
      if (video.error) {
        switch (video.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMsg = 'تم إيقاف تحميل القناة';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMsg = 'تعذر الاتصال بالخادم - تحقق من اتصالك بالإنترنت';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMsg = 'تعذر فك تشفير البث - قد لا يتم دعم التنسيق';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMsg = 'تنسيق القناة غير مدعوم';
            break;
        }
      }
      setError(errorMsg);
      setIsLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);

    // Try to play
    const isHls = src.includes('.m3u') || src.includes('.m3u8');
    
    if (isHls && Hls.isSupported()) {
      hlsRef.current = new Hls({
        enableWorker: true,
        lowLatencyMode: false, // Disable low latency for better reliability
        debug: false,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,
        startLevel: 0,
        enableSoftwareAES: true,
        xhrSetup: (xhr) => {
          xhr.timeout = 30000; // 30 second timeout
        },
      });
      
      hlsRef.current.loadSource(src);
      hlsRef.current.attachMedia(video);
      
      hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ Manifest parsed');
        setIsLoading(false);
        video.play().catch(() => {
          // Autoplay might fail, that's okay
        });
      });
      
      hlsRef.current.on(Hls.Events.ERROR, (_event, data) => {
        console.error('❌ HLS error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('💻 Network error, trying to recover');
              hlsRef.current?.startLoad();
              setError('القناة غير متاحة الآن - قد تكون محمية أو غير متاحة في منطقتك');
              setIsLoading(false);
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('🎥 Media error, trying to recover');
              hlsRef.current?.recoverMediaError();
              break;
            default:
              setError(`خطأ: ${data.details || 'فشل تشغيل القناة'}`);
              setIsLoading(false);
              break;
          }
        }
      });
    } else if (isHls && video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari
      video.src = src;
    } else {
      // Direct source
      video.src = src;
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

  const retry = () => {
    if (videoRef.current) {
      setError(null);
      setIsLoading(true);
      videoRef.current.load();
    }
  };

  return (
    <div className="relative bg-black aspect-video w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent border-t-transparent"></div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 p-4">
          <p className="text-white text-lg mb-4 text-center">{error}</p>
          <button
            onClick={retry}
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-red-700 transition"
          >
            إعادة المحاولة
          </button>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        playsInline
        poster={poster}
      />
    </div>
  );
};
