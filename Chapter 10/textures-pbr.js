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
const lightParams = {
    color: 0xffffff,
    intensity: 500,
    distance: 70
};
const integratableParams = {
    position: {
        x: 0,
        y: 25,
        z: 11
    }
};
const light = new THREE.PointLight(...Object.values(lightParams));
light.position.set(...Object.values(integratableParams.position));
scene.add(light);

{
    const lightParams = {
        color: 0xffffff,
        intensity: 6,
        width: 70,
        height: 70
    };
    const integratableParams = {
        rotation: {
            x: THREE.MathUtils.degToRad(-25),
            y: THREE.MathUtils.degToRad(0),
            z: THREE.MathUtils.degToRad(0)
        },
        position: {
            x: 0,
            y: 50,
            z: 11
        }
    };
    const light = new THREE.RectAreaLight(...Object.values(lightParams));
    light.position.set(...Object.values(integratableParams.position));
    scene.add(light);

}


const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load('assets/Glass_Window_003_basecolor.jpg');
colorTexture.colorSpace = THREE.SRGBColorSpace;
const alphaTexture = textureLoader.load('assets/Glass_Window_003_opacity.jpg');
const heightTexture = textureLoader.load('assets/Glass_Window_003_height.png');
const normalTexture = textureLoader.load('assets/Glass_Window_003_normal.jpg');
const ambientOcclusionTexture = textureLoader.load('assets/Glass_Window_003_ambientOcclusion.jpg');
const metalnessTexture = textureLoader.load('assets/Glass_Window_003_metallic.jpg');
const roughnessTexture = textureLoader.load('assets/Glass_Window_003_roughness.jpg');

const geometry = new THREE.SphereGeometry();
const material = new THREE.MeshStandardMaterial( { 
    map: colorTexture,
    metalnessMap: metalnessTexture,
    roughnessMap: roughnessTexture,
    normalMap: normalTexture,
    aoMap: ambientOcclusionTexture,
    alphaMap: alphaTexture,
    heightTexture
} );

const mesh = new THREE.Mesh( geometry, material );
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