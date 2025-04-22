<template>
  <view class="container">
    <!-- 顶部选项卡 -->
    <!-- <view class="tabs">
      <view class="tab active">商业贷款计算器</view>
      <view class="tab">公积金贷款计算</view>
      <view class="tab">组合贷款计算器</view>
    </view> -->
    

        <!-- 贷款期限选择 -->
    <view class="input-group">
      <text class="label">项目名称</text>
      <picker mode="selector" :range="years" range-key="name" :value="yearIndex" @change="bindYearChange">
        <view class="picker">
          {{years[yearIndex].name}}（{{years[yearIndex].months}}期）
          <image src="/static/down.png" class="down-icon"></image>
        </view>
      </picker>
    </view>

    <!-- 贷款期限选择 -->
    <view class="input-group">
      <text class="label">产品型号</text>
      <picker mode="selector" :range="years" range-key="name" :value="yearIndex" @change="bindYearChange">
        <view class="picker">
          {{years[yearIndex].name}}（{{years[yearIndex].months}}期）
          <image src="/static/down.png" class="down-icon"></image>
        </view>
      </picker>
    </view>
    
        <!-- 贷款金额输入 -->
    <view class="input-group">
      <text class="label">建议零售价</text>
      <view class="input-box">
        <input type="number" placeholder="请输入金额" v-model="loanAmount" />
        <text class="unit">元</text>
      </view>
    </view>

    <view class="input-group">
      <text class="label">公司成本价</text>
      <view class="input-box">
        <input type="number" placeholder="请输入金额" v-model="loanAmount" />
        <text class="unit">元</text>
      </view>
    </view>

    <view class="input-group">
      <text class="label">实际成交价</text>
      <view class="input-box">
        <input type="number" placeholder="请输入金额" v-model="loanAmount" />
        <text class="unit">元</text>
      </view>
    </view>

    <!-- 利率选择 -->
    <view class="input-group">
      <text class="label">商贷利率</text>
      <picker mode="selector" :range="rates" range-key="name" :value="rateIndex" @change="bindRateChange">
        <view class="picker">
          {{rates[rateIndex].name}}
          <image src="/static/down.png" class="down-icon"></image>
        </view>
      </picker>
      <text class="rate-display">={{rates[rateIndex].value}}%</text>
    </view>
    
    <!-- 还款方式选择 -->
    <view class="input-group">
      <text class="label">还款方式</text>
      <view class="repayment-method">
        <view 
          class="method" 
          :class="{active: repaymentMethod === '等额本息'}" 
          @click="selectMethod('等额本息')"
        >等额本息</view>
        <view 
          class="method" 
          :class="{active: repaymentMethod === '等额本金'}" 
          @click="selectMethod('等额本金')"
        >等额本金</view>
      </view>
    </view>
    
    <!-- 计算按钮 -->
    <view class="calculate-btn" @click="calculate">计算</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 贷款年限选项
      years: [
        { name: '1年', months: 12 },
        { name: '5年', months: 60 },
        { name: '10年', months: 120 },
        { name: '15年', months: 180 },
        { name: '20年', months: 240 },
        { name: '25年', months: 300 },
        { name: '30年', months: 360 }
      ],
      yearIndex: 4, // 默认选中20年
      
      // 利率选项
      rates: [
        { name: '最新基准利率下', value: 4.9 },
        { name: '无折扣', value: 4.9 },
        { name: '9折', value: 4.41 },
        { name: '85折', value: 4.165 },
        { name: '8折', value: 3.92 },
        { name: '7折', value: 3.43 }
      ],
      rateIndex: 1, // 默认选中无折扣
      
      // 还款方式
      repaymentMethod: '等额本息',
      
      // 贷款金额
      loanAmount: 100
    }
  },
  methods: {
    // 贷款年限改变
    bindYearChange(e) {
      this.yearIndex = e.detail.value
    },
    
    // 利率改变
    bindRateChange(e) {
      this.rateIndex = e.detail.value
    },
    
    // 还款方式选择
    selectMethod(method) {
      this.repaymentMethod = method
    },
    
    // 计算按钮点击
    calculate() {
      const loanAmount = this.loanAmount * 10000 // 转换为元
      const months = this.years[this.yearIndex].months
      const rate = this.rates[this.rateIndex].value / 100 / 12 // 月利率
      
      if (this.repaymentMethod === '等额本息') {
        // 等额本息计算
        const monthlyPayment = loanAmount * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1)
        const totalPayment = monthlyPayment * months
        const totalInterest = totalPayment - loanAmount
        
        uni.navigateTo({
          url: `/pages/result/result?type=等额本息&payment=${monthlyPayment.toFixed(2)}&total=${totalPayment.toFixed(2)}&interest=${totalInterest.toFixed(2)}`
        })
      } else {
        // 等额本金计算
        const principal = loanAmount / months
        let totalInterest = 0
        let remaining = loanAmount
        
        for (let i = 0; i < months; i++) {
          totalInterest += remaining * rate
          remaining -= principal
        }
        
        const totalPayment = loanAmount + totalInterest
        const firstMonthPayment = principal + loanAmount * rate
        
        uni.navigateTo({
          url: `/pages/result/result?type=等额本金&payment=${firstMonthPayment.toFixed(2)}&total=${totalPayment.toFixed(2)}&interest=${totalInterest.toFixed(2)}`
        })
      }
    }
  }
}
</script>

<style>
.container {
  padding: 20px;
  background-color: #fff;
}

.tabs {
  display: flex;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 15px 0;
  color: #666;
}

.tab.active {
  color: #1a8cff;
  border-bottom: 2px solid #1a8cff;
}

.input-group {
  margin-bottom: 20px;
}

.label {
  display: block;
  margin-bottom: 10px;
  color: #333;
  font-size: 16px;
}

.input-box {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px 15px;
}

.input-box input {
  flex: 1;
  font-size: 16px;
}

.unit {
  margin-left: 10px;
  color: #666;
}

.picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px 15px;
}

.down-icon {
  width: 16px;
  height: 16px;
}

.rate-display {
  display: block;
  margin-top: 5px;
  color: #1a8cff;
  font-size: 15px;
}

.repayment-method {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.method {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  color: #666;
}

.method.active {
  background-color: #1a8cff;
  color: #fff;
}

.calculate-btn {
  margin-top: 30px;
  background-color: #1a8cff;
  color: #fff;
  text-align: center;
  padding: 15px 0;
  border-radius: 4px;
  font-size: 16px;
}
</style>