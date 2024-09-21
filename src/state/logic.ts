import { atom } from "jotai";
import { SelectedMolecule, selectedMoleculeSchema } from "./validations";

export const getMoleculeFromUrlSearchParams = (
  fallback?: SelectedMolecule
): SelectedMolecule | undefined => {
  try {
    return (
      selectedMoleculeSchema.parse(
        Object.fromEntries(new URLSearchParams(window.location.search))
      ) || fallback
    );
  } catch {
    return fallback;
  }
};

export const atomWithLocalStorage = <T, V = void>(
  key: string,
  fallbackValue: T,
  initialValue?: T,
  validationSchema?: V,
  doNotPersistFunction?: (nextValue: T) => boolean
) => {
  const getInitialValue = () => {
    if (initialValue) {
      return initialValue;
    }

    const item = localStorage.getItem(key);
    if (item !== null) {
      if (validationSchema) {
        const parsed = JSON.parse(item);
        try {
          // validate local storage value
          return selectedMoleculeSchema.parse(parsed) as T;
        } catch {
          // if local storage value is corrupted, remove it
          localStorage.removeItem(key);
          return fallbackValue;
        }
      } else {
        return JSON.parse(item) as T;
      }
    }
    return fallbackValue;
  };
  const baseAtom = atom(getInitialValue());
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === "function" ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      if (doNotPersistFunction) {
        if (doNotPersistFunction(nextValue)) {
          return;
        }
      }
      localStorage.setItem(key, JSON.stringify(nextValue));
    }
  );
  return derivedAtom;
};

// export function atomWithHistory<T>(
//   targetAtom: Atom<T>,
//   limit: number,
//   initialHistory: T[]
// ) {
//   const getInitialValue = () => initialHistory || ([] as T[]);
//   const historyAtom = atom(
//     () => getInitialValue(),
//     (get) => () => void (get(historyAtom).length = 0)
//   );
//   historyAtom.onMount = (mount) => mount();
//   historyAtom.debugPrivate = true;
//   return atom((get) => {
//     const ref = get(historyAtom);
//     const filteredRef = ref.filter(
//       (item) => !simpleShallowEqual(item, get(targetAtom))
//     );
//     return [get(targetAtom), ...filteredRef].slice(0, limit);
//   });
// }
