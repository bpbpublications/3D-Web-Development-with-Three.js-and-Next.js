// Importing the Three.js module into the application
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'; 

const gui = new GUI();

// Object with default parameters
const obj = { number1: 1, number2: 50 };

// Creating the slider with range from 0 to 1, 
// that takes obj.number1 value as default 
gui.add( obj, 'number1', 0, 1 ); // min, max

// // Creating the slider with range from 0 to 100, 
// that takes obj.number2 value as default and 
// each slider change will have step that equals 10
gui.add( obj, 'number2', 0, 100, 10 ); // min, max, step

// Object with actions inside
const buttons = { triggerOnClick: () => console.log('click') };

// Assign function to the GUI to create the button
gui.add( buttons, 'triggerOnClick' );

// Object with list data and default values
// For the better readability we recomend use flat object 
// to store configurations
const lists = { 
  numberList: [ 0, 1, 2 ],
  labeledObject: { Label1: 0, Label2: 1, Label3: 2 },
  numbers: 1,
  labels: 1
};

// Adding numbers dorpdown that represents data array as is
gui.add( lists, 'numbers', lists.numberList );

// Adding objects doropdown that will show keys in list
gui.add( lists, 'labels', lists.labeledObject );

// Object with colors configuration for the objects
const colors = {
  // The format of the color can be one of this:
  // '#ffffff'
  // 0xffffff
  // { r: 1, g: 1, b: 1 }
  // [ 1, 1, 1 ]
	meshColor: '#ffffff',
};
gui.addColor( colors, 'meshColor' );

// const myObject = {
// 	myBoolean: true,
// 	myFunction: () => console.log('click'),
// 	myString: 'lil-gui',
// 	myNumber: 1
// };

// gui.add( myObject, 'myBoolean' );  // Checkbox
// gui.add( myObject, 'myFunction' ); // Button
// gui.add( myObject, 'myString' );   // Text Field
// gui.add( myObject, 'myNumber' );   // Number Field

// gui.add( myObject, 'myNumber', [ 0, 1, 2 ] );
// gui.add( myObject, 'myNumber', { Label1: 0, Label2: 1, Label3: 2 } );


// // Chainable methods
// gui.add( myObject, 'myString' )
// 	.name( 'Custom string field' )
// 	.onChange( value => {
// 		console.log( value );
// 	} );

// // Create color pickers for multiple color formats
// const colorFormats = {
// 	color: '#ffffff',
// 	int: 0xffffff,
// 	object: { r: 1, g: 1, b: 1 },
// 	array: [ 1, 1, 1 ]
// };

// gui.addColor( colorFormats, 'color' );

// const folder = gui.addFolder( 'Position' );
// folder.add( obj, 'number1' , 0, 1);
// folder.add( obj, 'number2', 0, 100, 10 );

// Getting the Three.js object into the console of the browser
console.log(THREE);

const props = {
  width: 800,
  height: 600,
  color: 0xff0000
}; 

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, props.width / props.height);
scene.add(camera);

// Create the connection with the Canvas object in the HTML file
const canvas = document.querySelector('#container');
// Create the renderer. There is different types of them but its the part of ther chapter
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
// gui.add(mesh.position, 'y', - 3, 3, 0.01);
// gui.add(material, 'wireframe');
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: props.color });
const mesh = new THREE.Mesh(geometry, material);

gui
    .addColor(props, 'color')
    .onChange(() =>
    {
        material.color.set(props.color)
    });


scene.add(mesh);

camera.position.z = 5;


// Setup the renderer
renderer.setSize(props.width, props.height);

// Render the scene using scene and camera objects
// remove renderer below and add the function to animate 
// the scene
// renderer.render(scene, camera);
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();
function animate() {

	requestAnimationFrame( animate );
  // required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render( scene, camera );

}
animate();