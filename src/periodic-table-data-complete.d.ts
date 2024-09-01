declare module "periodic-table-data-complete" {
  export const pTable: string;
  export const pTableUnits: string;
  export const pTableProperties: string;

  export type PTableParsed = Array<PTableElementData>;
  export type PTableUnitsParsed = Record<ElementProperty, string>;
  export type PTablePropertiesParsed = Record<ElementProperty, string>;

  // prettier-ignore
  export type PTableSymbol = 
  | "H" | "He" | "Li" | "Be" | "B" | "C" | "N" | "O" | "F" | "Ne"
  | "Na" | "Mg" | "Al" | "Si" | "P" | "S" | "Cl" | "Ar" | "K" | "Ca"
  | "Sc" | "Ti" | "V" | "Cr" | "Mn" | "Fe" | "Co" | "Ni" | "Cu" | "Zn"
  | "Ga" | "Ge" | "As" | "Se" | "Br" | "Kr" | "Rb" | "Sr" | "Y" | "Zr"
  | "Nb" | "Mo" | "Tc" | "Ru" | "Rh" | "Pd" | "Ag" | "Cd" | "In" | "Sn"
  | "Sb" | "Te" | "I" | "Xe" | "Cs" | "Ba" | "La" | "Ce" | "Pr" | "Nd"
  | "Pm" | "Sm" | "Eu" | "Gd" | "Tb" | "Dy" | "Ho" | "Er" | "Tm" | "Yb"
  | "Lu" | "Hf" | "Ta" | "W" | "Re" | "Os" | "Ir" | "Pt" | "Au" | "Hg"
  | "Tl" | "Pb" | "Bi" | "Po" | "At" | "Rn" | "Fr" | "Ra" | "Ac" | "Th"
  | "Pa" | "U" | "Np" | "Pu" | "Am" | "Cm" | "Bk" | "Cf" | "Es" | "Fm"
  | "Md" | "No" | "Lr" | "Rf" | "Db" | "Sg" | "Bh" | "Hs" | "Mt" | "Ds"
  | "Rg" | "Cn" | "Nh" | "Fl" | "Mc" | "Lv" | "Ts" | "Og" | "Uue";

  export interface PTableElementData {
    name: string;
    symbol: PTableSymbol;
    abundance: {
      universe: number;
      solar: number;
      meteor: number;
      crust: number;
      ocean: number;
      human: number;
    };
    adiabatic_index: string;
    allotropes: string;
    appearance: string;
    atomic_mass: number;
    atomic_number: number;
    block: "s-block" | "p-block" | "d-block" | "f-block";
    boiling_point: number;
    classification: {
      cas_number: string;
      cid_number: string;
      rtect_number: string;
      dot_number: number;
      dot_hazard_class: number;
    };
    conductivity: Record<string, number>;
    cpk_hex: string;
    critical_pressure: number;
    critical_temperature: number;
    crystal_structure: string;
    density: {
      stp: number;
    };
    discovered: {
      year: number;
      by: string;
      location: string;
    };
    electron_affinity: number;
    electron_configuration: string;
    electron_configuration_semantic: string;
    electronegativity_pauling: number;
    eletrions_per_shell: number[];
    energy_levels: string;
    gas_phase: string;
    group: number;
    half_life: string;
    heat: {
      specific: number;
      vaporization: number;
      fusion: number;
      molar: number;
    };
    ionization_energies: number[];
    isotopes_known: string;
    isotopes_stable: string;
    isotopic_abundances: string;
    lattice_angles: string;
    lattice_constants: string;
    lifetime: string;
    magnetic_susceptibility: {
      mass: number;
      molar: number;
      volume: number;
    };
    magnetic_type: string;
    melting_point: number;
    molor_volume: number;
    neutron_cross_section: number;
    neutron_mass_absorption: number;
    oxidation_states: string;
    period: number;
    phase: string;
    quantum_numbers: string;
    radius?: {
      calculated?: number;
      empirical?: number;
      covalent?: number;
      vanderwaals?: number;
    };
    refractive_index: number;
    series: string;
    source: string;
    space_group_name: string;
    space_group_number: string;
    speed_of_sound: number;
    summary: string;
    valence_electrons: number;
  }

  export type ElementProperty = keyof ElementData;

  export interface ElementUnits {
    abundance: {
      universe: "%";
      solar: "%";
      meteor: "%";
      crust: "%";
      human: "%";
    };
    atomic_mass: "amu";
    boiling_point: {
      celsius: "°";
      fahrenheit: "°";
      kelvin: "K";
    };
    conductivity: {
      thermal: "W/mK";
      electric: "MS/m";
    };
    curie_point: "K";
    density: {
      shear: "GPa";
      young: "GPa";
      stp: "kg/m³";
      liquid: "kg/m³";
    };
    discovered: "year";
    electron_affinity: "kJ/mol";
    electronegativity_pauling: "kJ/mol";
    energy_levels: "e⁻️";
    half_life: "year";
    hardness: {
      radius: "pm";
      vickers: "MPa";
      brinell: "MPa";
      mohs: "MPa";
    };
    heat: {
      specific: "J/(kg K)";
      fusion: "kJ/mol";
      vaporization: "kJ/mol";
      molar: "J/K.mol";
    };
    ionization_energies: "kJ/mol";
    lattice_constants: "pm";
    lifetime: "year";
    magnetic_susceptibility: {
      mass: "m³/Kg";
      molar: "m³/mol";
    };
    melting_point: {
      celsius: "°";
      fahrenheit: "°";
      kelvin: "K";
    };
    modulus: {
      bulk: "GPa";
    };
    neel_point: "K";
    radius: {
      calculated: "pm";
      empirical: "pm";
      covalent: "pm";
      vanderwaals: "pm";
    };
    resistivity: "m Ω";
    speed_of_sound: "m/s";
    superconducting_point: "K";
    thermal_expansion: "K⁻¹";
  }
}
