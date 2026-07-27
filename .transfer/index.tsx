import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type FormEvent, type ReactNode } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

/* ---------- Logo mark ---------- */

function LogoMark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="9" fill="#2952E3" />
      <path
        d="M9 9v9.5a6.5 6.5 0 0 0 13 0V9"
        stroke="#F3EDE1"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M22 9v6.5" stroke="#F3EDE1" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Icon set (custom line glyphs, single stroke family) ---------- */

function IconContent() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconAgent() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="7" width="12" height="10" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9.5" cy="12" r="1.1" fill="currentColor" />
      <circle cx="14.5" cy="12" r="1.1" fill="currentColor" />
      <path d="M12 7V4M9 4h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconAutomation() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M13.5 15.5 20 19M4 19l6.5-3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="19" cy="19.5" r="1.6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="5" cy="19.5" r="1.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconInsight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19V9M12 19V5M19 19v-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- CTA components (each a distinct interaction identity) ---------- */

function MagneticButton({ href, children }: { href: string; children: ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  }

  return (
    <a
      ref={ref}
      href={href}
      className="uni-btn-solid"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </a>
  );
}

function GhostButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="uni-btn-ghost">
      {children}
      <span className="uni-arrow" aria-hidden="true">
        <IconArrowRight />
      </span>
    </a>
  );
}

function TickLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="uni-btn-tick">
      {children}
    </a>
  );
}

function CardCTA({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="uni-btn-card">
      {children}
      <span className="uni-card-icon" aria-hidden="true">
        <IconArrowRight />
      </span>
    </a>
  );
}

/* ---------- Section visuals (CSS/SVG-crafted, no photography) ---------- */

function IntakeVisual() {
  const heights = [30, 55, 80, 45, 65, 90, 40, 70, 50, 85];
  return (
    <div className="uni-scene-visual uni-visual-intake">
      <div className="uni-wave-row">
        {heights.map((h, i) => (
          <div
            key={i}
            className="uni-wave-bar"
            data-active={i % 3 === 0 ? "true" : "false"}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="uni-wave-row">
        {heights
          .slice()
          .reverse()
          .map((h, i) => (
            <div
              key={i}
              className="uni-wave-bar"
              data-active={i % 4 === 0 ? "true" : "false"}
              style={{ height: `${h * 0.6}%` }}
            />
          ))}
      </div>
    </div>
  );
}

function ForgeVisual() {
  return (
    <div className="uni-scene-visual uni-visual-forge">
      <svg className="uni-forge-rig" viewBox="0 0 320 240" fill="none">
        <circle cx="160" cy="120" r="46" stroke="#2952E3" strokeWidth="1.6" />
        <circle cx="160" cy="120" r="70" stroke="#454B57" strokeWidth="1" opacity="0.5" />
        <circle cx="160" cy="120" r="94" stroke="#454B57" strokeWidth="1" opacity="0.3" />
        <circle cx="160" cy="74" r="5" fill="#F3EDE1" />
        <circle cx="206" cy="120" r="5" fill="#2952E3" />
        <circle cx="160" cy="166" r="5" fill="#2952E3" />
        <circle cx="114" cy="120" r="5" fill="#F3EDE1" />
        <path d="M160 74v46h46" stroke="#2952E3" strokeWidth="1.4" />
        <path d="M114 120h46v46" stroke="#F3EDE1" strokeWidth="1.4" opacity="0.7" />
      </svg>
    </div>
  );
}

function ConveyorVisual() {
  return <div className="uni-scene-visual uni-visual-conveyor" aria-hidden="true" />;
}

function DeckVisual() {
  const lit = [0, 2, 4, 5, 7];
  return (
    <div className="uni-scene-visual uni-visual-deck">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="uni-deck-tile" data-lit={lit.includes(i) ? "true" : "false"} />
      ))}
    </div>
  );
}

/* ---------- Contact form ---------- */

function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  }

  if (sent) {
    return (
      <div className="uni-success" data-show="true">
        Transmission received. Expect a reply within 24 hours.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="uni-form-row">
        <div className="uni-field">
          <label htmlFor="fname">First name</label>
          <input id="fname" type="text" placeholder="Alex" required />
        </div>
        <div className="uni-field">
          <label htmlFor="lname">Last name</label>
          <input id="lname" type="text" placeholder="Rivera" required />
        </div>
      </div>
      <div className="uni-field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="alex@yourbusiness.com" required />
      </div>
      <div className="uni-field">
        <label htmlFor="business">Business</label>
        <input id="business" type="text" placeholder="What do you do?" />
      </div>
      <div className="uni-field">
        <label htmlFor="message">What are you looking to build?</label>
        <textarea id="message" placeholder="Tell us what's slowing you down." />
      </div>
      <button type="submit" className="uni-btn-submit" data-loading={loading ? "true" : "false"}>
        <span className="uni-scan" aria-hidden="true" />
        {loading ? "Transmitting..." : "Send transmission"}
      </button>
    </form>
  );
}

/* ---------- Page ---------- */

