
export interface UserProfile {
  name: string;
  lastName: string;
  birthDate: string;
  email: string;
  password?: string;
  country: string;
  city: string;
  gender: 'male' | 'female' | 'other';
  showGenderProfile: boolean;
  passions: Passion[];
  photos: string[]; 
}

export interface Passion {
  category: string;
}
