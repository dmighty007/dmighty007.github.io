export interface Publication {
  id: string;
  year: number;
  title: string;
  authors: string; // plain text, "Dibyendu Maity" will be highlighted at render time
  venue: string;
  volume?: string;
  pages?: string;
  articleNumber?: string;
  doi: string;
  status: 'published' | 'preprint';
  isFirstAuthor: boolean;
  tags: Array<'methods' | 'applications'>;
  code?: string;
  featured?: boolean;
}

export const publications: Publication[] = [
  {
    id: 'cowera-2026',
    year: 2026,
    title:
      'CoWERA: A Temporal Coherence Guided Binless Resampling Algorithm for Weighted-Ensemble Based Estimation of Rare-Event Kinetics',
    authors: 'S. Shahid, Dibyendu Maity, Suman Chakrabarty',
    venue: 'The Journal of Chemical Physics',
    volume: '164',
    pages: '134111',
    doi: '10.1063/5.0320586',
    status: 'published',
    isFirstAuthor: false,
    tags: ['methods'],
  },
  {
    id: 'pathway-phase-separation-2026',
    year: 2026,
    title:
      'Pathway Controlled Phase Separation of Minimal Building Blocks Utilizing a Dissociative Chemical Transformation',
    authors: 'S. Pal, Dibyendu Maity, J. Chakraborty, S. Jha, K. Sarma, N. Koner, S. Chakrabarty, D. Das',
    venue: 'Angewandte Chemie International Edition',
    articleNumber: 'e1914460',
    doi: '10.1002/anie.1914460',
    status: 'published',
    isFirstAuthor: false,
    tags: ['applications'],
  },
  {
    id: 'microwave-thermal-blood-2026',
    year: 2026,
    title:
      'Microwave-Assisted Thermal Profiling of Blood: A Potential Biomarker for Differentiating Cancer and Non-Cancer States',
    authors:
      'S. Sarkar, R. Saha, A. Dutta, R. Chattopadhyay, Dibyendu Maity, I. Biswas, A. Mondal, A. Ghosh, R. Ganguly, A. K. Santra, U. Garain, D. Mitra, S. Chakrabarty',
    venue: 'Journal of Medical Engineering & Technology',
    pages: '1–16',
    doi: '10.1080/03091902.2026.2698512',
    status: 'published',
    isFirstAuthor: false,
    tags: ['applications'],
  },
  {
    id: 'pathgennie-2025',
    year: 2025,
    title:
      'PathGennie: Rapid Generation of Rare Event Pathways via Direction-Guided Adaptive Sampling Using Ultrashort Monitored Trajectories',
    authors: 'Dibyendu Maity, Shaheerah Shahid, Suman Chakrabarty',
    venue: 'Journal of Chemical Theory and Computation',
    volume: '21',
    pages: '11377–11389',
    doi: '10.1021/acs.jctc.5c01244',
    status: 'published',
    isFirstAuthor: true,
    tags: ['methods'],
    code: 'https://github.com/dmighty007/PathGennie',
    featured: true,
  },
  {
    id: 'icecoder-2025',
    year: 2025,
    title: 'IceCoder: Identification of Ice Phases in Molecular Simulation Using Variational Autoencoder',
    authors: 'Dibyendu Maity, Suman Chakrabarty',
    venue: 'Journal of Chemical Theory and Computation',
    volume: '21',
    pages: '1916–1928',
    doi: '10.1021/acs.jctc.4c01298',
    status: 'published',
    isFirstAuthor: true,
    tags: ['methods'],
    code: 'https://github.com/dmighty007/IceCoder',
    featured: true,
  },
  {
    id: 'light-harvesting-nanotubes-2023',
    year: 2023,
    title: 'Efficient Light Harvesting in Self-Assembled Organic Luminescent Nanotubes',
    authors: 'S. K. Bhaumik, Dibyendu Maity, I. Basu, S. Chakrabarty, S. Banerjee',
    venue: 'Chemical Science',
    volume: '14',
    pages: '4363–4374',
    doi: '10.1039/D3SC00375B',
    status: 'published',
    isFirstAuthor: false,
    tags: ['applications'],
  },
  {
    id: 'dimer-parity-odd-even-2022',
    year: 2022,
    title:
      'Dimer-Parity-Dependent Odd-Even Effects in Photoinduced Transitions to Cholesteric and TGB Smectic-C* Mesophases: Experiments and Simulations',
    authors: 'R. Sahoo, Dibyendu Maity, D. S. S. Rao, S. Chakrabarty, C. V. Yelamaggad, S. K. Prasad',
    venue: 'Physical Review E',
    volume: '106',
    articleNumber: '044702',
    doi: '10.1103/PhysRevE.106.044702',
    status: 'published',
    isFirstAuthor: false,
    tags: ['applications'],
  },
  {
    id: 'pathway-resolved-kinetics-chemrxiv-2026',
    year: 2026,
    title: 'Quantitative Pathway-Resolved Kinetics from Neural Network-Guided Weighted Ensemble Simulations',
    authors: 'Dibyendu Maity, Shaheerah Shahid, S. Bhattacharya, R. Majumdar, Suman Chakrabarty',
    venue: 'ChemRxiv',
    doi: '10.26434/chemrxiv.15005553/v1',
    status: 'preprint',
    isFirstAuthor: true,
    tags: ['methods'],
    featured: true,
  },
];

export const publicationYears = Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a);
