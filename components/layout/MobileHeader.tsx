"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
}

const MobileHeader: React.FC<HeaderProps> = ({ title }) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <header className="flex items-center justify-between h-14 px-4 bg-white border-b border-gray-200 w-full fixed top-0 left-0 z-10">
      <div className="w-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleGoBack}
          aria-label="Go back"
          className="h-8 w-8"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <h1 className="text-lg font-medium text-center flex-1">{title}</h1>

      {/* Empty div to balance the header layout */}
      <div className="w-10"></div>
    </header>
  );
};

export default MobileHeader;
