/**
 * Dedicated postdoctoral research programmes detailing future directions and host lab integration.
 */
export const researchFitProgrammes = [
  {
    id: "representation-learning",
    title: "Physics-Aware Molecular Representation Learning",
    tagline: "Encoding physical constraints, topological graphs, and trajectory statistics for transferability.",
    foundation: "Evaluated 2D graph embeddings, SOAP descriptors, and trajectory conformer ensembles across out-of-distribution solvation free energy benchmarks.",
    unresolvedQuestion: "How can deep learning representations maintain strict out-of-distribution transferability when solute-solvent systems feature unusual chemistry, charged moieties, or strained transient states?",
    proposedMethod: "Combine equivariant neural network architectures (e.g. EGNN, NequIP) with domain-uncertainty indicators, local hydration shell descriptors (SolOrder), and physical conservation constraints.",
    targetSystems: "Complex drug-like small molecules, electrolyte solutions, and metalloprotein binding pockets."
  },
  {
    id: "rare-event-sampling",
    title: "Adaptive Rare-Event Sampling and Kinetics",
    tagline: "Integrating direction-guided trajectory spawning with lineage-aware transition networks.",
    foundation: "Developed PathGennie for rapid rare-event pathway generation and TRAILS-MD for lineage-aware adaptive MD sampling.",
    unresolvedQuestion: "How can we automatically construct unbiased kinetic rate constants and transition state ensembles for complex macromolecular switches without relying on pre-specified reaction coordinates?",
    proposedMethod: "Coupling direction-guided adaptive sampling (PathGennie) and lineage tracking (TRAILS-MD) with weighted-ensemble flux estimators (CoWERA) and neural-network progress coordinate discovery.",
    targetSystems: "Macromolecular conformational transitions, protein-ligand unbinding kinetics, and intrinsically disordered protein folding routes."
  },
  {
    id: "phase-transitions",
    title: "Machine Learning for Phase Transitions & Self-Assembly",
    tagline: "Unsupervised discovery of local order parameters for nucleation, crystallization, and soft materials.",
    foundation: "Created IceCoder (SOAP-VAE) to classify ice polymorphs and liquid environments without manual order parameters.",
    unresolvedQuestion: "How do transient interfacial structures and topological defects direct homogeneous and heterogeneous nucleation pathways during phase transformations?",
    proposedMethod: "Extend unsupervised VAE and contrastive learning maps to multi-component self-assembling systems, learning time-resolved order parameter trajectories for phase boundary tracking.",
    targetSystems: "Gas hydrate crystallization, organic luminescent nanotube assembly, and responsive mesophase liquid crystals."
  }
];
