import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'; 

// Init Debug UI
const gui = new GUI();

// Object with default parameters
const obj = { 
    radius : 7, 
    widthSegments : 20, 
    heightSegments : 20
};
const materialProps = {
    color: '#ebebeb',
    shininess: 20,
    flatShading: false,
    roughness: 1,
    metalness: 1,
    clearcoat: 0,
    clearCoatRoughness: 0,
    wireframe: false
};
const materialTypeProps = {
    type: 'MeshBasicMaterial'
};
const currentGeometry = 'SphereGeometry';

// Init Scene
const props = {
  width: 800, 
  height: 600,
  color: 0xff0000
};
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, props.width / props.height);
scene.add(camera);

// Object creation with special Geometry type
const initGeometry = () => {
  return new THREE[currentGeometry](...Object.values(obj));
}

const regenerateGeometry = (mesh) => {
  const newGeometry = initGeometry();
  mesh.material = new THREE[materialTypeProps.type](materialProps);
  mesh.geometry = newGeometry;
  
}
const geometry = initGeometry();
// As Circle is 2D object to color it from both sides we need to add 
// parameter `side` to have color for each side

const material = new THREE[materialTypeProps.type](materialProps);
const mesh = new THREE.Mesh(geometry, material);


// GUI elements to update parameters
const materialPropsArray = Object.keys(materialProps);
materialPropsArray.forEach(key => {
    key !== 'color' && gui.add( materialProps, key, 0, 10)
        .onChange(() => regenerateGeometry(mesh));
    key === 'color' && gui.addColor( materialProps, 'color')
        .onChange(() => regenerateGeometry(mesh));
});
        
gui.add( materialTypeProps, 'type', [ 
                'MeshBasicMaterial', 
                'MeshStandardMaterial', 
                'MeshPhysicalMaterial',
                'MeshDepthMaterial',
                'MeshNormalMaterial',
                'ShaderMaterial',
                'MeshLambertMaterial', 
                'MeshPhongMaterial', 
                'MeshToonMaterial' ] )
    .onChange(() => regenerateGeometry(mesh));

scene.add(mesh);
camera.position.z = 20;

// Simple light creation for the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const color = 0xFFFFFF;
const intensity = 30;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(5, 5, 5);
scene.add(light);

// Setup the renderer
const canvas = document.querySelector('#container');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});

renderer.setSize(props.width, props.height);

// Render the scene using scene and camera objects
// remove renderer below and add the function to animate 
// the scene
// renderer.render(scene, camera);
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();
function animate() {

	requestAnimationFrame( animate );
  // required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render( scene, camera );

}
animate();