export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  years: string;
  detail?: string;
  advisor?: string;
  status?: string;
}

// Homepage timeline: academic progression only (no secondary school).
export const educationTimeline: EducationEntry[] = [
  {
    id: 'bsc',
    degree: 'B.Sc. in Physics (Honours)',
    institution: 'Midnapore College, West Bengal',
    years: '2016–2019',
  },
  {
    id: 'msc',
    degree: 'M.Sc. in Physical Sciences',
    institution: 'University of Calcutta / S. N. Bose National Centre for Basic Sciences, Kolkata',
    years: '2019–2021',
  },
  {
    id: 'phd',
    degree: 'Ph.D. in Physics (Theoretical)',
    institution: 'University of Calcutta / S. N. Bose National Centre for Basic Sciences, Kolkata',
    years: '2021–2026',
    advisor: 'Prof. Suman Chakrabarty',
    detail:
      'Thesis: Development and Application of Machine Learning Approaches for Prediction, Identification and Sampling Problems in the Field of Molecular Modeling and Simulation',
    status: 'Thesis submitted',
  },
];

// Full record for the About page, including secondary education.
export const educationFull: EducationEntry[] = [
  {
    id: 'secondary',
    degree: 'Secondary (WBBSE)',
    institution: 'Ananda Nagar Srinath Vidyapith, Anandanagar',
    years: '2014',
    detail: 'Marks: 94.43%',
  },
  {
    id: 'higher-secondary',
    degree: 'Higher Secondary (WBCHSE)',
    institution: 'Ananda Nagar Srinath Vidyapith, Anandanagar',
    years: '2016',
    detail: 'Marks: 94.0%',
  },
  {
    id: 'bsc',
    degree: 'B.Sc. in Physics (Honours)',
    institution: 'Midnapore College, West Bengal',
    years: '2016–2019',
    detail: 'Marks: 81.25%',
  },
  {
    id: 'msc',
    degree: 'M.Sc. in Physical Sciences',
    institution: 'University of Calcutta / S. N. Bose National Centre for Basic Sciences, Kolkata',
    years: '2019–2021',
    detail: 'Marks: 79.80%',
  },
  {
    id: 'phd',
    degree: 'Ph.D. in Physics (Theoretical)',
    institution: 'University of Calcutta / S. N. Bose National Centre for Basic Sciences, Kolkata',
    years: '2021–2026',
    advisor: 'Prof. Suman Chakrabarty',
    detail:
      'Thesis: Development and Application of Machine Learning Approaches for Prediction, Identification and Sampling Problems in the Field of Molecular Modeling and Simulation',
    status: 'Thesis submitted',
  },
];
