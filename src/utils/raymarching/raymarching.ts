import {
  BoxGeometry,
  Camera,
  CapsuleGeometry,
  Color,
  CubeTexture,
  CylinderGeometry,
  DepthTexture,
  Frustum,
  GLSL3,
  Group,
  IcosahedronGeometry,
  Intersection,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Quaternion,
  RawShaderMaterial,
  Scene,
  Sphere,
  SphereGeometry,
  Texture,
  UnsignedShortType,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderTarget,
  WebGLRenderer,
} from "three";
import lighting from "./shaders/lighting.glsl?raw";
import raymarcherFragment from "./shaders/raymarcher.frag?raw";
import raymarcherVertex from "./shaders/raymarcher.vert?raw";
import screenFragment from "./shaders/screen.frag?raw";
import screenVertex from "./shaders/screen.vert?raw";

export interface PBRMaterial {
  color: Color;
  params: Vector4;
}

export interface Entity {
  materialIndex: number;
  operation: number;
  shape: number;
  blending: number;
  position: Vector3;
  rotation: Quaternion;
  scale: Vector3;
}

export type Layer = Array<Entity>;

export class SDFLayer extends Group {
  constructor() {
    super();
  }
}

export interface SortedLayer {
  bounds: Sphere;
  distance: number;
  entities: Set<SDFPrimitive>;
}

// TODO: Temporary type until raycasting detection is refactored
export interface SDFIntersection extends Intersection {
  entity: Entity;
  entityId: number;
  layer: Layer;
  layerId: number;
}

export type EnvMap = Texture | CubeTexture | null;

const _bounds: Array<Sphere> = [];
const _frustum = new Frustum();
const _position = new Vector3();
const _projection = new Matrix4();
const _size = new Vector2();
const _sphere = new Sphere();

type PrimitiveShapes =
  | BoxGeometry
  | CapsuleGeometry
  | SphereGeometry
  | CylinderGeometry
  | IcosahedronGeometry
  | PlaneGeometry;

abstract class SDFPrimitive extends Mesh<PrimitiveShapes> {
  materialIndex: number = 0;
  operation: Operation = Operation.UNION;
  shape: Shape = Shape.SPHERE;
  blending = 0;
  override material: MeshBasicMaterial;

  constructor(shape: number, geometry: PrimitiveShapes) {
    super(geometry);
    this.frustumCulled = false;
    this.shape = shape;
    this.material = new MeshBasicMaterial({
      wireframe: false,
      color: new Color(0xffffff),
      transparent: true,
      opacity: 0.5,
      depthWrite: true,
    });
  }
}

export class SDFBox extends SDFPrimitive {
  constructor() {
    super(Shape.BOX, new BoxGeometry(1, 1, 1));
  }
}

export class SDFCapsule extends SDFPrimitive {
  constructor() {
    super(Shape.CAPSULE, new CapsuleGeometry(0.5, 0, 16, 16));
  }
}

export class SDFSphere extends SDFPrimitive {
  constructor() {
    super(Shape.SPHERE, new SphereGeometry(0.5, 10, 10));
  }
}

export enum Shape {
  BOX,
  CAPSULE,
  SPHERE,
}

export enum Operation {
  UNION,
  SUBSTRACTION,
}

class Raymarcher extends Mesh<PlaneGeometry, RawShaderMaterial> {
  resolution: number;
  declare material: RawShaderMaterial;
  raymarcher: Mesh<PlaneGeometry, RawShaderMaterial>;
  target: WebGLRenderTarget;
  materials: Array<PBRMaterial> = [];

  private get uniforms() {
    return this.raymarcher.material.uniforms;
  }
  private get defines() {
    return this.raymarcher.material.defines;
  }

  get conetracing() {
    return this.defines.CONETRACING;
  }
  set conetracing(value) {
    if (this.defines.CONETRACING !== !!value) {
      this.defines.CONETRACING = !!value;
      this.raymarcher.material.transparent = this.material.transparent =
        !!value;
      this.raymarcher.material.needsUpdate = true;
    }
  }
  get envMap() {
    return this.uniforms.envMap.value;
  }
  set envMap(value) {
    this.uniforms.envMap.value = value;
    if (this.defines.ENVMAP_TYPE_CUBE_UV !== !!value) {
      this.defines.ENVMAP_TYPE_CUBE_UV = !!value;
      this.material.needsUpdate = true;
    }
    if (value) {
      const maxMip = Math.log2(value.image.height) - 2;
      const texelWidth = 1.0 / (3 * Math.max(Math.pow(2, maxMip), 7 * 16));
      const texelHeight = 1.0 / value.image.height;
      if (this.defines.CUBEUV_MAX_MIP !== `${maxMip}.0`) {
        this.defines.CUBEUV_MAX_MIP = `${maxMip}.0`;
        this.material.needsUpdate = true;
      }
      if (this.defines.CUBEUV_TEXEL_WIDTH !== texelWidth) {
        this.defines.CUBEUV_TEXEL_WIDTH = texelWidth;
        this.material.needsUpdate = true;
      }
      if (this.defines.CUBEUV_TEXEL_HEIGHT !== texelHeight) {
        this.defines.CUBEUV_TEXEL_HEIGHT = texelHeight;
        this.material.needsUpdate = true;
      }
    }
  }
  get envMapIntensity() {
    return this.uniforms.envMapIntensity.value;
  }
  set envMapIntensity(value) {
    this.uniforms.envMapIntensity.value = value;
  }

