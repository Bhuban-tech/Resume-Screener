// Aligned with backend SkillExtractorService MASTER_SKILLS for skill extraction
export const SKILL_LIST = [
  'Java', 'Python', 'JavaScript', 'TypeScript', 'Kotlin', 'Swift', 'Go', 'Rust', 'C', 'C++', 'C#',
  'Ruby', 'PHP', 'Scala', 'R',
  'Spring Boot', 'Spring', 'Hibernate', 'React', 'Angular', 'Vue', 'Flutter', 'Django',
  'FastAPI', 'Node.js', 'Express', 'Next.js', 'NestJS',
  'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Cassandra', 'Oracle', 'SQLite',
  'Elasticsearch', 'DynamoDB',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'Terraform',
  'Ansible', 'CI/CD', 'Linux',
  'Git', 'Maven', 'Gradle', 'Kafka', 'RabbitMQ', 'GraphQL', 'REST', 'Microservices',
  'JUnit', 'Mockito', 'Selenium',
  'Machine Learning', 'Deep Learning', 'Data Science', 'AI', 'NLP',
  'Agile', 'Scrum', 'TDD', 'OOP', 'Design Patterns',
];

export const FILTER_OPTIONS = [
  { label: 'All Scores', value: 'all' },
  { label: 'Must-have met only', value: 'must-have' },
  { label: '80%+ (Strong Match)', value: '80' },
  { label: '60%+ (Good Match)', value: '60' },
];

export const STATUS_FILTER_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Shortlisted', value: 'SHORTLISTED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export const SORT_OPTIONS = [
  { label: 'Sort by Score', value: 'score' },
  { label: 'Sort by Name', value: 'name' },
];

export const FEATURES = [
  {
    title: 'Smart Screening',
    description: 'Upload multiple PDFs and screen them against any job description instantly.',
    icon: '🎯',
  },
  {
    title: 'Skill Matching',
    description: 'Skills are matched against your job description and ranked automatically.',
    icon: '⚡',
  },
  {
    title: 'Ranked Results',
    description: 'Candidates are ranked by score with clear skill match and gap analysis.',
    icon: '📊',
  },
  {
    title: 'Export CSV',
    description: 'Download your screening results as a CSV for further analysis or sharing.',
    icon: '📁',
  },
];
