# Three JS First Person Controller

This is a simple **Three JS** first person controller using a cube as the player who can move around with **W, A, S, D, jump with space, and look around using the mouse**. You can view the first person controller **[here](https://susjejesus.github.io/Three_JS_First_Person_Controller/index.html)**.
![Menu Screen](https://susjejesus.github.io/Three_JS_First_Person_Controller/resources/Capture.PNG)

# Download


You can download this repository as a zip on your computer and extract it. You must open the **index.html** on a **live server** to view it or you can view the **index.html** file **[here](https://susjejesus.github.io/Three_JS_First_Person_Controller/index.html)**

## First Person Controls
If you are wondering how I locked the mouse, I used the [PointerLockControls](https://threejs.org/docs/#examples/en/controls/PointerLockControls) from ThreeJS to lock the mouse. I then made a [Vector3](https://threejs.org/docs/?q=vector#api/en/math/Vector3) for the Z and the X movement. Finally, I normalized them, and added the direction to the player position.

direction.subVectors(forwardVector, sideVector).normalize().multiplyScalar(speed).applyEuler(camera.rotation);

player.position.set(player.position.x + direction.x, player.position.y - gravity, player.position.z + direction.z);
