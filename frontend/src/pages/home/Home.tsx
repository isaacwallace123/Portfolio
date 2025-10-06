import { avatar, site, socialLinks } from '@/config/site';

import {
  FadeIn,
  SlideLeft,
  SlideRight,
  SlideUp,
  Stagger,
  ZoomIn,
} from '@/components/animations';

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  SkillGlobe,
} from '@/components/ui';
import SkillsArray from '@/shared/data/Skills.data';

import {
  Activity,
  Clock3,
  Cpu,
  ExternalLink,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Terminal,
} from 'lucide-react';

import './Home.css';

const items = [
  { label: 'Uptime (30d)', value: '99.97%', icon: Activity },
  { label: 'API P95', value: '182 ms', icon: Clock3 },
  { label: 'Host CPU', value: '23%', icon: Cpu },
];

type Project = {
  title: string;
  blurb: string;
  image: string;
  tags: string[];
  live?: string;
  repo?: string;
};

const projects: Project[] = [
  {
    title: 'Kleff Hosting Platform',
    blurb:
      'Modular API-driven server deployment with Docker, metrics, and CI/CD.',
    image: '/images/projects/kleff.jpg',
    tags: ['Go', 'Docker', 'API', 'CI/CD'],
    live: '/projects/kleff',
    repo: 'https://github.com/isaacwallace123/kleff',
  },
  {
    title: 'GoWeb',
    blurb:
      'Modular Go library to modernize and simulate Springboot practices with GoLang.',
    image: '/images/projects/portfolio.jpg',
    tags: ['Go', 'Restful', 'API', 'WebServices', 'Http'],
    live: '/projects/portfolio',
    repo: 'https://github.com/isaacwallace123/GoWeb',
  },
  {
    title: 'Wall-Y V2',
    blurb:
      'Full-stack discord bot with easy expansion, modern commands, and fluid infrastructure.',
    image: '/images/projects/wallybot.jpg',
    tags: ['Linux', 'Docker', 'Grafana', 'Prometheus'],
    live: '/projects/wallybot',
    repo: 'https://github.com/isaacwallace123/WallY-V2',
  },
];

