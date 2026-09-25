export type ApiSuccess<T> = { data: T; error: null };
export type ApiError = { data: null; error: { message: string; code: string } };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export interface GeoPoint {
  longitude: number;
  latitude: number;
}

export type Geolocation = {
  id?: string;
  userId?: string;
  location: GeoPoint;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  country: string | null;
};

export const VALID_ROLES = ["buyer", "seller", "admin", "moderator"] as const;
export type UserRole = (typeof VALID_ROLES)[number];

export type User = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  accountStatus: "active" | "suspended" | "banned" | "pending_review";
  reputationScore: number;
  isVerified: boolean;
  phoneNumber?: string | null;
  roles: UserRole[];
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  country?: string | null;
};

export type UpdateUserInput = Partial<
  Pick<
    User,
    | "firstName"
    | "lastName"
    | "phoneNumber"
    | "city"
    | "province"
    | "postalCode"
    | "country"
  >
>;

export type JwtPayload = {
  userId: string;
  email: string;
  roles: UserRole[];
  accountStatus: "active" | "suspended" | "banned" | "pending_review";
};
