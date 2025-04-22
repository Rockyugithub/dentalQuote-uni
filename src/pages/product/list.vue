<template>
    <view>
      <view v-if="role === 'admin'" class="add-btn">
        <button @click="goToAdd">添加产品</button>
      </view>
      

    </view>
  </template>
  
  <script>
  import api from '@/common/api'
  
  
  </script>