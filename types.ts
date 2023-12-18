export enum MerchantStatus {
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    PENDING = "pending"
}

export interface Merchant {
  id: number;
  username: string;
  password: string;
  phoneNumber: number;
  email: string;
  status: MerchantStatus
}

export interface Business {
  id: number;
  name: string;
  description: string;
  address: string;
  contactNumber: string;
  contactEmail: string;
}
