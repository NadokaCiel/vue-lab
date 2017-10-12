<template>
<div class='vivid'>
  <canvas id='screen'></canvas>
</div>
</template>

<script>
import BABYLON from 'babylonjs';
import cannon from 'cannon';
export default {
  data() {
    return {
    };
  },
  methods: {
  },
  mounted() {
    // get the canvas DOM element
    let canvas = document.getElementById('screen');

    // load the 3D engine
    let engine = new BABYLON.Engine(canvas, true);

    // createScene function that creates and return the scene
    let createScene = function() {
      // create a basic BJS Scene object
      let scene = new BABYLON.Scene(engine);

      // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
      let camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);

      // target the camera to scene origin
      camera.setTarget(BABYLON.Vector3.Zero());

      // attach the camera to the canvas
      camera.attachControl(canvas, false);

      // create a basic light, aiming 0,1,0 - meaning, to the sky
      let light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

      // create a built-in "sphere" shape; its constructor takes 5 params: name, width, depth, subdivisions, scene
      let sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);

      // move the sphere upward 1/2 of its height
      sphere.position.y = 1;

      // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
      let ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);

      // return the created scene
      return scene;
    }

    // call the createScene function
    let scene = createScene();

    // run the render loop
    engine.runRenderLoop(function() {
      scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', function() {
      engine.resize();
    });
  },
};
</script>
<style lang="less" scoped>
@import '../../style/color.less';
.vivid {
  #screen {
    width: 100%;
    height: 100%;
    touch-action: none;
  }
}
</style>