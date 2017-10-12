<template>
  <div class="chess">
    <div class="chess-board">
      <div v-for="block in graph" class="block" :class="[{'black':(block.x%2)^(block.y%2)},{'selected':selected.position==block.position},{'access':accessPath.indexOf(block.position)>=0 && !block.piece},{'attack':accessPath.indexOf(block.position)>=0 && block.piece}]" @click="move(block)" @mouseenter="showPath(block)" @mouseleave="clearPath()">
        <!-- {{block.x}}:{{block.y}} -->
        <!-- {{block.position}} -->
        <div v-if="block.piece" :class="['piece','piece-'+getName(block)+'-'+block.piece.camp]">
          <!-- {{block.piece && block.piece.name ? block.piece.name :""}} -->
        </div>
      </div>
    </div>
    <div class="box">
      <div>Current Camp : {{campMap[currentMover]}}</div>
      <!-- <el-button @click="undo()" type="default">undo</el-button> -->
      <el-button @click="generate()" type="default">reset</el-button>
<!--       <el-switch v-model="ai" on-color="#FF6E97" off-color="#DB9019" on-text="AI" off-text="PVP">
      </el-switch> -->
    </div>
    <el-dialog class="upgrade-dialog" title="Upgrade Your Piece" :visible.sync="showUpgrade" size="small" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-button class="upgrade-btn" size="small" type="warning" @click="upgradeTo('r')">Rook</el-button>
      <el-button class="upgrade-btn" size="small" type="warning" @click="upgradeTo('n')">Knight</el-button>
      <el-button class="upgrade-btn" size="small" type="warning" @click="upgradeTo('b')">Bishop</el-button>
      <el-button class="upgrade-btn" size="small" type="warning" @click="upgradeTo('q')">Queen</el-button>
    </el-dialog>
    <el-dialog title="Game Over" :visible.sync="showEnd" size="tiny">
      <span>{{endInfo}}</span>
    </el-dialog>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import Piece from '../../data/chess/Piece'
