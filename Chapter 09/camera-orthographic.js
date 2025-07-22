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
const cameraParams = {
    delta: 20
};

const cameraPosition = {
    x: 8,
    y: 20,
    z: 40
};

const cameraRotation = {
    x: 0,
    y: 0,
    z: 0
};
const camera = new THREE.OrthographicCamera( 
    props.width / - cameraParams.delta, 
    props.width / cameraParams.delta, 
    props.height / cameraParams.delta, 
    props.height / - cameraParams.delta, 1, 1000 );
camera.position.set(...Object.values(cameraPosition));
camera.lookAt( sphere.position );

// GUI debugger for the position and angle of the camera
const deltaFolder = gui.addFolder( 'Delta' );
const deltaKeysAsArray = Object.keys(cameraParams);
deltaKeysAsArray.forEach(delta => {
    deltaFolder.add( cameraParams, delta, 0, 100, 1)
        .onChange((value) => {
            camera.left = props.width / - value;
            camera.right = props.width / value;
            camera.top = props.height / value;
            camera.bottom = props.height / - value;

            camera.lookAt( sphere.position );
            camera.updateProjectionMatrix();
        });
});
const positionFolder = gui.addFolder( 'Position' );
const positionKeysAsArray = Object.keys(cameraPosition);
positionKeysAsArray.forEach(position => {
    positionFolder.add( cameraPosition, position, 0, 100)
        .onChange((value) => {
            camera.position[position] = value;
            camera.lookAt( sphere.position );
            camera.updateMatrix();
        });
});
const rotationFolder = gui.addFolder( 'Rotation' );
const rotationKeysAsArray = Object.keys(cameraRotation);
rotationKeysAsArray.forEach(position => {
    rotationFolder.add( cameraRotation, position, -100, 100)
        .onChange((value) => {
            camera.rotation[position] = THREE.MathUtils.degToRad(value);
            camera.updateMatrix();
        });
});


renderer.setSize(props.width, props.height);

function animate() {

	requestAnimationFrame( animate );
    
	renderer.render( scene, camera );
    

}
animate();