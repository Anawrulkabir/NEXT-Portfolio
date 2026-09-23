/**
 * Skills — see docs/PORTFOLIO_REDESIGN.md §06.4
 * Grouped into six "workshops", each skill carrying evidence (where it was
 * actually used), never a numeric proficiency. `verify: true`
 * skills render only once the author confirms them.
 */
import type { Skill, SkillGroup } from './types'

export const skillGroups: SkillGroup[] = [
  {
    id: 'programming',
    name: 'Programming',
    workshop: 'The Terminal',
    blurb: 'Languages used across professional and personal work.',
  },
  {
    id: 'software',
    name: 'Software',
    workshop: 'Software Workshop',
    blurb: 'Backend, frameworks, and developer tooling.',
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    workshop: 'The Racks',
    blurb: 'Cloud, containers, and orchestration behind AI Studio.',
  },
  {
    id: 'gpu-ai',
    name: 'GPU / AI Systems',
    workshop: 'GPU Floor',
    blurb: 'GPU virtualization and AI development environments.',
  },
  {
    id: 'ml-research',
    name: 'Machine Learning / Research',
    workshop: 'Research Bench',
    blurb: 'Methods used in the thesis and refrigerant research.',
  },
  {
    id: 'engineering',
    name: 'Mechanical Engineering',
    workshop: 'Thermal & Fluids Bench',
    blurb: 'The engineering foundation underneath the research.',
  },
]

