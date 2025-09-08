"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface LoginFormData {
    email: string;
    password: string;
}

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginFormData>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            // TODO: Implement actual login logic
            console.log("Login attempt:", data);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Redirect to account page on success
            window.location.href = "/account";
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-full max-w-md">
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = "/"}
                        className="flex items-center gap-2 mb-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <Card className="w-full">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
                            <CardDescription className="text-center">
                                Enter your email and password to access your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
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
                                                    <Input
                                                        type="email"
                                                        placeholder="Enter your email"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        rules={{
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="Enter your password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Signing In..." : "Sign In"}
                                    </Button>
                                </form>
                            </Form>
                            <div className="mt-4 text-center text-sm">
                                <a href="#" className="text-primary hover:underline">
                                    Forgot your password?
                                </a>
                            </div>
                            <div className="mt-4 text-center text-sm">
                                Don't have an account?{" "}
                                <a href="/signup" className="text-primary hover:underline">
                                    Sign up
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
