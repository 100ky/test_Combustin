interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

export default function Button({ children, type = "button" }: ButtonProps) {
  return (
    <button
      className="cursor-pointer items-center rounded-full border border-transparent bg-[var(--primary-background)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-all duration-200 hover:bg-[var(--primary-background-hover)]"
      type={type}
    >
      {children}
    </button>
  );
}