export default {
  name: 'chess',
  created: function() {
    let vm = this
    vm.generate()
  },
  data() {
    return {
      ai:true,
      gameEnd:false,
      endInfo:'',
      showEnd:false,
      showUpgrade:false,
      currentMover:'white',
      charArr:'abcdefgh'.split(''),
      resetFnn:'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
      campMap:{
        "white":"Blue",
        "black":"Pink"
      },
      pieceMap:{
        "Pawn":"p",
        "Rook":"r",
        "Knight":"n",
        "Bishop":"b",
        "Queen":"q",
        "King":"k"
      },
      currentFnn:"",
      fnnList:[],
      graph:[],
      accessPath:[],
      axisMap:{},
      battleMap:{},
      selected:{},
      upgradePiece:{},
      cemetery:{
        white:[],
        black:[]
      }
    }
  },
  methods: {
    getName(block) {
      return block.piece && block.piece.name ? block.piece.name.toLowerCase() : 'none'
    },
    upgradeTo(alias) {
      const vm = this
      vm.upgradePiece.transform(alias)
      vm.showUpgrade = false
    },
    generate() {
      const vm = this
      vm.selected = {}
      vm.graph = []
      vm.cemetery = {
        white:[],
        black:[]
      }
      for (let i = 0; i < 64; i++) {
        let block = {
          x: i % 8 + 1,
          y: Math.floor(i / 8) + 1,
          position: vm.charArr[i % 8] + (8 - Math.floor(i / 8)),
          piece: null,
          selected: false,
        }
        vm.battleMap[block.position] = block
        vm.axisMap[`(${block.x},${block.y})`] = block
        vm.graph.push(block)
      }
      vm.setPiece(vm.resetFnn)
      // vm.setPiece('rnbqkbnr/pppppppp/8/8/5P2/8/PPPPP1PP/RNBQKBN')
    },
    move(block) {
      const vm = this
      if (vm.gameEnd) {
        return
      }
      if (!vm.selected.position && !block.piece) {
        return
      }
      if (!vm.selected.position && block.piece.camp !== vm.currentMover) {
        return
      }
      if (!vm.selected.position) {
        vm.selected = block
      } else if (vm.selected.piece && block.piece && vm.selected.piece.camp === block.piece.camp) {
        vm.selected = {}
      } else {
        if (vm.selected.piece.move(vm.selected, block, vm.axisMap)) {
          vm.selected.piece.inactive = false
          if (block.piece) {
            if (block.piece.name === "King") {
              vm.endInfo = vm.selected.piece.camp + " wins!"
              vm.gameEnd = true
              vm.showEnd = true
              return
            }
            vm.cemetery[block.piece.camp].push(block.piece)
          }
          block.piece = vm.selected.piece
          if (vm.axisMap['passer'] && vm.currentMover !== vm.axisMap['passer'].camp) {
            if (vm.axisMap['passer'].eaten) {
              vm.cemetery[vm.axisMap['passer'].camp].push(vm.axisMap['passer'].block.piece)
              vm.axisMap['passer'].block.piece = null
            }
            vm.axisMap['passer'] = null
          }
          vm.currentMover = vm.currentMover === 'white' ? 'black' : 'white'
          vm.lastLine(vm.selected, block)
          vm.selected.piece = null
          vm.fnnList.push(vm.getPiece())
          if(vm.ai && vm.currentMover=='black'){
            console.log('AI Move!')
            vm.aiMove()
          }
        }
        vm.selected = {}
      }
    },
    aiMove(){

    },
    showPath(block){
      const vm = this
      if(!block.piece){
        return
      }
      vm.graph.forEach(b=>{
        if(b.position == block.position){
          return
        }
        if(block.piece.move(block, b, vm.axisMap, true)){
          vm.accessPath.push(b.position)
        }
      })
    },
    clearPath(){
      this.accessPath = []
    },
    lastLine(block1, block2) {
      const vm = this
      if (block1.piece.name !== "Pawn") {
        return
      }
      if ((block1.piece.camp === "white" && block2.y === 1) || (block1.piece.camp === "black" && block2.y === 8)) {
        vm.upgradePiece = block1.piece
        vm.showUpgrade = true
      }
    },
    setPiece(fnn) {
      const vm = this
      const boardList = fnn.split('/').reverse()
      boardList.forEach((list, row) => {
        const pieceList = list.split('')
        let gap = 0
        let now_index = 0
        pieceList.forEach(piece => {
          let num = Number.parseInt(piece)
          if (Number.isInteger(num)) {
            gap = num
          } else {
            now_index += gap
            gap = 0
            vm.battleMap[vm.charArr[now_index] + (row + 1)].piece = new Piece(piece)
            now_index++
          }
        })
      })
      vm.currentMover = "white"
      vm.gameEnd = false
      vm.currentFnn = fnn
    },
    getPiece() {
      const vm = this
      let fnn = ""
      let gap = 0
      vm.graph.forEach((block, i) => {
        let piece = block.piece
        if (!block.piece) {
          gap++
        } else {
          fnn += (gap ? gap : '')
          fnn += (piece.camp === "white" ? vm.pieceMap[piece.name].toUpperCase() : vm.pieceMap[piece.name])
          gap = 0
        }
        if ((i + 1) % 8 === 0) {
          fnn += (gap ? gap : '')
          gap = 0
          fnn += '/'
        }
      })
      fnn = fnn.substr(0, fnn.length - 2)
      vm.currentFnn = fnn
      return fnn
    },
    undo() {
      const vm = this
      if (vm.fnnList.length <= 0) {
        return
      }
      vm.setPiece(vm.fnnList.pop())
      vm.currentMover = vm.currentMover === 'white' ? 'black' : 'white'
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
.chess {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  .box {
    margin:25px auto;
    text-align: center;
    font-size: 24px;
    *{
      margin:10px;
    }
  }

  .chess-board {
    width: 640px;
    height: 640px;
    margin: 25px auto;
    text-align: center;
    border: 1px solid @black;
    box-sizing: content-box;

    .block {
      float: left;
      cursor: pointer;
      user-select: none;
      font-size: 16px;
      font-weight: bold;
      position: relative;
      width: 80px;
      height: 80px;
      line-height: 80px;
      text-align: center;
      overflow: visible;
      border: 2px solid transparent;
      z-index: 1;

      &.black {
        background-color: @black;
      }
      &:hover, &.selected {
        box-shadow: 0 0 15px 5px rgba(233,240,29, 0.8);
        z-index: 10;
      }
      &.selected{
        border-color: @deco1;
      }
      &.access:after {
        content: ' ';
        position: absolute;
        top:-2px;
        right:-2px;
        bottom:-2px;
        left:-2px;
        box-shadow: 0 0 10px 3px rgba(0,255,128, .4);
        background-color: rgba(0,255,128, .4);
      }
      &.attack:after {
        content: ' ';
        position: absolute;
        top:-2px;
        right:-2px;
        bottom:-2px;
        left:-2px;
        box-shadow: 0 0 10px 3px rgba(235,63,47, .4);
        background-color: rgba(235,63,47, .4);
      }
      .piece{
        width: 60px;
        height: 60px;
        margin:10px auto;
        line-height: 60px;
        border-radius: 50%;
        // background-color: @lighterblack;
        background-size: contain;
      }
      .piece-black{
        color:@black;
      }
      .piece-white{
        color:@white;
      }
      .piece-pawn-white{
        background-image: url(../../assets/piece-pawn-white.png)
      }
      .piece-pawn-black{
        background-image: url(../../assets/piece-pawn-black.png)
      }
      .piece-rook-white{
        background-image: url(../../assets/piece-rook-white.png)
      }
      .piece-rook-black{
        background-image: url(../../assets/piece-rook-black.png)
      }
      .piece-knight-white{
        background-image: url(../../assets/piece-knight-white.png)
      }
      .piece-knight-black{
        background-image: url(../../assets/piece-knight-black.png)
      }
      .piece-queen-white{
        background-image: url(../../assets/piece-queen-white.png)
      }
      .piece-queen-black{
        background-image: url(../../assets/piece-queen-black.png)
      }
      .piece-king-white{
        background-image: url(../../assets/piece-king-white.png)
      }
      .piece-king-black{
        background-image: url(../../assets/piece-king-black.png)
      }
      .piece-bishop-white{
        background-image: url(../../assets/piece-bishop-white.png)
      }
      .piece-bishop-black{
        background-image: url(../../assets/piece-bishop-black.png)
      }
    }
  }
}
.upgrade-dialog{
  text-align: center;
  .upgrade-btn{
    margin:10px;
  }
}
</style>