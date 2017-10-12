<template>
  <div class="article-list">
    <el-table class="my-list" :data="list" border :highlight-current-row="true">
      <el-table-column fixed prop="id" label="ID" width="60">
      </el-table-column>
      <el-table-column prop="title" label="Title">
      </el-table-column>
      <el-table-column prop="tag" label="Tag" width="200">
        <template scope="scope">
          <el-tag class="tag" :class="[tagMap[tag]]" type="success" close-transition v-for="tag in scope.row.tag" :key="tag">{{tag}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="Author">
      </el-table-column>
      <el-table-column prop="createTime" label="Create Time" width="200">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button type="text" size="small">View</el-button>
          <el-button type="text" size="small">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
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
      tagMap:{
        "Lab":"lab",
        "Tech":"tech"
      },
      list:[{
        id:1,
        title:"我的实验室",
        createTime:"2017-08-15 17:50",
        creator:"Ciel",
        tag:["Lab","Tech"],
        category:["Top"]
      }]
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
  .my-list{
    text-align: center;
    margin: 20px auto;
    width: 80%;
    .tag{
      margin:4px;
      &.lab{
        color:@blue;
        background-color: @co6;
        border-color: @blue;
      }
      &.tech{
        color:@nav;
        background-color: @co13;
        border-color: @nav;
      }
    }
  }
}
</style>