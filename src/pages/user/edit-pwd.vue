<template>
    <view class="form-container">
      <!-- 弹窗标题 -->
      <view class="form-header">
        <text class="title">修改密码</text>
        <uni-icons 
          type="close" 
          size="24" 
          color="#999" 
          @click="closeForm"
        />
      </view>
  
      <!-- 当前用户信息 -->
      <view class="current-user">
        <text>用户：{{ user.username }}</text>
        <text class="role-tag" :class="user.role">
          {{ user.role === 'admin' ? '管理员' : '普通用户' }}
        </text>
      </view>
  
      <!-- 表单主体 -->
      <view class="form-body">
        <view class="form-item">
          <text class="label">新密码</text>
          <input 
            v-model="password" 
            placeholder="请输入新密码" 
            password 
            class="input"
          />
        </view>
  
        <view class="form-item">
          <text class="label">确认密码</text>
          <input 
            v-model="confirmPassword" 
            placeholder="请再次输入密码" 
            password 
            class="input"
          />
        </view>
      </view>
  
      <!-- 提交按钮 -->
      <button 
        class="submit-btn" 
        :loading="loading"
        @click="handleSubmit"
      >
        确认修改
      </button>
    </view>
  </template>
  
  <script setup>
  import { ref, defineProps } from 'vue'
  import { updatePassword } from '@/api/auth'
  const props = defineProps({
    user: {
      type: Object,
      required: true
    }
  })
  
  const emit = defineEmits(['success', 'close'])
  
  const password = ref('')
  const confirmPassword = ref('')
  const loading = ref(false)
  
  const handleSubmit = async () => {
    if (!password.value || !confirmPassword.value) {
      return uni.showToast({ title: '请输入完整密码', icon: 'none' })
    }
  
    if (password.value !== confirmPassword.value) {
      return uni.showToast({ title: '两次密码不一致', icon: 'none' })
    }
  
    loading.value = true
    try {
      await updatePassword({userId: props.user.id, newPassword:password.value})
      emit('success')
      uni.showToast({ title: '修改成功' })
      closeForm()
    } catch (e) {
      uni.showToast({ title: e.message || '修改失败', icon: 'none' })
    } finally {
      loading.value = false
    }
  }
  
  const closeForm = () => emit('close')
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
      margin-bottom: 30rpx;
  
      .title {
        font-size: 36rpx;
        font-weight: bold;
      }
    }
  
    .current-user {
      display: flex;
      align-items: center;
      margin-bottom: 30rpx;
      padding-bottom: 20rpx;
      border-bottom: 1rpx dashed #eee;
  
      .role-tag {
        margin-left: 20rpx;
        padding: 4rpx 12rpx;
        border-radius: 6rpx;
        font-size: 24rpx;
  
        &.admin {
          background: #e6f7ff;
          color: #1890ff;
        }
  
        &.user {
          background: #f6ffed;
          color: #52c41a;
        }
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