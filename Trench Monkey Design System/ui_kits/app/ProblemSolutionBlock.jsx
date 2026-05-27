// ProblemSolutionBlock.jsx — paired display-headed columns with mascot videos.

function PSMedia({ src, poster, alt }) {
  const ref = React.useRef(null);
  const [playing, setPlaying] = React.useState(true);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="tm-ps__media" onClick={toggle} role="button" aria-label={alt}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      {!playing && (
        <button className="tm-ps__play" aria-label="Play video" onClick={(e) => { e.stopPropagation(); toggle(); }}>
          <i data-lucide="play"></i>
        </button>
      )}
    </div>
  );
}

function ProblemSolutionBlock() {
  return (
    <section className="tm-ps">
      <div className="tm-ps__col">
        <h2 className="tm-ps__h tm-ps__h--blue">The Problem</h2>
        <p className="tm-ps__p">
          Feeling similar emotions? At Trench Monkey we know this problem all too well.
        </p>
        <PSMedia
          src="../../assets/problem.mp4"
          poster="../../assets/hero-trench.jpg"
          alt="Monkey digging in a trench"
        />
      </div>
      <div className="tm-ps__col">
        <h2 className="tm-ps__h tm-ps__h--orange">The Solution</h2>
        <p className="tm-ps__p">
          World class AI automation, taking you away from our meaningless marketing job, and
          onto the golf course where life really matters.
        </p>
        <PSMedia
          src="../../assets/solution.mp4"
          poster="../../assets/hero-golf.jpg"
          alt="Monkey enjoying the solution"
        />
      </div>
    </section>
  );
}

window.ProblemSolutionBlock = ProblemSolutionBlock;
