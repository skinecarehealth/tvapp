export const PlaylistConfig = {
  // الخيار 1: ملف محلي
  source: "local",
  localPath: "/playlist.m3u",

  // الخيار 2: رابط خارجي (ضع رابط الـ playlist هنا)
  // source: "remote",
  remoteUrl: "https://your-domain.com/playlist.m3u",

  // تحديث تلقائي كل X ساعة
  autoRefresh: true,
  refreshInterval: 6, // ساعات

  // فئات مخصصة (اختياري - يتم استخراجها تلقائياً من الـ M3U)
  categories: ["الكل", "رياضة", "أخبار", "أفلام", "أطفال", "وثائقي"],
};
