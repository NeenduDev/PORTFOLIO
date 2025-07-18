import * as THREE from "three";
import images from "./images";
import vertex from "../shaders/vertex.glsl";
import fragment from "../shaders/fragment.glsl";
const loader = new THREE.TextureLoader();

const texture1 = loader.load(images.ruwanwalisaya);
const texture2 = loader.load(images.buddha);
const texture3 = loader.load(images.jethawanaya);
const texture4 = loader.load(images.sigiriya);

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

class Shaded {
  constructor() {
    this.container = document.querySelector(".landing");
    this.inner = document.querySelector(".intro");
    this.links = [...document.querySelectorAll("#shadedimg")];
    this.targetX = 0;
    this.targetY = 0;
    this.scene = new THREE.Scene();
    this.perspective = 1000;
    this.sizes = new THREE.Vector2(0, 0);
    this.offset = new THREE.Vector2(0, 0);
    this.uniforms = {
      uTexture: { value: texture1 },
      uAlpha: { value: 0.0 },
      uOffset: { value: new THREE.Vector2(0.0, 0.0) },
      transparent: true,
    };

    this.links.map((link, i) => {
      link.addEventListener("mouseenter", () => {
        switch (i) {
          case 0:
            this.uniforms.uTexture.value = texture1;
            break;
          case 1:
            this.uniforms.uTexture.value = texture2;
            break;
          case 2:
            this.uniforms.uTexture.value = texture3;
            break;
          case 3:
            this.uniforms.uTexture.value = texture4;
            break;
        }
      });
      link.addEventListener("mouseleave", () => {
        this.uniforms.uAlpha.value = lerp(this.uniforms.uAlpha.value, 0.0, 0.1);
      });
    });
    this.checkHovered();
    this.setupCamera();
    this.setupRenderer();
    window.addEventListener("resize", this.onResize.bind(this));
    this.followMouseMove();
    this.createMesh();
    this.render();
  }

  get viewport() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let aspectRatio = width / height;
    let pixelRatio = window.devicePixelRatio;
    return {
      width,
      height,
      aspectRatio,
      pixelRatio,
    };
  }
  checkHovered() {
    this.inner.addEventListener("mouseenter", () => {
      this.hovered = true;
    });
    this.inner.addEventListener("mouseleave", () => {
      this.hovered = false;
      this.uniforms.uTexture = { value: texture1 };
    });
  }
  setupCamera() {
    let fov =
      (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) /
      Math.PI;
    this.camera = new THREE.PerspectiveCamera(
      fov,
      this.viewport.aspectRatio,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, this.perspective);
  }
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderer.setPixelRatio(this.viewport.pixelRatio);
    this.container.appendChild(this.renderer.domElement);
  }
  createMesh() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 20, 20);
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.sizes.set(370, 470, 1);
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
    this.mesh.position.set(this.offset.x, this.offset.y, 0);
    this.scene.add(this.mesh);
  }
  followMouseMove() {
    window.addEventListener("mousemove", (e) => {
      this.targetX = e.clientX;
      this.targetY = e.clientY;
    });
  }
  onResize() {
    this.camera.aspect = this.viewport.aspectRatio;
    this.camera.fov =
      (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) /
      Math.PI;
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.camera.updateProjectionMatrix();
  }
  render() {
    this.offset.x = lerp(this.offset.x, this.targetX, 0.1);
    this.offset.y = lerp(this.offset.y, this.targetY, 0.1);
    this.uniforms.uOffset.value.set(
      (this.targetX - this.offset.x) * 0.0006,
      -(this.targetY - this.offset.y) * 0.0006
    );
    this.mesh.position.set(
      this.offset.x - window.innerWidth / 2,
      -this.offset.y + window.innerHeight / 2
    );
    this.hovered
      ? (this.uniforms.uAlpha.value = lerp(
          this.uniforms.uAlpha.value,
          1.0,
          0.1
        ))
      : (this.uniforms.uAlpha.value = lerp(
          this.uniforms.uAlpha.value,
          0.0,
          0.1
        ));
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}
new Shaded();
