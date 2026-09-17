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
    language: 'Python / C++',
    description: 'Local solvation and structural-order-parameter analysis utilities for molecular simulations.',
    repo: 'https://github.com/dmighty007/SolOrder',
  },
];
