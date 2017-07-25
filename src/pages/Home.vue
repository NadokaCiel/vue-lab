<template>
  <div class="home">
    <div class="title-wrapper">
      <div class="my-title">
        <div class="main-title">{{appName}}</div>
        <div class="sub-title">A Developing Software Framework</div>
        <div class="hint">You have been here for {{ now | timeNormalize}}</div>
        <div class="hint navigate" @click="toTest">To Test</div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex'
export default {
  name: 'home',
  created: function() {
    let vm = this;
    setInterval(() => {
      vm.now += 1000
    }, 1000)
  },
  data() {
    return {
      now: 0
    }
  },
  methods: {
    toTest(){
      this.$router.push({name:'ButtonTest'})
    }
  },
  computed: {
    ...mapState({
      appName: state => state.appName,
    })
  },
  components: {}
}
</script>


<style lang="less" scoped>
@import '../style/color.less';
.home {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  .title-wrapper {
    display: table;
    width: 100%;
    height: 100%;
    font-size: 1rem;

    .my-title {
      display: table-cell;
      vertical-align: middle;
      text-align: center;
    }
  }
  .main-title {
    color: @sec1;
    font-size: 2rem;
  }
  .sub-title {
    text-align: center;
    color: @lightgray;
    font-size: .5rem;
  }
  .hint{
    padding-top: .4em;
    text-align: center;
    color: @sec2;
    font-size: .2rem;
  }
  .navigate{
    color:@sec3;
    cursor: pointer;
    &:hover{
      color:@deco1;
    }
  }
}
</style>