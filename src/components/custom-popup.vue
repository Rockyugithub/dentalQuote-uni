<template>
  <!-- 黑色半透明背景层 -->
  <view
    v-if="modelValue"
    class="popup-mask"
    :style="{ zIndex }"
    @click="handleMaskClick"
  >
    <!-- 内容容器（阻止事件冒泡） -->
    <view
      class="popup-content"
      :style="contentStyle"
      @click.stop
    >
      <!-- 插槽内容 -->
      <slot></slot>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 控制显示/隐藏（v-model）
  modelValue: {
    type: Boolean,
    default: false
  },
  // 点击遮罩层是否可关闭
  maskClosable: {
    type: Boolean,
    default: true
  },
  // 内容区域自定义样式
  contentStyle: {
    type: Object,
    default: () => ({})
  },
  // 层级控制
  zIndex: {
    type: Number,
    default: 999
  }
})

const emit = defineEmits([
  'update:modelValue', // 用于v-model
  'close' // 关闭事件
])

// 关闭弹窗方法
const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

// 暴露方法给父组件
defineExpose({
  closePopup: close
})

// 处理遮罩层点击
const handleMaskClick = () => {
  if (props.maskClosable) {
    close()
  }
}

// 计算最终内容样式（合并默认样式和传入样式）
const finalContentStyle = computed(() => ({
  borderRadius: '32rpx',
  backgroundColor: '#fff',
  ...props.contentStyle
}))
</script>

<style scoped>
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-content {
  width: 80%;
  max-width: 600rpx;
  padding: 40rpx;
  box-sizing: border-box;
  animation: popup-fade 0.3s ease-out;
}

@keyframes popup-fade {
  0% {
    opacity: 0;
    transform: translateY(100rpx);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>