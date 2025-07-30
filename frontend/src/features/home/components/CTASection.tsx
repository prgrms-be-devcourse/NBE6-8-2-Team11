export default function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 to-yellow-500">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          아이들이 당신을 기다립니다
        </h2>
        <p className="text-xl text-orange-100 mb-8">
          작은 관심이 큰 변화를 만들어냅니다. 
          유기동물들에게 새로운 희망을 선물해주세요.
        </p>
        <div className="flex justify-center">
          <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-orange-500 transition-all">
            입양/돌봄 신청하기
          </button>
        </div>
      </div>
    </section>
  );
} 