"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";

interface UserInfo {
    name: string;
    email: string;
    phone: string;
    address: string;
    joinDate: string;
}

interface SettingsFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    notifications: boolean;
    marketingEmails: boolean;
}

export default function AccountPage() {
    const [isLoading, setIsLoading] = useState(false);

    // Mock user data - in real app this would come from API/context
    const [userInfo] = useState<UserInfo>({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, City, State 12345",
        joinDate: "January 2024",
    });

    const settingsForm = useForm<SettingsFormData>({
        defaultValues: {
            name: userInfo.name,
            email: userInfo.email,
            phone: userInfo.phone,
            address: userInfo.address,
            notifications: true,
            marketingEmails: false,
        },
    });

    const onSettingsSubmit = async (data: SettingsFormData) => {
        setIsLoading(true);
        try {
            // TODO: Implement actual settings update logic
            console.log("Settings update:", data);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert("Settings updated successfully!");
        } catch (error) {
            console.error("Settings update failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        // TODO: Implement actual logout logic
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = "/"}
                        className="mb-4 flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold text-(--color-foreground)">My Account</h1>
                    <p className="text-muted-foreground">Manage your account settings and preferences</p>
                </div>

                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>
                                    Your account details and membership information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src="/placeholder-avatar.jpg" alt={userInfo.name} />
                                        <AvatarFallback className="text-lg">
                                            {userInfo.name.split(" ").map(n => n[0]).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-xl font-semibold">{userInfo.name}</h3>
                                        <p className="text-muted-foreground">{userInfo.email}</p>
                                        <Badge variant="secondary" className="mt-1">
                                            Member since {userInfo.joinDate}
                                        </Badge>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium mb-2">Contact Information</h4>
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Email:</span>
                                                <span className="ml-2">{userInfo.email}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Phone:</span>
                                                <span className="ml-2">{userInfo.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Address</h4>
                                        <p className="text-sm">{userInfo.address}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Settings</CardTitle>
                                <CardDescription>
                                    Update your personal information and preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...settingsForm}>
                                    <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={settingsForm.control}
                                                name="name"
                                                rules={{ required: "Name is required" }}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Full Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter your full name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={settingsForm.control}
                                                name="email"
                                                rules={{
                                                    required: "Email is required",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Invalid email address",
                                                    },
                                                }}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input type="email" placeholder="Enter your email" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={settingsForm.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phone Number</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter your phone number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={settingsForm.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Address</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter your address" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <Separator />

                                        <div className="space-y-4">
                                            <h4 className="font-medium">Preferences</h4>
                                            <div className="space-y-3">
                                                <FormField
                                                    control={settingsForm.control}
                                                    name="notifications"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={field.value}
                                                                    onChange={field.onChange}
                                                                    className="h-4 w-4"
                                                                />
                                                            </FormControl>
                                                            <div className="space-y-1 leading-none">
                                                                <FormLabel>Enable notifications</FormLabel>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Receive notifications about your orders and account activity
                                                                </p>
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={settingsForm.control}
                                                    name="marketingEmails"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={field.value}
                                                                    onChange={field.onChange}
                                                                    className="h-4 w-4"
                                                                />
                                                            </FormControl>
                                                            <div className="space-y-1 leading-none">
                                                                <FormLabel>Marketing emails</FormLabel>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Receive emails about new products and promotions
                                                                </p>
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-between pt-6">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleLogout}
                                            >
                                                Sign Out
                                            </Button>
                                            <Button type="submit" disabled={isLoading}>
                                                {isLoading ? "Saving..." : "Save Changes"}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
