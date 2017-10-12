<template>
  <div class="puzzle">
    <draggable class="puzzle-box clearfix" :list="pieces" :style="{'width':width * length + 'px','height':height * length + 'px'}" @end="checkGame">
      <transition-group name="cell">
        <div class="puzzle-piece" v-for="piece in pieces" :key="piece.id" :style="{'width': length + 'px','height':length + 'px','line-height':length + 'px','background-size':width * length + 'px','background-position':(piece.id%width * (100/(width-1)))+'% '+Math.floor(piece.id/height) * (100/(height-1)) +'%'}">
          {{piece.value}}
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import draggable from 'vuedraggable'
export default {
  name: 'puzzle',
  created: function() {
    const vm = this
    const total = 100
    for (let i = 0; i < total; i++) {
      vm.pieces.push({
        id:i,
        value:i+1
      })
    }
    vm.width = 10
    vm.height = 10
    vm.pieces = _.shuffle(vm.pieces)
  },
  data() {
    return {
      length: 50,
      width:3,
      height:3,
      pieces:[]
    }
  },
  methods: {
    checkGame(){
      const vm = this
      const list = vm.pieces.map(i=>i.id)
      let s1 = list.join(',')
      let s2 = list.sort((a,b)=>a-b).join(',')
      console.log(s1)
      console.log(s2)
      if(s1 == s2){
        alert("You Win!")
      }
    }
  },
  computed: mapState({
    appName:state=>state.appName
  }),
  watch:{
  },
  components: {
    draggable
  }
}
</script>


<style lang="less" scoped>
@import '../../style/color.less';
.puzzle {
  .puzzle-box{
    margin:100px auto;
  }
  .puzzle-piece{
    float: left;
    font-size: 16px;
    text-align: center;
    border:1px solid cyan;
    background-image: url(../../assets/timg.png);
    &.sortable-chosen{
      border-color: @co4;
    }
  }
}
</style>