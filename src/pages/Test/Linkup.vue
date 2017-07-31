<template>
  <div class="link-up">
    <transition-group name="cell" tag="div" class="box" :style="{'width':(width+2) * 50 + 'px','height':(height+2) * 50 + 'px'}">
      <div v-for="item in graph" class="item-box" :class="[{'selected':item.selected},'dot-'+item.weight]" :style="{'visibility':item.show ? 'visible' : 'hidden'}" :key="item.id" @click="linkup(item)">
        <div class="line" :class="{'line-dot':item.isDot}"></div>
        <div class="line" :class="item.linkList"></div>
        <!-- <div>{{item.weight}}</div> -->
        <i class="fa" :class="'fa-'+iconList[item.weight-1]"></i>
      </div>
    </transition-group>
    <div class="box">
      <div>Score:{{score}}</div>
      <el-button @click="random()" :disabled="ticket==0">random({{ticket}})</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'link-up',
  created: function() {
    let vm = this
    vm.generate()
  },
  data() {
    return {
      score: 0,
      ticket: 2,
      height: 10,
      width: 10,
      type: 14,
      data: [],
      graph: [],
      path: [],
      linked: {},
      dotMap: {},
      iconList: [
        "cutlery",
        "bolt",
        "balance-scale",
        "beer",
        "anchor",
        "diamond",
        "bath",
        "automobile",
        "coffee",
        "grav",
        "bug",
        "bank",
        "bell",
        "tree",
        "globe",
      ]
    }
  },
  methods: {
    generate() {
      const vm = this
      const data = []
      const total = vm.height * vm.width
      const mirror = []
      for (let i = 0; i < Math.floor(total / 2); i++) {
        data.push({
          id: i,
          show: true,
          selected: false,
          weight: Math.round(Math.random() * vm.type + 1)
        })
      }
      const dl = data.length
      data.forEach((item, i) => {
        mirror.push({
          id: dl + i,
          show: true,
          selected: false,
          weight: data[i].weight
        })
      })
      vm.data = data.concat(mirror)
      vm.random()
    },
    random() {
      const vm = this
      if(vm.ticket<1){
        return
      }
      vm.ticket--
      vm.score = Math.round(vm.score/2)
      vm.data = _.shuffle(vm.data)
      vm.dotMap = {}
      vm.data.forEach((item, i) => {
        // item.show = true
        item.selected = false
        item.isDot = false
        item.linkList = []
        item.x = i % vm.width + 1
        item.y = Math.floor(i / vm.width) + 1
        item.point = `(${item.x},${item.y})`
        vm.dotMap[item.point] = item
      })
      for (let i = 0; i < vm.height+2; i++) {
        let item_1 = {
          id:'edge1'+i,
          show:false,
          linkList:[],
          x:0,
          y:i,
          point:`(0,${i})`
        }
        let item_2 = {
          id:'edge2'+i,
          show:false,
          linkList:[],
          x:vm.width+1,
          y:i,
          point:`(${vm.width+1},${i})`
        }
        vm.dotMap[item_1.point] = item_1
        vm.dotMap[item_2.point] = item_2
      }
      for (let i = 0; i < vm.width+2; i++) {
        let item_1 = {
          id:'edge3'+i,
          show:false,
          linkList:[],
          x:i,
          y:0,
          point:`(${i},0)`
        }
        let item_2 = {
          id:'edge4'+i,
          show:false,
          linkList:[],
          x:i,
          y:vm.height+1,
          point:`(${i},${vm.height+1})`
        }
        vm.dotMap[item_1.point] = item_1
        vm.dotMap[item_2.point] = item_2
      }
      vm.graph = Object.values(vm.dotMap).sort((a,b)=>{
        if(a.x != b.x){
          return a.x - b.x
        }else{
          return a.y - b.y
        }
      })
    },
    linkup(item) {
      const vm = this
      if(!item.show){
        return
      }
      vm.clearLink()
      item.selected = !item.selected
      if(item.id === vm.linked.id){
        vm.linked = {}
        return
      }
      if (!vm.linked.id) {
        vm.linked = item
      } else {
        if (vm.linked.weight == item.weight) {
          vm.checkout(item, vm.linked) ? vm.eliminate(item) : vm.cancel(item)
        }else{
          vm.cancel(item)
        }
      }
    },
    clearLink(){
      this.path.forEach(dot=>{
        dot.isDot = false
        dot.linkList = []
      })
      this.path = []
    },
    checkout(dot_1, dot_2) {
      const vm = this
      if (vm.state(dot_1, dot_2)) {
        dot_1.isDot = true
        dot_2.isDot = true
        vm.path.push(dot_1)
        vm.path.push(dot_2)
        return true
      }
      vm.clearLink()
      //扫描第一个点的十字线路径
      for (let i = 0; i < vm.width + 2; i++) {
        if (i == dot_1.x) {
          continue
        }
        if (vm.dotMap[`(${i},${dot_1.y})`].show == false) {
          if (vm.state(dot_1, vm.dotMap[`(${i},${dot_1.y})`]) && vm.state(dot_2, vm.dotMap[`(${i},${dot_1.y})`])) {
            dot_1.isDot = true
            dot_2.isDot = true
            vm.path.push(dot_1)
            vm.path.push(dot_2)
            return true
          }else{
            vm.clearLink()
          }
        }
      }
      for (let j = 0; j < vm.height + 2; j++) {
        if (j == dot_1.y) {
          continue
        }
        if (vm.dotMap[`(${dot_1.x},${j})`].show == false) {
          if (vm.state(dot_1, vm.dotMap[`(${dot_1.x},${j})`]) && vm.state(dot_2, vm.dotMap[`(${dot_1.x},${j})`])) {
            dot_1.isDot = true
            dot_2.isDot = true
            vm.path.push(dot_1)
            vm.path.push(dot_2)
            return true
          }else{
            vm.clearLink()
          }
        }
      }
      // vm.clearLink()
      return false
    },
    state(dot_1, dot_2) {
      const vm = this
      let alpha = 0
      if (dot_1.x == dot_2.x) {
        alpha = vm.stateX0(dot_1, dot_2)
      } else if (dot_1.y == dot_2.y) {
        alpha = vm.stateY0(dot_1, dot_2)
      } else {
        alpha = vm.state1(dot_1, dot_2)
      }
      return alpha
    },
    eliminate(dot) {
      const vm = this
      dot.show = false
      vm.linked.show = false
      vm.score+= dot.weight * 2
      vm.linked = {}
      vm.allClear()
    },
    cancel(dot){
      const vm = this
      dot.selected = false
      vm.linked.selected = false
      vm.linked = {}
    },
    stateX0(dot_1,dot_2){
      const vm = this
      const minY = dot_1.y < dot_2.y ? dot_1.y : dot_2.y
      const length = Math.abs(dot_1.y - dot_2.y)
      const path_x = []
      for (let i = 1; i < length; i++) {
        if(vm.dotMap[`(${dot_1.x},${minY+i})`].show){
          return 0
        }else{
          path_x.push(vm.dotMap[`(${dot_1.x},${minY+i})`])
        }
      }
      path_x.forEach(dot=>{
        dot.linkList.push('line-x')
      })
      dot_1.linkList.push(dot_1.y < dot_2.y ? 'line-right' : 'line-left')
      dot_2.linkList.push(dot_1.y > dot_2.y ? 'line-right' : 'line-left')
      path_x.push(dot_1)
      path_x.push(dot_2)
      vm.path = vm.path.concat(path_x)
      return 1
    },
    stateY0(dot_1,dot_2){
      const vm = this
      const minX = dot_1.x < dot_2.x ? dot_1.x : dot_2.x
      const length = Math.abs(dot_1.x - dot_2.x)
      const path_y = []
      for (let i = 1; i < length; i++) {
        if(vm.dotMap[`(${minX+i},${dot_1.y})`].show){
          return 0
        }else{
          path_y.push(vm.dotMap[`(${minX+i},${dot_1.y})`])
        }
      }
      path_y.forEach(dot=>{
        dot.linkList.push('line-y')
      })
      dot_1.linkList.push(dot_1.x < dot_2.x ? 'line-down' : 'line-up')
      dot_2.linkList.push(dot_1.x > dot_2.x ? 'line-down' : 'line-up')
      path_y.push(dot_1)
      path_y.push(dot_2)
      vm.path = vm.path.concat(path_y)
      return 1
    },
    state1(dot_1, dot_2) {
      const vm = this
      let alpha = 0
      if (!vm.dotMap[`(${dot_1.x},${dot_2.y})`].show) {
        alpha = vm.stateX0(dot_1, vm.dotMap[`(${dot_1.x},${dot_2.y})`]) && vm.stateY0(dot_2, vm.dotMap[`(${dot_1.x},${dot_2.y})`])
      }
      if(alpha){
        return 1
      }
      if (!vm.dotMap[`(${dot_2.x},${dot_1.y})`].show) {
        alpha = vm.stateY0(dot_1, vm.dotMap[`(${dot_2.x},${dot_1.y})`]) && vm.stateX0(dot_2, vm.dotMap[`(${dot_2.x},${dot_1.y})`])
      }
      return alpha ? 1 : 0
    },
    allClear(){
      const flag = this.data.every(item=>{
        return item.show == false
      })
      if(flag){
        console.log('Congratulations！All Clear!')
        console.log('Your score：'+this.score)
      }
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
.link-up {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

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
      border: 1px solid @lighterwhite;
      overflow: visible;

      &:hover {
        background-color: @light;
      }
      &.selected {
        background-color: @sec1;
      }
    }
    .line{
      &:before,&:after{
        visibility: visible;
        position: absolute;
        top:0;
        right: 0;
        bottom: 0;
        left: 0;
        content: '';
        display: block;
        background-color: transparent;
      }
    }
    .line-dot:before{
      top: calc(~"50% - 4px");
      margin:0 auto;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: @linkline;
    }

    .line-x:before{
      top:calc(~"50% - 2px");
      width: calc(~"100% + 2px");
      height: 4px;
      background-color: @linkline;
    }

    .line-y:after{
      width: 4px;
      height: calc(~"100% + 2px");
      margin:0 auto;
      background-color: @linkline;
    }

    .line-up:after{
      width: 4px;
      height: 50%;
      margin:-1px auto;
      background-color: @linkline;
    }

    .line-down:after{
      top:50%;
      width: 4px;
      height: calc(~"50% + 1px");
      margin:1px auto;
      background-color: @linkline;
    }

    .line-left:before{
      top:calc(~"50% - 2px");
      width: calc(~"50% + 3px");
      height: 4px;
      margin-left: -1px;
      background-color: @linkline;
    }

    .line-right:before{
      top:calc(~"50% - 2px");
      left:calc(~"50% - 3px");
      width: calc(~"50% + 4px");
      height: 4px;
      margin-left: 1px;
      background-color: @linkline;
    }
  }
  .cell-move {
    transition: transform 1s;
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
}
</style>