// UserType
export enum UserType {
  EMPTY = "empty",
  MERCHANT = "merchant",
  CUSTOMER = "customer",
  MINISTRY_OFFICER = "ministry_officer",
}

export interface MerchantDataResponse {
  status: string;
  code: number;
  data: MerchantData[];
  message: string;
}

// login types
export interface User<UserTypeData> {
  userId: number;
  username: string;
  password: string;
  data: UserTypeData;
}

// user types and their data
export type UserTypeData =
  | { type: UserType.MERCHANT; data: MerchantData }
  | { type: UserType.CUSTOMER; data: CustomerData }
  | { type: UserType.MINISTRY_OFFICER; data: MinistryOfficerData };

// merchant related interface types
export enum MerchantStatus {
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  PENDING = "pending",
}

export interface MerchantData {
  merchantId: number;
  name: string;
  contactNumber: number;
  contactEmail: string;
  description: string;
  businessFileURLs: string[];
  status: MerchantStatus;
  products: Product[];
}

export interface Product {
  [key: string]: any;
  productId: number;
  address: string;
  name: string;
  description: string;
  price: number;
  type: string;
  productImageURLs: string[];
  merchantId: number;
}

// Customer related interface types
export interface CustomerData {
  customerId: number;
}

// Ministry Officer related interface types
export interface MinistryOfficerData {
  officerId: number;
}

// business related interface types
export interface Business {
  merchantId: number; // as owner of the business
  businessId: number;
  name: string;
  description: string;
  address: string;
  contactNumber: string;
  contactEmail: string;
  businessFileURLs: string[];
}
