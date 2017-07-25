<template>
  <div class="button-test">
    <div>{{appName}}</div>
    <div class="btn-group">
      <el-button type="primary" @click="elementClick">Element Button</el-button>
      <c-button type="primary" :clickFunc="[customClick]">Custom Button</c-button>
    </div>
    <div class="test-result">
      {{resultText ? `System: ${resultText}`:''}}
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import cButton from '../../components/cButton.vue'
export default {
  name: 'button-test',
  created: function() {
    let vm = this
  },
  data() {
    return {
      resultText:''
    }
  },
  methods: {
    sleep(ms = 1000) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    async customClick() {
      await this.sleep()
      if (parseInt(Math.random() * 10) < 5) {
        this.resultText = 'Custom Operation Failed'
        throw "Operation Failed!"
      } else {
        this.$ajax.get('/src/data/test.json').then(response => {
          console.log('Succeed!')
          console.log(response)
        }, response => {
          console.log('Failed!')
          console.log(response)
        })
        this.resultText = 'Custom Operation Succeed'
      }
    },
    elementClick(){
      this.$store.dispatch('setAppName','element-lab')
      this.resultText = 'Element Operation Succeed'
    },
    changeText(newV,oleV){
      console.log('new: ' + newV)
      console.log('old: ' + oleV)
      console.log('now: ' + this.resultText)
    }
  },
  computed: mapState({
    appName:state=>state.appName
  }),
  watch:{
    resultText:'changeText'
  },
  components: {
    cButton
  }
}
</script>


<style lang="less" scoped>
@import '../../style/color.less';
.button-test {
  .btn-group, .test-result {
    text-align: center;
  }
}
</style>