export const skills: Skill[] = [
  // Programming
  { id: 'python', name: 'Python', group: 'programming', evidence: [{ type: 'research', id: 'pinn-naca0012-thesis' }] },
  { id: 'typescript', name: 'JavaScript / TypeScript', group: 'programming', evidence: [{ type: 'project', id: 'tensorcode' }] },
  { id: 'go', name: 'Go', group: 'programming', evidence: [{ type: 'experience', id: 'poridhi' }] },
  { id: 'cpp', name: 'C/C++', group: 'programming', evidence: [], verify: true },
  { id: 'matlab', name: 'MATLAB', group: 'programming', evidence: [], verify: true },

  // Software
  { id: 'nodejs', name: 'Node.js', group: 'software', evidence: [{ type: 'project', id: 'ride-sharing-microservices' }] },
  { id: 'hono', name: 'Hono.js', group: 'software', evidence: [{ type: 'project', id: 'tensorcode' }] },
  { id: 'flask', name: 'Flask', group: 'software', evidence: [{ type: 'experience', id: 'poridhi' }] },
  { id: 'react', name: 'React', group: 'software', evidence: [{ type: 'project', id: 'tensorcode' }] },
  { id: 'nextjs', name: 'Next.js', group: 'software', evidence: [], verify: true },
  { id: 'postgresql', name: 'PostgreSQL', group: 'software', evidence: [{ type: 'experience', id: 'poridhi' }] },
  { id: 'redis', name: 'Redis', group: 'software', evidence: [{ type: 'project', id: 'ride-sharing-microservices' }] },
  { id: 'mongodb', name: 'MongoDB', group: 'software', evidence: [{ type: 'project', id: 'luca' }, { type: 'project', id: 'sitemark' }] },
  { id: 'rest-apis', name: 'REST APIs', group: 'software', evidence: [{ type: 'experience', id: 'poridhi' }] },
  { id: 'rabbitmq', name: 'RabbitMQ', group: 'software', evidence: [{ type: 'project', id: 'ride-sharing-microservices' }] },
  { id: 'git', name: 'Git', group: 'software', evidence: [], verify: true },
  { id: 'stripe', name: 'Stripe', group: 'software', evidence: [{ type: 'project', id: 'luca' }, { type: 'project', id: 'sitemark' }, { type: 'project', id: 'craftpaper' }], verify: true },
  { id: 'firebase', name: 'Firebase Auth', group: 'software', evidence: [{ type: 'project', id: 'craftpaper' }], verify: true },
  { id: 'express', name: 'Express', group: 'software', evidence: [], verify: true },

  // Infrastructure
  { id: 'linux', name: 'Linux', group: 'infrastructure', evidence: [{ type: 'experience', id: 'poridhi' }], verify: true },
  { id: 'docker', name: 'Docker', group: 'infrastructure', evidence: [{ type: 'experience', id: 'poridhi' }] },
  { id: 'kubernetes', name: 'Kubernetes', group: 'infrastructure', evidence: [{ type: 'project', id: 'ai-studio' }] },
  { id: 'k3s', name: 'k3s', group: 'infrastructure', evidence: [], verify: true },
  { id: 'aws-ec2', name: 'AWS EC2', group: 'infrastructure', evidence: [{ type: 'project', id: 'ai-studio' }] },
  { id: 'aws-s3', name: 'AWS S3', group: 'infrastructure', evidence: [{ type: 'project', id: 'ai-studio' }] },
  { id: 'aws-ecr', name: 'AWS ECR', group: 'infrastructure', evidence: [{ type: 'project', id: 'ai-studio' }] },
  { id: 'temporal', name: 'Temporal', group: 'infrastructure', evidence: [{ type: 'experience', id: 'poridhi' }] },
  { id: 'terraform', name: 'Terraform', group: 'infrastructure', evidence: [{ type: 'experience', id: 'poridhi' }] },
  { id: 'pulumi', name: 'Pulumi', group: 'infrastructure', evidence: [{ type: 'experience', id: 'poridhi' }] },
  { id: 'github-actions', name: 'GitHub Actions', group: 'infrastructure', evidence: [{ type: 'experience', id: 'poridhi' }] },
  { id: 'cloudflare-workers', name: 'Cloudflare Workers', group: 'infrastructure', evidence: [{ type: 'project', id: 'tensorcode' }] },
  { id: 'cloudflare-d1', name: 'Cloudflare D1', group: 'infrastructure', evidence: [{ type: 'project', id: 'tensorcode' }] },
  { id: 'cloudflare-r2', name: 'Cloudflare R2', group: 'infrastructure', evidence: [{ type: 'project', id: 'tensorcode' }] },
  { id: 'cloudflare-kv', name: 'Cloudflare KV', group: 'infrastructure', evidence: [{ type: 'project', id: 'tensorcode' }] },
  { id: 'juicefs', name: 'JuiceFS', group: 'infrastructure', evidence: [{ type: 'project', id: 'ai-studio' }] },
  { id: 'headlamp', name: 'Headlamp', group: 'infrastructure', evidence: [{ type: 'experience', id: 'poridhi' }] },
  { id: 'k8s-rbac', name: 'Kubernetes RBAC', group: 'infrastructure', evidence: [{ type: 'experience', id: 'poridhi' }] },

  // GPU / AI Systems
  { id: 'hami', name: 'HAMi GPU virtualization', group: 'gpu-ai', evidence: [{ type: 'project', id: 'ai-studio' }] },
  { id: 'gpu-partitioning', name: 'NVIDIA GPU partitioning', group: 'gpu-ai', evidence: [{ type: 'project', id: 'ai-studio' }] },
  { id: 'pytorch', name: 'PyTorch', group: 'gpu-ai', evidence: [{ type: 'research', id: 'pinn-naca0012-thesis' }] },
  { id: 'cuda', name: 'CUDA', group: 'gpu-ai', evidence: [{ type: 'project', id: 'tensorcode' }], verify: true },
  { id: 'triton', name: 'Triton', group: 'gpu-ai', evidence: [], verify: true },
  { id: 'jupyter', name: 'Jupyter', group: 'gpu-ai', evidence: [], verify: true },
  { id: 'code-server', name: 'code-server', group: 'gpu-ai', evidence: [], verify: true },
  { id: 'tensorboard', name: 'TensorBoard', group: 'gpu-ai', evidence: [], verify: true },

  // ML / Research
  { id: 'pinn', name: 'Physics-informed neural networks', group: 'ml-research', evidence: [{ type: 'research', id: 'pinn-naca0012-thesis' }] },
  { id: 'lora', name: 'LoRA-style fine-tuning', group: 'ml-research', evidence: [{ type: 'research', id: 'pinn-naca0012-thesis' }] },
  { id: 'gradient-boosting', name: 'Gradient boosting', group: 'ml-research', evidence: [{ type: 'research', id: 'r455a-evaporation-ml' }] },
  { id: 'shap', name: 'SHAP', group: 'ml-research', evidence: [{ type: 'research', id: 'r455a-evaporation-ml' }] },
  { id: 'cross-validation', name: 'Cross-condition validation', group: 'ml-research', evidence: [{ type: 'research', id: 'r455a-evaporation-ml' }] },
  { id: 'feature-engineering', name: 'Dimensionless feature engineering', group: 'ml-research', evidence: [{ type: 'research', id: 'r455a-evaporation-ml' }] },
  { id: 'ml-library', name: 'scikit-learn / XGBoost / LightGBM', group: 'ml-research', evidence: [], verify: true },

  // Engineering
  { id: 'heat-transfer', name: 'Heat transfer', group: 'engineering', evidence: [{ type: 'research', id: 'r455a-evaporation-ml' }] },
  { id: 'refrigeration', name: 'Refrigeration', group: 'engineering', evidence: [{ type: 'research', id: 'r455a-evaporation-ml' }] },
  { id: 'plate-heat-exchangers', name: 'Plate heat exchangers', group: 'engineering', evidence: [{ type: 'research', id: 'r455a-evaporation-ml' }] },
  { id: 'low-gwp-refrigerants', name: 'Low-GWP refrigerants', group: 'engineering', evidence: [{ type: 'research', id: 'r455a-evaporation-ml' }] },
  { id: 'airfoil-aero', name: 'Airfoil aerodynamics', group: 'engineering', evidence: [{ type: 'research', id: 'pinn-naca0012-thesis' }] },
  { id: 'arduino', name: 'Arduino', group: 'engineering', evidence: [{ type: 'project', id: 'soccer-bot' }] },
  { id: 'cad-sim', name: 'CAD / simulation tools', group: 'engineering', evidence: [], verify: true },
]
