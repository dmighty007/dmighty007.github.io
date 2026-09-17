export interface FeaturedProject {
  id: string;
  title: string;
  tagline: string;
  problem: string;
  approach: string;
  contribution: string;
  publicationId?: string;
  doi?: string;
  code?: string;
  image: string;
  imageAlt: string;
}

export const featuredProjects: FeaturedProject[] = [
  {
    id: 'pathgennie',
    title: 'PathGennie',
    tagline: 'Direction-guided adaptive sampling for rare-event transition pathways',
    problem:
      'Rare molecular transitions — folding events, phase changes, chemical reorganizations — occur on timescales far beyond what direct molecular dynamics can reach, making transition pathways difficult to sample efficiently.',
    approach:
      'PathGennie uses ultrashort monitored trajectories to steer adaptive sampling along a direction that biases exploration toward the transition, generating rare-event pathways rapidly without long unbiased runs.',
    contribution:
      'Provides a practical, direction-guided adaptive-sampling scheme for generating transition pathways at substantially reduced computational cost, released as an open-source Python framework.',
    publicationId: 'pathgennie-2025',
    doi: '10.1021/acs.jctc.5c01244',
    code: 'https://github.com/dmighty007/PathGennie',
    image: '/images/research/pathgennie.webp',
    imageAlt:
      'Infographic summarizing PathGennie: the challenge of rare molecular events with long waiting times, the direction-guided adaptive-sampling concept, and rapid generation of reactive pathways within hundreds of picoseconds.',
  },
  {
    id: 'icecoder',
    title: 'IceCoder',
    tagline: 'Variational-autoencoder representation learning for ice-phase identification',
    problem:
      'Distinguishing ice polymorphs and liquid environments from local molecular geometry is difficult with hand-crafted order parameters, which are often specific to a single phase or system.',
    approach:
      'IceCoder learns a compact latent representation of local molecular environments with a variational autoencoder, trained without phase labels, so that structurally distinct environments separate naturally in latent space.',
    contribution:
      'Delivers an unsupervised classifier for ice phases and liquid environments that generalizes across simulation conditions, packaged as an open-source PyTorch framework.',
    publicationId: 'icecoder-2025',
    doi: '10.1021/acs.jctc.4c01298',
    code: 'https://github.com/dmighty007/IceCoder',
    image: '/images/research/icecoder.webp',
    imageAlt:
      'Latent-space scatter plot from IceCoder showing liquid water and ice polymorphs Ih, Ic, II, III, V, VI, VII, and XVII separating into distinct clusters learned by the variational autoencoder.',
  },
  {
    id: 'pathway-resolved-kinetics',
    title: 'Pathway-resolved kinetics',
    tagline: 'Neural-network-guided weighted-ensemble simulations for channel-specific rates',
    problem:
      'When a rare event proceeds through multiple competing pathways, standard weighted-ensemble kinetics estimates the overall rate but obscures how much flux flows through each individual channel.',
    approach:
      'Candidate transition routes are grouped and refined into smooth reference pathways described by a neural-network path collective variable (PathCV), and independent weighted-ensemble (WE) simulations are then run along each channel.',
    contribution:
      'Enables quantitative, pathway-resolved kinetics — channel-specific fluxes and mean first-passage times — from weighted-ensemble simulations rather than a single lumped rate.',
    publicationId: 'pathway-resolved-kinetics-chemrxiv-2026',
    doi: '10.26434/chemrxiv.15005553/v1',
    image: '/images/research/pathway-kinetics.webp',
    imageAlt:
      'Schematic showing a neural-network path collective variable (PathCV) combined with weighted-ensemble (WE) sampling, producing separate rate estimates for four distinct pathways.',
  },
  {
    id: 'trails-md',
    title: 'TRAILS-MD',
    tagline: 'Lineage-aware adaptive molecular-dynamics framework',
    problem:
      'Adaptive sampling campaigns spawn and prune many trajectory segments over time, and tracking how each segment relates to its ancestry is essential for correct reweighting and analysis.',
    approach:
      'TRAILS-MD runs many short, segmented parallel walkers and records which earlier segment produced each new one, so continuous transition paths can be reconstructed from many short pieces regardless of the underlying MD engine.',
    contribution:
      'Turns rapid, broad exploration into connected, interpretable transition pathways rather than a scatter of disconnected samples, released as reusable adaptive-sampling infrastructure.',
    code: 'https://github.com/TeamSuman/Trails-MD',
    image: '/images/research/trails-md.webp',
    imageAlt:
      'Diagram showing many short segmented parallel walkers exploring rapidly from State A and connecting into two distinct transition paths, Path 1 and Path 2, that reach State B.',
  },
];
