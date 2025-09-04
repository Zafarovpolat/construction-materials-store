import { Mail, Phone } from 'lucide-react'
import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Branding Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary font-heading">
              BuildMart
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your trusted partner for premium construction materials and building supplies.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">
              Quick Links
            </h4>
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/about" 
                className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
              >
                Contact
              </Link>
              <Link 
                href="/privacy" 
                className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
              >
                Terms of Service
              </Link>
            </nav>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">
              Contact Info
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a 
                  href="mailto:info@buildmart.com" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                >
                  info@buildmart.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a 
                  href="tel:+1-555-0123" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                >
                  +1 (555) 012-3456
                </a>
              </div>
            </div>
          </div>

          {/* Additional Info or Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">
              Hours
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Monday - Friday: 7:00 AM - 6:00 PM</p>
              <p>Saturday: 8:00 AM - 5:00 PM</p>
              <p>Sunday: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} BuildMart. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Building quality since 1995
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}