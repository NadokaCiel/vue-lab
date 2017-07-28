<template>
  <el-menu default-active="1" class="nav" @mouseenter.native="showText=!showText" @mouseleave.native="showText=!showText" @select="menuSelected">
    <template v-for="item in menu">
      <el-menu-item v-if="!item.sub || item.sub.length==0" :index="item.route">
        <i :class="item.icon ? item.icon : 'el-icon-null'"></i>
        <span>{{showText ? item.name : ''}}</span>
      </el-menu-item>
      <el-submenu v-if="item.sub && item.sub.length!=0" :index="item.route">
        <template slot="title">
        <i :class="item.icon ? item.icon : 'el-icon-null'"></i>
        <span>{{showText ? item.name : ''}}</span>
        </template>
        <el-menu-item v-for="(subItem,index) in item.sub" :index="subItem.route" :key="index">
          <i :class="subItem.icon ? subItem.icon : 'el-icon-null'"></i>
          <span>{{showText ? subItem.name : ''}}</span>
        </el-menu-item>
      </el-submenu>
    </template>
  </el-menu>
</template>




<script>
import menuData from '../data/menu'
import { mapState } from 'vuex'
export default {
  name: 'nav',
  data() {
    return {
    	menu:menuData,
      showText:false
    }
  },
  created: function() {
  },
  methods:{
    menuSelected(index,path){
      this.$router.push({name:index})
    }
  },
  computed: mapState([]),
  components: {
  }
}
</script>

<style lang="less" scoped>
@import '../style/color.less';

.nav {
  width: 50px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  overflow-x: hidden;
  overflow-y: auto;
  transition: all .3s ease;

  &:hover {
    width: 200px;
  }
  [class*=" el-icon-"], [class^=el-icon-], [class*=" fa-"], [class^=fa-] {
    font-size: 16px;
  }
  .el-menu-item {
    padding-left: 18px !important;
  }
  .el-icon-null {
    display: inline-block;
    width: 16px;
    height: 16px;
  }
}
</style>
<style lang="less">
.nav {
  .el-submenu__title {
    .el-submenu__icon-arrow {
      visibility: hidden;
    }
  }
  &:hover {
    .el-submenu__title {
      .el-submenu__icon-arrow {
        visibility: visible;
      }
    }
  }
}
</style>