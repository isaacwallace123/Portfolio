// scripts/generate-icons.ts
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import type { SimpleIcon } from 'simple-icons';
import * as simpleIcons from 'simple-icons';

// ---- Types that mirror your app data ----
type SkillItem = { label: string; color?: string; icon?: string };

// ---- Output config ----
const OUT_DIR = path.resolve('public/icons');
const SIZE = 256;

// Ensure output dir exists
await mkdir(OUT_DIR, { recursive: true });

// ---- Load SkillsArray from TS file (works with tsx) ----
async function loadSkills(): Promise<SkillItem[]> {
  const skillsTsPath = path.resolve('src/shared/data/Skills.data.ts');
  const skillsUrl = pathToFileURL(skillsTsPath).href;
  const mod = (await import(skillsUrl)) as { default: SkillItem[] };
  return mod.default;
}

// ---- Label → Simple-Icons slug overrides (authoritative) ----
const OVERRIDES: Record<string, string> = {
  TypeScript: 'typescript',
  React: 'react',
  Tailwind: 'tailwindcss',
  Go: 'go',
  Docker: 'docker',
  Postgres: 'postgresql',
  Kubernetes: 'kubernetes',
  Proxmox: 'proxmox',
  Unraid: 'unraid',
  Linux: 'linux',
  Python: 'python',
  'C++': 'cplusplus',
  Java: 'java',
  JavaScript: 'javascript',
  HTML5: 'html5',
  CSS: 'css',
  Git: 'git',
  GitHub: 'github',
  'CI/CD': 'githubactions',
  Springboot: 'spring',
  Roblox: 'roblox',
  LUAU: 'lua',
  Redis: 'redis',
  MongoDB: 'mongodb',
  Azure: 'microsoftazure',
  Blender: 'blender',
  'Node.js': 'nodedotjs',
  Express: 'express',
  'Next.js': 'nextdotjs',
  Prisma: 'prisma',
  GraphQL: 'graphql',
  'GitHub Actions': 'githubactions',
  Terraform: 'terraform',
  Helm: 'helm',
  NGINX: 'nginx',
  Traefik: 'traefikproxy',
  Prometheus: 'prometheus',
  Grafana: 'grafana',
  Jest: 'jest',
  Playwright: 'playwright',
  Vite: 'vite',
  Angular: 'angular',
};

// ---- Fallback slug normalizer (overrides are preferred) ----
function toSlug(label: string): string {
  if (OVERRIDES[label]) return OVERRIDES[label];
  return label
    .toLowerCase()
    .replace(/c\+\+/g, 'cplusplus')
    .replace(/node\.js/g, 'nodedotjs')
    .replace(/next\.js/g, 'nextdotjs')
    .replace(/github actions/g, 'githubactions')
    .replace(/ci\/cd/g, 'githubactions')
    .replace(/traefik/g, 'traefikproxy')
    .replace(/postgres/g, 'postgresql')
    .replace(/[ ._/]/g, '')
    .replace(/\+/g, 'plus');
}

// ---- Minimal icon shape we need across Simple-Icons versions ----
type SimpleIconLike = Pick<SimpleIcon, 'hex'> & {
  svg?: string; // modern
  path?: string; // older fallback
};

// Typed view of the module across versions
type SimpleIconsModule = {
  get?: (slug: string) => SimpleIconLike | undefined;
  Get?: (slug: string) => SimpleIconLike | undefined;
  [exportName: string]: unknown;
};

// ---- Resolve an icon by slug (handles API differences) ----
function getIcon(slug: string): SimpleIconLike | undefined {
  const lib = simpleIcons as unknown as SimpleIconsModule;

  if (typeof lib.get === 'function') return lib.get(slug);
  if (typeof lib.Get === 'function') return lib.Get(slug);

  // Fallback to named export pattern: siReact, siNextdotjs, etc.
  const key =
    'si' +
    slug
      .replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase())
      .replace(/^\w/, (s: string) => s.toUpperCase());

  const val = lib[key];
  if (val && typeof val === 'object') return val as SimpleIconLike;
  return undefined;
}

// ---- Generate a PNG from a Simple-Icons entry ----
async function writePngFromSimpleIcon(name: string, slug: string, size = SIZE) {
  const icon = getIcon(slug);
  if (!icon) {
    console.warn(`⚠️  Missing Simple Icon for "${name}" (slug "${slug}")`);
    return;
  }

  const rawSvg =
    icon.svg ??
    (icon.path
      ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${icon.path}"/></svg>`
      : null);

  if (!rawSvg) {
    console.warn(`⚠️  Icon for "${name}" has no SVG/path.`);
    return;
  }

  const hex = icon.hex ?? '000000';
  const svgColored = rawSvg.includes('currentColor')
    ? rawSvg.replace(/currentColor/g, `#${hex}`)
    : rawSvg.replace('<svg', `<svg fill="#${hex}"`);

  const outPath = path.join(OUT_DIR, `${slug}.png`);
  const png = await sharp(Buffer.from(svgColored))
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();

  await writeFile(outPath, png);
  console.log(`✅ ${name} → ${outPath}`);
}

// ---- Main: read skills, create icons, write a label→icon map ----
async function main() {
  const skills = await loadSkills();
  const mapping: Record<string, string> = {};

  for (const s of skills) {
    // If data already specifies a local icon, keep it (remove to force regen)
    if (s.icon && s.icon.startsWith('/icons/')) {
      mapping[s.label] = s.icon;
      continue;
    }
    const slug = toSlug(s.label);
    await writePngFromSimpleIcon(s.label, slug);
    mapping[s.label] = `/icons/${slug}.png`;
  }

  await writeFile(
    path.join(OUT_DIR, '_map.json'),
    JSON.stringify(mapping, null, 2)
  );
  console.log(`\n🗺  Wrote label→icon map to public/icons/_map.json`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
