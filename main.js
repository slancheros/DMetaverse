import './style.css'
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import gsap from 'gsap'

const textureLoader = new THREE.TextureLoader();

const igeometry =  new THREE.PlaneBufferGeometry(1,1.3);

const scene = new THREE.Scene();


scene.background = new THREE.Color(0x081053);

const ambientLight = new THREE.AmbientLight();


const pointLight1 = new THREE.PointLight(0xF7D607);

pointLight1.position.set(2,-30,2);

const pointLight2 = new THREE.PointLight(0xF5F4E0);

pointLight2.position.set(5,5,5);

scene.add(pointLight1,pointLight2);

const camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.5,1000);
camera.position.setZ(20);


for(let i=0; i<5; i++){
  const imaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load(`static/img/${i}.jpg`)
  })

  const img =new THREE.Mesh(igeometry,imaterial);
  img.position.set(1,i*-1,i*3);
  scene.add(img);
}

const renderer  = new THREE.WebGLRenderer({
  canvas: document.querySelector('#main-content'),
  antialias : true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const photoGeomertry = new THREE.PlaneBufferGeometry( 1, 1.3,30,30);


const video = document.getElementById('myVideo');


 video.onscroll= function() { // the function will trigger after data loads
  video.play()
  video.muted = false;
  };

const videoImage = document.createElement('canvas');
videoImage.width = 500;
videoImage.height = 500;
 
const videoImageContext = videoImage.getContext('2d');
videoImageContext.crossOrigin = "anonymous"
videoImageContext.fillStyle = '#000000';
videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);



const videoTexture = new THREE.VideoTexture(video);

videoTexture.on

videoTexture.needsUpdate = true;



const photoMaterial = new THREE.MeshBasicMaterial({
  map: videoTexture,
  side: THREE.FrontSide, 
  toneMapped: false
} );
photoMaterial.needsUpdate = true;
const imag = new THREE.Mesh(photoGeomertry,photoMaterial);
imag.position.set(5,3,1);
scene.add(imag);



const crystalGeometry = new THREE.OctahedronGeometry(1.5,0,3);
const whiteMaterial = new THREE.MeshStandardMaterial( { 
  color: 0xFFFFFF,
  metalness: 0.1,
  roughness:0.2,
  opacity: 0.1,
  shadowSide: true,
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
  videoTexture.update(0.08, 0.008 + 20)

	renderer.render( scene, camera );

} );
//renderer.render( scene, camera);


const animatedMeshes = [crystal, crystal2, sphere];

function animate() {
	requestAnimationFrame( animate );
  
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

function resize (){
   camera.aspect = window.innerWidth/window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize(window.innerWidth,window.innerHeight );

}
document.body.onscroll = moveCamera;



addEventListener("wheel",onMouseWheel);

let y=0;
let position =0

function onMouseWheel(event){
  y= event.deltaY*0.0007

}

const raycaster = new THREE.Raycaster()



const mouse = new THREE.Vector3()

addEventListener('mousemove',(event)=> {
 // mouse.x = (event.clientX / window.innerWidth) * 2 -1
 // mouse.y = (event.clientY / window.innerHeight) * 2 +1
 mouse.x = event.clientX
 mouse.y = event.clientY
})

let objs = [];
scene.traverse((object)=>{
    if (object.isMesh){
      objs.push(object)
    }
  }
)

const clock = new THREE.Clock();
const tick=()=>
{
  const elapsedTime = clock.getElapsedTime()
  
   position += y
   y*= 0.9

   raycaster.setFromCamera(mouse,camera)
   const intersects = raycaster.intersectObjects(objs);

   for( const intersect of intersects){
      gsap.to(intersect.object.scale,{x:1.7,y:1.7})
     
      //gsap.to(intersect.object.rotation,{y:-5})
   }

   for (const obj of objs){
     if(!intersects.find(intersect => intersect.object === obj)){
       gsap.to(obj.scale,{x:1,y:1})
       //gsap.to(obj.rotation,{y:5})
      }
     }
          
   
  //Update objects
  camera.position.y = position;

  renderer.render(scene,camera);
  window.requestAnimationFrame(tick)
}
tick()