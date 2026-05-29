export type TechCategory =
  | 'styling'
  | 'backend'
  | 'database'
  | 'hardware'
  | 'ai'
  | 'web'
  | 'devops'
  | 'other';

const categoryClasses: Record<TechCategory, string> = {
  styling: 'bg-pink-100 text-pink-700 border-pink-300',
  backend: 'bg-green-100 text-green-700 border-green-300',
  database: 'bg-purple-100 text-purple-700 border-purple-300',
  hardware: 'bg-red-100 text-red-700 border-red-300',
  ai: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  web: 'bg-blue-100 text-blue-700 border-blue-300',
  devops: 'bg-orange-100 text-orange-700 border-orange-300',
  other: 'bg-gray-100 text-gray-700 border-gray-300',
};

const categoryMatchers: Record<TechCategory, string[]> = {
  styling: ['css', 'tailwind', 'sass', 'figma'],
  backend: ['node', 'express', 'python', 'flask', 'next', 'sanity'],
  database: ['mongo', 'postgres', 'mysql', 'sqlite', 'sql', 'database'],
  hardware: ['raspberry pi', 'arduino', 'iot'],
  ai: ['pytorch', 'mediapipe', 'gemini', 'ml', 'ai'],
  web: ['html', 'javascript', 'typescript', 'react', 'vue', 'angular', 'astro'],
  devops: ['docker', 'traefik', 'github actions', 'azure', 'aws', 'gcp', 'kubernetes', 'ci/cd'],
  other: [],
};

export const getTechCategory = (tech: string): TechCategory => {
  const techLower = tech.toLowerCase();

  for (const [category, matchers] of Object.entries(categoryMatchers) as [TechCategory, string[]][]) {
    if (matchers.some((matcher) => techLower.includes(matcher))) {
      return category;
    }
  }

  return 'other';
};

export const getTechColor = (tech: string): string => {
  return categoryClasses[getTechCategory(tech)];
};
