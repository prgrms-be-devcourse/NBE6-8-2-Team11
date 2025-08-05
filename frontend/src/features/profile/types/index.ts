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
  petId: number;
  petName: string;
  petImage?: string;
  shelterName: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  appliedAt: Date;
  updatedAt?: Date;
} 