<template>
  <div class="character-edit">
    <el-form class="my-form" ref="form" :model="form" label-width="80px">
      <el-form-item label="Name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="Type">
        <el-select v-model="form.types" placeholder="choose a type" multiple>
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <c-button type="primary" :clickFunc="[save]">保存</c-button>
        <el-button @click="toList">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import cButton from '../../components/cButton.vue'
export default {
  name: 'character-edit',
  created: function() {
    let vm = this
    if(vm.$route.params && vm.$route.params.id){
      vm.id = vm.$route.params.id
      vm.getData()
    }
  },
  data() {
    return {
      id: 0,
      form: {
        name: '',
        types: [],
      },
      typeOptions:[{
        value:"physical",
        label:"Physical"
      },{
        value:"spell",
        label:"Spell"
      },{
        value:"supporter",
        label:"Supporter"
      }]
    }
  },
  methods: {
    toList() {
      const vm = this
      vm.$router.push({
        name: 'Character-List'
      })
    },
    getData(){
      const vm = this
      return vm.$ajax('get', '/api/character/'+vm.id,{}, data => {
        console.log(data)
        vm.form = data
      }, error => {
        console.log(error)
      })
    },
    save() {
      const vm = this
      if (vm.id) {
        return vm.$ajax('put', '/api/character/'+vm.id, vm.form, data => {
          vm.toList()
        }, error => {
          console.log(error)
        })
      } else {
        return vm.$ajax('post', '/api/character', vm.form, data => {
          vm.toList()
        }, error => {
          console.log(error)
        })
      }
    }
  },
  computed: mapState({}),
  watch: {},
  components: {
    cButton
  }
}
</script>


<style lang="less" scoped>
@import '../../style/color.less';
.character-edit {
  .my-form{
    margin: 20px auto;
    padding-right: 30%;
    width: 80%;
  }
}
</style>