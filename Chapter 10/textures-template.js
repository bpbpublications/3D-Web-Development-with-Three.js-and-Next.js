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