const NumPadButton = ({
  children,
  onClick,
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) => (
  <button
    className={`h-16 w-16 rounded-full bg-background text-2xl transition-colors 
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-transparent active:bg-muted/80"
        }
        ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default NumPadButton;
