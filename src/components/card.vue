<template>
  <div class="card" :class="{'reverse':!card.show}" @click="flipCard(card)">
    <div class="flip">
      <div class="card-front" :class="'card-'+card.suit">{{card.point}}</div>
      <div class="card-back"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    card: {
      type: Object,
      default: () => {
        return {
          suit: "joker-r",
          point: "Joker",
          value: 15,
          show: false
        }
      }
    },
  },
  data() {
    return {
    }
  },
  methods: {
    flipCard(card) {
      card.show = !card.show
    },
  }
}
</script>

<style lang="less" scoped>
@import '../style/color.less';
.card {
  float: left;
  cursor: pointer;
  user-select: none;
  margin: 5px;
  width: 50px;
  height: 80px;
  font-size: 16px;
  perspective: 1000;
  transform-style: preserve-3d;
}

.reverse {
  .flip {
    transform: rotateY(540deg);
  }

}

.flip {
  width: 100%;
  height: 100%;
  position: relative;
  transition: 0.6s;
  transform-style: preserve-3d;
}

.card-front {
  position: absolute;
  padding: 2px;
  width: 100%;
  height: 100%;
  z-index: 15;
  border: 1px solid @co10;
  background-color: @white;
  backface-visibility: hidden;
}

.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(../assets/poker-back1.jpg);
  background-size: cover;
  z-index: 10;
  backface-visibility: hidden;
  transform: rotateY(-180deg);
}

.card-heart, .card-diam, .card-joker-r {
  color: @co1;
}

.card-spade, .card-club, .card-joker-b {
  color: @co19;
}

.card-front:after {
  position: absolute;
  right: 2px;
  bottom: 2px;
  transform: rotate(-180deg);
}

.card-heart:before, .card-heart:after {
  content: "\2665";
}

.card-spade:before, .card-spade:after {
  content: "\2660";
}

.card-diam:before, .card-diam:after {
  content: "\2666";
}

.card-club:before, .card-club:after {
  content: "\2663";
}
</style>