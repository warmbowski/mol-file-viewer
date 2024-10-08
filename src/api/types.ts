export interface AutoCompleteResponse {
  status: {
    code: number;
  };
  total: number;
  dictionary_terms: {
    compound: string[];
    // // ***** not used *****
    // assay: string[];
    // gene: string[];
    // taxonomy: string[];
  };
}

export interface ConformerList {
  InformationList: {
    Information: [
      {
        CID: number;
        ConformerID: string[];
      }
    ];
  };
}

export interface PUGRESTError {
  Fault: {
    Code: string; // ex: "PUGREST.NotFound";
    Message: string; // ex: "No conformers found for the given CID(s)";
  };
}

export interface GetCompundOptions {
  text: string;
  by: "name" | "cid";
  output?: "json" | "sdf" | "png";
  operation?: "conformers";
}

export interface GetConformerOptions {
  conformerId: string;
  output?: "json" | "sdf" | "png";
}
