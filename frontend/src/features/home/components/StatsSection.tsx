import { STATS_DATA } from '../../../shared/constants';
import { formatNumber } from '../../../shared/utils';

export default function StatsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {STATS_DATA.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="text-4xl font-bold text-orange-500">
                {formatNumber(stat.value)}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 