export default function Home() {
  return (
    <main className="space-y-24 md:space-y-16">
      {/* Hero */}
      <section className="hero">
        <FadeIn as="p" className="hero-kicker text-brand" duration={700}>
          Welcome
        </FadeIn>

        <ZoomIn as="h1" className="hero-title" duration={700} delay={150}>
          Hello, I’m <span className="text-brand">Isaac</span>
        </ZoomIn>

        <SlideUp as="p" className="hero-text" duration={700} delay={300}>
          I build clean systems and modern web apps. Explore my projects and
          live infrastructure metrics.
        </SlideUp>

        <SlideUp as="div" className="hero-actions" delay={500} duration={700}>
          <Button
            to="/projects"
            variant="solid"
            isDeep
            padY=".72rem"
            padX="1.25rem"
            radius={10}
            textSize=".95rem"
          >
            View Projects
          </Button>
          <Button
            to="/contact"
            variant="outline"
            isDeep
            padY=".72rem"
            padX="1.25rem"
            radius={10}
            textSize=".95rem"
          >
            Contact Me
          </Button>
        </SlideUp>
      </section>

      {/* About Me */}
      <section className="relative isolate bg-muted/50">
        <div className="app-container mx-auto px-4 sm:px-6 py-10 md:py-14">
          <SlideUp duration={700}>
            <Card className="border border-white/10">
              <CardHeader className="pb-4">
                <Stagger baseDelay={80} step={80}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <FadeIn duration={600}>
                        <Avatar
                          src={avatar.github(200)}
                          alt={`${site.name} – GitHub avatar`}
                          name={site.name}
                          size={80}
                        />
                      </FadeIn>

                      <div>
                        <SlideUp duration={650}>
                          <CardTitle>About Me</CardTitle>
                        </SlideUp>

                        <FadeIn duration={700} delay={50}>
                          <CardDescription className="mt-1 flex flex-wrap items-center gap-3 text-base text-white/70">
                            <span className="inline-flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {site.location}
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <Terminal className="h-4 w-4" />
                              Web Platforms · APIs · DevOps
                            </span>
                          </CardDescription>
                        </FadeIn>
                      </div>
                    </div>

                    <SlideRight duration={650}>
                      <div className="flex flex-wrap items-center gap-2">
                        <Stagger baseDelay={0} step={80}>
                          <FadeIn duration={500}>
                            <Button
                              to={socialLinks.github}
                              variant="outline"
                              padY=".55rem"
                              padX="1rem"
                              radius={12}
                              textSize=".9rem"
                            >
                              <Github className="mr-2 h-4 w-4" /> GitHub
                            </Button>
                          </FadeIn>

                          <FadeIn duration={500} delay={40}>
                            <Button
                              to={socialLinks.linkedin}
                              variant="outline"
                              padY=".55rem"
                              padX="1rem"
                              radius={12}
                              textSize=".9rem"
                            >
                              <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                            </Button>
                          </FadeIn>

                          <FadeIn duration={500} delay={80}>
                            <Button
                              to={socialLinks.instagram}
                              variant="outline"
                              padY=".55rem"
                              padX="1rem"
                              radius={12}
                              textSize=".9rem"
                            >
                              <Instagram className="mr-2 h-4 w-4" /> Instagram
                            </Button>
                          </FadeIn>

                          <FadeIn duration={500} delay={120}>
                            <Button
                              to={`mailto:${site.email}`}
                              variant="solid"
                              padY=".55rem"
                              padX="1rem"
                              radius={12}
                              textSize=".9rem"
                            >
                              <Mail className="mr-2 h-4 w-4" /> Email
                            </Button>
                          </FadeIn>
                        </Stagger>
                      </div>
                    </SlideRight>
                  </div>
                </Stagger>
              </CardHeader>

              <Separator />

              <CardContent className="pt-6">
                <div className="grid gap-8 md:grid-cols-3">
                  <div className="md:col-span-2 space-y-4">
                    <SlideUp duration={650}>
                      <p className="text-white/80 leading-relaxed">
                        I’m a systems-minded developer focused on clean
                        architecture and performance. I ship modern web apps,
                        scalable APIs, and automation that improves developer
                        experience. I enjoy CI/CD, infra as code, and squeezing
                        more out of less.
                      </p>
                    </SlideUp>

                    <Stagger baseDelay={100} step={60}>
                      <div className="flex flex-wrap gap-2">
                        <FadeIn duration={400}>
                          <Badge>TypeScript</Badge>
                        </FadeIn>
                        <FadeIn duration={400} delay={40}>
                          <Badge>React</Badge>
                        </FadeIn>
                        <FadeIn duration={400} delay={80}>
                          <Badge>Node</Badge>
                        </FadeIn>
                        <FadeIn duration={400} delay={120}>
                          <Badge>Go</Badge>
                        </FadeIn>
                        <FadeIn duration={400} delay={160}>
                          <Badge>Docker</Badge>
                        </FadeIn>
                        <FadeIn duration={400} delay={200}>
                          <Badge>CI/CD</Badge>
                        </FadeIn>
                        <FadeIn duration={400} delay={240}>
                          <Badge>Java Spring</Badge>
                        </FadeIn>
                      </div>
                    </Stagger>
                  </div>

                  <SlideLeft duration={650} delay={120}>
                    <div className="grid gap-4">
                      <FadeIn duration={450}>
                        <div className="rounded-xl border border-white/10 p-4">
                          <p className="text-[10px] uppercase tracking-wider text-white/50">
                            Currently
                          </p>
                          <p className="font-medium">
                            Building projects & infra tooling
                          </p>
                        </div>
                      </FadeIn>

                      <FadeIn duration={450} delay={60}>
                        <div className="rounded-xl border border-white/10 p-4">
                          <p className="text-[10px] uppercase tracking-wider text-white/50">
                            Interests
                          </p>
                          <p className="font-medium">
                            DX, Observability, Performance
                          </p>
                        </div>
                      </FadeIn>

                      <FadeIn duration={450} delay={120}>
                        <div className="rounded-xl border border-white/10 p-4">
                          <p className="text-[10px] uppercase tracking-wider text-white/50">
                            Availability
                          </p>
                          <p className="font-medium">Open to collabs & roles</p>
                        </div>
                      </FadeIn>
                    </div>
                  </SlideLeft>
                </div>
              </CardContent>
            </Card>
          </SlideUp>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="app-container grid md:grid-cols-2 gap-10 items-center mx-auto px-4 sm:px-6">
        <Stagger step={100}>
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
              connectionsColor="#008080"
              labelFontUrl="/fonts/JetBrainsMono-Bold.ttf"
              rotateAuto
              showIcons
              depthFadeIcons
            />
          </SlideLeft>
        </Stagger>
      </section>

      <section className="app-container mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <SlideUp duration={650}>
            <h2 className="text-3xl md:text-4xl font-bold text-brand">
              Featured Projects
            </h2>
          </SlideUp>
          <FadeIn duration={600} delay={40}>
            <p className="text-muted md:text-lg">
              Selected work with short descriptions and links.
            </p>
          </FadeIn>
        </div>

        <Stagger baseDelay={80} step={90}>
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map(p => (
              <SlideUp key={p.title} duration={650}>
                <Card className="overflow-hidden border border-white/10 group">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                  />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{p.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/80 leading-relaxed">{p.blurb}</p>
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map(tag => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      {p.live && (
                        <Button to={p.live} variant="solid">
                          <ExternalLink className="mr-2 h-4 w-4" /> Live
                        </Button>
                      )}
                      {p.repo && (
                        <Button to={p.repo} variant="outline">
                          <Github className="mr-2 h-4 w-4" /> Repo
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </SlideUp>
            ))}
          </div>
        </Stagger>
      </section>

      <section className="app-container mx-auto px-4 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <SlideUp duration={650}>
            <h2 className="text-3xl md:text-4xl font-bold text-brand">
              Live Metrics
            </h2>
          </SlideUp>
          <FadeIn duration={500} delay={40}>
            <Button to="/metrics" variant="outline">
              View Dashboard
            </Button>
          </FadeIn>
        </div>

        <Stagger baseDelay={200} step={90}>
          <div className="grid gap-4 sm:grid-cols-3">
            {items.map(({ label, value, icon: Icon }) => (
              <SlideUp key={label} duration={600}>
                <Card className="border border-white/10">
                  <CardContent className="flex items-center justify-between py-5">
                    <div className="space-y-1">
                      <p className="text-sm text-white/60">{label}</p>
                      <p className="text-2xl font-semibold">{value}</p>
                    </div>
                    <Icon className="h-6 w-6 opacity-80" />
                  </CardContent>
                </Card>
              </SlideUp>
            ))}
          </div>
        </Stagger>
      </section>
    </main>
  );
}
