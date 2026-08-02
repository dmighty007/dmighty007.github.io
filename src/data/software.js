/**
 * Scientific software tools developed or maintained by Dibyendu Maity.
 * Each project includes explicit repository URLs, dependencies, and execution verification status labels.
 */
export const softwareProjects = [
  {
    id: "trails-md",
    name: "TRAILS-MD",
    tagline: "Lightweight, engine-agnostic framework for lineage-aware adaptive MD sampling.",
    purpose: "Designed for exploring complex conformational landscapes when reaction coordinates are not known in advance. Runs parallel short simulations, tracks particle lineage, and spawns new trajectories from sparse or promising regions.",
    capabilities: [
      "Engine-agnostic integration with GROMACS, OpenMM, NAMD, and PLUMED",
      "Explicit trajectory lineage forest reconstruction from short trajectory segments",
      "Density-aware seed selection across fixed or machine-learned collective variables",
      "Automated continuous pathway assembly and visualization export"
    ],
    supportedSystems: ["Linux", "macOS (HPC clusters supported)"],
    language: "Python",
    dependencies: ["numpy", "scipy", "MDAnalysis", "networkx", "h5py"],
    installCommand: "pip install git+https://github.com/TeamSuman/Trails-MD.git",
    minimalUsage: `from trails import AdaptiveSampler

sampler = AdaptiveSampler(
    topology="protein.pdb",
    cv_definitions=["distance_CV1", "dihedral_CV2"],
    n_workers=16,
    segment_length="100ps"
)

# Run lineage-aware adaptive sampling loop
lineage_forest = sampler.run(
    initial_structure="native.pdb",
    max_generations=50
)

# Reconstruct continuous trajectory
continuous_path = lineage_forest.get_longest_path()
continuous_path.write_xtc("rare_transition.xtc")`,
    testStatus: "Open-source research software",
    verificationStatus: "Repository verified",
    license: "MIT",
    repository: "https://github.com/TeamSuman/Trails-MD"
  },
  {
    id: "pathgennie",
    name: "PathGennie",
    tagline: "Direction-guided adaptive-sampling framework for rapidly generating rare-event transition pathways.",
    purpose: "Accelerates rare-event molecular-dynamics simulations by spawning short parallel MD segments and steering exploration along progress coordinates using real-time direction vectors.",
    capabilities: [
      "Adaptive parallel trajectory spawning along multidimensional progress coordinates",
      "Real-time directional vector calculation for steering exploration",
      "Seamless interface with GROMACS, OpenMM, and PLUMED",
      "Automated barrier-crossing detection and path optimization"
    ],
    supportedSystems: ["Linux", "macOS (HPC clusters supported)"],
    language: "Python",
    dependencies: ["numpy", "scipy", "MDAnalysis", "openmm", "plumed"],
    installCommand: "pip install git+https://github.com/dmighty007/PathGennie.git",
    minimalUsage: `from pathgennie import PathGenerator

generator = PathGenerator(
    topology="system.pdb",
    progress_coordinates=["CV1", "CV2"],
    n_replicas=8,
    segment_length="50ps"
)

transition_pathways = generator.generate_path(
    initial_state="basin_A.coor",
    target_state="basin_B.coor",
    max_iterations=100
)

transition_pathways.write_trajectory("rare_event_pathway.xtc")`,
    testStatus: "Open-source research software (JCTC 2025)",
    verificationStatus: "Syntax validated",
    license: "MIT",
    repository: "https://github.com/dmighty007/PathGennie"
  },
  {
    id: "icecoder",
    name: "IceCoder",
    tagline: "Unsupervised representation-learning framework for ice polymorph and liquid environment classification.",
    purpose: "Classifies and identifies local molecular environments in water and ice phases directly from trajectories. Combines SOAP local density descriptors with variational autoencoders.",
    capabilities: [
      "High-throughput SOAP density descriptor calculation using DScribe",
      "Variational Autoencoder training with PyTorch",
      "2D/3D latent-space phase mappings without manual order parameters",
      "Supports hexagonal ice Ih, cubic ice Ic, and liquid water structural boundaries"
    ],
    supportedSystems: ["Linux", "macOS (CUDA GPUs supported)"],
    language: "Python / PyTorch",
    dependencies: ["torch", "dscribe", "numpy", "scikit-learn", "mdtraj"],
    installCommand: "pip install git+https://github.com/dmighty007/IceCoder.git",
    minimalUsage: `import torch
from icecoder import IceCoderDataset, SOAP_VAE

dataset = IceCoderDataset(
    trajectory="nucleation_run.xtc",
    topology="nucleation_run.gro",
    soap_params={"rcut": 6.0, "nmax": 8, "lmax": 6}
)

model = SOAP_VAE(input_dim=dataset.descriptor_dim, latent_dim=2)
model.load_state_dict(torch.load("vae_weights.pt"))
model.eval()

with torch.no_grad():
    latent_space, phase_predictions = model.encode_trajectory(dataset)

print(f"Latent space shape: {latent_space.shape}")`,
    testStatus: "Open-source research software (JCTC 2025)",
    verificationStatus: "Syntax validated",
    license: "MIT",
    repository: "https://github.com/dmighty007/IceCoder"
  },
  {
    id: "solorder",
    name: "SolOrder",
    tagline: "Local solvation & structural order parameter analysis utilities for molecular simulations.",
    purpose: "Utility library for computing local structural order parameters, hydration shell coordination numbers, tetrahedrality indices, and radial density profiles from atomistic MD trajectories.",
    capabilities: [
      "Fast C++/NumPy calculation of tetrahedral order parameters (q_tet)",
      "Hydration shell spatial distribution and coordination shell extraction",
      "Solvent orientation vector mapping relative to solute surface normals",
      "Parallel trajectory processing for large-scale MD ensembles"
    ],
    supportedSystems: ["Linux", "macOS"],
    language: "Python / C++",
    dependencies: ["numpy", "scipy", "MDAnalysis"],
    installCommand: "pip install git+https://github.com/dmighty007/SolOrder.git",
    minimalUsage: `from solorder import OrderParameterCalculator

calc = OrderParameterCalculator(
    topology="system.pdb",
    trajectory="solvation.xtc"
)

# Compute tetrahedral order parameter q_tet for water molecules
q_values = calc.compute_tetrahedral_order(solvent_mask="resname SOL")
print(f"Mean tetrahedrality index q = {q_values.mean():.4f}")`,
    testStatus: "Open-source repository",
    verificationStatus: "Repository verified",
    license: "MIT",
    repository: "https://github.com/dmighty007/SolOrder"
  },
  {
    id: "we-tools",
    name: "we-trajectory-lineage",
    tagline: "Trajectory-lineage reconstruction utilities for weighted-ensemble dynamics.",
    purpose: "Reconstructs complete, continuous trajectory histories from split-and-merge weighted-ensemble dynamics for kinetic rate constant extraction and transition network modeling.",
    capabilities: [
      "Lineage tracing of split-and-merge particles across WESTPA / WE data files",
      "Unbiased transition flux calculation between target basins",
      "Export of continuous trajectory histories for visual inspection",
      "Transition network generation for rate decomposition"
    ],
    supportedSystems: ["Linux", "macOS"],
    language: "Python / Bash",
    dependencies: ["numpy", "h5py", "networkx"],
    installCommand: "pip install git+https://github.com/dmighty007/we-trajectory-lineage.git",
    minimalUsage: `we-trace-lineage --west-h5 west.h5 --target-state 3 --output-path trajectory_lineages.json

import json
from wetools import LineageForest

forest = LineageForest.from_json("trajectory_lineages.json")
transition_network = forest.to_transition_network()
print(f"Transition network nodes: {transition_network.number_of_nodes()}")`,
    testStatus: "Open-source research repository",
    verificationStatus: "Repository verified",
    license: "BSD 3-Clause",
    repository: "https://github.com/dmighty007/we-trajectory-lineage"
  }
];
