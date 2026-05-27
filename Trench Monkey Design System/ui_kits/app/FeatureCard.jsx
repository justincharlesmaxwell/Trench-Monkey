// FeatureCard.jsx — single icon + eyebrow + description card.
// Used in a three-up row directly under the hero.

const { useEffect: useFCEffect } = React;

function FeatureCard({ icon, eyebrow, children }) {
  useFCEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  return (
    <article className="tm-fcard">
      <i data-lucide={icon} className="tm-fcard__icon"></i>
      <div className="tm-fcard__eyebrow">{eyebrow}</div>
      <p className="tm-fcard__desc">{children}</p>
    </article>
  );
}

function FeatureRow() {
  return (
    <div className="tm-fcard__row">
      <FeatureCard icon="badge-check" eyebrow="DATA-BACKED">
        Pitches are synthesised from current market trends and granular competitor benchmarks.
      </FeatureCard>
      <FeatureCard icon="zap" eyebrow="INSTANT RESULTS">
        Receive a curated deck outline and strategic copy in under 30 seconds.
      </FeatureCard>
      <FeatureCard icon="shield" eyebrow="SCHOLARLY PRIVACY">
        Your intellectual property remains private to your account — never sent to our servers.
      </FeatureCard>
    </div>
  );
}

window.FeatureCard = FeatureCard;
window.FeatureRow = FeatureRow;
