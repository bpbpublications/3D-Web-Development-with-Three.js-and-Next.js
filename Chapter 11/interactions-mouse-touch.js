import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, cube;
let raycaster, mouse, renderer, controls;
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
    camera.position.x = 3;
    camera.lookAt( 0, 0, 0 );
    scene.add(camera);

    const gridHelper = new THREE.GridHelper( props.width, props.width );
    scene.add( gridHelper );

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, opacity: 0.5, transparent: true });
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(1,1,1);
    
    cube.userData.onClick = function (object) {
        console.log(object);
        // Your click event logic here
        object.material.color.set(getRandomColor());
        console.log('Box clicked!');
        document.querySelector('#mobile-console').innerHTML += 'Box clicked<br/>'
    };
    cube.userData.onMouserMove = function () {
        // cube.material.color.set(getRandomColor());
    }

    scene.add(cube);


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


    // Raycaster to handle mouse events
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Setup the renderer
    const canvas = document.querySelector('#container');
    
    renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(props.width, props.height);

    controls = new OrbitControls( camera, renderer.domElement );
    controls.update();
    
    // Add click event listener to the document
    document.addEventListener('click', onMouseClick, false);
    document.addEventListener('touchend', onMouseClick, false);
    document.addEventListener('touchstart', onMouseClick, false);
    document.addEventListener('pointermove', onMouserMove, false);
}

// Handle mouse click
function onMouseClick(event) {
    event.preventDefault();

    // Calculate mouse position in normalized device coordinates
    mouse.set( 
        ( event.clientX / props.width) * 2 - 1, 
        - ( event.clientY / props.height) * 2 + 1 );

    // Check for intersections
    const intersects = raycaster.intersectObjects([cube], false);
    
    if (intersects.length > 0) {
        // Trigger the click event
        intersects[0].object.userData.onClick(intersects[0].object);
        render();
    }
}

function onMouserMove( event ) {
	mouse.set( 
        ( event.clientX / props.width ) * 2 - 1, 
        - ( event.clientY / props.height ) * 2 + 1 );
    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects([cube], false);
    if ( intersects.length > 0 ) {
        cube.userData.onMouserMove();
        render();
    }
}


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



init();
// render();

function animate() {

	requestAnimationFrame( animate );
    controls.position.set()
	controls.update();
	render();

}
animate();

