// Business model types
import { IMAGES } from "../constants/Images";

export interface Business {
    id: string;
    name: string;
    description: string;
    logo: any; // Changed from string to any to support image imports
    address: string;
    phone: string;
    email: string;
    website?: string;
    openingHours: OpeningHours;
    menu: Menu;
    qrCode: string; // URL to the QR code image or encoded data
    location: {
        latitude: number;
        longitude: number;
    };
    rating: number;
    reviewCount: number;
}

export interface OpeningHours {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
}

export interface Menu {
    id: string;
    businessId: string;
    categories: MenuCategory[];
}

export interface MenuCategory {
    id: string;
    name: string;
    products: Product[];
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    categoryId: string;
    businessId: string;
    ingredients?: string[];
    allergens?: string[];
    isAvailable: boolean;
    discount?: number;
    isFeatured?: boolean;
    rating?: number;
}

// Sample data for testing
export const sampleBusinesses: Business[] = [
    {
        id: "1",
        name: "Coffee Paradise",
        description:
            "A cozy coffee shop with a variety of coffee options and pastries.",
        logo: IMAGES.item1, // Using IMAGES constant reference
        address: "123 Coffee St, Brewville",
        phone: "+1 123-456-7890",
        email: "info@coffeeparadise.com",
        website: "www.coffeeparadise.com",
        openingHours: {
            monday: "7:00 AM - 8:00 PM",
            tuesday: "7:00 AM - 8:00 PM",
            wednesday: "7:00 AM - 8:00 PM",
            thursday: "7:00 AM - 8:00 PM",
            friday: "7:00 AM - 10:00 PM",
            saturday: "8:00 AM - 10:00 PM",
            sunday: "8:00 AM - 6:00 PM",
        },
        menu: {
            id: "m1",
            businessId: "1",
            categories: [
                {
                    id: "c1",
                    name: "Hot Coffee",
                    products: [
                        {
                            id: "p1",
                            name: "Espresso",
                            description:
                                "Strong black coffee made by forcing steam through ground coffee beans",
                            price: 2.99,
                            image: IMAGES.item1, // Using IMAGES constant reference
                            categoryId: "c1",
                            businessId: "1",
                            ingredients: ["Coffee beans"],
                            isAvailable: true,
                            rating: 4.8,
                        },
                        {
                            id: "p2",
                            name: "Cappuccino",
                            description: "Coffee with steamed milk foam",
                            price: 3.99,
                            image: IMAGES.item2, // Using IMAGES constant reference
                            categoryId: "c1",
                            businessId: "1",
                            ingredients: ["Coffee", "Milk"],
                            isAvailable: true,
                            rating: 4.7,
                        },
                    ],
                },
                {
                    id: "c2",
                    name: "Cold Coffee",
                    products: [
                        {
                            id: "p3",
                            name: "Iced Latte",
                            description: "Espresso with cold milk and ice",
                            price: 4.49,
                            image: IMAGES.item3, // Using IMAGES constant reference
                            categoryId: "c2",
                            businessId: "1",
                            ingredients: ["Coffee", "Milk", "Ice"],
                            isAvailable: true,
                            rating: 4.6,
                        },
                    ],
                },
            ],
        },
        qrCode: "https://example.com/qrcodes/business1.png",
        location: {
            latitude: 37.7749,
            longitude: -122.4194,
        },
        rating: 4.7,
        reviewCount: 120,
    },
    {
        id: "2",
        name: "Bean & Brew",
        description:
            "Specialty coffee shop focusing on unique international coffee beans.",
        logo: IMAGES.item2, // Using IMAGES constant reference
        address: "456 Latte Ave, Beantown",
        phone: "+1 987-654-3210",
        email: "hello@beanandbrew.com",
        website: "www.beanandbrew.com",
        openingHours: {
            monday: "6:30 AM - 7:00 PM",
            tuesday: "6:30 AM - 7:00 PM",
            wednesday: "6:30 AM - 7:00 PM",
            thursday: "6:30 AM - 7:00 PM",
            friday: "6:30 AM - 9:00 PM",
            saturday: "7:00 AM - 9:00 PM",
            sunday: "7:00 AM - 5:00 PM",
        },
        menu: {
            id: "m2",
            businessId: "2",
            categories: [
                {
                    id: "c3",
                    name: "Signature Brews",
                    products: [
                        {
                            id: "p4",
                            name: "Ethiopian Yirgacheffe",
                            description:
                                "Light-bodied coffee with bright acidity and complex flavor",
                            price: 5.99,
                            image: IMAGES.item4, // Using IMAGES constant reference
                            categoryId: "c3",
                            businessId: "2",
                            ingredients: ["Ethiopian Coffee Beans"],
                            isAvailable: true,
                            isFeatured: true,
                            rating: 4.9,
                        },
                    ],
                },
            ],
        },
        qrCode: "https://example.com/qrcodes/business2.png",
        location: {
            latitude: 34.0522,
            longitude: -118.2437,
        },
        rating: 4.8,
        reviewCount: 85,
    },
];
