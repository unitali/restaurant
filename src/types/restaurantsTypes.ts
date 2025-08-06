
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  createdAt: Date;
  expiredAt?: Date;
  status?: "active" | "inactive";
}