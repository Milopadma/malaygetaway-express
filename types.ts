export interface Merchant {
  id: number;
  username: string;
  password: string;
  phoneNumber: number;
  email: string;
}

export interface Business {
  id: number;
  name: string;
  description: string;
  address: string;
  contactNumber: string;
  contactEmail: string;
}
