export function simpleShallowEqual(newObj: unknown, prevObj: unknown) {
  if (JSON.stringify(newObj) === JSON.stringify(prevObj)) {
    return true;
  }
  return false;
}
