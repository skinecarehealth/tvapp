import { useEffect, useState } from 'react';
import { AdsConfig } from '../config/ads.config';
import { X } from 'lucide-react';

interface AdPrerollProps {
  onClose: () => void;
}

export const AdPreroll = ({ onClose }: AdPrerollProps) => {
  const [remainingTime, setRemainingTime] = useState(AdsConfig.preroll.duration);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, AdsConfig.preroll.skipAfter * 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(skipTimer);
    };
  }, [onClose]);

  const handleSkip = () => {
    if (canSkip) {
      onClose();
    }
  };

  const currentAd = AdsConfig.preroll.fallbackAds[0];

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4 text-white text-sm">
        {canSkip ? (
          <button
            onClick={handleSkip}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full hover:bg-white/30 transition"
          >
            تخطي <X size={18} />
          </button>
        ) : (
          <div className="px-4 py-2 bg-white/20 rounded-full">
            يمكن التخطي بعد {remainingTime} ثوانٍ
          </div>
        )}
      </div>
      {currentAd && (
        <a
          href={currentAd.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-4xl aspect-video"
        >
          <img
            src={currentAd.image}
            alt={currentAd.alt}
            className="w-full h-full object-cover"
          />
        </a>
      )}
    </div>
  );
};
