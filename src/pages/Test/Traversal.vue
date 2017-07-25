<template>
  <div class="traversal">
    <div class="box" flex="main:center cross:center">
      <div>
        <div flex="main:center cross:center" v-for="row in drawData">
        <div class="item-box" :class="{'highlight':item==1}" v-for="item in row">{{item}}</div>
      </div>
      </div>
      <chart class="box" :options="graphOption"></chart>
    </div>
    <div class="" flex="main:center cross:center">
      <el-button type="info" @click="generate">generate</el-button>
    </div>
  </div>
</template>


<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line'

Vue.component('chart', ECharts)

export default {
  name: 'traversal',
  created: function() {
    let vm = this
    vm.generate()
  },
  data() {
    return {
      height:10,
      width:10,
      pathArr:[],
      pathMap:{},
      drawData:[],
      originalData:[],
      graphOption:{}
    }
  },
  methods: {
    generate() {
      const vm = this
      const graph = []
      for (let i = 0; i < vm.height; i++) {
        const row = []
        for (let j = 0; j < vm.width; j++) {
          let alpha = Math.random() < 0.5 ? 1 : 0
          row.push(alpha)
        }
        graph.push(row)
      }
      vm.drawData = JSON.parse(JSON.stringify(graph)).reverse()
      vm.originalData = graph
      vm.getGraphOption()
    },
    getGraphOption() {
      const vm = this
      vm.pathArr = []
      vm.pathMap = {}
      vm.originalData[0].forEach((start, i) => {
        vm.dig(i, 0, [])
      })
      const series = []
      vm.pathArr.forEach((path,i)=>{
        console.log(path.join('|'))
        series.push({
          name: `path ${i}`,
          type: 'line',
          data: path
        })
      })
      const option = {
        title: {
          text: 'Dig Result'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'value',
          splitNumber: vm.width - 1,
          min: 0,
          max: vm.width - 1
        },
        yAxis: {
          type: 'value',
          splitNumber: vm.height - 1,
          min: 0,
          max: vm.height - 1
        },
        series: series
      }
      vm.graphOption = option
    },
    dig(x, y, path) {
      const vm = this
      if (vm.pathMap[`(${x},${y})`] || x >= vm.width || x < 0 || y >= vm.height || vm.originalData[y][x] == 0) {
        path.length > 0 && !vm.pathMap[path.join('|')] ? vm.pathArr.push(path) : ''
        vm.pathMap[path.join('|')] = true
        return
      }
      vm.pathMap[`(${x},${y})`] = true
      const n_path = JSON.parse(JSON.stringify(path))
      n_path.push([x,y])
      vm.dig(x, y + 1, n_path)
      vm.dig(x - 1, y, n_path)
      vm.dig(x + 1, y, n_path)
    }
  },
  computed: mapState({
  }),
  components: {
  }
}
</script>


<style lang="less" scoped>
@import '../../style/color.less';
.traversal {
  .box{
    margin:40px;
    font-size: 28px;
    text-align: center;
  }
  .item-box{
    height: 30px;
    width: 30px;
  }
  .highlight{
    color:@nav;
  }
}
</style>