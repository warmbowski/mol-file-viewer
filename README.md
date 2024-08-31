# Interactive 3d molecule viewer in React

Inspired by [LiamOsler/Three-Molecules](https://github.com/LiamOsler/Three-Molecules) but coded declaritively using `@react-three/fiber` and Typescript in a Vite meta-framework.

Demo: https://mol-file-viewer.netlify.app

## Other inspired technologies and studys

### Signed Distance Field (SDF) Raymarching representation of Van der Waals cloud.

- based on https://github.com/MelonCode/r3f-raymarching/tree/main
- less cpu intenseive but requires immense recalculation when orbiting model

### Constructive Solid Geometry (CSG) representation of Van der Waals cloud.

- based on https://github.com/gkjohnson/three-bvh-csg/blob/main/examples/multimaterial.js
- cpu intensive calculation, but offloaded to webworker
- geometry serialized and cached once calulated

# Getting started

- clone repo and cd into directory
- run `npm install`
- run `npm run dev` for running local development server
- run `npm run build` for production build
- run `npm run preview` for running produciton build server locally
