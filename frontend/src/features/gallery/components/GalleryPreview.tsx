import { SAMPLE_ANIMALS } from '../../../shared/constants';
import { formatAnimalAge, formatAnimalGender, formatAnimalSize } from '../../../shared/utils';

export default function GalleryPreview() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            입양 대기중인 동물들
          </h2>
          <p className="text-xl text-gray-600">
            새로운 가족을 기다리는 사랑스러운 친구들을 만나보세요
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_ANIMALS.map((animal) => (
            <div key={animal.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="h-48 bg-gradient-to-br from-orange-200 to-yellow-200 flex items-center justify-center">
                <span className="text-6xl">🐕</span>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-2">{animal.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {formatAnimalAge(animal.age)} • {formatAnimalGender(animal.gender)} • {formatAnimalSize(animal.size)}
                </p>
                <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors">
                  상세보기
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all">
            더 많은 동물 보기
          </button>
        </div>
      </div>
    </section>
  );
} 