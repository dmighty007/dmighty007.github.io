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
  visual: 'pathgennie' | 'icecoder' | 'kinetics' | 'trails';
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
    visual: 'pathgennie',
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
    visual: 'icecoder',
  },
  {
    id: 'pathway-resolved-kinetics',
    title: 'Pathway-resolved kinetics',
    tagline: 'Neural-network-guided weighted-ensemble simulations for channel-specific rates',
    problem:
      'When a rare event proceeds through multiple competing pathways, standard weighted-ensemble kinetics estimates the overall rate but obscures how much flux flows through each individual channel.',
    approach:
      'A neural-network path coordinate separates trajectories into distinct pathway families during weighted-ensemble sampling, allowing each channel to be resolved and analyzed independently.',
    contribution:
      'Enables quantitative, pathway-resolved kinetics — channel-specific fluxes and mean first-passage times — from weighted-ensemble simulations rather than a single lumped rate.',
    publicationId: 'pathway-resolved-kinetics-chemrxiv-2026',
    doi: '10.26434/chemrxiv.15005553/v1',
    visual: 'kinetics',
  },
  {
    id: 'trails-md',
    title: 'TRAILS-MD',
    tagline: 'Lineage-aware adaptive molecular-dynamics framework',
    problem:
      'Adaptive sampling campaigns spawn and prune many trajectory segments over time, and tracking how each segment relates to its ancestry is essential for correct reweighting and analysis.',
    approach:
      'TRAILS-MD is a lightweight, engine-agnostic framework that tracks trajectory lineage explicitly through the adaptive sampling process, independent of the underlying MD engine.',
    contribution:
      'Provides reusable infrastructure for lineage-aware adaptive molecular-dynamics sampling that can be paired with different simulation engines and sampling strategies.',
    code: 'https://github.com/TeamSuman/Trails-MD',
    visual: 'trails',
  },
];
