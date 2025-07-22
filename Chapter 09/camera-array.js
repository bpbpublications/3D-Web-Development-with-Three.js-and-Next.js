import * as THREE from 'three';
import GUI from 'lil-gui'; 

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
sphere.castShadow = true;
sphere.receiveShadow = true;
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
    intensivity: 2
};
const light = new THREE.HemisphereLight(...Object.values(lightParams));
scene.add(light);

// Put the camera related code here
// This is a default camera parameters
const AMOUNT = 4;
const ASPECT_RATIO = window.innerWidth / window.innerHeight;
const WIDTH = ( window.innerWidth / AMOUNT ) * window.devicePixelRatio;
const HEIGHT = ( window.innerHeight / AMOUNT ) * window.devicePixelRatio;

const cameras = [];
for ( let y = 0; y < AMOUNT; y ++ ) {
    for ( let x = 0; x < AMOUNT; x ++ ) {
        const subcamera = new THREE.PerspectiveCamera( 120, ASPECT_RATIO, 1, 1000 );
        subcamera.viewport = new THREE.Vector4( 
                Math.floor( x * WIDTH ), 
                Math.floor( y * HEIGHT ), 
                Math.ceil( WIDTH ), 
                Math.ceil( HEIGHT ) 
        );
        subcamera.lookAt( sphere.position );
        subcamera.position.set(0,0,0);
        subcamera.updateMatrixWorld();
        cameras.push( subcamera );
    }
}

// Create an ArrayCamera using the array of cameras
const arrayCamera = new THREE.ArrayCamera(cameras);
arrayCamera.position.z = 3;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;

// Render the scene using scene and camera objects
// remove renderer below and add the function to animate 
// the scene
function animate() {
	
	renderer.render( scene, arrayCamera );
    requestAnimationFrame( animate );

}
animate();