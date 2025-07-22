import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const props = {
    width: 800, 
    height: 600
};

const scene = new THREE.Scene();
scene.background = new THREE.Color('#ffffff');
const camera = new THREE.PerspectiveCamera(75, props.width / props.height);
camera.position.z = 50;
camera.position.y = 10;
camera.position.x = -30;
scene.add(camera);

// This code is from previous example to create plane with texture
const loader = new THREE.TextureLoader();
loader.load( 'https://threejs.org/manual/examples/resources/images/checker.png', (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    const planeSize = 80;
    const repeats = planeSize / 2;
    texture.repeat.set( repeats, repeats );

    const planeMaterial = new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide  });
    const planeGeometry = new THREE.PlaneGeometry( planeSize, planeSize );
    planeMaterial.color.setRGB(1.5, 1.5, 1.5);
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.rotation.x = Math.PI * -.5;
    planeMesh.receiveShadow = true;
    scene.add(planeMesh);
});

// We can encapsulate blocks to unnamed closures to not have
// naming intersections
{
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 2;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
}

{
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 5);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);
}

const canvas = document.querySelector('#container');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
renderer.setSize(props.width, props.height);

// Objects creation
const shadowTexture = loader.load('https://threejs.org/manual/examples/resources/images/roundshadow.png');
const sphereShadowBases = [];
const sphereParams = {
    radius: 1,
    widthDivisions: 32,
    heightDivisions: 16
};
const sphereGeomerty = new THREE.SphereGeometry(...Object.values(sphereParams));
const planeSize = 1;
const shadowGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
for (let i = 0; i < 15; ++i) {
    const base = new THREE.Object3D();
    scene.add(base);

    const shadowMaterial = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false
    });

    const shadowMesh = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadowMesh.position.y = 0.001;
    shadowMesh.rotation.x = Math.PI * -.5;
    
    const shadowSize = sphereParams.radius * 4;
    shadowMesh.scale.set(shadowSize, shadowSize, shadowSize);
    base.add(shadowMesh);
    
    const sphereMaterial = new THREE.MeshPhongMaterial({color: '#7DAA92'});
    const sphereMesh = new THREE.Mesh(sphereGeomerty, sphereMaterial);
    sphereMesh.position.set(0, sphereParams.radius + 2, 0);
    base.add(sphereMesh);
    
    sphereShadowBases.push({base, sphereMesh, shadowMesh, y: sphereMesh.position.y});
}

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

function animate() {
	requestAnimationFrame( animate );
	controls.update();
    sphereShadowBases.forEach((sphereShadowBase, index) => {
        const { base, sphereMesh, shadowMesh, y } = sphereShadowBase;
     
        const shadowIntensity = index / sphereShadowBases.length;
     
        const distance = 0.2;
        const angle = distance + shadowIntensity * Math.PI * 2 * (index % 1 ? 1 : -1);
        const radius = Math.sin(distance - index) * 10;
        base.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
     
        const yOff = Math.abs(Math.sin(5 + index));
        sphereMesh.position.y = y + THREE.MathUtils.lerp(-2, 2, yOff);
        shadowMesh.material.opacity = THREE.MathUtils.lerp(1, .25, yOff);
      });
	renderer.render( scene, camera );
}
animate();