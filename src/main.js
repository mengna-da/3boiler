import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMeshes, addStandardMesh, addTextureMesh, addMetalMesh } from './addDefaultMeshes'
import {addLight} from './addDefaultLight'
import Model from './Model'

const renderer = new THREE.WebGLRenderer({antialias: true})

const clock = new THREE.Clock()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)

const meshes = {}

const lights = {}

const mixers = [] //animation storage

const scene = new THREE.Scene()

init()
function init(){
  // set up our renderer default settings, aka where we render our scene to on our website
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  //add meshes to our meshes object
  meshes.default = addBoilerPlateMeshes() 
  meshes.standard = addStandardMesh()
  meshes.physical = addTextureMesh()
  meshes.metal = addMetalMesh()

  //add lights to our lights object
  lights.default = addLight()

  //add meshes to our scene
  // scene.add(meshes.default) 
  // scene.add(meshes.standard) 
  scene.add(lights.default)
  // scene.add(meshes.physical)
  // scene.add(meshes.metal)

  camera.position.set(0, 0, 5)
  instances()
  resize()
  animate()
}

function instances(){
  const flower = new Model ({
    name: 'flower',
    scene: scene,
    meshes: meshes,
    url: 'flowers.glb',
    scale: new THREE.Vector3(2, 2, 2),
    position: new THREE.Vector3(0, -1, 3),
    replace: true, //automatically refer to 'mat.png'
    animationState: true,
    mixers: mixers,
  })
  flower.init()
}

function resize(){
  window.addEventListener('resize', ()=>{
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  })
}

function animate(){
  // const tick = clock.getElapsedTime()
  const delta = clock.getDelta() //time between each frame

  requestAnimationFrame(animate)

  //play animation mixer
  for(const mixer of mixers) {
    mixer.update(delta)
  }
  if (meshes.flower){ //make rotation happen only after the model is loaded
  meshes.flower.rotation.y += 0.01 //meshes.flower follows the name section within 'const flower = new Model'
  }

  meshes.physical.rotation.y += 0.01
  // meshes.physical.material.displacementScale = Math.sin(tick)

  meshes.metal.rotation.x -= 0.02
  // meshes.metal.material.displacementScale = Math.cos(tick)

  meshes.default.rotation.x += 0.01
  meshes.default.rotation.y += 0.01
  meshes.default.rotation.z += 0.01

  meshes.standard.rotation.x -= 0.01
  meshes.standard.rotation.y -= 0.01
  meshes.standard.rotation.z -= 0.01

  renderer.render(scene, camera)
}