"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";

const DELIVERY_OPTIONS = [
    { id: 'standard', name: 'Standard Delivery', price: 5000, estimatedDays: '3-5 business days' },
    { id: 'express', name: 'Express Delivery', price: 10000, estimatedDays: '1-2 business days' },
    { id: 'pickup', name: 'Store Pickup', price: 35000, estimatedDays: 'Ready for pickup in 1 hour' },
];

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, cartTotal, clearCart, formatPrice } = useCart();
    const [checkoutStep, setCheckoutStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [checkoutData, setCheckoutData] = useState<{
        contact: {
            name: string;
            phone: string;
            email: string;
            address: string;
        };
        delivery: {
            id: string;
            name: string;
            price: number;
            estimatedDays: string;
        } | null;
        payment: {
            method: string;
        };
    }>({
        contact: {
            name: '',
            phone: '',
            email: '',
            address: '',
        },
        delivery: null,
        payment: {
            method: '',
        },
    });

    const handleOrderSubmit = async () => {
        setIsLoading(true);
        try {
            // Simulate order processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            clearCart();
            router.push('/');
        } catch (error) {
            console.error('Order submission failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-8">
            <div className="container py-8 px-0">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-4 sm:mb-8">
                        <h1 className="text-2xl font-bold mb-2 text-(--color-foreground)">Checkout</h1>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className={`flex items-center gap-2 ${checkoutStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                                <div className={`w-8 h-8 aspect-square rounded-full flex items-center justify-center text-sm font-medium ${checkoutStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    1
                                </div>
                                <span>Shipping & Contact</span>
                            </div>
                            <div className="h-px bg-border flex-1" />
                            <div className={`flex items-center gap-2 ${checkoutStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                                <div className={`w-8 h-8 aspect-square rounded-full flex items-center justify-center text-sm font-medium ${checkoutStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    2
                                </div>
                                <span>Payment & Review</span>
                            </div>
                        </div>
                    </div>

                    {checkoutStep === 1 ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Shipping & Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={checkoutData.contact.name}
                                            onChange={(e) => setCheckoutData(prev => ({
                                                ...prev,
                                                contact: { ...prev.contact, name: e.target.value }
                                            }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={checkoutData.contact.phone}
                                            onChange={(e) => setCheckoutData(prev => ({
                                                ...prev,
                                                contact: { ...prev.contact, phone: e.target.value }
                                            }))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={checkoutData.contact.email}
                                        onChange={(e) => setCheckoutData(prev => ({
                                            ...prev,
                                            contact: { ...prev.contact, email: e.target.value }
                                        }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Delivery Address</Label>
                                    <Input
                                        id="address"
                                        value={checkoutData.contact.address}
                                        onChange={(e) => setCheckoutData(prev => ({
                                            ...prev,
                                            contact: { ...prev.contact, address: e.target.value }
                                        }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Label>Delivery Options</Label>
                                    <div className="space-y-3">
                                        {DELIVERY_OPTIONS.map((option) => (
                                            <div
                                                key={option.id}
                                                className={`p-4 rounded-lg border cursor-pointer transition-colors ${checkoutData.delivery?.id === option.id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'hover:bg-muted/50'
                                                    }`}
                                                onClick={() => setCheckoutData(prev => ({ ...prev, delivery: option }))}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium">{option.name}</h4>
                                                        <p className="text-sm text-muted-foreground">{option.estimatedDays}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold">{formatPrice(option.price)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 flex-col sm:flex-row">
                                    <Link href="/">
                                        <Button variant="outline">
                                            Back to Cart
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={() => setCheckoutStep(2)}
                                        disabled={!checkoutData.contact.name || !checkoutData.contact.phone || !checkoutData.contact.email || !checkoutData.contact.address || !checkoutData.delivery}
                                        className="flex-1"
                                    >
                                        Continue to Payment
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="gap-2 sm:gap-6">
                            <CardHeader>
                                <CardTitle>Payment & Order Review</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="font-semibold">Order Summary</h3>
                                    <div className="space-y-3">
                                        {cart.map((item) => (
                                            <div key={item.product.id} className="flex justify-between">
                                                <div>
                                                    <span className="font-medium">{item.product.name}</span>
                                                    <span className="text-muted-foreground"> × {item.quantity}</span>
                                                </div>
                                                <span>{formatPrice(item.product.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                        <div className="border-t pt-3">
                                            <div className="flex justify-between">
                                                <span>Subtotal:</span>
                                                <span>{formatPrice(cartTotal)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Delivery:</span>
                                                <span>{formatPrice(checkoutData.delivery?.price || 0)}</span>
                                            </div>
                                            <div className="flex justify-between font-semibold text-lg">
                                                <span>Total:</span>
                                                <span>{formatPrice(cartTotal + (checkoutData.delivery?.price || 0))}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label>Payment Method</Label>
                                    <div className="space-y-3">
                                        {['Paynet', 'Click', 'Apelsin'].map((method) => (
                                            <div
                                                key={method}
                                                className={`p-4 rounded-lg border cursor-pointer transition-colors ${checkoutData.payment.method === method
                                                    ? 'border-primary bg-primary/5'
                                                    : 'hover:bg-muted/50'
                                                    }`}
                                                onClick={() => setCheckoutData(prev => ({
                                                    ...prev,
                                                    payment: { method }
                                                }))}
                                            >
                                                <h4 className="font-medium">{method}</h4>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 flex-col sm:flex-row">
                                    <Button variant="outline" onClick={() => setCheckoutStep(1)}>
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleOrderSubmit}
                                        disabled={!checkoutData.payment.method || isLoading}
                                        className="flex-1"
                                    >
                                        {isLoading ? "Processing..." : "Place Order"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
