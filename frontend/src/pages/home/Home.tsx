import {
  FadeIn,
  SlideLeft,
  SlideRight,
  SlideUp,
  Stagger,
  ZoomIn,
} from '@/components/animations';

import {
  ConnectionMode,
  EdgeStyle,
  LayoutMode,
  SkillGlobe,
} from '@/components/ui/globe';
import SkillsArray from '@/shared/data/Skills.data';

import './home.css';

export default function Home() {
  return (
    <main className="space-y-24 md:space-y-16">
      <section className="hero">
        {/* kicker */}
        <FadeIn as="p" className="hero-kicker text-brand" duration={700}>
          Welcome
        </FadeIn>

        {/* main title */}
        <ZoomIn as="h1" className="hero-title" duration={700} delay={150}>
          Hello, I’m <span className="text-brand">Isaac</span>
        </ZoomIn>

        {/* tagline */}
        <SlideUp as="p" className="hero-text" duration={700} delay={300}>
          I build clean systems and modern web apps. Explore my projects and
          live infrastructure metrics.
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

      <section className="app-container grid md:grid-cols-2 gap-10 items-center mx-auto px-4 sm:px-6">
        <Stagger baseDelay={600} step={100}>
          <SlideRight duration={700}>
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-brand">
                Tech Stack
              </h2>
              <p className="text-muted md:text-lg">
                Each intersection represents a core skill.
              </p>
            </div>
          </SlideRight>

          <SlideLeft duration={700} delay={200}>
            <SkillGlobe
              skills={SkillsArray}
              grid={{ latStep: 30, lonStep: 30, latExtent: 60, radius: 1.6 }}
              connect={ConnectionMode.Nearest}
              neighbors={4}
              showGrid={false}
              layout={LayoutMode.Uniform}
              showDots={false}
              arcLift={0.08}
              height={460}
              connectionsColor="#008080"
              labelFontUrl="/fonts/JetBrainsMono-Bold.ttf"
              edgeStyle={EdgeStyle.Straight}
              rotateAuto
              showIcons={true}
              showLabels={false}
            />
          </SlideLeft>
        </Stagger>
      </section>
    </main>
  );
}
