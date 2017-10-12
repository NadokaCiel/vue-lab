<template>
  <div class="character-list">
    <div class="tool">
      <el-button type="primary" icon="plus" @click="toAdd"></el-button>
    </div>
    <el-table class="my-list" :data="list" border :highlight-current-row="true">
      <el-table-column prop="name" label="Name">
      </el-table-column>
      <el-table-column prop="type" label="Type" width="200">
        <template scope="scope">
          <el-tag class="tag" :class="[typeMap[type]]" type="success" close-transition v-for="type in scope.row.types" :key="type">{{type}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Create Time" width="200">
        <template scope="scope">
          {{scope.row.Created_date | date}}
        </template>
      </el-table-column>
      <el-table-column label="Operation" width="200">
        <template scope="scope">
          <el-button class="line-btn" type="text" size="mini" @click="toEdit(scope.row._id)">Edit</el-button>
          <!-- <el-button type="text" size="small" @click="deleteLine(scope.row)">Delete</el-button> -->
          <el-popover width="160" v-model="scope.row.showDelete">
            <p>确定删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.showDelete = false">取消</el-button>
              <el-button type="text" size="mini" @click="deleteLine(scope.row)">确定</el-button>
            </div>
            <el-button class="line-btn" type="text" size="mini" slot="reference">Delete</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="tool" @size-change="sizeChange" @current-change="pageChange" :current-page="page" :page-sizes="[5, 10, 15, 20]" :page-size="size" layout="total, sizes, prev, pager, next" :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { mapState } from 'vuex'                     
export default {
  name: 'character-list',
  created: function() {
    let vm = this
    vm.getList()
  },
  data() {
    return {
      typeMap:{
        "physical":"physical",
        "spell":"spell",
        "supporter":"supporter"
      },
      list:[],
      page:1,
      total:0,
      size:10
    }
  },
  methods: {
    toAdd() {
      const vm = this
      vm.$router.push({
        name: 'Character-Edit',
        params:{id:0}
      })
    },
    toEdit(id) {
      const vm = this
      vm.$router.push({
        name: 'Character-Edit',
        params:{id}
      })
    },
    sizeChange(size){
      this.size = size
      this.getList()
    },
    pageChange(page){
      this.page = page
      this.getList()
    },
    getList() {
      const vm = this
      vm.$ajax('get', '/api/character', {
        page: vm.page,
        size: vm.size
      }, data => {
        data.list.forEach(i=>{
          i.showDelete = false
        })
        vm.list = data.list
        vm.total = data.total
        console.log(data)
      }, error => {
        console.log(error)
      })
    },
    deleteLine(line){
      const vm = this
      let id = line._id
      return vm.$ajax('delete', '/api/character/'+id,{}, data => {
        vm.getList()
      }, error => {
        console.log(error)
      })
    }
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
.character-list {
  .tool{
    margin: 20px auto;
    width: 80%;
  }
  .my-list{
    text-align: center;
    margin: 20px auto;
    width: 80%;
    .tag{
      margin:4px;
      &.physical{
        color:@linkline;
        background-color: @co3;
        border-color: @linkline;
      }
      &.spell{
        color:@co16;
        background-color: @co13;
        border-color: @co16;
      }
      &.supporter{
        color:@co14;
        background-color: @co12;
        border-color: @co14;
      }
    }
    .line-btn{
      margin:0 10px;
    }
  }
}
</style>