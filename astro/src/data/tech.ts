// The one list of technologies a project or post can be tagged with.
// Names must match exactly; the content schema rejects anything not listed here.
// "infra" tools get the accent colour on tags, everything else stays neutral.
export const TECH = {
	// Infrastructure and DevOps
	Docker: 'infra',
	Traefik: 'infra',
	'GitHub Actions': 'infra',
	GHCR: 'infra',
	Coolify: 'infra',
	Azure: 'infra',
	Linux: 'infra',
	Nginx: 'infra',
	Kubernetes: 'infra',
	Terraform: 'infra',
	Ansible: 'infra',
	Grafana: 'infra',
	Prometheus: 'infra',
	Proxmox: 'infra',
	Beszel: 'infra',
	Umami: 'infra',

	// Languages, frameworks and everything else
	Python: 'general',
	Flask: 'general',
	PyTorch: 'general',
	Pygame: 'general',
	MediaPipe: 'general',
	Gemini: 'general',
	SQLite: 'general',
	PostgreSQL: 'general',
	'Raspberry Pi': 'general',
	HTML: 'general',
	CSS: 'general',
	JavaScript: 'general',
	TypeScript: 'general',
	React: 'general',
	'Next.js': 'general',
	Astro: 'general',
	'Tailwind CSS': 'general',
	Sanity: 'general',
	Figma: 'general',
} as const satisfies Record<string, 'infra' | 'general'>;

export type TechName = keyof typeof TECH;
export const TECH_NAMES = Object.keys(TECH) as [TechName, ...TechName[]];

export const isInfra = (name: TechName) => TECH[name] === 'infra';

// Infra first, so it survives when a card truncates its tag list
export const sortTech = (names: readonly TechName[]) =>
	[...names].sort((a, b) => Number(isInfra(b)) - Number(isInfra(a)));

// Each post gets exactly one topic
export const TOPICS = ['DevOps', 'Self-hosting', 'CI/CD', 'Career'] as const;
export type Topic = (typeof TOPICS)[number];