function Index() {
  return (
    <div className="uni-page">
      <header className="uni-nav">
        <div className="uni-container uni-nav-inner">
          <a href="#" className="uni-logo">
            <LogoMark />
            UniversoulAI
          </a>
          <ul className="uni-nav-links uni-nav-links-desktop">
            <li>
              <a href="#capabilities" className="uni-nav-link">
                Capabilities
              </a>
            </li>
            <li>
              <a href="#process" className="uni-nav-link">
                Process
              </a>
            </li>
            <li>
              <MagneticButton href="#contact">Book a free call</MagneticButton>
            </li>
          </ul>
        </div>
      </header>

      <main>
        <section className="uni-hero">
          <div className="uni-starfield" />
          <div className="uni-planet" />
          <div className="uni-container">
            <div className="uni-hero-content uni-reveal">
              <h1 className="uni-h1">AI systems built for your business.</h1>
              <p className="uni-sub">
                UniversoulAI designs and ships the AI infrastructure creators and
                businesses actually run on: content pipelines, agents,
                automation, and insight, built around how you already work.
              </p>
              <div className="uni-hero-actions">
                <GhostButton href="#capabilities">Enter the deck</GhostButton>
              </div>
            </div>
          </div>
        </section>

        <section className="uni-section" id="capabilities">
          <div className="uni-container">
            <div className="uni-scene">
              <div className="uni-scene-copy">
                <h2 className="uni-h2">Signal Intake</h2>
                <p className="uni-sub">
                  AI content systems that research, write, and publish across
                  blogs, social, scripts, and email, in your voice, on a
                  schedule your team never has to babysit.
                </p>
                <TickLink href="#process">See how it works</TickLink>
              </div>
              <IntakeVisual />
            </div>
          </div>
        </section>

        <section className="uni-section">
          <div className="uni-container">
            <div className="uni-scene uni-scene--reverse">
              <div className="uni-scene-copy">
                <h2 className="uni-h2">Agent Forge</h2>
                <p className="uni-sub">
                  Custom AI agents handle support, scheduling, and internal
                  ops around the clock, wired into the tools your team
                  already uses.
                </p>
                <TickLink href="#process">See how it works</TickLink>
              </div>
              <ForgeVisual />
            </div>
          </div>
        </section>

        <section className="uni-section">
          <div className="uni-container">
            <div className="uni-scene">
              <div className="uni-scene-copy">
                <h2 className="uni-h2">Automation Conveyor</h2>
                <p className="uni-sub">
                  We connect your stack and remove the manual steps slowing
                  your team down, so work moves without anyone pushing it by
                  hand.
                </p>
                <TickLink href="#process">See how it works</TickLink>
              </div>
              <ConveyorVisual />
            </div>
          </div>
        </section>

        <section className="uni-section">
          <div className="uni-container">
            <div className="uni-scene uni-scene--reverse">
              <div className="uni-scene-copy">
                <h2 className="uni-h2">Command Deck</h2>
                <p className="uni-sub">
                  Data and insight surfaced in one place, so you decide
                  faster instead of digging through five different
                  dashboards.
                </p>
                <CardCTA href="#contact">Book a free call</CardCTA>
              </div>
              <DeckVisual />
            </div>
          </div>
        </section>

        <section className="uni-section" id="process">
          <div className="uni-container">
            <p className="uni-eyebrow">Process</p>
            <h2 className="uni-h2">From signal to system</h2>
            <p className="uni-sub" style={{ marginBottom: 48 }}>
              No bloated proposals. A clear path from conversation to a
              running system.
            </p>
          </div>
          <div className="uni-container">
            <div className="uni-process-grid">
              <div className="uni-process-step">
                <p className="uni-process-num">01</p>
                <h3>Discovery call</h3>
                <p>
                  We learn your business, your bottlenecks, and where AI
                  makes the biggest immediate difference.
                </p>
              </div>
              <div className="uni-process-step">
                <p className="uni-process-num">02</p>
                <h3>Custom blueprint</h3>
                <p>
                  We map the exact systems to build. No cookie-cutter
                  packages, no upsell noise.
                </p>
              </div>
              <div className="uni-process-step">
                <p className="uni-process-num">03</p>
                <h3>Build and deploy</h3>
                <p>
                  We build, test, and launch. Most systems go live within
                  weeks, not months.
                </p>
              </div>
              <div className="uni-process-step">
                <p className="uni-process-num">04</p>
                <h3>Grow and optimize</h3>
                <p>
                  We stay in the loop, iterating as your business evolves so
                  the system keeps delivering.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="uni-section" id="contact">
          <div className="uni-container">
            <p className="uni-eyebrow">Get started</p>
            <div className="uni-contact-wrap">
              <div className="uni-contact-copy">
                <h2 className="uni-h2" style={{ color: "var(--uni-cream)" }}>
                  Book a free discovery call
                </h2>
                <p className="uni-sub">
                  Tell us about your business and what you want to automate
                  or build. We come prepared with ideas, no pitch, just a
                  real conversation.
                </p>
                <div className="uni-icon-row" style={{ display: "flex", gap: 20, marginTop: 8 }}>
                  <span style={{ color: "var(--uni-cobalt-2)", width: 22, height: 22 }}>
                    <IconContent />
                  </span>
                  <span style={{ color: "var(--uni-cobalt-2)", width: 22, height: 22 }}>
                    <IconAgent />
                  </span>
                  <span style={{ color: "var(--uni-cobalt-2)", width: 22, height: 22 }}>
                    <IconAutomation />
                  </span>
                  <span style={{ color: "var(--uni-cobalt-2)", width: 22, height: 22 }}>
                    <IconInsight />
                  </span>
                </div>
              </div>
              <div className="uni-contact-form-panel">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="uni-footer">
        <div className="uni-container uni-footer-inner">
          <a href="#" className="uni-logo">
            <LogoMark />
            UniversoulAI
          </a>
          <p>© 2026 UniversoulAI. AI systems for creators and businesses.</p>
          <a href="mailto:hello@universoul.ai" className="uni-footer-email">
            hello@universoul.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
