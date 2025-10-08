export interface UserProfile {
  uid: string;
  name: string;
  lastName: string;
  birthDate: string;
  country: string;
  city: string;
  gender: string;
  showGenderProfile: boolean;
  passions: { category: string }[];
  photos: string[];
}

export interface Passion {
  category: string;
}
