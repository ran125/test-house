<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li>
        <a href="https://vuejs.org" target="_blank">Core Docs</a>
      </li>
      <li>
        <a href="https://forum.vuejs.org" target="_blank">Forum</a>
      </li>
      <li>
        <a href="https://chat.vuejs.org" target="_blank">Community Chat</a>
      </li>
      <li>
        <a href="https://twitter.com/vuejs" target="_blank">Twitter</a>
      </li>
      <br>
      <li>
        <a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a>
      </li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li>
        <a href="http://router.vuejs.org/" target="_blank">vue-router</a>
      </li>
      <li>
        <a href="http://vuex.vuejs.org/" target="_blank">vuex</a>
      </li>
      <li>
        <a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a>
      </li>
      <li>
        <a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "HelloWorld1",
  data() {
    return {
      msg: "Welcome to Your Vue.js App7908098"
    };
  }
  // methods: {
  //   init: function() {
  //       let container = document.getElementById('three');

  //       this.camera = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 10);
  //       this.camera.position.z = 1;

  //       this.scene = new Three.Scene();
  //       let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
  //       let material = new Three.MeshNormalMaterial();

  //       this.mesh = new Three.Mesh(geometry, material);
  //       this.scene.add(this.mesh);

  //       this.renderer = new Three.WebGLRenderer({antialias: true});
  //       this.renderer.setSize(container.clientWidth, container.clientHeight);
  //       container.appendChild(this.renderer.domElement);

  //   },
  //   animate: function() {
  //       requestAnimationFrame(this.animate);
  //       this.mesh.rotation.x += 0.01;
  //       this.mesh.rotation.y += 0.02;
  //       this.renderer.render(this.scene, this.camera);
  //   }
  // },
  // mounted() {
  //     this.init();
  //     this.animate();
  // }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
