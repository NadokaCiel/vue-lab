<template>
  <div class="joseph">
   <div class="sector" ref="sector">
     <div class="sector-item" v-for="(item,i) in list" :style="{transform:getDeg(i),left:getLeft(i),top:getTop(i)}" :class="{'hidden':item.hidden}">{{item.value}}</div>
     <div class="sector-origin" :style="{top:centerTop + 'px',left:centerLeft + 'px'}"></div>
   </div>
   <div class="tool-box">
     <div>
       <span>Your List Size: </span>
       <el-input-number v-model="listSize" @change="sizeChange" :min="2" :max="16"></el-input-number>
     </div>
     <div>
       <span>Your Gap Size: </span>
       <el-input-number v-model="gap" @change="gapChange" :min="2" :max="1000"></el-input-number>
     </div>
     <div>
       <el-button @click="doJoseph()">Do It!</el-button>
     </div>
   </div>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import NodeList from '../../data/node/NodeList'
export default {
  name: 'joseph',
  created: function() {
    let vm = this
    vm.sizeChange(vm.listSize)
  },
  data() {
    return {
      avd:"",
      ahd:"",
      round: 0,
      gap: 3,
      listSize: 12,
      list:[],
      nodeList:{},
      centerTop: 0,
      centerLeft: 0,
      borderTop: 0,
      borderLeft: 0,
      offsetLeft:30,
      offsetTop:15,
    }
  },
  mounted: function() {
    this.borderTop = this.$refs.sector.offsetTop
    this.borderLeft = this.$refs.sector.offsetLeft
    this.centerTop = this.$refs.sector.offsetHeight / 2
    this.centerLeft = this.$refs.sector.offsetWidth / 2
    this.round = this.$refs.sector.offsetWidth / 4
  },
  methods: {
    getDeg(i) {
      return 'rotate(' + (-this.avd * i) + 'deg)'
    },
    getLeft(i) {
      return Math.sin(this.ahd * i) * this.round + this.centerLeft - this.offsetLeft + 'px'
    },
    getTop(i) {
      return Math.cos(this.ahd * i) * this.round + this.centerTop - this.offsetTop + 'px'
    },
    sizeChange(len) {
      const vm = this
      vm.list = []
      for (let i = 0; i < len; i++) {
        vm.list.push({
          value: i+1,
          hidden: false
        })
      }
      vm.nodeList = new NodeList(vm.list)
      vm.avd = 360 / this.list.length
      vm.ahd = vm.avd * Math.PI / 180
    },
    gapChange(){
      this.sizeChange(this.listSize)
    },
    doJoseph(){
      const vm = this
      let count = 0
      let node = vm.nodeList.head
      while(node.next != node){
        if(count == vm.gap - 1){
          node.prev.next = node.next
          node.next.prev = node.prev
          this.list[node.index].hidden = true
          count = 0
          console.log("got one: "+node.data.value)
        }
        node = node.next
        count ++
      }
      console.log("done")
    }
  },
  computed: mapState({
    appName:state=>state.appName
  }),
  watch:{
  },
  components: {
  }
}
</script>


<style lang="less" scoped>
@import '../../style/color.less';
.joseph {
  .sector {
    position: relative;
    margin: 20px auto;
    width: 800px;
    height: 600px;
    background-color: cyan;

    .sector-item {
      position: absolute;
      width: 60px;
      height: 30px;
      line-height: 30px;
      font-size: 16px;
      text-align: center;
      background-color: @co15;
    }

    .sector-origin {
      position: absolute;
      width: 5px;
      height: 5px;
      background-color: @co1;
    }

    .hidden{
      background-color: @co6;
    }

  }
  .tool-box{
    font-size: 16px;
    margin:10px auto;
    text-align: center;
    div{
      margin:10px 0;
    }
  }
}
</style>