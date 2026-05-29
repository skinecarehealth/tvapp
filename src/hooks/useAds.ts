import { useState, useEffect } from 'react';
import { AdsConfig } from '../config/ads.config';

// تحميل سكربت Adsterra
const loadAdsterraScript = () => {
  if (!AdsConfig.adsterra.enabled || !AdsConfig.adsterra.popunderScript) return;
  if (document.getElementById('adsterra-script')) return; // تجنب تحميله مراراً

  const script = document.createElement('script');
  script.id = 'adsterra-script';
  script.src = AdsConfig.adsterra.popunderScript;
  script.async = true;
  document.body.appendChild(script);
};

// تشغيل Popunder من Adsterra
const triggerAdsterraPopunder = () => {
  if (!AdsConfig.adsterra.enabled || !AdsConfig.popunder.enabled) return;
  
  const lastPopunder = localStorage.getItem('lastPopunderTime');
  const now = Date.now();
  
  // عرض Popunder كل 30 دقيقة على الأقل
  if (lastPopunder) {
    const diff = now - parseInt(lastPopunder);
    if (diff < 30 * 60 * 1000) return;
  }
  
  localStorage.setItem('lastPopunderTime', now.toString());
  
  // العديد من سكربتات Adsterra تعمل تلقائياً عند تحميلها، 
  // لكن يمكننا إضافة مستمع للنقر لتفعيل Popunder
};

export const useAds = () => {
  const [showPreroll, setShowPreroll] = useState(false);

  // تحميل سكربت Adsterra عند تحميل التطبيق
  useEffect(() => {
    loadAdsterraScript();
  }, []);

  const shouldShowPreroll = () => {
    if (!AdsConfig.preroll.enabled) return false;
    
    const lastShown = localStorage.getItem('lastPrerollTime');
    if (!lastShown) return true;

    const now = Date.now();
    const diff = now - parseInt(lastShown);
    const intervalMs = AdsConfig.preroll.intervalMinutes * 60 * 1000;
    return diff > intervalMs;
  };

  const markPrerollShown = () => {
    localStorage.setItem('lastPrerollTime', Date.now().toString());
    setShowPreroll(false);
    // تشغيل Popunder بعد إغلاق الإعلان
    triggerAdsterraPopunder();
  };

  const checkPreroll = () => {
    if (shouldShowPreroll()) {
      setShowPreroll(true);
    }
  };

  return {
    showPreroll,
    setShowPreroll,
    shouldShowPreroll,
    markPrerollShown,
    checkPreroll,
  };
};
