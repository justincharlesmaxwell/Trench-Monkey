// Button.jsx — primary / accent / secondary / ghost.

function TMButton({ variant = "primary", size = "md", icon, iconRight, children, onClick, type = "button" }) {
  const cls = `tm-btn tm-btn--${variant} tm-btn--${size}`;
  return (
    <button type={type} className={cls} onClick={onClick}>
      {icon && <i data-lucide={icon} className="tm-btn__ic"></i>}
      <span>{children}</span>
      {iconRight && <i data-lucide={iconRight} className="tm-btn__ic"></i>}
    </button>
  );
}

window.TMButton = TMButton;
