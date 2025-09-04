"use client";

import React, { useState } from "react";
import Storefront from "@/components/Storefront";
import AdminDashboard from "@/components/AdminDashboard";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Store, Settings } from "lucide-react";

export default function HomePage() {

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content Container */}
      <div className="flex-1 w-full">
        <div className="mx-auto ">
          <Storefront />
          {/* Footer */}
          <Footer />
        </div>
      </div>

    </div>
  );
}
