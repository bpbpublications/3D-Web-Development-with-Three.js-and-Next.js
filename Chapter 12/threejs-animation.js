import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const props = { width: 800, height: 600 };
const canvas = document.querySelector('#container');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, props.width / props.height);
camera.position.z = 6;
scene.add(camera);   

const planeMaterial = new THREE.MeshBasicMaterial({ color: '#ebebeb', side: THREE.DoubleSide });
const planeGeometry = new THREE.PlaneGeometry(props.width, props.width);
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.position.set(0, -5, 0);
planeMesh.rotation.set(Math.PI / -2, 0, 0);
scene.add(planeMesh);

const geometry = new THREE.SphereGeometry(10, 32, 16); 
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 }); 
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(...[10, 10, 0]); 
scene.add(sphere);

renderer.setSize(props.width, props.height);
const controls = new OrbitControls(camera, renderer.domElement);

// your code goes here
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let tween;

function onDoubleClick(event) {
    console.log('click');
    mouse.set(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        - (event.clientY / renderer.domElement.clientHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, false);

    if (intersects.length > 0) {
        const point = intersects[0].point;
        tween = new TWEEN.Tween(sphere.position)
            .to({ x: point.x, z: point.z }, 500).start()
    }
}

renderer.domElement.addEventListener('dblclick', onDoubleClick, false);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    tween?.update();
    renderer.render(scene, camera);
}

animate();
