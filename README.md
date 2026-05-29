# IPTV Player App

تطبيق ويب متكامل لمشاهدة قنوات IPTV مجانًا، مع نظام إعلانات مدمج لتحقيق الربح.

## الميزات

- تحليل ملفات M3U و M3U8 مع دعم tvg-id, tvg-name, tvg-logo, و group-title
- مشغل فيديو يدعم HLS
- قائمة القنوات مع البحث والتصفية حسب الفئة
- نظام إعلانات (إعلان قبل البث + بانرات)
- قائمة المفضلة
- تذكر آخر قناة مشاهدة
- دعم PWA (تثبيت التطبيق على الجوال)
- تصميم متجاوب

## خطوات التشغيل

1. `npm install`
2. ضع ملف playlist.m3u في مجلد `public` أو عدّل رابط الـ playlist في `src/config/playlist.config.ts`
3. أضف معرف AdSense في `src/config/ads.config.ts` (اختياري)
4. `npm run dev` للتطوير
5. `npm run build` للنشر

## النشر (Deploy)

- Vercel: اربط المشروع وانشره مباشرة
- Netlify: نفس الطريقة
- VPS: `npm run build` ثم ارفع مجلد `dist`
