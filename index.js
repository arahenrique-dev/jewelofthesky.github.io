import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import {gsap} from 'https://cdn.skypack.dev/gsap';

let w = window.innerWidth;
let h = window.innerHeight;

// Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 13;

// Renderer
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(500,500,500);
scene.add(dirLight);

let mixer;

// Load GLB model
const loader = new GLTFLoader();
let bird;
loader.load(
  'beijaflor.glb',   // path to your GLB file
  (gltf) => {
    bird = gltf.scene;
    bird.scale.set(0.04, 0.04, 0.04);
    bird.rotation.y = Math.PI/360 * 360;
    
    bird.position.set(5, -1.5, 1);
    scene.add(bird);

    mixer = new THREE.AnimationMixer(bird);
    mixer.clipAction(gltf.animations[0]).play();
    
  },
  (xhr) => {
    console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`);
  },
  (error) => {
    console.error('Error loading model:', error);
  }
);

// Render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (mixer) mixer.update(0.02)
}
animate();

let arrPositionModel = [
    {
        id: 'hero',
        position: {x: 0, y: -0, z: 0},
        rotation: { x: 0, y: Math.PI/360 * -180, z: 0 },
    },
    {
        id: 'flight',
        position: {x: 8, y: -0, z: 0},
        rotation: { x: 0, y: Math.PI/360 * -300, z: 0 },
    },
    {
        id: 'metabolism',
        position: {x: -4, y: -0.5, z: 5},
        rotation: { x: 0, y: Math.PI/360 * 0, z: 0 },
    },
    {
        id: 'pollinization',
        position: {x: 4, y: -0.5, z: 6},
        rotation: { x: 0, y: Math.PI/360 * -320, z: 0 },
    },
    {
        id: 'migration',
        position: {x: -4, y: -0.5, z: 6},
        rotation: { x: 0, y: Math.PI/360 * 0, z: Math.PI/360 * 0},
    },
    {
        id: 'resiliance',
        position: {x: 5, y: -1.5, z: 1},
        rotation: { x: 0, y: Math.PI/360 * 360, z: 0 },
    },

]

const modelMove = () => {
    const sections = document.querySelectorAll('.section');
    let currentSection;
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) {
            currentSection = section.id;
        }
    });
    console.log('All good');
    let position_active = arrPositionModel.findIndex(
        (val) => val.id  == currentSection
    );
    if (position_active >= 0) {
        let new_coordinates = arrPositionModel[position_active];
        gsap.to(bird.position, {
            duration: 1,
            x: new_coordinates.position.x,
            y: new_coordinates.position.y,
            z: new_coordinates.position.z,
            ease: 'power1.Out',
        });
        gsap.to(bird.rotation, {
            duration: 1,
            x: new_coordinates.rotation.x,
            y: new_coordinates.rotation.y,
            z: new_coordinates.rotation.z,
            ease: 'power1.Out',
        });
    }
}

window.addEventListener('scroll', () => {
    if (bird) {
        modelMove();
    }
});

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});