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
const geometry = new THREE.BoxGeometry(2, 2, 2);
const texture = new THREE.TextureLoader().load('assets/uv-collection.png');
texture.colorSpace = THREE.SRGBColorSpace;

const uvAttribute = geometry.getAttribute("uv");
const uvArray = uvAttribute.array;
let isLeft = true;
let cornerStep = 0;
let delta = 0;
for (let i = 0; i < uvArray.length; i += 2) {
    if (i > 0 && i % 8 === 0) {
      isLeft = !isLeft;    
    }
    if (i > 0 && i % 16 === 0) {
      delta += 1/3
    }

    if (isLeft) {
      uvArray[i + 0] = cornerStep === 1 || cornerStep === 2 ? 0.5 : 0;
    } else {
      uvArray[i + 0] = cornerStep === 1 || cornerStep === 2 ? 1 : 0.5;
    }
    uvArray[i + 1] = cornerStep === 0 || cornerStep === 1 ?  1 - delta - 1/3 : 1 - delta;

    cornerStep ++;
    if (cornerStep > 3) {
      cornerStep = 0;
    }

}

uvAttribute.needsUpdate = true;

const material = new THREE.MeshBasicMaterial({ map: texture });
const mesh = new THREE.Mesh( geometry, material );
mesh.position.set(0.0, 0.0);
scene.add( mesh );


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