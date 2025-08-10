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
    status?: "active" | "inactive";
}

export interface ImageParams {
    file: File;
    folder: string;
    oldImagePath?: string;
}

export interface ImageType {
    path: string;
    url: string;
    imageId: string;
}

export interface CartItem {
    product: ProductType;
    quantity: number;
    price: number;
}

export interface ProductType {
    id?: string;
    name: string;
    price: number;
    categoryId: string;
    description?: string;
    image?: ImageType | null;
}

export interface RestaurantType {
    company: CompanyType;
    categories: CategoryType;
    settings: SettingsType;
    products: ProductType;
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