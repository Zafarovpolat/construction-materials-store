"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Store, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PackagePlus, PackageMinus } from "lucide-react";
import { useCart } from "@/lib/cart-context";

interface HeaderProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export default function Header({ searchTerm, setSearchTerm }: HeaderProps) {
    const router = useRouter();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { cart, cartItemCount, cartTotal, updateCartQuantity, clearCart, handleCheckout, formatPrice } = useCart();

    const handleCartCheckout = useCallback(() => {
        // Close the cart sheet and trigger checkout
        setIsCartOpen(false);

        // Check if cart is empty
        if (cart.length === 0) {
            handleCheckout(); // This will show the error message
            return;
        }

        // Check stock availability
        const outOfStockItems = cart.filter(item => item.quantity > item.product.stock);
        if (outOfStockItems.length > 0) {
            handleCheckout(); // This will show the error message
            return;
        }

        // Navigate to checkout page
        router.push("/checkout");
    }, [cart, handleCheckout, router]);

    return (
        <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Store className="h-6 w-6 text-primary" />
                    <span className="text-lg font-semibold">BuildMart</span>
                </div>

                <div className="flex-1 max-w-md mx-4 hidden md:block w-full">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="relative">
                                <ShoppingCart className="h-4 w-4" />
                                {cartItemCount > 0 && (
                                    <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs">
                                        {cartItemCount}
                                    </Badge>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-md overflow-y-auto gap-0">
                            <SheetHeader>
                                <SheetTitle>Shopping Cart ({cartItemCount} items)</SheetTitle>
                            </SheetHeader>

                            <div className="flex-1 space-y-4 p-4 pt-0">
                                {cart.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">Your cart is empty</p>
                                    </div>
                                ) : (
                                    <>
                                        {cart.map((item) => (
                                            <div key={item.product.id} className="flex gap-4 rounded-lg border p-4">
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    className="h-16 w-16 rounded-md object-cover"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-medium">{item.product.name}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.product.size} • {item.product.material}
                                                    </p>
                                                    <p className="font-semibold">{formatPrice(item.product.price)}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                                        >
                                                            <PackageMinus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                                        >
                                                            <PackagePlus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    <p className="text-sm font-semibold">
                                                        {formatPrice(item.product.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="space-y-4 border-t pt-4">
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    placeholder="Promo code"
                                                    className="flex-1"
                                                />
                                                <Button variant="outline" size="sm">Apply</Button>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span>Subtotal:</span>
                                                    <span className="font-semibold">{formatPrice(cartTotal)}</span>
                                                </div>
                                            </div>

                                            <Button onClick={handleCartCheckout} className="w-full" size="lg">
                                                Proceed to Checkout
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>


                </div>
            </div>
        </header>
    );
}
