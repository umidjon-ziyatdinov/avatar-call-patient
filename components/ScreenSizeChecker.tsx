"use client";
import { useEffect, useState } from "react";

function ScreenSizeChecker({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      // Typical mobile screen width breakpoint
      setIsMobile(window.innerWidth <= 768);
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Mobile Version Only</h1>
          <p className="mb-4">
            This application is currently optimized for mobile screens. The
            desktop version is under development.
          </p>
          <p className="text-sm text-muted-foreground">
            Please use a mobile device or reduce your browser window size.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ScreenSizeChecker;
