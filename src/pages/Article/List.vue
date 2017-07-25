<template>
  <div class="article-list">                
  </div>
</template>


<script>
import { mapState } from 'vuex'                     
export default {
  name: 'article-list',
  created: function() {
    let vm = this
  },
  data() {
    return {
    }
  },
  methods: {
  },
  computed: mapState({}),
  watch:{
  },
  components: {
  }
}
</script>


<style lang="less" scoped>
@import '../../style/color.less';
.article-list {
}
</style>