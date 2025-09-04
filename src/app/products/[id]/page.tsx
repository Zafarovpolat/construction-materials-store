"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PackagePlus, PackageMinus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/lib/cart-context";

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    material: string;
    size: string;
    stock: number;
    featured: boolean;
    description: string;
    specs: Record<string, string>;
}

interface CartItem {
    product: Product;
    quantity: number;
}

const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Premium Portland Cement",
        price: 25000,
        image: "/1.jpg",
        category: "Cement",
        material: "Portland",
        size: "50kg",
        stock: 150,
        featured: true,
        description: "High-quality Portland cement for construction projects",
        specs: { weight: "50kg", type: "OPC 53", grade: "53", packaging: "Bags" }
    },
    {
        id: "2",
        name: "Ceramic Floor Tiles",
        price: 45000,
        image: "/2.jpg",
        category: "Tiles",
        material: "Ceramic",
        size: "60x60cm",
        stock: 200,
        featured: true,
        description: "Durable ceramic tiles perfect for flooring",
        specs: { size: "60x60cm", thickness: "8mm", finish: "Glossy", usage: "Floor/Wall" }
    },
    {
        id: "3",
        name: "Acrylic Wall Paint",
        price: 35000,
        image: "/5.jpg",
        category: "Paint",
        material: "Acrylic",
        size: "20L",
        stock: 80,
        featured: false,
        description: "Premium acrylic paint for interior walls",
        specs: { volume: "20L", coverage: "140sqm", finish: "Matt", drying: "2-4 hours" }
    },
    {
        id: "4",
        name: "White Cement",
        price: 32000,
        image: "/6.jpg",
        category: "Cement",
        material: "White Portland",
        size: "40kg",
        stock: 100,
        featured: false,
        description: "Pure white cement for decorative applications",
        specs: { weight: "40kg", type: "White OPC", grade: "53", color: "Pure White" }
    },
    {
        id: "5",
        name: "Marble Effect Tiles",
        price: 85000,
        image: "/3.jpg",
        category: "Tiles",
        material: "Porcelain",
        size: "80x80cm",
        stock: 50,
        featured: true,
        description: "Luxury porcelain tiles with marble effect",
        specs: { size: "80x80cm", thickness: "10mm", finish: "Polished", rectified: "Yes" }
    },
    {
        id: "6",
        name: "Exterior Paint",
        price: 42000,
        image: "/4.jpg",
        category: "Paint",
        material: "Weather Shield",
        size: "18L",
        stock: 60,
        featured: true,
        description: "Weather-resistant exterior paint",
        specs: { volume: "18L", coverage: "120sqm", finish: "Satin", weather: "All Weather" }
    }
];

export default function ProductPage() {
    const params = useParams();
    const productId = params.id as string;

    const [searchTerm, setSearchTerm] = useState("");

    // Use cart context
    const { addToCart, formatPrice } = useCart();

    // Find the product
    const product = MOCK_PRODUCTS.find(p => p.id === productId);

    if (!product) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                        <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
                        <Link href="/">
                            <Button>Back to Store</Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <main className="flex-1">
                {/* Back Button */}
                <div className="container py-4">
                    <Link href="/">
                        <Button variant="ghost" className="mb-0 ">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Store
                        </Button>
                    </Link>
                </div>

                {/* Product Details */}
                <div className="container py-8 pt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Product Image */}
                        <div className="aspect-square overflow-hidden rounded-lg">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6 max-w-[540px]">
                            <div>
                                <h1 className="text-3xl font-bold mb-2 text-(--color-foreground)">{product.name}</h1>
                                <p className="text-muted-foreground mb-4">{product.description}</p>

                                <div className="flex items-center gap-4 mb-4">
                                    <Badge className="p-0 leading-tight text-sm" variant={product.stock > 0 ? "secondary" : "destructive"}>
                                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                        Estimated delivery: 2-5 business days
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4">{formatPrice(product.price)}</h2>
                            </div>

                            {/* Specifications */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg">Specifications</h3>
                                <div className="grid gap-3">
                                    {Object.entries(product.specs).map(([key, value]) => (
                                        <div key={key} className="flex justify-start gap-2 bg-muted/50 rounded-lg">
                                            <span className="text-muted-foreground capitalize">{key}:</span>
                                            <span className="font-medium">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Add to Cart */}
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => addToCart(product)}
                                    disabled={product.stock === 0}
                                    className="flex-1"
                                    size="lg"
                                >
                                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
