import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Init Scene
const props = {
    width: 800, 
    height: 600
  };
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, props.width / props.height);
camera.position.z = 5;
scene.add(camera);

// Put your code here

// Create a geometry and assign UV coordinates
const geometry = new THREE.SphereGeometry(1, 32, 32);

const eyeTexture = new THREE.TextureLoader().load('assets/eye.jpg');
eyeTexture.colorSpace = THREE.SRGBColorSpace;
const uniforms = {
  "tex": { value: eyeTexture }   
};

const vertex_shader = `
varying vec3 vNormal;
void main() {
  vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const fragment_shader = `
uniform sampler2D tex;
varying vec3 vNormal;
void main() {
  vec2 uv = normalize( vNormal ).xy * 0.5 + 0.5;
  vec3 color = texture2D( tex, uv ).rgb;
  if ( vNormal.z < - 0.85 ) color = vec3( 0.777, 0.74, 0.74 );
  gl_FragColor = vec4( color, 1.0 );
}
`;

const material = new THREE.ShaderMaterial({ 
  uniforms        : uniforms,
  vertexShader    : vertex_shader,
  fragmentShader  : fragment_shader
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Setup the renderer
const canvas = document.querySelector('#container');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });

renderer.setSize(props.width, props.height);

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();
function animate() {

	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );

}
animate();