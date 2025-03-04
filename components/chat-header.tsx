"use client";
import { memo } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

function PureChatHeader() {
  const { theme } = useTheme();
  const pathname = usePathname();

  if (pathname !== "/") return <></>;

  return (
    <header className="sticky top-0 flex items-center min-h-[60px] border-b-1 border justify-between bg-background px-2 py-1.5 md:px-2 z-10">
      <div className="flex items-center justify-center w-full text-center gap-2">
        <div className="relative inline-block">
          <div className="flex items-center gap-2">
            <div className="relative inline-block">
              <h1
                className="text-3xl font-bold tracking-tight 
                text-gray-800 dark:text-gray-200 
                transition-colors duration-300"
              >
                Reminisce AI
              </h1>
              <svg
                className="absolute bottom-[-5px] left-0 w-full"
                height="10"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M5 5 Q50 3, 95 5"
                  fill="none"
                  stroke={theme === "dark" ? "#4a5568" : "#718096"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="5,5"
                  className="transition-colors duration-300"
                />
                <path
                  d="M0 6 Q50 8, 100 6"
                  fill="none"
                  stroke={theme === "dark" ? "#2d3748" : "#e2e8f0"}
                  strokeWidth="1"
                  strokeLinecap="round"
                  className="transition-colors duration-300"
                />
              </svg>
            </div>
            <span
              className="
                text-xs 
                font-medium 
                px-2 
                py-0.5 
                rounded-full 
                bg-blue-50 
                text-blue-800 
                dark:bg-blue-900/30 
                dark:text-blue-300
                transition-colors 
                duration-300
                select-none
                cursor-default
              "
              title="This product is in beta and may have ongoing improvements"
            >
              Beta
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader);
