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
// Setup the renderer

// Put your code here
// const texture = new THREE.TextureLoader().load('assets/uv_mapping.jpg');
// texture.magFilter = THREE.NearestFilter;
// texture.minFilter = THREE.NearestFilter;
// texture.magFilter = THREE.LinearFilter;
// texture.minFilter = THREE.LinearFilter;
// texture.magFilter = THREE.LinearFilter;
// texture.minFilter = THREE.LinearMipMapLinearFilter;
// texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;
// const timesToRepeatHorizontally = 4;
// const timesToRepeatVertically = 2;
// texture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically);

const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
const texture =  new THREE.TextureLoader().load('assets/uv_mapping.jpg');
const uniforms = {
  "tex": { value: texture }   
};
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const customFilterShader = `
varying vec2 vUv;
uniform sampler2D tex;

void main()
{
    vec4 color = texture2D(tex, vUv);
    gl_FragColor = color;
}
`;

const material = new THREE.ShaderMaterial({
  uniforms,
  fragmentShader: customFilterShader,
  vertexShader: vertexShader
});

const cube = new THREE.Mesh( geometry, material ); 
scene.add( cube );

const textureNonFiltered = new THREE.TextureLoader().load('assets/uv_mapping.jpg');
const nonFilteredGeometry = new THREE.BoxGeometry(1, 1, 1);
const materialNonFiltered = new THREE.MeshStandardMaterial( { map: textureNonFiltered } ); 
const cubeNoneFiltered = new THREE.Mesh( nonFilteredGeometry, materialNonFiltered ); 
cubeNoneFiltered.position.set(...[2, 0, 0]); 

scene.add( cubeNoneFiltered );


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