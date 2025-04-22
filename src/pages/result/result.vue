<template>
    <view class="result-container">
      <view class="result-header">
        <text>计算结果</text>
        <text>还款方式：{{repaymentType}}</text>
      </view>
      
      <view class="result-item">
        <text>月供</text>
        <text>{{monthlyPayment}}元</text>
      </view>
      
      <view class="result-item">
        <text>还款总额</text>
        <text>{{totalPayment}}元</text>
      </view>
      
      <view class="result-item">
        <text>支付利息</text>
        <text>{{totalInterest}}元</text>
      </view>
      
      <view class="back-btn" @click="goBack">返回</view>
    </view>
  </template>
  
  <script>
  export default {
    data() {
      return {
        repaymentType: '',
        monthlyPayment: '',
        totalPayment: '',
        totalInterest: ''
      }
    },
    onLoad(options) {
      this.repaymentType = options.type
      this.monthlyPayment = options.payment
      this.totalPayment = options.total
      this.totalInterest = options.interest
    },
    methods: {
      goBack() {
        uni.navigateBack()
      }
    }
  }
  </script>
  
  <style>
  .result-container {
    padding: 20px;
  }
  
  .result-header {
    margin-bottom: 30px;
  }
  
  .result-header text:first-child {
    display: block;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .result-item {
    display: flex;
    justify-content: space-between;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
  }
  
  .back-btn {
    margin-top: 40px;
    background-color: #1a8cff;
    color: #fff;
    text-align: center;
    padding: 15px 0;
    border-radius: 4px;
  }
  </style>