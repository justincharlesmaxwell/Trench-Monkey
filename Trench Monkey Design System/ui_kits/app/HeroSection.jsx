// HeroSection.jsx — opening section: navy rule + heavy headline + lede + supporting paragraph.

function HeroSection() {
  return (
    <section className="tm-hero">
      <hr className="tm-section-rule" />
      <h1 className="tm-hero__title">World Class AI Market Intelligence</h1>
      <p className="tm-hero__lede">
        Enter your prospect's details and Trench Monkey will research the market, segment the
        audience, position against competitors, build a seasonal calendar, and split the
        budget — all in under 40 seconds.
      </p>
      <p className="tm-hero__lede">
        Every pitch is powered by live market intelligence, grounded in real competitor data,
        and tailored to the exact budget and industry you provide. No templates. No guesswork.
        Just a pitch ready to present.
      </p>
    </section>
  );
}

window.HeroSection = HeroSection;
