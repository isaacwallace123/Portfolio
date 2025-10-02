import { FadeIn, SlideUp, Stagger, ZoomIn } from '@/components/animations';

import './home.css';

export default function Home() {
  return (
    <section className="hero">
      {/* kicker */}
      <FadeIn as="p" className="hero-kicker text-brand" duration={700}>
        Welcome
      </FadeIn>

      {/* main title */}
      <ZoomIn as="h1" className="hero-title" duration={700} delay={150}>
        Hi, I’m <span className="accent">Isaac</span>
      </ZoomIn>

      {/* tagline */}
      <SlideUp as="p" className="hero-text" duration={700} delay={300}>
        I build clean systems and modern web apps. Explore my projects and live
        infrastructure metrics.
      </SlideUp>

      {/* staggered call-to-actions */}
      <Stagger baseDelay={500} step={120}>
        <SlideUp as="div" className="hero-actions" duration={700}>
          <a href="/projects" className="btn btn-brand">
            View Projects
          </a>
          <a href="/contact" className="btn btn-outline-brand">
            Contact Me
          </a>
        </SlideUp>
      </Stagger>
    </section>
  );
}
