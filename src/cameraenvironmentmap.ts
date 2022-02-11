import { THREE } from "./three";
import { Camera } from "./camera";

export class CameraEnvironmentMap extends THREE.Texture {
  private cubeMapScene = new THREE.Scene();

  private renderTarget = new THREE.WebGLCubeRenderTarget(256, {
    format: THREE.RGBAFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
  });

  private cubeCamera = new THREE.CubeCamera(0.1, 1000, this.renderTarget);

  private sphereMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });

  private sphereGroup = new THREE.Group();

  /**
   * The resulting map texture. Set this as your `scene.environment` or as a material's `envMap`.
   */
  public environmentMap = this;

  /**
   * Constructs a new Camera Environment Map.
   */
  public constructor() {
    super();
    Object.assign(this, this.renderTarget.texture);
    // TODO: Once we drop support for <r126, use the new API instead:
    // this.renderTarget.SetTexture(this);
    this.renderTarget.texture = this as any;
    this.cubeMapScene.add(this.cubeCamera);

    const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(10, 16, 12), this.sphereMaterial);

    sphere.rotation.set(0, -0.5 * Math.PI, 0);
    this.sphereGroup.add(sphere);
    this.cubeMapScene.add(this.sphereGroup);
  }

  /**
   * Destroy the resources held by this object.
   */
  public dispose() {
    this.renderTarget.dispose();
    this.sphereMaterial.dispose();
    super.dispose();
  }

  /**
   * Update the contents of the environment map with the latest texture from the camera.
   *
   * Call this each frame after you call `update` on your Zappar camera, but before you render the scene.
   * @param renderer - Your renderer object
   * @param zapparCamera - The Zappar camera you're using to render your scene
   */
  public update(renderer: THREE.WebGLRenderer, zapparCamera: Camera) {
    this.sphereMaterial.map = zapparCamera.backgroundTexture;
    this.sphereGroup.quaternion.copy(zapparCamera.quaternion);
    this.cubeCamera.update(renderer, this.cubeMapScene);
  }
}
