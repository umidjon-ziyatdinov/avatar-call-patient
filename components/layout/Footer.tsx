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
            <Button
              asChild
              variant="default"
              className="rounded-4 text-white font-bold text-md"
              size="lg"
            >
              <Link
                href={navigation.contact.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-8 mt-[1px]"
                >
                  <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515c-.21.37-.404.75-.576 1.134a18.382 18.382 0 0 0-5.713 0 12.646 12.646 0 0 0-.578-1.134A19.842 19.842 0 0 0 3.683 4.37C1.793 7.594.902 10.74.25 13.823a19.867 19.867 0 0 0 6.065 4.562c.49-.663.927-1.368 1.3-2.107a12.865 12.865 0 0 1-2.06-1.003c.173-.125.342-.254.507-.388a14.903 14.903 0 0 0 12.886 0c.165.134.334.263.507.388a12.84 12.84 0 0 1-2.062 1.003c.374.739.81 1.444 1.3 2.107a19.846 19.846 0 0 0 6.067-4.562c-.655-3.083-1.546-6.23-3.437-9.454ZM8.478 14.597c-1.257 0-2.285-1.154-2.285-2.572 0-1.42 1.007-2.573 2.285-2.573 1.282 0 2.31 1.155 2.285 2.573 0 1.418-1.007 2.572-2.285 2.572Zm7.044 0c-1.257 0-2.285-1.154-2.285-2.572 0-1.42 1.007-2.573 2.285-2.573 1.282 0 2.31 1.155 2.285 2.573 0 1.418-1.007 2.572-2.285 2.572Z" />
                </svg>
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
