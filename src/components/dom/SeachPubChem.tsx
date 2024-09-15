import { useState } from "react";
import { Box, Combobox, Loader, TextInput, useCombobox } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useSearchCompounds } from "@api";
import { useDebouncedState } from "@mantine/hooks";
import { useAtom } from "jotai";
import { pubChemMoleculeAtom } from "@state";

export function SeachPubChem() {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [, setMoleculeName] = useAtom(pubChemMoleculeAtom);

  const [value, setValue] = useState("");
  const [search, setSearch] = useDebouncedState(value, 500);

  const { data, isFetching } = useSearchCompounds(search);

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        setValue(optionValue);
        setMoleculeName(optionValue);
        combobox.closeDropdown();
      }}
      withinPortal={false}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          placeholder="Search PubChem"
          value={value}
          onChange={(event) => {
            const { value } = event.currentTarget;
            setValue(value);

            if (value.length > 3) {
              setSearch(value);
              combobox.resetSelectedOption();
              combobox.openDropdown();
            } else {
              combobox.closeDropdown();
            }
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => {
            if (data !== undefined) {
              combobox.openDropdown();
            }
          }}
          onBlur={() => combobox.closeDropdown()}
          rightSection={isFetching ? <Loader size={18} /> : <Box w={18} />}
          leftSection={<IconSearch />}
        />
      </Combobox.Target>

      <Combobox.Dropdown hidden={data === undefined}>
        <Combobox.Options>
          {(data?.dictionary_terms.compound || []).map((item) => (
            <Combobox.Option value={item} key={item}>
              {item}
            </Combobox.Option>
          ))}
          {!data && <Combobox.Empty>No results found</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
