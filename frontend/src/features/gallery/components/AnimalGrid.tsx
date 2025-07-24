import { Pet } from '@/shared/types';
import AnimalCard from './AnimalCard';

interface AnimalGridProps {
  pets: Pet[];
}

export default function AnimalGrid({ pets }: AnimalGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {pets.map((pet) => (
        <AnimalCard key={pet.id} pet={pet} />
      ))}
    </div>
  );
} 