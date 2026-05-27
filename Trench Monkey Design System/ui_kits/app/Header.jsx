// Header.jsx — Trench Monkey top nav
// Fixed at top, near-white chrome, hairline bottom border. Mascot logo + wordmark left, utility icons right.

const { useEffect } = React;

function Header({ variant = "titlecase" }) {
  // variant: "titlecase" -> "Trench Monkey" in Fredoka
  //          "uppercase" -> "TRENCH MONKEY" in Plus Jakarta Sans Black
  useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, []);

  return (
    <header className="tm-header">
      <div className="tm-header__inner">
        <a className="tm-header__lockup" href="#">
          <span className="tm-header__logo">
            <img src="../../assets/monkey-logo.png" alt="Trench Monkey" />
          </span>
          {variant === "uppercase" ? (
            <span className="tm-wordmark tm-wordmark--upper">
              <span style={{ color: "var(--tm-blue)" }}>TRENCH</span>{" "}
              <span style={{ color: "var(--tm-orange)" }}>MONKEY</span>
            </span>
          ) : (
            <span className="tm-wordmark">
              <span className="blue">Trench</span> <span className="orange">Monkey</span>
            </span>
          )}
        </a>
        <nav className="tm-header__nav">
          <button className="tm-iconbtn" aria-label="History"><i data-lucide="history"></i></button>
          <button className="tm-iconbtn" aria-label="Settings"><i data-lucide="settings"></i></button>
        </nav>
      </div>
    </header>
  );
}

window.Header = Header;
