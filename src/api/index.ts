/**
 * PubChem API documentation
 * https://pubchem.ncbi.nlm.nih.gov/docs/programmatic-access
 */
export const pubchemBaseUrl = "https://pubchem.ncbi.nlm.nih.gov/rest";

export const compoundAutocompleteUrl = (search: string) =>
  `${pubchemBaseUrl}/autocomplete/compound/${search}/json`;

export const compoundByNameOrIdUrl = (
  search: string,
  by: "name" | "cid" = "name",
  output: "json" | "sdf" | "png" = "json"
) => `${pubchemBaseUrl}/rest/pug/compound/${by}/${search}/${output}`;
