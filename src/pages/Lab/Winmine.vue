<template>
  <div class="link-up">
    <transition-group v-loading="gameLoading" name="cell" tag="div" class="box game-board" :style="{'width':(width+2) * 50 + 'px','height':(height+2) * 50 + 'px'}">
      <div v-for="item in graph" class="item-box" :class="[{'selected':item.selected},'dot-'+getColor(item.weight)]" :style="{'visibility':item.show ? 'visible' : 'hidden'}" :key="item.id" @click="linkup(item)">
        <div class="line" :class="{'line-dot':item.isDot}"></div>
        <div class="line" :class="item.linkList"></div>
        <!-- <div>{{item.weight}}</div> -->
        <i class="fa" :class="'fa-'+iconList[item.weight-1]"></i>
      </div>
    </transition-group>
    <div class="box">
      <el-radio-group v-model="difficulty" @change="regame()">
        <el-radio-button :label="2">easy</el-radio-button>
        <el-radio-button :label="4">normal</el-radio-button>
        <el-radio-button :label="6">hard</el-radio-button>
        <el-radio-button :label="8">nightmare</el-radio-button>
      </el-radio-group>
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
      gameLoading:false,
      difficulty:4,
      score: 0,
      ticket: 2,
      height: 12,
      width: 12,
      type: 12,
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
        "gavel",
        "gift",
        "heartbeat",
        "music",
        "money",
        "star"
      ],
      weightPool:{}
    }
  },
  methods: {
    regame(){
      const vm = this
      vm.gameLoading = true
      vm.score = 0
      vm.ticket++
      vm.width = 4 * vm.difficulty - 4
      vm.height = 4 * vm.difficulty - 4
      vm.type = 2 * vm.difficulty + 4
      vm.generate()
      setTimeout(()=>{
        vm.gameLoading = false
      }, 1000)
    },
    getColor(weight){
      const vm = this
      if(vm.difficulty<5){
        return weight
      }else{
        return Math.round(Math.random() * vm.type + 1)
      }
    },
    generate() {
      const vm = this
      const data = []
      const total = vm.height * vm.width
      const mirror = []
      vm.weightPool = {}
      for (let i = 0; i < Math.floor(total / 2); i++) {
        data.push({
          id: i,
          show: true,
          selected: false,
          weight: vm.getRandom()
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
    getRandom(){
      const vm = this
      let n = Math.round(Math.random() * vm.type + 1)
      if(!vm.weightPool[n]){
        vm.weightPool[n] = 1
        return n
      }else if(vm.weightPool[n] >= Math.floor(vm.width * vm.height / vm.type / 2)){
        return vm.getRandom()
      }else {
        vm.weightPool[n] ++
        return n
      }
    },
    random(behalf) {
      const vm = this
      if(vm.ticket<1){
        return
      }
      vm.ticket--
      vm.score = behalf ? vm.score : Math.round(vm.score/2)
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
      vm.score+= (dot.weight+vm.difficulty) * 2
      vm.linked = {}
      vm.allClear()
      if(vm.difficulty === 8){
        vm.ticket++
        vm.random(true)
      }
    },
    cancel(dot){
      const vm = this
      dot.selected = false
      vm.linked.selected = false
      vm.linked = {}
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
      border: 1px solid @lighterwhite;
      overflow: visible;

      &:hover {
        background-color: @light;
      }
      &.selected {
        background-color: rgba(179,24,0, 0.8);
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
    transition: transform .6s;
  }
}
</style>