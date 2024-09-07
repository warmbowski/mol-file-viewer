export interface AutoCompleteResponse {
  status: {
    code: number;
  };
  total: number;
  dictionary_terms: {
    compound: string[];
    // not used
    // assay: string[];
    // gene: string[];
    // taxonomy: string[];
  };
}
