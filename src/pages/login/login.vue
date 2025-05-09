<template>
  <view class="login-container">
    <view class="login-card">
      <view class="logo-area">
        <image src="/static/logo.png" mode="aspectFit" class="logo"></image>
        <text class="welcome-text">泽兴口腔报价系统</text>
      </view>
      
      <view class="form-container">
        <view class="input-group">
          <text class="input-label">用户名</text>
          <input 
            v-model="form.name" 
            placeholder="请输入用户名" 
            class="input-field"
            placeholder-class="placeholder"
          />
        </view>
        
        <view class="input-group">
          <text class="input-label">密码</text>
          <input 
            v-model="form.password" 
            type="password" 
            placeholder="请输入密码" 
            class="input-field"
            placeholder-class="placeholder"
          />
        </view>
        
        <button 
          @click="handleLogin" 
          :disabled="loading" 
          class="login-btn"
          hover-class="btn-hover"
        >
          {{ loading ? '登录中...' : '立即登录' }}
          <view class="btn-icon">→</view>
        </button>
      </view>
      
      <view class="footer-links">
        <text @click="navTo('register')">注册账号</text>
        <text @click="navTo('forget')">忘记密码</text>
      </view>
    </view>
    
    <view class="bg-decoration">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
      <view class="circle circle-3"></view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const loading = ref(false)
const form = ref({
  name: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.value.name || !form.value.password) {
    uni.showToast({ title: '请输入用户名和密码', icon: 'none' })
    return
  }
  
  try {
    loading.value = true
    await userStore.login(form.value)
    uni.showToast({ title: '登录成功' })
    uni.redirectTo({ url: '/pages/home/home' })
  } catch (err) {
    console.error('登录失败:', err)
    uni.showToast({ title: err.message || '登录失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const navTo = (type) => {
  const routes = {
    register: '/pages/register/register',
    forget: '/pages/forget/forget'
  }
  uni.navigateTo({ url: routes[type] })
}
</script>

<style>
/* 颜色变量 */
:root {
  --primary-color: #4361ee;
  --secondary-color: #f8f9fa;
  --accent-color: #4895ef;
  --text-color: #2b2d42;
  --light-text: #8d99ae;
  --border-color: #edf2f4;
  --card-bg: rgba(255, 255, 255, 0.95);
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

/* 基础样式 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f7ff 0%, #e9f0ff 100%);
  position: relative;
  overflow: hidden;
  padding: 20rpx;
}

/* 背景装饰元素 */
.bg-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(67, 97, 238, 0.05);
}

.circle-1 {
  width: 400rpx;
  height: 400rpx;
  top: -100rpx;
  right: -100rpx;
}

.circle-2 {
  width: 300rpx;
  height: 300rpx;
  bottom: 50rpx;
  left: -50rpx;
}

.circle-3 {
  width: 200rpx;
  height: 200rpx;
  bottom: 150rpx;
  right: 50rpx;
}

/* 登录卡片 */
.login-card {
  width: 90%;
  max-width: 600rpx;
  background: var(--card-bg);
  border-radius: 24rpx;
  padding: 60rpx 50rpx;
  box-shadow: var(--shadow);
  z-index: 1;
  backdrop-filter: blur(10px);
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
}

.logo {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
}

.welcome-text {
  font-size: 40rpx;
  color: var(--text-color);
  font-weight: 500;
  letter-spacing: 1rpx;
}

/* 表单样式 */
.form-container {
  width: 100%;
}

.input-group {
  margin-bottom: 40rpx;
}

.input-label {
  display: block;
  font-size: 28rpx;
  color: var(--text-color);
  margin-bottom: 16rpx;
  font-weight: 500;
}

.input-field {
  width: 100%;
  height: 100rpx;
  border: 1px solid var(--border-color);
  border-radius: 12rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  color: var(--text-color);
  transition: all 0.3s;
  background: var(--secondary-color);
}

.input-field:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
}

.placeholder {
  color: var(--light-text);
  font-size: 28rpx;
}

/* 按钮样式 */
.login-btn {
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  color: black;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 500;
  letter-spacing: 2rpx;
  border-color: black;
  margin-top: 40rpx;
  transition: all 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40rpx;
}

.btn-hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
}

.btn-icon {
  font-size: 40rpx;
  font-weight: bold;
}

.login-btn[disabled] {
  background: #adb5bd;
  transform: none !important;
  box-shadow: none !important;
}

/* 底部链接 */
.footer-links {
  display: flex;
  justify-content: space-between;
  margin-top: 50rpx;
  font-size: 26rpx;
}

.footer-links text {
  color: var(--light-text);
  transition: color 0.3s;
}

.footer-links text:active {
  color: var(--primary-color);
}

/* 响应式设计 */
@media (min-width: 768px) {
  .login-card {
    padding: 80rpx 70rpx;
  }
  
  .input-field {
    height: 110rpx;
    font-size: 32rpx;
  }
  
  .login-btn {
    height: 110rpx;
    line-height: 110rpx;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-card {
  animation: fadeInUp 0.6s ease-out;
}
</style>