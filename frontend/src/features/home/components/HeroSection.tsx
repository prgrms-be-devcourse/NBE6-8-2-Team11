import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
              사랑스러운 <span className="text-orange-500">반려동물</span>과<br />
              특별한 인연을 만들어보세요
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              유기동물들에게 새로운 가족이 되어주세요. 
              우리는 보호소와 입양희망자를 연결하여 
              모든 동물이 사랑받는 가정에서 살 수 있도록 도와드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/gallery">
                <button className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all transform hover:scale-105">
                  보호중인 아이들 보러가기
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all transform hover:scale-105">
                  회원가입
                </button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                  <div className="w-full h-48 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-xl flex items-center justify-center">
                    <span className="text-4xl">🐕</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg transform -rotate-2 hover:rotate-0 transition-transform">
                  <div className="w-full h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">🐱</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-white rounded-2xl p-4 shadow-lg transform -rotate-1 hover:rotate-0 transition-transform">
                  <div className="w-full h-32 bg-gradient-to-br from-green-200 to-teal-200 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">🐰</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg transform rotate-2 hover:rotate-0 transition-transform">
                  <div className="w-full h-48 bg-gradient-to-br from-pink-200 to-red-200 rounded-xl flex items-center justify-center">
                    <span className="text-4xl">🐦</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 