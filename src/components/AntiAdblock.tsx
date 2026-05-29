import { useState, useEffect } from 'react';

interface AdBlockDetectorProps {
  onAdBlockDetected: () => void;
}

const AdBlockDetector: React.FC<AdBlockDetectorProps> = ({ onAdBlockDetected }) => {
  useEffect(() => {
    // طريقة 1: فحص عنصر إعلان
    const checkAdElement = () => {
      const adTest = document.createElement('div');
      adTest.className = 'adsbox adsbygoogle ad-container ad-slot ad-holder';
      adTest.style.position = 'absolute';
      adTest.style.left = '-9999px';
      adTest.style.height = '1px';
      document.body.appendChild(adTest);

      setTimeout(() => {
        if (adTest.offsetHeight === 0 || adTest.offsetParent === null) {
          onAdBlockDetected();
        }
        document.body.removeChild(adTest);
      }, 100);
    };

    // طريقة 2: محاولة تحميل ملف إعلان
    const checkAdRequest = () => {
      const xhr = new XMLHttpRequest();
      xhr.onload = xhr.onerror = () => {
        // إذا كان الطلب ناجح أو يفشل بسبب CORS، قد لا يكون هناك مانع إعلانات
        // لكن نعتمد على الطريقة الأولى بشكل أساسي
      };
      xhr.open('GET', 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', true);
      xhr.send();
    };

    // فحص متكرر كل 2 ثانية
    const interval = setInterval(() => {
      checkAdElement();
      checkAdRequest();
    }, 2000);

    // فحص أولي
    setTimeout(checkAdElement, 100);

    return () => clearInterval(interval);
  }, [onAdBlockDetected]);

  return null;
};

export const AntiAdblockOverlay: React.FC = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <>
      <AdBlockDetector onAdBlockDetected={() => setShowOverlay(true)} />

      {showOverlay && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-md">
            <div className="text-6xl mb-6">🚫</div>
            <h1 className="text-3xl font-bold text-white mb-4">تعطيل مانع الإعلانات</h1>
            <p className="text-xl text-gray-300 mb-8">
              لدعم خدماتنا المجانية، يرجى تعطيل مانع الإعلانات لديك وتحديث الصفحة
            </p>
            <div className="bg-gray-800 p-6 rounded-lg mb-8 text-left">
              <h3 className="text-lg font-bold text-white mb-4">كيف تقوم بذلك؟</h3>
              <ol className="text-gray-300 space-y-2">
                <li>1. انقر على أيقونة مانع الإعلانات في شريط المتصفح</li>
                <li>2. اختر "إيقاف العمل على هذا الموقع" أو "تعطيل"</li>
                <li>3. اضغط على F5 أو زر تحديث الصفحة</li>
              </ol>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-accent text-white font-bold text-xl rounded-lg hover:bg-red-700 transition-all transform hover:scale-105"
            >
              تحديث الصفحة
            </button>
          </div>
        </div>
      )}
    </>
  );
};
