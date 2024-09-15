import { GetCompundOptions, GetConformerOptions } from "./types";

/**
 * PubChem API documentation
 * https://pubchem.ncbi.nlm.nih.gov/docs/programmatic-access
 */
export const pubchemBaseUrl = "https://pubchem.ncbi.nlm.nih.gov/rest";

export const compoundAutocompleteUrl = (search: string) =>
  `${pubchemBaseUrl}/autocomplete/compound/${search}/json`;

const defalutGetCompoundOptions: GetCompundOptions = {
  text: "",
  by: "cid",
  output: "json",
};

export const compoundByNameOrIdUrl = (options: GetCompundOptions) => {
  const { text, by, output, operation } = {
    ...defalutGetCompoundOptions,
    ...options,
  };
  return `${pubchemBaseUrl}/pug/compound/${by}/${text}/${
    operation || ""
  }/${output}`.replace("//", "/");
};

const defalutGetConformerOptions: GetConformerOptions = {
  conformerId: "",
  output: "json",
};
export const conformerUrl = (options: GetConformerOptions) => {
  const { conformerId, output } = {
    ...defalutGetConformerOptions,
    ...options,
  };
  return `${pubchemBaseUrl}/pug/conformers/${conformerId}/${output}`;
};
