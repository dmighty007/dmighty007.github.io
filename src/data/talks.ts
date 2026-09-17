export interface Talk {
  id: string;
  type: 'invited' | 'lightning' | 'poster';
  title?: string;
  event: string;
  place: string;
  date: string;
  award?: string;
}

export const talks: Talk[] = [
  {
    id: 'cdam-2026',
    type: 'poster',
    event: 'Computational and Data-Driven Advanced Materials (CDAM 2026)',
    place: 'CSIR–Central Glass and Ceramic Research Institute, Kolkata, India',
    date: '7–8 April 2026',
    award: 'Poster Award',
  },
  {
    id: 'ml-enhanced-sampling-workshop-2026',
    type: 'lightning',
    event:
      'Workshop on Machine Learning, Enhanced Sampling, and Dynamical Surrogate Models for Glassy and Adaptable Materials',
    place: 'University of Chicago Center in Delhi, New Delhi, India',
    date: '30 March–1 April 2026',
  },
  {
    id: 'biophysics-today-2025',
    type: 'poster',
    event: 'Biophysics Today',
    place: 'S. N. Bose National Centre for Basic Sciences, Kolkata, India',
    date: '2–4 December 2025',
  },
  {
    id: 'rare-2025',
    type: 'poster',
    event: 'Recent Advances in Modeling Rare Events (RARE 2025): Methods and Applications',
    place: 'Khajuraho, Madhya Pradesh, India',
    date: '9–12 March 2025',
  },
  {
    id: 'iiser-kolkata-2024',
    type: 'invited',
    title: 'Invited lecture',
    event: 'Supramolecular Chemistry Discussion 2024',
    place: 'IISER Kolkata, Kolkata, India',
    date: '8 December 2024',
  },
  {
    id: 'chemdojo-2024',
    type: 'lightning',
    event: 'CHEMDOJO 3.0',
    place: 'India',
    date: '1–4 October 2024',
  },
  {
    id: 'md60-2024',
    type: 'poster',
    event: 'JNCASR–CECAM Conference: MD@60',
    place: 'Jawaharlal Nehru Centre for Advanced Scientific Research, Bengaluru, India',
    date: '26–29 February 2024',
    award: 'Best Poster Award',
  },
  {
    id: 'ml4ms-2024',
    type: 'lightning',
    event: '2nd Discussion Meeting on Machine Learning for Molecular Sciences 2024 (ML4MS2024)',
    place: 'Gokulam Grand, Thiruvananthapuram, Kerala, India',
    date: '1–4 February 2024',
  },
  {
    id: 'tcs-2023',
    type: 'poster',
    title: 'Identification/Classification of Ice Phases in Molecular Simulation using Variational Autoencoder',
    event: 'Theoretical Chemistry Symposium 2023 (TCS-2023)',
    place: 'Department of Chemistry, Indian Institute of Technology Madras, Chennai, India',
    date: '7–10 December 2023',
  },
  {
    id: 'sophyc-2023',
    type: 'poster',
    event: 'Physical Chemistry Symposium 2023 (SoPhyC-2023), inaugural meeting of the Society of Physical Chemistry',
    place: 'Indian Institute of Technology Kanpur, Kanpur, India',
    date: '29–31 October 2023',
  },
  {
    id: 'rac-tca-2022',
    type: 'poster',
    event:
      'National Conference on Recent Advances in Chemistry: Theoretical and Computational Aspects (RAC-TCA 2022)',
    place: 'NIT Meghalaya and North-Eastern Hill University, India',
    date: '18–20 November 2022',
    award: 'Best Poster Award',
  },
];
