/**
 * template literal tag for glsl to help with inline syntax
 * highlighting. Needs extension `glsl-literal` to work.
 */
export const glsl = <
  Elem extends string,
  Template extends ReadonlyArray<Elem>,
  Arg extends string,
  Args extends Arg[]
>(
  template: Template,
  ...args: [...Args]
) => {
  return template
    .map((str, i) => {
      return str + (args[i] ?? "");
    })
    .join("");
};
