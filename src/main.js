(function () { var script = document.createElement('script'); script.onload = function () { var stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop) }); }; script.src = '//mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script); })()

import * as THREE from '../modules/three.module.js';
import { PointerLockControls } from '../modules/PointerLockControls.js';

let renderer, scene, camera, player, controls;
let keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    space: false,
    shift: false
}
let gravity = 0;
const speed = 0.3;
let jumping = false;
let jump = false;
let air = false;
let lock = false;
const direction = new THREE.Vector3();
const forwardVector = new THREE.Vector3(0, 0, (keys.backward ? 1 : 0) - (keys.forward ? 1 : 0));
const sideVector = new THREE.Vector3((keys.left ? 1 : 0) - (keys.right ? 1 : 0), 0, 0);
function init() {
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    // Camera
    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 1.0;
    const far = 1000.0;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(15, 2, 0);
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();

    let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(300, 300, 50);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    scene.add(light);
    scene.add(light.target);

    light = new THREE.AmbientLight(0XFFFFFF, 0.45);
    scene.add(light);

    // Floor
    const texture = new THREE.TextureLoader().load('./resources/textures/grass.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(50, 50);
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100, 10, 10),
        new THREE.MeshPhongMaterial({
            map: texture,
        })
    );
    plane.position.set(0, 1, 0)
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    // Player
    player = new THREE.Mesh( new THREE.BoxGeometry(2, 2, 2), new THREE.MeshLambertMaterial({ color: 0XFFFFFF }))
    player.position.set(0, 5, 0);
    scene.add(player);

    // Pointer lock controls
    controls = new PointerLockControls(camera, document.body);
    document.body.addEventListener('click', () => {
        controls.lock();
    })
    controls.addEventListener('lock', () => {
        document.querySelector('#text-container').style.display = "none";
        lock = true;
    })
    controls.addEventListener('unlock', () => {
        document.querySelector('#text-container').style.display = "";
        lock = false;
    })

    animate();
}

function OnWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    window.addEventListener('resize', () => {
        OnWindowResize();
    }, false);

    renderer.render(scene, camera);

    // Movement and jump
    forwardVector.z = (keys.backward ? 1 : 0) - (keys.forward ? 1 : 0);
    sideVector.x = (keys.left ? 1 : 0) - (keys.right ? 1 : 0);
    direction.subVectors(forwardVector, sideVector).normalize().multiplyScalar(speed).applyEuler(camera.rotation);
    player.position.set(player.position.x + direction.x, player.position.y - gravity, player.position.z + direction.z);
    if(player.position.y > 2 && !jump){
        gravity += 0.2;
        jumping = false;
    } else if(player.position.y <= 2 && !jump){
        player.position.y = 2;
        gravity = 0;
        jumping = false;
        air = false;
    }
    if(keys.space && !air){
        air = true;
        jump = true;
        jumping = true;
    }
    if(jumping){
        gravity -= 1;
        air = true;
        setTimeout(() => {
            jump = false;
        }, 30)
    }

    camera.position.set(player.position.x, player.position.y + 3, player.position.z)

    // Key down and Key up
    document.addEventListener('keydown', (event) => {
        if(!lock){
            return
        }
        switch (event.keyCode) {
            case 87: // w
                keys.forward = true;
                break;
            case 65: // a
                keys.left = true;
                break;
            case 83: // s
                keys.backward = true;
                break;
            case 68: // d
                keys.right = true;
                break;
            case 32: // SPACE
                keys.space = true;
                break;
            case 16: // SHIFT
                keys.shift = true;
                break;
        }
    })
    document.addEventListener('keyup', (event) => {
        if(!lock){
            return
        }
        switch (event.keyCode) {
            case 87: // w
                keys.forward = false;
                break;
            case 65: // a
                keys.left = false;
                break;
            case 83: // s
                keys.backward = false;
                break;
            case 68: // d
                keys.right = false;
                break;
            case 32: // SPACE
                keys.space = false;
                break;
            case 16: // SHIFT
                keys.shift = false;
                break;
        }
    })
}

init();