  constructor({
    envMap = null,
    conetracing = true,
    envMapIntensity = 1,
    resolution = 1,
  } = {}) {
    const plane = new PlaneGeometry(2, 2, 1, 1);
    plane.deleteAttribute("normal");
    plane.deleteAttribute("uv");
    const target = new WebGLRenderTarget(1, 1, {
      depthTexture: new DepthTexture(1, 1, UnsignedShortType),
    });

    const screenMaterial = new RawShaderMaterial({
      glslVersion: GLSL3,
      transparent: !!conetracing,
      vertexShader: screenVertex,
      fragmentShader: screenFragment,
      uniforms: {
        colorTexture: { value: target.texture },
        depthTexture: { value: target.depthTexture },
      },
    });

    super(plane, screenMaterial);

    this.target = target;

    const material = new RawShaderMaterial({
      glslVersion: GLSL3,
      transparent: !!conetracing,
      vertexShader: raymarcherVertex,
      fragmentShader: raymarcherFragment.replace(
        "#include <lighting>",
        lighting
      ),
      defines: {
        CONETRACING: !!conetracing,
        MAX_ENTITIES: 0,
        MAX_MATERIALS: 0,
        MAX_DISTANCE: "1000.0",
        MAX_ITERATIONS: 500,
        MIN_COVERAGE: "0.02",
        MIN_DISTANCE: "0.001",
      },
      uniforms: {
        bounds: { value: { center: new Vector3(), radius: 0 } },
        cameraDirection: { value: new Vector3() },
        cameraFar: { value: 0 },
        cameraFov: { value: 0 },
        cameraNear: { value: 0 },
        envMap: { value: null },
        envMapIntensity: { value: envMapIntensity },
        resolution: { value: new Vector2() },
        numEntities: { value: 0 },
        materials: {
          value: [
            {
              color: new Color(0xffd700),
              params: new Vector4(0.5, 0.5, 0.5, 0.5),
            },
          ],
        },
        entities: {
          value: [
            {
              materialIndex: 0,
              operation: Operation.UNION,
              position: new Vector3(),
              rotation: new Quaternion(1, 0, 0, 0),
              scale: new Vector3(1, 1, 1),
              shape: Shape.BOX,
            },
          ],
        },
      },
    });

    this.resolution = resolution;
    this.raymarcher = new Mesh(plane, material);
    this.matrixAutoUpdate = this.raymarcher.matrixAutoUpdate = false;
    this.frustumCulled = this.raymarcher.frustumCulled = false;
    if (envMap) {
      this.envMap = envMap;
    }
  }

  private findSdfLayers(object: Object3D): Set<SDFLayer> {
    const sdfLayerSet: Set<SDFLayer> = new Set();
    let queue: Object3D[] = [object];
    while (queue.length > 0) {
      const current = queue.shift();
      if (current instanceof SDFLayer) {
        sdfLayerSet.add(current);
        continue;
      }
      if (current && current.children) {
        queue = queue.concat(current.children);
      }
    }
    return sdfLayerSet;
  }

  private findSdfPrimitives(layer: SDFLayer): Set<SDFPrimitive> {
    const sdfPrimitiveSet: Set<SDFPrimitive> = new Set();
    let queue: Object3D[] = [layer];
    while (queue.length > 0) {
      const current = queue.shift();
      if (current instanceof SDFPrimitive) {
        sdfPrimitiveSet.add(current);
      }
      if (current && current.children) {
        queue = queue.concat(current.children);
      }
    }
    return sdfPrimitiveSet;
  }

  dispose() {
    const { material, geometry } = this;
    material.dispose();
    geometry.dispose();
    this.raymarcher.material.dispose();
    this.target.dispose();
    this.target.depthTexture?.dispose();
    this.target.texture.dispose();
  }

