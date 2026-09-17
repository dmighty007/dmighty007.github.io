export interface ExpertiseGroup {
  title: string;
  items: string[];
}

export const expertise: ExpertiseGroup[] = [
  {
    title: 'Molecular simulation',
    items: [
      'Molecular Dynamics',
      'Enhanced Sampling',
      'Metadynamics',
      'Umbrella Sampling',
      'Adaptive Sampling',
      'Rare-Event Sampling',
      'Langevin Dynamics',
      'Weighted Ensemble',
    ],
  },
  {
    title: 'Machine learning',
    items: [
      'Representation Learning',
      'Autoencoders',
      'Variational Autoencoders',
      'Deep Learning',
      'Data-driven collective variables',
      'Pathway analysis',
    ],
  },
  {
    title: 'Programming',
    items: ['Python', 'NumPy', 'SciPy', 'PyTorch', 'MDAnalysis', 'MDTraj', 'C++', 'Bash'],
  },
  {
    title: 'Simulation / scientific computing',
    items: ['GROMACS', 'OpenMM', 'PLUMED', 'Git', 'Linux', 'HPC environments'],
  },
];

export const researchThemes = [
  {
    id: 'rare-event-sampling',
    title: 'Rare-event sampling',
    description: 'Adaptive simulation strategies for efficiently discovering infrequent molecular transitions.',
  },
  {
    id: 'transition-pathways-kinetics',
    title: 'Transition pathways & kinetics',
    description:
      'Pathway discovery, pathway-resolved analysis, weighted-ensemble simulations, fluxes, MFPTs, and kinetic observables.',
  },
  {
    id: 'ml-representations',
    title: 'Machine-learned molecular representations',
    description:
      'Autoencoders, variational autoencoders, learned collective variables, dimensionality reduction, and data-driven descriptors.',
  },
  {
    id: 'molecular-materials-simulation',
    title: 'Molecular & materials simulation',
    description:
      'Applications spanning proteins, molecular recognition, phase transitions, molecular materials, solvation, and related problems.',
  },
];
