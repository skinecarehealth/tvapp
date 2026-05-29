import { useEffect, useRef, useState } from 'react';
import { AdsConfig } from '../config/ads.config';

interface AdBannerProps {
  size: 'leaderboard' | 'rectangle' | 'mobile';
}

export const AdBanner = ({ size }: AdBannerProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef<{ [key: string]: boolean }>({});
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const ads = AdsConfig.preroll.fallbackAds;

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex(prev => (prev + 1) % ads.length);
      }, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [ads.length]);

  useEffect(() => {
    if (!adRef.current) return;
    
    // For leaderboard size, use High Performance Format if available
    if (size === 'leaderboard' && AdsConfig.highPerformanceFormat?.enabled) {
      const config = AdsConfig.highPerformanceFormat.leaderboard;
      
      // Only load the script once per page
      if (scriptLoadedRef.current['hpf-leaderboard']) return;
      scriptLoadedRef.current['hpf-leaderboard'] = true;

      // Set up atOptions
      (window as any).atOptions = {
        key: config.key,
        format: config.format,
        height: config.height,
        width: config.width,
        params: {}
      };

      // Load the script
      const script = document.createElement('script');
      script.src = config.scriptUrl;
      script.async = true;
      
      adRef.current.appendChild(script);
      
      return () => {
        // Cleanup
        delete (window as any).atOptions;
      };
    }
    
    // For other sizes, show fallback ads
  }, [size]);

  const dimensions = {
    leaderboard: 'w-full h-[90px]',
    rectangle: 'w-full max-w-[300px] h-[250px]',
    mobile: 'w-full h-[50px]',
  };

  // Show the ad container
  if (size === 'leaderboard' && AdsConfig.highPerformanceFormat?.enabled) {
    return (
      <div
        ref={adRef}
        className={`${dimensions[size]} bg-gray-800 flex items-center justify-center overflow-hidden`}
      />
    );
  }

  // For other sizes, show fallback ads
  if (ads.length === 0) return null;
  const currentAd = ads[currentAdIndex];
  return (
    <a
      href={currentAd.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`${dimensions[size]} bg-gray-800 flex items-center justify-center overflow-hidden`}
    >
      <img
        src={currentAd.image}
        alt={currentAd.alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = '<span class="text-gray-400">إعلان</span>';
          }
        }}
      />
    </a>
  );
};
