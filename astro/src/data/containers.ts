// Containers shown by name in the hero's "top containers" widget.
// Matched against the container name or image; first match wins, and several containers
// can share a label (they are summed). Anything unmatched is folded into "Other",
// so client or personal project names never reach the page.
// pinned: always shown, even if smaller than the top rows
export const CONTAINER_ALIASES: { match: RegExp; label: string; pinned?: boolean }[] = [
	{ match: /ghcr\.io\/cd-chief\/dev-portfolio/, label: 'This site', pinned: true },
	{ match: /^coolify-proxy$|^traefik:/, label: 'Traefik' },
	{ match: /^coolify(-sentinel|-db|-redis|-realtime)?$/, label: 'Coolify' },
	{ match: /prom\/prometheus|grafana\/grafana|cadvisor|prom\/node-exporter/, label: 'Monitoring' },
	// Umami app and its database share the Coolify resource id
	{ match: /umami-software|p4c0s88skokksww4o0owok8w/, label: 'Umami' },
	{ match: /henrygd\/beszel/, label: 'Beszel' },
];

export const OTHER_LABEL = 'Other';
// Named rows shown before the rest collapse into "Other"
export const TOP_CONTAINERS = 5;
