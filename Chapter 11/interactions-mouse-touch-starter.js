import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
// import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls.js';


let scene, camera, cube;
let raycaster, mouse, renderer; 
let controls, startAnimation, x, delta, mod;
mod = false;
const props = {
    width: 800, 
    height: 600
};

function init() {
    // Init Scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, props.width / props.height);
    camera.position.z = 3;
    camera.position.y = 3;
    camera.position.z = 3;
    camera.lookAt( 0, 0, 0 );
    scene.add(camera);

    // This helper will create the grid on scene
    // We will need it to see how elements are located in scene
    const gridHelper = new THREE.GridHelper( props.width, props.width );
    scene.add( gridHelper );

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.5, transparent: true });
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(1,1,1);
    scene.add(cube);

    cube.userData.onClick = function (object) {
        // Your click event logic here
        object.material.color.set(getRandomColor());
        console.log('Box clicked!');
    };

    // Raycaster to handle mouse events
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Setup the renderer
    const canvas = document.querySelector('#container');
    
    renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(props.width, props.height);

    // controls = new PointerLockControls( camera, renderer.domElement );
    controls = new DeviceOrientationControls( camera);
    
    // controls.movementSpeed = 0.02;
    // controls.rollSpeed = 0.002;
    
    // Add click event listener to the document
    document.addEventListener('click', onMouseClick, false);
    document.addEventListener('pointerdown', onTouch, false);
    // document.addEventListener('touchmove', onMouserMove, false);
    document.addEventListener('pointermove', onMouserMove, false);
    document.addEventListener('deviceorientation', (event) => {
        controls.handleDeviceOrientation(event); // Pass device orientation events to the controls
    });
}

function onTouch(event) {
    event.preventDefault();
    scene.updateMatrixWorld();

    mouse.set( 
        ( event.clientX / props.width) * 2 - 1, 
        - ( event.clientY / props.height) * 2 + 1 );
    const intersects = raycaster.intersectObjects([cube], false);
    if (intersects.length > 0) {
        console.log(intersects);
        const consoleJS = document.querySelector('#mobile-console');
        consoleJS.innerHTML = x+ ' --- '+ JSON.stringify(intersects)+ '<br>';
        x++;    
    }
    
}

// Handle mouse click
function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.set( 
        ( event.clientX / props.width) * 2 - 1, 
        - ( event.clientY / props.height) * 2 + 1 );

    // Check for intersections
    // const intersects = raycaster.intersectObjects([cube], false);
    // if (intersects.length > 0) {
    //     mod = !mod;
    //     delta = 0.01 * (mod? 1: -1);
    //     startAnimation = true;
    // }
    // controls.lock();
}

function onMouserMove( event ) {
	mouse.set( 
        ( event.clientX / props.width ) * 2 - 1, 
        - ( event.clientY / props.height ) * 2 + 1 );
    raycaster.setFromCamera( mouse, camera );
}

// This function will create the random color.
// We will use it to show the interactions
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function render() {
    renderer.render( scene, camera );
}

function resetAnimation() {
    x = 0;
    startAnimation = false;
}


init();
resetAnimation();
// render();
x = 0;
function animate() {

	requestAnimationFrame( animate );
	render();

}
animate();