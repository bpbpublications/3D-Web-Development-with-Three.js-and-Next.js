import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);
camera.position.z = 5;
// your code goes here

const keyframes = [
    { pos: new THREE.Vector3(0, 0, 0), time: 0 },
    { pos: new THREE.Vector3(0, 2, 0), time: 2 },
    { pos: new THREE.Vector3(0, 0, 0), time: 4 },
];

const positionTrack = new THREE.VectorKeyframeTrack(
    '.position', 
     keyframes.map(kf => kf.time), 
     keyframes.flatMap(kf => kf.pos.toArray()));

const clip = new THREE.AnimationClip('cubeAnimation', -1, [positionTrack]);

const mixer = new THREE.AnimationMixer(cube);
const action = mixer.clipAction(clip);
action.play();

function animate() {
    requestAnimationFrame(animate);
    mixer.update(0.01); // Update the animation mixer
    renderer.render(scene, camera);
}

animate();
