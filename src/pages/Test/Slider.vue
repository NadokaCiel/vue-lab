<template>
  <div tabindex="-1" class="slider-2048" @keyup.up="change('up')" @keyup.down="change('down')" @keyup.left="change('left')" @keyup.right="change('right')">
    <transition-group name="cell" tag="div" class="box game-board" :style="{'width':(width) * 50 + 'px','height':(height) * 50 + 'px'}">
      <div v-for="item in graph" class="item-box" :class="['dot-'+item.weight]" :key="item.id">
        <div>{{item.weight ? Math.pow(2, item.weight) : ''}}</div>
      </div>
    </transition-group>
    <div class="box">
      <div>Score:{{score}}</div>
      <el-button @click="reset()">reset</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'slider-2048',
  created: function() {
    let vm = this
    vm.generate()
  },
  data() {
    return {
      score: 0,
      height: 4,
      width: 4,
      changed: false,
      data: [],
      graph: [],
      pointMap: {},
    }
  },
  methods: {
    reset(){
      const vm = this
      vm.score = 0
      vm.graph = []
      vm.pointMap = {}
      vm.generate()
    },
    generate() {
      const vm = this
      const data = []
      const total = vm.height * vm.width
      for (let i = 0; i < total; i++) {
        let point = {
          id:i,
          x: i % vm.height,
          y: Math.floor(i / vm.width),
          weight: 0
        }
        data.push(point)
        vm.pointMap[`(${point.x},${point.y})`] = point
      }
      vm.graph = data
      vm.newNum()
    },
    newNum(){
      const vm = this
      let x = Math.floor((Math.random()*vm.width))
      let y = Math.floor((Math.random()*vm.height))
      if(vm.pointMap[`(${x},${y})`].weight==0){
        vm.pointMap[`(${x},${y})`].weight = (Math.random() < 0.8 ? 1 : 2)
      }else{
        return vm.newNum()
      }
    },
    excute(x, y, key) {
      const vm = this
      if (vm.pointMap[`(${x},${y})`].weight == 0) {
        return
      }
      if (key == "up") {
        for (let i = 0; i < y; i++) {
          if (vm.pointMap[`(${x},${i})`].weight == 0) {
            [vm.pointMap[`(${x},${i})`].weight, vm.pointMap[`(${x},${y})`].weight] = [vm.pointMap[`(${x},${y})`].weight, vm.pointMap[`(${x},${i})`].weight]
            vm.changed = true
            return
          } else if (vm.pointMap[`(${x},${i})`].weight == vm.pointMap[`(${x},${y})`].weight && vm.clearPath(x, i, x, y)) {
            vm.pointMap[`(${x},${y})`].weight = 0
            vm.pointMap[`(${x},${i})`].weight++
              vm.changed = true
            return
          }
        }
      } else if (key == "down") {
        for (let i = vm.height - 1; i > y; i--) {
          if (vm.pointMap[`(${x},${i})`].weight == 0) {
            [vm.pointMap[`(${x},${i})`].weight, vm.pointMap[`(${x},${y})`].weight] = [vm.pointMap[`(${x},${y})`].weight, vm.pointMap[`(${x},${i})`].weight]
            vm.changed = true
            return
          } else if (vm.pointMap[`(${x},${i})`].weight == vm.pointMap[`(${x},${y})`].weight && vm.clearPath(x, i, x, y)) {
            vm.pointMap[`(${x},${y})`].weight = 0
            vm.pointMap[`(${x},${i})`].weight++
              vm.changed = true
            return
          }
        }
      } else if (key == "left") {
        for (let i = 0; i < x; i++) {
          if (vm.pointMap[`(${i},${y})`].weight == 0) {
            [vm.pointMap[`(${i},${y})`].weight, vm.pointMap[`(${x},${y})`].weight] = [vm.pointMap[`(${x},${y})`].weight, vm.pointMap[`(${i},${y})`].weight]
            vm.changed = true
            return
          } else if (vm.pointMap[`(${i},${y})`].weight == vm.pointMap[`(${x},${y})`].weight && vm.clearPath(i, y, x, y)) {
            vm.pointMap[`(${x},${y})`].weight = 0
            vm.pointMap[`(${i},${y})`].weight++
              vm.changed = true
            return
          }
        }
      } else if (key == "right") {
        for (let i = vm.width - 1; i > x; i--) {
          if (vm.pointMap[`(${i},${y})`].weight == 0) {
            [vm.pointMap[`(${i},${y})`].weight, vm.pointMap[`(${x},${y})`].weight] = [vm.pointMap[`(${x},${y})`].weight, vm.pointMap[`(${i},${y})`].weight]
            vm.changed = true
            return
          } else if (vm.pointMap[`(${i},${y})`].weight == vm.pointMap[`(${x},${y})`].weight && vm.clearPath(i, y, x, y)) {
            vm.pointMap[`(${x},${y})`].weight = 0
            vm.pointMap[`(${i},${y})`].weight++
              vm.changed = true
            return
          }
        }
      }
    },
    change(key) {
      const vm = this
      if (key == "up") {
        for (let x = 0; x < vm.width; x++) {
          for (let y = 0; y < vm.height; y++) {
            vm.excute(x, y, key)
          }
        }
      } else if (key == "down") {
        for (let x = 0; x < vm.width; x++) {
          for (let y = vm.height - 1; y >= 0; y--) {
            vm.excute(x, y, key)
          }
        }
      } else if (key == "left") {
        for (let y = 0; y < vm.height; y++) {
          for (let x = vm.width - 1; x >= 0; x--) {
            vm.excute(x, y, key)
          }
        }
      } else if (key == "right") {
        for (let y = 0; y < vm.height; y++) {
          for (let x = 0; x < vm.width; x++) {
            vm.excute(x, y, key)
          }
        }
      }
      if(vm.changed){
        if(!vm.overCheck()){
          vm.newNum()
        }
        vm.changed = false
      }
    },
    clearPath(x1, y1, x2, y2) {
      const vm = this
      if (x1 === x2) {
        const minY = y1 < y2 ? y1 : y2
        const length = Math.abs(y1 - y2)
        for (let i = 1; i < length; i++) {
          if (vm.pointMap[`(${x1},${minY+i})`].weight > 0) {
            return false
          }
        }
        return true
      } else if (y1 === y2) {
        const minX = x1 < x2 ? x1 : x2
        const length = Math.abs(x1 - x2)
        for (let i = 1; i < length; i++) {
          if (vm.pointMap[`(${minX+i},${y1})`].weight > 0) {
            return false
          }
        }
        return true
      }
      return false
    },
    overCheck(){
      return this.graph.every(item=>{
        return item.weight > 0
      })
    },
    swap(arr,index_1,index_2){
      let tmp = arr[index_1]
      Vue.set(arr, index_1, arr[index_2])
      Vue.set(arr, index_2, tmp)
    }
  },
  computed: mapState({
  }),
  watch:{
  },
  components: {
  }
}
</script>


