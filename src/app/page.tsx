"use client";

import Storefront from "@/components/Storefront";
import { Footer } from "@/components/Footer";

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
