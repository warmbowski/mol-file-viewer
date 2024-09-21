import { useState } from "react";
import {
  ActionIcon,
  Box,
  CloseIcon,
  Combobox,
  Loader,
  TextInput,
  useCombobox,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useSearchCompounds } from "@api";
import { useDebouncedState } from "@mantine/hooks";
import { useAtom } from "jotai";
import { selectedMoleculeAtom, selectedHistoryAtom } from "@state";

export function SeachPubChem() {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [, setSelectedMolecule] = useAtom(selectedMoleculeAtom);
  const [history, updateHistory] = useAtom(selectedHistoryAtom);

  const [value, setValue] = useState("");
  const [search, setSearch] = useDebouncedState(value, 500);

  const { data, isFetching } = useSearchCompounds(search);

  const handleClearClick = () => {
    setValue("");
  };

  // console.log(history);

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        setValue(optionValue);
        setSelectedMolecule({ text: optionValue, by: "name" });
        updateHistory({ text: optionValue, by: "name" });
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
            combobox.openDropdown();
          }}
          onBlur={() => combobox.closeDropdown()}
          leftSection={<IconSearch />}
          rightSection={
            isFetching ? (
              <Loader size={18} />
            ) : value ? (
              <ActionIcon onClick={handleClearClick} size="18">
                <CloseIcon />
              </ActionIcon>
            ) : (
              <Box size={18} />
            )
          }
        />
      </Combobox.Target>

      <Combobox.Dropdown hidden={value.length > 0 && data === undefined}>
        <Combobox.Options>
          {value ? (
            <Combobox.Group label="Search Results">
              {(data?.dictionary_terms.compound || []).map((item) => (
                <Combobox.Option value={item} key={item}>
                  {item}
                </Combobox.Option>
              ))}
            </Combobox.Group>
          ) : (
            <Combobox.Group label="History">
              {history.map((item) => (
                <Combobox.Option value={item.text} key={item.text}>
                  {item.text}
                </Combobox.Option>
              ))}
            </Combobox.Group>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
