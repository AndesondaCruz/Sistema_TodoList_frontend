function Button({ children, onClick, type = "button", variant = "primary", disabled }) {

  const baseStyle = {
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: "bold",
    transition: "0.2s",
    opacity: disabled ? 0.5 : 1
  };

  const variants = {
    primary: {
      background: "#3b82f6", // azul
      color: "white"
    },
    success: {
      background: "#22c55e", // verde
      color: "white"
    },
    danger: {
      background: "#ef4444", // vermelho
      color: "white"
    },
    secondary: {
      background: "#334155", // cinza escuro
      color: "#e2e8f0"
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...baseStyle,
        ...variants[variant]
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.target.style.filter = "brightness(1.1)";
      }}
      onMouseLeave={(e) => {
        e.target.style.filter = "brightness(1)";
      }}
    >
      {children}
    </button>
  );
}

export default Button;