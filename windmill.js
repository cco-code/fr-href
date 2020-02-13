let container;
let camera;
let controls;
let renderer;
let scene;

const mixers = [];
const clock = new THREE.Clock();

function init() {
  //get Dom
  container = document.querySelector( '#scene-container' );
  
  //Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x4B7A8F );
  //scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
  
  createCamera();
  createControls();
  createLights();
  createModel();
  loadModels();
  createRenderer();

  renderer.setAnimationLoop( () => {
    update();
    render();
  } );
}

function createCamera() {
  //Camera
  camera = new THREE.PerspectiveCamera( 
    45, 
    container.clientWidth / container.clientHeight, 
    1, 
    1000
  );
  camera.position.set( 10, 10, 15 );
}

function createControls() {
  controls = new THREE.OrbitControls( camera, container );
}

function createLights() {
  //Light
  const ambientLight = new THREE.HemisphereLight( 0x4B7A8F, 0x4B7A8F, 1 );
  //ambientLight.color.setHSL( 0, 0, 0 );
  //ambientLight.groundColor.setHSL( 0.095, 1, 0.75 );
  //ambientLight.position.set( 0, 10, 0 );
  const mainLight = new THREE.DirectionalLight( 0xFFFAF3, 0.3 );
  //mainLight.color.setHSL( 0, 0, 0.55 );
  mainLight.position.set( 6, 6, 6 );
  mainLight.castShadow = true;
  //mainLight.position.multiplyScalar( 10 );
  const pointLight = new THREE.PointLight( 0xFFFAF3, 0.4 );
  pointLight.position.set( 6, 10, 6 );
  pointLight.castShadow = true;
  
  scene.add( ambientLight, mainLight, pointLight );
}

function createModel() {
  var geometry = new THREE.CylinderBufferGeometry( 5, 5, 1, 32 );
  var material = new THREE.MeshToonMaterial( { 
    color: 0xaad150, 
  } );
  var cube = new THREE.Mesh( geometry, material );
  cube.position.set( -0.5, 0.5, 2.5 );
  cube.receiveShadow = true;
  
  
  var geometry2 = new THREE.CylinderBufferGeometry( 1, 1, 2, 32 );
  var cube2 = new THREE.Mesh( geometry2, material );
  cube2.position.set( -3, 2, 2.5 );
  cube2.castShadow = true;
  cube2.receiveShadow = true;
  scene.add( cube, cube2 );
}

function loadModels() {
  const loader = new THREE.GLTFLoader();
  loader.load( 'windmillx.glb', function( gltf ) {
    var mesh = gltf.scene;
    var s = 1;
    mesh.scale.set( s,s,s );
    mesh.position.x = 0;
    mesh.position.y = 1;
    mesh.position.z = 2.5;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add( mesh );
    
    const mixer = new THREE.AnimationMixer( mesh );
    mixer.clipAction( gltf.animations[ 0 ] ).setDuration(1).play();
    mixers.push( mixer );
  } );
}

function createRenderer() {
  //Renderer
  renderer = new THREE.WebGLRenderer( { antialias: true } ); //抗鋸齒
  renderer.setSize( container.clientWidth, container.clientHeight );
  renderer.setPixelRatio( window.devicePixelRatio );
  
  renderer.gammaFactor = 2.2; //gamma顏色矯正
  renderer.gammaOutput = true;
  renderer.shadowMap.enabled = true;
  
  container.appendChild( renderer.domElement );
}

function update() {
  //Object animate
  const delta = clock.getDelta();
  for( const mixer of mixers ) {
    mixer.update( delta );
  }
}

function render() {
  renderer.render( scene, camera );
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( container.clientWidth, container.clientHeight );
}
window.addEventListener( 'resize', onWindowResize );

init();
