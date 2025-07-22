import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import GUI from 'lil-gui'; 


// Init Debug UI
const gui = new GUI();

// Objects with default parameters
const objectsOnScene = [
    {
        name: 'SphereGeometry', // This is the name of used geometry
        params: { // this is default params that will be used to create it
            radius: 10, 
            detail: 30
        },
        position: [-20, 5, 0], // this is XYZ position fo the object
        color: '#7DAA92' // This is a color of the object
    },
    {
        name: 'TorusGeometry',
        params: {
            radius: 10, 
            tube : 3,
            radialSegments: 16,
            tubularSegments: 100
        },
        position: [10, 10, 0],
        color: '#8E4A49'
    }
];

// Init Scene
const props = {
  width: 800, 
  height: 600
};
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, props.width / props.height);
scene.add(camera);

// Object creation with special Geometry type
const initGeometry = (object) => {
  return new THREE[object.name](...Object.values(object.params));
}

// Here we use an array of objects and create them using parameters
objectsOnScene.forEach(object => {
    const geometry = initGeometry(object);
    const material = new THREE.MeshStandardMaterial({ color: object.color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...object.position);
    scene.add(mesh);
});

// We make a ground object to see shadows
const loader = new THREE.TextureLoader();
// At this chapter we will not depp dive into textures but we need this one to 
// see shadows reactions
// This code is to create flat plane that will be used as ground
// the callback for loader is required as in the other case you will not see texture 
// The texture will be loaded after the renderer because of how JS works by itself
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

camera.position.z = 50;
camera.position.y = 10;
camera.position.x = -30;


// Setup the renderer
const canvas = document.querySelector('#container');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
RectAreaLightUniformsLib.init();

// Put this code before renderer.setSize call
// Create light with a pararameters
const lightParams = {
    color: 0xffffff,
    intensity: 6,
    width: 70,
    height: 70
};
const ranges = {
    intensity: [0, 20],
    width: [0, 200],
    height: [0, 200],
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

let light, helper = null;
// Initiation of the light type. You can follow examples from other 
// chapters and optimise this code using light type as a parameter
const initLight = () => {
    light = new THREE.RectAreaLight(...Object.values(lightParams));
    light.position.set(...Object.values(integratableParams.position));
    light.rotation.set(...Object.values(integratableParams.rotation));
    scene.add(light);
    helper = new RectAreaLightHelper(light);
    scene.add(helper);
};
// Here we will destroy the current light and re implement it with new parameters
// For more optimisatoin you can directly change the parameters 
// but we will speak about it in next chapters
const regenerateLight = () => {
    scene.remove(light);
    scene.remove(helper);
    initLight();
};
initLight();


// GUI elements to update parameters
const lightKeysAsArray = Object.keys(lightParams);
const positionFolder = gui.addFolder( 'Position' );
const ositionKeysAsArray = Object.keys(integratableParams.position);
ositionKeysAsArray.forEach(position => {
    positionFolder.add( integratableParams.position, position, -50, 50)
        .onChange(() => regenerateLight());
});

const rotationFolder = gui.addFolder( 'rotation' );
const rotationKeysAsArray = Object.keys(integratableParams.rotation);
rotationKeysAsArray.forEach(rotation => {
    rotationFolder.add( light.rotation, rotation, -50, 50).name('rotation')
        .onChange((value) => {
            integratableParams.rotation[rotation] = THREE.MathUtils.degToRad(value);
            regenerateLight();
        });
});

lightKeysAsArray.forEach(key => {
    if (!key.toLowerCase().includes('color') && key !== 'angle') {
        gui.add( lightParams, key, ...ranges[key])
            .onChange(() => regenerateLight());
    }
    else {
        gui.addColor( lightParams, key)
        .onChange(() => regenerateLight());
    }
});

renderer.setSize(props.width, props.height);

// Render the scene using scene and camera objects
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();
function animate() {

	requestAnimationFrame( animate );
  // required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render( scene, camera );

}
animate();