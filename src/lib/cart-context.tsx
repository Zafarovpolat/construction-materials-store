"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { toast } from "sonner";

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

interface CartContextType {
    cart: CartItem[];
    cartItemCount: number;
    cartTotal: number;
    addToCart: (product: Product, quantity?: number) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    handleCheckout: () => void;
    formatPrice: (price: number) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const lastToastRef = useRef<{ productId: string; timestamp: number } | null>(null);

    // Load cart from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem("storefront-cart");
            if (savedCart) {
                try {
                    setCart(JSON.parse(savedCart));
                } catch (error) {
                    console.error("Failed to load cart from localStorage:", error);
                }
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("storefront-cart", JSON.stringify(cart));
        }
    }, [cart]);

    const cartItemCount = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }, [cart]);

    const cartTotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    }, [cart]);

    // Функция для предотвращения дублирования тостов
    const showToast = useCallback((productId: string, message: string, type: 'success' | 'error' = 'success') => {
        const now = Date.now();

        // Проверяем, не показывали ли мы уже тост для этого продукта недавно
        if (lastToastRef.current?.productId === productId &&
            now - lastToastRef.current.timestamp < 500) {
            return; // Не показываем тост, если прошло менее 500мс
        }

        lastToastRef.current = { productId, timestamp: now };

        if (type === 'success') {
            toast.success(message);
        } else {
            toast.error(message);
        }
    }, []);

    const addToCart = useCallback((product: Product, quantity: number = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product.id === product.id);
            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                if (newQuantity > product.stock) {
                    showToast(product.id, `Only ${product.stock} items available in stock`, 'error');
                    return prevCart;
                }
                showToast(product.id, `Updated ${product.name} quantity to ${newQuantity}`);
                return prevCart.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            } else {
                if (quantity > product.stock) {
                    showToast(product.id, `Only ${product.stock} items available in stock`, 'error');
                    return prevCart;
                }
                showToast(product.id, `Added ${product.name} to cart`);
                return [...prevCart, { product, quantity }];
            }
        });
    }, [showToast]);

    const updateCartQuantity = useCallback((productId: string, quantity: number) => {
        setCart(prevCart => {
            if (quantity <= 0) {
                const item = prevCart.find(item => item.product.id === productId);
                if (item) {
                    showToast(productId, `Removed ${item.product.name} from cart`);
                }
                return prevCart.filter(item => item.product.id !== productId);
            }

            return prevCart.map(item => {
                if (item.product.id === productId) {
                    if (quantity > item.product.stock) {
                        showToast(productId, `Only ${item.product.stock} items available in stock`, 'error');
                        return item;
                    }
                    return { ...item, quantity };
                }
                return item;
            });
        });
    }, [showToast]);

    const clearCart = useCallback(() => {
        setCart([]);
        showToast('cart', "Cart cleared");
    }, [showToast]);

    const handleCheckout = useCallback(() => {
        if (cart.length === 0) {
            showToast('checkout', "Your cart is empty", 'error');
            return;
        }

        // Check stock availability
        const outOfStockItems = cart.filter(item => item.quantity > item.product.stock);
        if (outOfStockItems.length > 0) {
            showToast('checkout', "Some items in your cart are out of stock", 'error');
            return;
        }

        // This will be handled by the component using the context
        // For now, just show a message
        showToast('checkout', "Redirecting to checkout...");
    }, [cart, showToast]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            minimumFractionDigits: 0
        }).format(price);
    };

    const value = {
        cart,
        cartItemCount,
        cartTotal,
        addToCart,
        updateCartQuantity,
        clearCart,
        handleCheckout,
        formatPrice
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}