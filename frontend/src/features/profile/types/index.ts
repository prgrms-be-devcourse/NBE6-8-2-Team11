export interface User {
  memberId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage?: string;
  memberType: 'adopter' | 'shelter';
  createdAt: Date;
  bio?: string;
}

export interface AdoptionRecord {
  id: number;
  title: string;
  type: 'ADOPTION' | 'CARE';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  petInfo?: {
    id: number;
    name: string;
    species: string;
    age: number;
    gender: string;
    imageUrl: string;
    shelterName?: string;
  };
  desiredStartDate?: string; // Care인 경우에만
  desiredEndDate?: string;   // Care인 경우에만
} 