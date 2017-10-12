<template>
  <div id="app">
    <div @mouseenter="onMenu(true)" @mouseleave="onMenu(false)">
      <nav-bar></nav-bar>
    </div>
    <transition name="el-fade-in-linear">
      <router-view class="app-view" :class="{'folded':expand}"></router-view>
    </transition>
  </div>
</template>

<script>
import navBar from './components/nav.vue'
import { mapState } from 'vuex'
export default {
  name: 'app',
  data() {
    return {
      expand:false,
    }
  },
  created: function() {
    let vm = this;
    let fontSize = (document.body.clientWidth / 16) + 'px';
    document.getElementsByTagName("html")[0].style.setProperty('font-size', fontSize);
    document.body.style.setProperty('font-size', '.6rem');
    window.onresize = function() {
      let fontSize = (document.body.clientWidth / 16) + 'px';
      document.getElementsByTagName("html")[0].style.setProperty('font-size', fontSize);
      document.body.style.setProperty('font-size', '.6rem');
    }

    //ctrl + j
    let a = this.deepAssign({a: 1 }, {a: {b: 0 } }, {a: {b: 1, c: 2 } }, {a: {c: {d: 2 } } }, {a: {c: {f: 3 } } }); 
    // console.log(a)
  },
  methods:{
    onMenu(isFoled){
      this.expand = isFoled
    }
  },
  computed: mapState([]),
  components: {
    navBar
  }
}
</script>

<style lang="less">
#app {
  font-family: "Microsoft YaHei", "Verdana", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  .app-view {
    margin-left: 50px;
    transition: all .3s ease;
  }
  .folded{
    margin-left:200px;
    transition: all .3s ease;
  }
}
* {
  box-sizing: border-box;
}
</style>