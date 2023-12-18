// UserType
export enum UserType {
  EMPTY = "empty",
  MERCHANT = "merchant",
  CUSTOMER = "customer",
  MINISTRY_OFFICER = "ministry_officer"
}

// login types
export interface User<UserTypeData = { type: UserType.EMPTY; data: null }> {
  [x: string]: any;
  userId: number;
  username: string;
  password: string;
  data: UserTypeData;
}

// user types and their data
export type UserTypeData = 
  | { type: UserType.EMPTY; data: null}
  | { type: UserType.MERCHANT; data: MerchantData }
  | { type: UserType.CUSTOMER; data: CustomerData }
  | { type: UserType.MINISTRY_OFFICER; data: MinistryOfficerData };

// merchant related interface types
export enum MerchantStatus {
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    PENDING = "pending"
}

export interface MerchantData {
  merchantId: number;
  phoneNumber: number;
  email: string;
  status: MerchantStatus
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
  id: number;
  name: string;
  description: string;
  address: string;
  contactNumber: string;
  contactEmail: string;
}
