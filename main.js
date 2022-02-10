import './style.css'

import * as THREE from 'three';

import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';


const scene = new THREE.Scene();
//scene.background = new THREE.Color(0x0B7BE6);

scene.background = new THREE.Color(0x081053);

const ambientLight = new THREE.AmbientLight();
//scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xF7D607);
//const pointLight1 = new THREE.PointLight(0xF5F4E0);
//const pointLight1 = new THREE.PointLight(0xB6C1F2);
pointLight1.position.set(2,-30,2);

const pointLight2 = new THREE.PointLight(0xF5F4E0);
//const pointLight2 = new THREE.PointLight(0xB6C1F2);
//const pointLight2 = new THREE.PointLight(0xF7D607);
pointLight2.position.set(5,5,5);

scene.add(pointLight1,pointLight2);

const camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.5,1000);
camera.position.setZ(20);
//camera.position.set(2.72,1.65,11.86);
//camera.rotation.set(-0.41,0.47,-2.48);

const renderer  = new THREE.WebGLRenderer({
  canvas: document.querySelector('#main-content')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);


const crystalGeometry = new THREE.OctahedronGeometry(1.5,0,3);
const whiteMaterial = new THREE.MeshStandardMaterial( { 
  color: 0xFFFFFF,
  metalness: 0.1,
  roughness:0.2,
  opacity: 0.1,
  shadowSide: true
} );
const crystal = new THREE.Mesh( crystalGeometry , whiteMaterial );
const crystal2 = crystal.clone();


crystal.position.set(7,5,3);
crystal2.position.set( -7,-4, 5);
scene.add( crystal,crystal2);

const geometry = new THREE.SphereGeometry( 2,34,50,3.14,6.30,0,6.82);
const material = new THREE.MeshBasicMaterial( { color: 0xB6C1F2} );
const sphere = new THREE.Mesh( geometry, whiteMaterial);
scene.add( sphere );

document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;

renderer.setAnimationLoop( function () {

	renderer.render( scene, camera );

} );
//renderer.render( scene, camera);

const animatedMeshes = [crystal, crystal2, sphere];

function animate() {
	requestAnimationFrame( animate );
  // Insert animation step transformations here
  // Such as:
  //   cube.rotation.x += 0.01;
  //   cube.rotation.y += 0.01;
  animatedMeshes.map(mesh => mesh.rotation.y += 0.005)
	renderer.render( scene, camera );
}
animate();

const moveCamera = () => {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * 0.008 + 20;
  camera.position.y = t * 0.008;
  camera.rotation.x = t * 0.00095;
}

document.body.onscroll = moveCamera;

