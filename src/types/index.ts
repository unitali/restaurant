
export interface CategoryType {
    id?: string;
    name: string;
    description: string;
}

export interface CompanyType {
    id?: string;
    name: string;
    address: string;
    phone: string;
    createdAt?: Date;
    expiredAt?: Date;
    updatedAt?: Date;
    shortUrlMenu?: string;
    status: "active" | "inactive";
    logo: ImageType | null;
    banner: ImageType | null;
}

export interface ImageParams {
    restaurantId: string;
    file: File;
    folder?: string;
    oldImagePath?: string;
}

export interface ImageType {
    path: string;
    url: string;
    imageId: string;
}

export interface ImageState {
    file: File | null;
    removed: boolean;
    dirty: boolean;
    previewUrl: string | null;
}

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    observation?: string;
    options?: ProductOptionsType[];
}
export interface ProductType {
    id?: string;
    name: string;
    price: number;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
    observationDisplay: boolean;
    observation?: string;
    description?: string;
    image?: ImageType | null;
    options?: ProductOptionsType[];
}
export interface ProductOptionsType {
    id: string;
    name: string;
    price: number;
    quantity?: number;
}
export interface PlanType {
    name: string;
    price: string;
    features: Record<string, boolean>;
}

export interface RestaurantType {
    id?: string;
    company: CompanyType;
    categories: CategoryType[];
    settings: SettingsType;
    products: ProductType[];
    orders: OrderType[];
}

export interface OrderType {
    id?: string;
    orderNumber: string;
    items: CartItem[];
    total: number;
    status: "pending" | "inProgress" | "completed" | "canceled";
    createdAt: Date;
    updatedAt?: Date;
}

export interface SettingsType {
    primaryColor: string;
    primaryTextColor: string;
    secondaryColor: string;
    secondaryTextColor: string;
}

export interface UserType {
    id: string;
    email: string;
    profile: "admin";
    restaurantId: string;
    password: string;
    confirmPassword: string;
    createdAt: Date;
};