export function InfrastructureBackdrop() {
  return (
    <div aria-hidden="true" className="infrastructure-backdrop">
      <div className="infrastructure-grid" />
      <div className="infrastructure-glow infrastructure-glow-primary" />
      <div className="infrastructure-glow infrastructure-glow-secondary" />
      <svg className="infrastructure-nodes" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M85 150H310L420 260H670L780 155H1090" />
          <path d="M120 520H340L455 405H725L860 520H1110" />
        </g>
        <g fill="currentColor">
          <circle cx="85" cy="150" r="3" /><circle cx="310" cy="150" r="3" /><circle cx="420" cy="260" r="3" /><circle cx="670" cy="260" r="3" /><circle cx="780" cy="155" r="3" /><circle cx="1090" cy="155" r="3" />
          <circle cx="120" cy="520" r="3" /><circle cx="340" cy="520" r="3" /><circle cx="455" cy="405" r="3" /><circle cx="725" cy="405" r="3" /><circle cx="860" cy="520" r="3" /><circle cx="1110" cy="520" r="3" />
        </g>
      </svg>
    </div>
  );
}
