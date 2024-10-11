// PageTab.tsx
import React from "react";

interface PageTabProps {
  title: string;
  isActive: boolean;
  onClick: () => void;
}

const PageTab: React.FC<PageTabProps> = ({ title, isActive, onClick }) => {
  return (
    <button
      className={`
        px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out
        ${
          isActive
            ? "bg-[#14397F] text-white shadow-md"
            : "bg-white text-[#14397F] hover:bg-[#14397F]/10"
        }
        focus:outline-none focus:ring-2 focus:ring-[#14397F] focus:ring-opacity-50
      `}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default PageTab;