<style lang="less" scoped>
@import '../../style/color.less';
.slider-2048 {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  .game-board{
    overflow: hidden;
  }

  .box {
    margin:25px auto;
    text-align: center;

    .item-box {
      float: left;
      cursor: pointer;
      user-select: none;
      font-size: 24px;
      position: relative;
      width: 50px;
      height: 50px;
      line-height: 50px;
      padding:1px;
      text-align: center;
      color: @linktext;
      border-radius: 4px;
      border: 1px solid @lighterblack;
      overflow: visible;
    }
  }
  .cell-move {
    transition: transform .6s;
  }
  .dot-1 {
    background-color: @co1;
  }
  .dot-2 {
    background-color: @co2;
  }
  .dot-3 {
    background-color: @co3;
  }
  .dot-4 {
    background-color: @co4;
  }
  .dot-5 {
    background-color: @co5;
  }
  .dot-6 {
    background-color: @co6;
  }
  .dot-7 {
    background-color: @co7;
  }
  .dot-8 {
    background-color: @co8;
  }
  .dot-9 {
    background-color: @co9;
  }
  .dot-10 {
    background-color: @co10;
  }
  .dot-11 {
    background-color: @co11;
  }
  .dot-12 {
    background-color: @co12;
  }
  .dot-13 {
    background-color: @co13;
  }
  .dot-14 {
    background-color: @co14;
  }
  .dot-15 {
    background-color: @co15;
  }
  .dot-16 {
    background-color: @co16;
  }
  .dot-17 {
    background-color: @co17;
  }
  .dot-18 {
    background-color: @co18;
  }
  .dot-19 {
    background-color: @co19;
  }
  .dot-20 {
    background-color: @co20;
  }
  .dot-21 {
    background-color: @co21;
  }
}
</style>