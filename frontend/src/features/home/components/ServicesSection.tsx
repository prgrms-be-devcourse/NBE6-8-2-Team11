import { SERVICE_CARDS } from '../../../shared/constants';

export default function ServicesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            우리가 제공하는 서비스
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            유기동물과 입양희망자를 위한 다양한 서비스를 제공합니다
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {SERVICE_CARDS.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">{service.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 