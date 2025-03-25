// components/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navigation = {
  main: [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "About Us", href: "/about" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
  social: [
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: Facebook,
      color: "hover:bg-[#1877F2] dark:text-gray-400 dark:hover:text-[#1877F2]",
    },
    {
      name: "Twitter",
      href: "https://twitter.com",
      icon: Twitter,
      color: "hover:bg-[#1DA1F2] dark:text-gray-400 dark:hover:text-[#1DA1F2]",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      icon: Linkedin,
      color: "hover:bg-[#0A66C2] dark:text-gray-400 dark:hover:text-[#0A66C2]",
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: Instagram,
      color: "hover:bg-[#E4405F] dark:text-gray-400 dark:hover:text-[#E4405F]",
    },
  ],
  contact: {
    email: "support@reminisceai.com",
    phone: "+1 (555) 123-4567",
    address: "123 AI Avenue, San Francisco, CA 94105",
    discord: "https://discord.gg/reminisceai",
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container py-12 md:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-6">
            <Link
              href="/"
              className="flex items-center space-x-2"
              aria-label="Reminisce AI Homepage"
            >
              <span className="font-heading text-xl font-bold">
                Reminisce AI
              </span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Providing personalized AI companions for patients with dementia
              and other medical conditions.
            </p>
            <div className="flex space-x-5">
              {navigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-muted-foreground transition-colors duration-200 hover:text-white p-2 rounded-full ${item.color}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.name} page`}
                >
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </Link>
              ))}
            </div>

            {/* Contact Information */}
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${navigation.contact.email}`}>
                  {navigation.contact.email}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <a href={`tel:${navigation.contact.phone}`}>
                  {navigation.contact.phone}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{navigation.contact.address}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-sm font-semibold">Navigation</h3>
              <ul role="list" className="mt-4 space-y-3">
                {navigation.main.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Company</h3>
              <ul role="list" className="mt-4 space-y-3">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Legal</h3>
              <ul role="list" className="mt-4 space-y-3">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 md:flex md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row gap-4 text-center md:text-left">
            <Button asChild variant="secondary" className="rounded-4" size="lg">
              <Link
                href={navigation.contact.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Get Support on Discord</span>
              </Link>
            </Button>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-xs text-muted-foreground">
              &copy; {currentYear} Reminisce AI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
