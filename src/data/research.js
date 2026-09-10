/**
 * Detailed case studies for flagship research contributions.
 */
export const researchThemes = [
  {
    id: "pathgennie",
    title: "Direction-Guided Rare-Event Adaptive Sampling",
    status: "Published in JCTC (2025)",
    thesisRef: "Thesis Chapter 3",
    subtitle: "How can rare transition pathways be generated efficiently without getting trapped in deep metastable basins?",
    problem: "Rare molecular transitions (e.g. conformational changes, nucleation, ligand binding) face high free-energy barriers, requiring micro- to millisecond timescales inaccessible to standard MD.",
    methodology: "Formulated PathGennie, an adaptive framework that spawns short parallel molecular dynamics segments and steers exploration along progress coordinates through real-time directional decisions.",
    result: "Constructed complete transition pathways using monitored ultrashort MD segments (50-100 ps). Accelerated pathway discovery by 10- to 100-fold on monitored benchmark systems without altering the physical potential.",
    contributionStatement: "Conceptualized and designed the direction-guided adaptive-sampling strategy, authored the Python package, and conducted validation on model systems.",
    toc: {
      label: "JCTC 2025 · Paper TOC",
      input: "Short monitored MD segments",
      method: "Direction-guided adaptive sampling",
      output: "Complete rare-event pathway",
      caption: "PathGennie steers ultrashort trajectories toward productive barrier-crossing routes."
    },
    codeUrl: "https://github.com/dmighty007/PathGennie",
    pubUrl: "https://pubs.acs.org/doi/10.1021/acs.jctc.5c01244"
  },
  {
    id: "icecoder",
    title: "Unsupervised Structural Phase Identification",
    status: "Published in JCTC (2025)",
    thesisRef: "Thesis Chapter 2",
    subtitle: "How can metastable states, structural phases, and reaction coordinates be detected directly from simulation trajectories?",
    problem: "Detecting crystallizing ice polymorphs or transient solid phases normally relies on manually engineered order parameters sensitive to temperature and noise.",
    methodology: "Integrated local SOAP (Smooth Overlap of Atomic Positions) density descriptors with a Variational Autoencoder (VAE) to construct IceCoder, projecting multi-phase structural environments into low-dimensional latent spaces.",
    result: "Achieved high-contrast latent-space clustering separating hexagonal ice (Ih), cubic ice (Ic), and liquid water environments. Successfully tracked dynamic phase-boundary nucleation on the fly.",
    contributionStatement: "Developed the SOAP-VAE representation coupling, implemented training workflows, and analyzed phase-boundary nucleation dynamics.",
    toc: {
      label: "JCTC 2025 · Paper TOC",
      input: "Local SOAP environments",
      method: "Variational autoencoder",
      output: "Ice Ih · Ice Ic · liquid",
      caption: "IceCoder maps local molecular environments into a latent space that separates ice phases and liquid water."
    },
    codeUrl: "https://github.com/dmighty007/IceCoder",
    pubUrl: "https://pubs.acs.org/doi/10.1021/acs.jctc.4c01298"
  },
  {
    id: "trails-md",
    title: "Lineage-Aware Adaptive Conformational Sampling",
    status: "Scientific software (2026)",
    thesisRef: null,
    subtitle: "How can adaptive simulations explore unknown conformational landscapes while preserving continuous physical histories?",
    problem: "Adaptive sampling algorithms often scatter trajectory seeds, making it difficult to verify whether sampled configurations belong to continuous physical transition pathways.",
    methodology: "Developed TRAILS-MD, an engine-agnostic framework that couples lightweight density-based seed selection with explicit trajectory lineage tracking across fixed or ML-learned collective variables.",
    result: "Reconstructed continuous conformational transition routes from short parallel trajectory fragments, eliminating trajectory fragmentation artifacts and facilitating rate calculations.",
    contributionStatement: "Designed and implemented the TRAILS-MD package, formulated lineage forest data structures, and validated on protein folding/unbinding benchmarks.",
    toc: {
      label: "TRAILS-MD · Software workflow",
      input: "Parallel short trajectories",
      method: "Lineage-aware resampling",
      output: "Continuous transition history",
      caption: "TRAILS-MD preserves trajectory ancestry while adaptive sampling explores complex conformational landscapes."
    },
    codeUrl: "https://github.com/TeamSuman/Trails-MD"
  },
  {
    id: "solvation-transferability",
    title: "Molecular Representation Learning & Transferability",
    status: "Thesis research (2025)",
    thesisRef: "Thesis Chapter 1",
    subtitle: "How should high-dimensional molecular coordinates and trajectories be encoded for effective property prediction?",
    problem: "Deep learning models for chemical property prediction often achieve high benchmark scores on random dataset splits but fail when tested on out-of-distribution solvents or solutes.",
    methodology: "Evaluated 2D graph embeddings, 3D conformer statistics, SOAP descriptors, and trajectory features against leakage-controlled chemical datasets for solvation free energy prediction.",
    result: "Identified key chemical transferability bottlenecks (e.g., shielded polar groups, long-chain alkanes) and demonstrated domain-aware representations that balance local chemistry and spatial orientations.",
    contributionStatement: "Curated domain-transfer benchmarks, evaluated ML architectures, and established guidelines for transferability assessment.",
    toc: {
      label: "Thesis research · Representation study",
      input: "2D, 3D, SOAP, trajectory features",
      method: "Leakage-controlled domain split",
      output: "Transferable solvation models",
      caption: "Representation choices are evaluated across out-of-distribution solutes and solvents."
    },
    codeUrl: "https://github.com/dmighty007/solvation-transferability",
    pubUrl: "https://doi.org/10.21203/rs.3.rs-6727155/v1"
  }
];
