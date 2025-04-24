<template>
  <view class="form-container">
    <!-- 弹窗标题 -->
    <view class="form-header">
      <text class="title">新增用户</text>
      <uni-icons 
        type="close" 
        size="24" 
        color="#999" 
        @click="closeForm"
      />
    </view>

    <!-- 表单主体 -->
    <view class="form-body">
      <view class="form-item">
        <text class="label">用户名</text>
        <input 
          v-model="form.username" 
          placeholder="请输入用户名" 
          class="input"
        />
      </view>

      <view class="form-item">
        <text class="label">密码</text>
        <input 
          v-model="form.password" 
          placeholder="请输入密码" 
          password 
          class="input"
        />
      </view>

      <view class="form-item">
        <text class="label">用户角色</text>
        <picker 
          mode="selector" 
          :range="roles" 
          range-key="label"
          @change="onRoleChange"
        >
          <view class="picker">
            {{ form.role.label || '请选择角色' }}
            <uni-icons type="arrowright" size="16" color="#999" />
          </view>
        </picker>
      </view>
    </view>

    <!-- 提交按钮 -->
    <button 
      class="submit-btn" 
      :loading="loading"
      @click="handleSubmit"
    >
      确认添加
    </button>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { create } from '@/api/auth'

const emit = defineEmits(['success', 'close'])

const form = ref({
  username: '',
  password: '',
  role: { value: 'user', label: '普通用户' }
})

const roles = ref([
  { value: 'user', label: '普通用户' },
  { value: 'admin', label: '管理员' }
])

const loading = ref(false)

const onRoleChange = (e) => {
  form.value.role = roles.value[e.detail.value]
}

const handleSubmit = async () => {
  if (!form.value.username || !form.value.password) {
    return uni.showToast({ title: '请填写完整信息', icon: 'none' })
  }

  loading.value = true
  try {
    await create(form.value)
    uni.showToast({ title: '添加成功' })
    emit('success')
    closeForm() // 添加成功后关闭表单
  } catch (e) {
    uni.showToast({ title: e.message || '添加失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const closeForm = () => {
  // 重置表单
  form.value = {
    username: '',
    password: '',
    role: { value: 'user', label: '普通用户' }
  }
  emit('close') // 触发关闭事件
}
</script>

<style lang="scss">
.form-container {
  padding: 30rpx;
  background: white;
  border-radius: 16rpx;

  .form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40rpx;

    .title {
      font-size: 36rpx;
      font-weight: bold;
    }
  }

  .form-body {
    .form-item {
      margin-bottom: 30rpx;

      .label {
        display: block;
        margin-bottom: 15rpx;
        font-size: 28rpx;
        color: #666;
      }

      .input {
        width: 90%;
        height: 80rpx;
        padding: 0 20rpx;
        border: 1rpx solid #eee;
        border-radius: 8rpx;
        font-size: 28rpx;
      }

      .picker {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 80rpx;
        padding: 0 20rpx;
        border: 1rpx solid #eee;
        border-radius: 8rpx;
        color: #333;
      }
    }
  }

  .submit-btn {
    margin-top: 50rpx;
    height: 90rpx;
    line-height: 90rpx;
    background: linear-gradient(90deg, #4a90e2, #5aa0ff);
    color: white;
    border-radius: 45rpx;
    font-size: 32rpx;
  }
}
</style>