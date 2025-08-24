
export interface CategoryType {
    id?: string;
    name: string;
    description: string;
}

export interface CompanyType {
    id?: string;
    brandName: string;
    legalName?: string;
    document?: string;
    address: AddressType;
    phone: string;
    logo: ImageType | null;
    banner: ImageType | null;
}

export interface AddressType {
    street: string;
    number: string;
    neighborhood: string;
    reference?: string;
    city?: string;
    state?: string;
    zipCode?: string;
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
    name?: string;
    price?: number;
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
    name?: string;
    price?: number;
    quantity?: number;
}
export interface PlanType {
    name: string;
    price: string;
    features: Record<string, boolean>;
}

export interface OpeningHoursType {
    [key: string]: {
        open: boolean;
        hours: string;
    };
}

export interface DeliveryType {
    enabled: boolean;
    takeout: boolean;
    tax: {
        price: number;
        maxDistance: number;
    }[]
}

export interface RestaurantType {
    id?: string;
    company: CompanyType;
    categories: CategoryType[];
    settings: SettingsType;
    products: ProductType[];
    orders: OrderType[];
    delivery?: DeliveryType | null;
    paymentMethods?: PaymentMethodsType;
    isOpen?: boolean;
    openingHours?: OpeningHoursType;
    plan?: PlanType;
    createdAt?: Date;
    expiredAt?: Date;
    updatedAt?: Date;
    status: "active" | "inactive";
    shortUrlMenu?: string;
}

export interface PaymentMethodsType {
    card: boolean;
    cash: boolean;
    pix: boolean;
}

export interface OrderType {
    id?: string;
    items: CartItem[];
    total?: number;
    address: AddressType | null;
    paymentMethod: string;
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