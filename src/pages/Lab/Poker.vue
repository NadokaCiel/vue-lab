<template>
  <div class="poker">
    <draggable class="player-panel clearfix" :list="player1" :options="{group:'card'}">
      <transition-group name="cell" tag="div">
        <card :card="card" v-for="card in player1" :key="card.id"></card>
      </transition-group>
    </draggable>
    <div class="deck-panel clearfix" :list="deck" :options="{group:'card'}" @click="deal()">
      <transition-group name="cell" tag="div">
        <card :card="card" :class="{'deck-fold':card.fold}" v-for="card in deck" :key="card.id"></card>
      </transition-group>
    </div>
    <draggable class="player-panel clearfix" :list="player2" :options="{group:'card'}">
      <transition-group name="cell" tag="div">
        <card :card="card" v-for="card in player2" :key="card.id"></card>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import draggable from 'vuedraggable'
import card from '../../components/card.vue'
export default {
  name: 'poker',
  created: function() {
    const vm = this
    vm.makeDeck()
    vm.shuffleDeck()
  },
  data() {
    return {
      shuffleCount:0,
      dealCount:0,
      turn:true,
      suits:["heart","spade","diam","club"],
      points:["A","2","3","4","5","6","7","8","9","10","J","Q","K"],
      deck:[],
      player1:[],
      player2:[]
    }
  },
  methods: {
    makeDeck() {
      const vm = this
      const deck = []
      vm.suits.forEach(s => {
        vm.points.forEach((p, i) => {
          const card = {
            suit: s,
            point: p,
            value: i+1
          }
          deck.push(card)
        })
      })
      const joker_b = {
        suit: "joker-b",
        point: "Joker",
        value: 14
      }
      deck.push(joker_b)
      const joker_r = {
        suit: "joker-r",
        point: "Joker",
        value: 15
      }
      deck.push(joker_r)
      deck.forEach((c, i) => {
        c.id = i
        c.show = false
      })
      vm.deck = deck
    },
    shuffleDeck(){
      const vm = this
      setTimeout(()=>{
        if(vm.shuffleCount<7){
          vm.shuffleCount++
          vm.shuffle()
          vm.shuffleDeck()
        }else{
          // vm.shuffle()
          vm.shuffle(true)
          vm.shuffleCount = 0
          vm.dealDeck()
        }
      },200)
    },
    shuffle(fold) {
      const vm = this
      vm.deck.forEach((c, i) => {
        c.fold = fold ? fold : false
        c.show = false
      })
      vm.deck = _.shuffle(vm.deck)
    },
    flipCard(card) {
      card.show = !card.show
    },
    dealDeck() {
      const vm = this
      setTimeout(() => {
        if (vm.dealCount < 13) {
          vm.dealCount++
            vm.deal()
          vm.dealDeck()
        } else {
          vm.deal()
          vm.dealCount = 0
          vm.player2.forEach(c => {
            c.show = true
          })
        }
      }, 200)
    },
    deal() {
      const vm = this
      if(vm.deck.length <= 0){
        return
      }
      vm.turn ? vm.player1.unshift(vm.deck.pop()) : vm.player2.unshift(vm.deck.pop())
      vm.turn = !vm.turn
    }
  },
  computed: mapState({
    appName:state=>state.appName
  }),
  watch:{
  },
  components: {
    card,
    draggable
  }
}
</script>


<style lang="less" scoped>
@import '../../style/color.less';
.poker {
  .deck-panel {
    overflow: hidden;
    position: relative;
    margin: 20px auto;
    // width: 782px;
    width: 482px;
    height: 255px;
    // height: 455px;
    border: 1px solid @co10;
  }

  .player-panel {
    position: relative;
    margin: 20px auto;
    width: 782px;
    height: 255px;
    border: 1px solid @co10;
  }

  .deck-fold {
    position: absolute;
    top: calc(~"50% - 40px");
    left: calc(~"50% - 25px");;
  }

  .cell-move {
    transition: transform .6s;
  }

}
</style>