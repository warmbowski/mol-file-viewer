import { AutoCompleteResponse, compoundAutocompleteUrl } from "./";

export async function searchCompounds(search: string) {
  const resp = await fetch(compoundAutocompleteUrl(search));
  return (await resp.json()) as AutoCompleteResponse;
}
