import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
 const props = {
    width: 800, 
    height: 600
};
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, props.width / props.height);
camera.position.z = 1; camera.position.y = 1; camera.position.x = 1;
const canvas = document.querySelector('#container');
const renderer = new THREE.WebGLRenderer({canvas: canvas });
renderer.setSize( props.width,  props.height);
document.body.appendChild(renderer.domElement);

//Your code goes here
// const particlesGeometry = new THREE.BoxGeometry(1, 1, 1, 7, 7, 7);

// Block with custom geometry
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.computeBoundingSphere();
const count = 1500;
const positions = new Float32Array(count);
for(let i = 0; i < count; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 2));

const particlesMaterial = new THREE.PointsMaterial();
particlesMaterial.size = 0.02;
particlesMaterial.sizeAttenuation = true;

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

const controls = new OrbitControls( camera, renderer.domElement );

// Basic animation function
// function animate() {
// 	requestAnimationFrame( animate );
// 	controls.update();
// 	renderer.render( scene, camera );
// }

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    particles.rotation.x += 0.005;
    particles.rotation.y += 0.005;
    renderer.render( scene, camera );
}
 

animate();