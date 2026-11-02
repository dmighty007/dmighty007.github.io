export interface SoftwareProject {
  id: string;
  name: string;
  language: string;
  description: string;
  repo: string;
}

export const software: SoftwareProject[] = [
  {
    id: 'trails-md',
    name: 'TRAILS-MD',
    language: 'Python',
    description:
      'Lightweight, engine-agnostic framework for lineage-aware adaptive molecular-dynamics sampling.',
    repo: 'https://github.com/TeamSuman/Trails-MD',
  },
  {
    id: 'pathgennie',
    name: 'PathGennie',
    language: 'Python',
    description:
      'Direction-guided adaptive-sampling framework for rapidly generating rare-event transition pathways.',
    repo: 'https://github.com/dmighty007/PathGennie',
  },
  {
    id: 'icecoder',
    name: 'IceCoder',
    language: 'Python / PyTorch',
    description:
      'Unsupervised representation-learning framework for classification and identification of ice polymorphs and liquid environments.',
    repo: 'https://github.com/dmighty007/IceCoder',
  },
  {
    id: 'solorder',
    name: 'SolOrder',
    language: 'Python / Numba',
    description:
      'Pip-installable library of water structural order parameters (tetrahedrality, LSI, F4, Steinhardt, Voronoi, CHILL/CHILL+ and more) with parallel execution, validated on ice polymorphs and nucleation snapshots.',
    repo: 'https://github.com/dmighty007/SolOrder',
  },
  {
    id: 'mdmovie',
    name: 'MD Movie Maker',
    language: 'Python',
    description:
      'Turns a molecular-dynamics trajectory into a multi-panel movie, with the molecule, synced analysis plots and free-energy-surface trails, exported to MP4 or GIF.',
    repo: 'https://github.com/dmighty007/mdmovie',
  },
  {
    id: 'slideforge',
    name: 'SlideForge',
    language: 'JavaScript / Python',
    description:
      'Free desktop presentation app for researchers: editable charts, curve fits, LaTeX equations and rotatable molecular structures on slides, with PowerPoint and PDF export.',
    repo: 'https://github.com/dmighty007/slideforge-studio',
  },
];
