export const AdsConfig = {
  adsense: {
    enabled: false,
    publisherId: 'ca-pub-XXXXXXXXXX', // يُضاف من المالك
    slots: {
      banner: 'XXXXXXXXXX',
      rectangle: 'XXXXXXXXXX',
    }
  },
  adsterra: {
    enabled: true, // تفعيل Adsterra
    popunderScript: 'https://pl29004958.effectivecpmnetwork.com/64/bf/d0/64bfd08b363cf1d3d83bf875754928c7.js',
    // يمكن إضافة المزيد من وحدات Adsterra هنا لاحقاً:
    // leaderboardScript: '',
    // rectangleScript: '',
    // mobileScript: '',
  },
  highPerformanceFormat: {
    enabled: true, // تفعيل High Performance Format
    leaderboard: {
      key: 'cd004ab74e5477245a5145a92248ef5e',
      format: 'iframe',
      height: 90,
      width: 728,
      scriptUrl: 'https://www.highperformanceformat.com/cd004ab74e5477245a5145a92248ef5e/invoke.js',
    }
  },
  preroll: {
    enabled: true,
    duration: 15,         // ثانية
    skipAfter: 5,         // ثانية
    intervalMinutes: 10,  // المدة بين إعلانين
    // ضع هنا إعلانات صور بديلة إذا لم يكن AdSense متاحاً:
    fallbackAds: [
      { image: 'https://picsum.photos/1280/720', link: 'https://example.com', alt: 'إعلان 1' },
      { image: 'https://picsum.photos/728/90', link: 'https://example.com', alt: 'إعلان 2' },
      { image: 'https://picsum.photos/300/250', link: 'https://example.com', alt: 'إعلان 3' },
    ]
  },
  popunder: {
    enabled: true, // تفعيل Popunder من Adsterra
    url: 'https://example.com'
  }
};
