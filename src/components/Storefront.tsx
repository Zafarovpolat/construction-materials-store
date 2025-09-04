"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Search, ListFilter, ArrowDownUp, SearchX } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/Header";
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

interface DeliveryOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
}

interface CheckoutData {
  contact: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  delivery: DeliveryOption | null;
  payment: {
    method: string;
  };
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

const DELIVERY_OPTIONS: DeliveryOption[] = [
  { id: "courier", name: "In-house Courier", price: 15000, estimatedDays: "1-2 days" },
  { id: "standard", name: "Standard Delivery", price: 8000, estimatedDays: "3-5 days" },
  { id: "express", name: "Express Delivery", price: 25000, estimatedDays: "Same day" }
];

export default function Storefront() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [showInStock, setShowInStock] = useState(false);
  const [sortBy, setSortBy] = useState("name-asc");
  const [isCheckout, setIsCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    contact: { name: "", phone: "", email: "", address: "" },
    delivery: null,
    payment: { method: "" }
  });
  const [promoCode, setPromoCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  const categories = ["All", "Cement", "Tiles", "Paint"];

  // Use cart context
  const { cart, cartItemCount, cartTotal, addToCart, updateCartQuantity, clearCart, formatPrice } = useCart();

  // Track screen width for responsive featured products
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = MOCK_PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.material.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesStock = !showInStock || product.stock > 0;

      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, priceRange, showInStock, sortBy]);

  const featuredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => product.featured);
  }, []);

  const handleCheckout = useCallback(() => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Check stock availability
    const outOfStockItems = cart.filter(item => item.quantity > item.product.stock);
    if (outOfStockItems.length > 0) {
      toast.error("Some items in your cart are out of stock");
      return;
    }

    setIsCheckout(true);
  }, [cart]);

  const handleOrderSubmit = useCallback(async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock order creation
    const orderId = `ORD-${Date.now()}`;

    setIsLoading(false);
    setIsCheckout(false);
    setCheckoutStep(1);
    clearCart();

    toast.success(`Order ${orderId} placed successfully! You will receive a confirmation email shortly.`);
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {isCheckout ? (
        /* Checkout Flow */
        <div className="container py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2 text-(--color-foreground)">Checkout</h1>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${checkoutStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${checkoutStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    1
                  </div>
                  <span>Shipping & Contact</span>
                </div>
                <div className="h-px bg-border flex-1" />
                <div className={`flex items-center gap-2 ${checkoutStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${checkoutStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
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
                  <div className="grid grid-cols-2 gap-4">
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

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setIsCheckout(false)}>
                      Back to Cart
                    </Button>
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
              <Card>
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

                  <div className="flex gap-4">
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
      ) : (
        /* Main Storefront */
        <>
          {/* Hero Section */}
          <section className="relative bg-hero text-white flex rounded-b-3xl overflow-hidden" style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/45a62abe-1b7d-41c6-b425-804a0008b26c/generated_images/wide-cinematic-shot-of-a-modern-construc-e69f8fc3-20250902150743.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '75vh',
          }}>
            <div className="container text-center relative z-10 m-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Quality Building Materials
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Everything you need for your construction project
              </p>
              <Button
                size="lg"
                className="bg-white text-hero hover:bg-white/90"
                onClick={() => {
                  const catalogSection = document.getElementById('catalog');
                  catalogSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Shop Now
              </Button>
            </div>
          </section>

          {/* Featured Products */}
          <section className="py-16 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(screenWidth >= 1024 && screenWidth < 1280 ? featuredProducts.slice(0, 3) : featuredProducts).map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow p-0 gap-2">
                    <Link href={`/products/${product.id}`}>
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          loading="lazy"
                        />
                      </div>
                    </Link>
                    <CardContent className="p-4">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold mb-1 hover:text-primary transition-colors cursor-pointer">{product.name}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.size} • {product.material}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                          }}
                          disabled={product.stock === 0}
                        >
                          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="py-8 border-b">
            <div className="container">
              <div className="flex gap-4 justify-center">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(selectedCategory === category ? "All" : category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          {/* Product Catalog */}
          <section id="catalog" className="py-16">
            <div className="container">
              <h2 className="text-3xl font-bold mb-8">Product Catalog</h2>

              {/* Filters and Sort */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ListFilter className="h-5 w-5" />
                        Filters
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Price Range</Label>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={100000}
                          step={1000}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{formatPrice(priceRange[0])}</span>
                          <span>{formatPrice(priceRange[1])}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Categories</Label>
                        {categories.slice(1).map((category) => (
                          <Button
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(selectedCategory === category ? "All" : category)}
                            className="w-full justify-start"
                          >
                            {category}
                          </Button>
                        ))}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="stock-filter"
                          checked={showInStock}
                          onCheckedChange={setShowInStock}
                        />
                        <Label htmlFor="stock-filter">In stock only</Label>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-3 space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48">
                        <ArrowDownUp className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name-asc">Name A → Z</SelectItem>
                        <SelectItem value="name-desc">Name Z → A</SelectItem>
                        <SelectItem value="price-asc">Price: Low → High</SelectItem>
                        <SelectItem value="price-desc">Price: High → Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <SearchX className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No products found</h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your search or filter criteria
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory("All");
                          setPriceRange([0, 100000]);
                          setShowInStock(false);
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredProducts.map((product) => (
                        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow p-0 gap-2">
                          <Link href={`/products/${product.id}`}>
                            <div className="aspect-square overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                loading="lazy"
                              />
                            </div>
                          </Link>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <Link href={`/products/${product.id}`}>
                                <h3 className="font-semibold hover:text-primary transition-colors cursor-pointer">{product.name}</h3>
                              </Link>
                              {product.stock <= 5 && product.stock > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  Low Stock
                                </Badge>
                              )}
                              {product.stock === 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  Out of Stock
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {product.size} • {product.material}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  addToCart(product);
                                }}
                                disabled={product.stock === 0}
                              >
                                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}


    </div>
  );
}
