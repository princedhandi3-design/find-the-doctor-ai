export interface Doctor {
  id: string;
  name: string;
  hospital: string;
  rating: number;
  reviews: number;
  address: string;
  phone?: string;
  latitude: number;
  longitude: number;
  googleMapsUri?: string;
}