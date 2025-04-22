<template>
    <view class="login-container">
      <image src="/static/logo.png" mode="aspectFit"></image>
      <view class="form">
        <input 
          v-model="form.username" 
          placeholder="请输入用户名" 
          class="input"
        />
        <input 
          v-model="form.password" 
          placeholder="请输入密码" 
          password 
          class="input"
        />
        <button 
          @click="handleLogin" 
          :loading="loading"
          class="login-btn"
        >登录</button>
      </view>
    </view>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const form = ref({
    username: '',
    password: ''
  })
  const loading = ref(false)
  
  const handleLogin = async () => {
    if (!form.value.username || !form.value.password) {
      return uni.showToast({ title: '请填写完整信息', icon: 'none' })
    }
  
    loading.value = true
    
    // 模拟登录逻辑（实际项目替换为API调用）
    const isAdmin = form.value.username === 'admin'
    const role = isAdmin ? 'admin' : 'user'
    
    // 存储用户信息
    uni.setStorageSync('userRole', role)
  
    loading.value = false
    uni.redirectTo({ url: "/pages/home/home" })
  }
  
  </script>
  
  <style>
  .login-container {
    padding: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .input {
    width: 100%;
    height: 80rpx;
    margin-bottom: 30rpx;
    padding: 0 20rpx;
    border: 1px solid #ddd;
    border-radius: 8rpx;
  }
  .login-btn {
    width: 100%;
    background-color: #4a90e2;
    color: white;
  }
  </style>