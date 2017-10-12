<template>
  <el-button :type="type" :size="size" :icon="icon" :nativeType="nativeType" :loading="innerLoading" :disabled="disabled" :plain="plain" :autofocus="autofocus" @click="handleClick">
    <span v-if="$slots.default"><slot></slot></span>
  </el-button>
</template>

<script>
export default {
  props: {
    clickFunc: {
      type: Array,
      default: () => {
        return []
      }
    },
    type: {
      type: String,
      default: 'default'
    },
    size: String,
    icon: {
      type: String,
      default: ''
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean
  },
  data() {
    return {
      innerLoading: false
    }
  },
  methods: {
    async handleClick(evt) {
      let vm = this
      if (vm.clickFunc.length > 0) {
        vm.innerLoading = true
        try {
          await vm.clickFunc[0](...vm.clickFunc.slice(1))
        } catch (e) {
          console.error(e)
        }
        vm.innerLoading = false
      }
    }
  }
}
</script>