import * as THREE from 'three';
import GUI from 'lil-gui'; 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Init Debug UI
const gui = new GUI();

// Init Scene
const props = {
  width: 800, 
  height: 600,
  color: 0xff0000
};
const scene = new THREE.Scene();

// Setup the renderer
const canvas = document.querySelector('#container');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});

// Create some object to play around with cameras. We will hardcode it here to not focus 
// on code at this point
const geometry = new THREE.SphereGeometry( 10, 32, 16 ); 
const material = new THREE.MeshStandardMaterial( { color: 0xffff00 } ); 
const sphere = new THREE.Mesh( geometry, material );
sphere.position.set(...[10, 10, 0]); 
scene.add( sphere );

// We make a ground object to see full scene
const loader = new THREE.TextureLoader();
loader.load( 'https://threejs.org/manual/examples/resources/images/checker.png', (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    const planeSize = 80;
    const repeats = planeSize / 2;
    texture.repeat.set( repeats, repeats );

    // This is an important part of the code. We will change the material of the plane
    // to see how it reacts on light changes
    const planeMaterial = new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide  });
    const planeGeometry = new THREE.PlaneGeometry( planeSize, planeSize );
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.position.set(0, -5, 0);
    planeMesh.rotation.set(Math.PI / -2, 0, 0);

    scene.add(planeMesh);
});


const lightParams = {
    skyColor: 0x404040,
    groundColor: 0xB1E1FF,
    intensivity: 10
};
const light = new THREE.HemisphereLight(...Object.values(lightParams));
scene.add(light);

// Put the camera related code here
// This is a default camera parameters
const camera = new THREE.PerspectiveCamera( 60, props.width / props.height, 1, 1000 );
camera.position.z = 75;

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256 );
cubeRenderTarget.texture.type = THREE.HalfFloatType;
const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
// Position the CubeCamera in the scene
cubeCamera.position.set(0, 5, 0);
scene.add(cubeCamera);

const second_geometry = new THREE.SphereGeometry( 10, 52, 26 ); 

// Create a reflective material using the cube map
const reflectiveMaterial = new THREE.MeshStandardMaterial({
    envMap: cubeCamera.renderTarget.texture,
    roughness: 0.05,
    metalness: 1
});

const second_sphere = new THREE.Mesh( second_geometry, reflectiveMaterial );
second_sphere.position.set(...[20, 20, 20]); 
scene.add( second_sphere );



renderer.setSize(props.width, props.height);

// Render the scene using scene and camera objects
// remove renderer below and add the function to animate 
// the scene
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();
function animate() {
    const time =  performance.now() / 1000;

	requestAnimationFrame( animate );
    sphere.position.x = Math.cos( time + 10 ) * 30;
    sphere.position.y = Math.sin( time + 10 ) * 30;
    sphere.position.z = Math.sin( time + 10 ) * 30;

    cubeCamera.update(renderer, scene);
	renderer.render( scene, camera );

}
animate();