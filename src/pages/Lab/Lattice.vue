<template>
  <div tabindex="-1" class="lattice" @keyup.up="change('up')" @keyup.down="change('down')" @keyup.left="change('left')" @keyup.right="change('right')">
    <div class="box game-board" :style="{'width':(width) * 50 + 'px','height':(height) * 50 + 'px'}">
      <div v-for="item in graph" class="item-box" :class="['dot-'+item.weight]" :key="item.id">
        <!-- <div>{{item.weight ? Math.pow(2, item.weight) : ''}}</div> -->
      </div>
      <transition name="cell" mode="out-in" :duration="{ enter: 500, leave: 800 }" class="asfd">
        <div class="player item-box dot-15" :style="{'top':player.top + 'px','left':player.left + 'px'}"></div>
      </transition>
    </div>
    <div class="box">
      <div>Score:{{score}}</div>
      <el-button @click="reset()">reset</el-button>
    </div>
  </div>
</template>


<script>
import TWEEN from 'tween'
import { mapState } from 'vuex'
export default {
  name: 'lattice',
  created: function() {
    let vm = this
    vm.generate()
  },
  data() {
    return {
      score: 0,
      height: 8,
      width: 8,
      graph: [],
      pointMap: {},
      player:{
        top:0,
        left:0
      },
      x:0,
      y:0,
      top:0,
      left:0,
      moving:false
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
          weight:0
        }
        data.push(point)
        vm.pointMap[`(${point.x},${point.y})`] = point
      }
      vm.graph = data
      vm.birth();
      [1,2,3,4,5].forEach(i=>{
        vm.obstacle()
      })
    },
    obstacle(){
      const vm = this
      let x = Math.floor((Math.random()*vm.width))
      let y = Math.floor((Math.random()*vm.height))
      if(vm.pointMap[`(${x},${y})`].weight==0 && !(x==vm.x && y==vm.y)){
        vm.pointMap[`(${x},${y})`].weight = (Math.random() * 20 + 1).toFixed(0)
      }else{
        return vm.obstacle()
      }
    },
    birth(){
      const vm = this
      let x = Math.floor((Math.random()*vm.width))
      let y = Math.floor((Math.random()*vm.height))
      vm.top =  y * 50
      vm.left = x * 50
      vm.x = x
      vm.y = y
    },
    change(key) {
      const vm = this
      if (vm.moving) {
        return
      }
      if (key == "up") {
        if(vm.top > 0 && vm.pointMap[`(${vm.x},${vm.y-1})`] && vm.pointMap[`(${vm.x},${vm.y-1})`].weight == 0){
          vm.top -= 50
          vm.y--
        }
      } else if (key == "down") {
        if(vm.top < (vm.height - 1) * 50 && vm.pointMap[`(${vm.x},${vm.y+1})`] && vm.pointMap[`(${vm.x},${vm.y+1})`].weight == 0){
          vm.top += 50
          vm.y++
        }
      } else if (key == "left") {
        if(vm.left > 0 && vm.pointMap[`(${vm.x-1},${vm.y})`] && vm.pointMap[`(${vm.x-1},${vm.y})`].weight == 0){
          vm.left -= 50
          vm.x--
        }
      } else if (key == "right") {
        if(vm.left < (vm.width - 1) * 50 && vm.pointMap[`(${vm.x+1},${vm.y})`] && vm.pointMap[`(${vm.x+1},${vm.y})`].weight == 0){
          vm.left += 50
          vm.x++
        }
      }
    },
    swap(arr,index_1,index_2){
      let tmp = arr[index_1]
      Vue.set(arr, index_1, arr[index_2])
      Vue.set(arr, index_2, tmp)
    }
  },
  computed: mapState({
  }),
  watch: {
    top(newValue, oldValue) {
      const vm = this
      vm.moving = true
      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }
      new TWEEN.Tween({ tweeningNumber: oldValue })
        .easing(TWEEN.Easing.Quadratic.Out)
        .to({ tweeningNumber: newValue }, 200)
        .onUpdate(function () {
          vm.player.top = this.tweeningNumber.toFixed(0)
          if(Math.abs(vm.player.top - vm.top)<10){
            vm.moving = false
          }
        })
        .start()
      animate()
    },
    left(newValue, oldValue) {
      const vm = this
      vm.moving = true
      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }
      new TWEEN.Tween({ tweeningNumber: oldValue })
        .easing(TWEEN.Easing.Quadratic.Out)
        .to({ tweeningNumber: newValue }, 200)
        .onUpdate(function () {
          vm.player.left = this.tweeningNumber.toFixed(0)
          if(Math.abs(vm.player.left - vm.left)<10){
            vm.moving = false
          }
        })
        .start()
      animate()
    }
  },
  components: {
  }
}
</script>


<style lang="less" scoped>
@import '../../style/color.less';
.lattice {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  .game-board {
    position: relative;
    overflow: hidden;
  }
  .box {
    margin: 25px auto;
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
      padding: 1px;
      text-align: center;
      color: @linktext;
      border-radius: 4px;
      border: 1px solid @lighterblack;
      overflow: visible;
    }
    .player {
      position: absolute;
    }
  }
  .cell-move {
    // transition: transform .6s;
    transition: all .3s ease;
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