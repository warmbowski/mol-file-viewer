import { compoundAutocompleteUrl } from "../pubchemUrls";
import { AutoCompleteResponse } from "../types";

export async function searchCompounds(search: string) {
  const resp = await fetch(compoundAutocompleteUrl(search));
  return (await resp.json()) as AutoCompleteResponse;
}
