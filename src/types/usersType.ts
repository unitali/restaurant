export interface User {
  id: string;
  email: string;
  profile: "admin" | "user";
  restaurantId: string;
  password?: string;
  confirmPassword?: string;
  createdAt?: Date;
}