  onBeforeRender = (renderer: WebGLRenderer, _scene: Scene, camera: Camera) => {
    const sdfLayerSet: Set<SDFLayer> = this.findSdfLayers(this);

    const layers: Set<SDFPrimitive>[] = [];
    for (const sdfLayer of sdfLayerSet) {
      layers.push(this.findSdfPrimitives(sdfLayer));
    }

    // TODO Can we get rid of this?
    if (!(camera instanceof PerspectiveCamera)) {
      throw new Error("Camera must be a PerspectiveCamera");
    }

    const { resolution, raymarcher, target } = this;
    const {
      material: { defines, uniforms },
    } = raymarcher;

    camera.getWorldDirection(uniforms.cameraDirection.value);
    uniforms.cameraFar.value = camera.far;
    uniforms.cameraFov.value = MathUtils.degToRad(camera.fov);
    uniforms.cameraNear.value = camera.near;

    _frustum.setFromProjectionMatrix(
      _projection.multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
      )
    );
    camera.getWorldPosition(_position);

    // Update materials
    if (this.materials.length !== defines.MAX_MATERIALS) {
      defines.MAX_MATERIALS = this.materials.length;
      uniforms.materials.value = this.materials;
    }
    this.materials.forEach((material, index) => {
      const uniform = uniforms.materials.value[index];
      uniform.color.copy(material.color);
      uniform.params.copy(material.params);
    });

    // TODO Can we only sort layers when they change?
    const sortedLayers: Array<SortedLayer> = layers
      .reduce((layers, entities, layer) => {
        if (defines.MAX_ENTITIES !== entities.size) {
          defines.MAX_ENTITIES = entities.size;
          const value: Array<Entity> = [];
          for (const entity of entities) {
            value.push({
              shape: entity.shape,
              materialIndex: entity.materialIndex,
              operation: entity.operation,
              blending: entity.blending,
              position: entity.getWorldPosition(new Vector3()),
              rotation: entity.getWorldQuaternion(new Quaternion()),
              scale: entity.getWorldScale(new Vector3()),
            });
          }
          uniforms.entities.value = value;
          raymarcher.material.needsUpdate = true;
        }
        const bounds = Raymarcher.getLayerBounds(layer);
        entities.forEach((entity) => {
          const material = uniforms.materials.value[entity.materialIndex];
          entity.material.color = new Color(material.color);
          entity.geometry.computeBoundingSphere();

          const {
            geometry: { boundingSphere },
            matrixWorld,
          } = entity;

          _sphere.copy(boundingSphere!).applyMatrix4(matrixWorld);

          if (bounds.isEmpty()) {
            bounds.copy(_sphere);
          } else {
            bounds.union(_sphere);
          }
        });

        if (_frustum.intersectsSphere(bounds)) {
          layers.push({
            bounds,
            entities,
            distance: bounds.center.distanceTo(_position),
          });
        }
        return layers;
      }, [] as Array<SortedLayer>)
      .sort(({ distance: a }, { distance: b }) =>
        defines.CONETRACING ? b - a : a - b
      );

    renderer.getDrawingBufferSize(_size).multiplyScalar(resolution).floor();
    if (target.width !== _size.x || target.height !== _size.y) {
      target.setSize(_size.x, _size.y);
      uniforms.resolution.value.copy(_size);
    }

    const currentAutoClear = renderer.autoClear;
    const currentClearAlpha = renderer.getClearAlpha();
    const currentRenderTarget = renderer.getRenderTarget();
    const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;
    const currentXrEnabled = renderer.xr.enabled;
    renderer.autoClear = false;
    renderer.shadowMap.autoUpdate = false;
    renderer.xr.enabled = false;
    renderer.setClearAlpha(0);
    renderer.setRenderTarget(target);
    renderer.state.buffers.depth.setMask(true);

    renderer.clear();
    sortedLayers.forEach(({ bounds, entities }) => {
      uniforms.bounds.value.center.copy(bounds.center);
      uniforms.bounds.value.radius = bounds.radius;
      uniforms.numEntities.value = entities.size;
      let i = 0;
      entities.forEach((entity) => {
        const uniform = uniforms.entities.value[i++];
        uniform.materialIndex = entity.materialIndex;
        uniform.operation = entity.operation;
        uniform.blending = entity.blending;
        uniform.shape = entity.shape;
        entity.getWorldPosition(uniform.position);
        entity.getWorldQuaternion(uniform.rotation);
        entity.getWorldScale(uniform.scale);
      });
      renderer.render(raymarcher, camera);
    });
    renderer.autoClear = currentAutoClear;
    renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;
    renderer.xr.enabled = currentXrEnabled;
    renderer.setClearAlpha(currentClearAlpha);
    renderer.setRenderTarget(currentRenderTarget);

    // What is this for?
    // if (camera.viewport) renderer.state.viewport(camera.viewport)
  };

  static getLayerBounds(layer: number): Sphere {
    if (!_bounds[layer]) {
      _bounds[layer] = new Sphere();
    }
    return _bounds[layer].makeEmpty();
  }
}

export default Raymarcher;
