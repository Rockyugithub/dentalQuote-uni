<template>
    <view class="container">
      <!-- 顶部标题 -->
      <view class="header">
        <button class="refresh-btn" @click="fetchData">刷新数据</button>
      </view>
  
      <!-- 项目列表 -->
      <view class="project-list" v-if="projects.length > 0">
        <view 
          v-for="project in projects" 
          :key="project.projectId" 
          class="project-item"
        >
          <view class="project-header" @click="toggleExpand(project.projectId)">
            <view class="project-select">
              <checkbox 
                :checked="isProjectSelected(project.projectId)"
                @click.stop="toggleProjectSelect(project.projectId)"
              />
              <text class="selected-count" v-if="getSelectedProductCount(project.projectId) > 0">
                ({{ getSelectedProductCount(project.projectId) }})
              </text>
            </view>
            <text class="project-name">{{ project.projectName }}</text>
            <view class="expand-icon">
              <uni-icons :type="project.expanded ? 'minus' : 'plus'" size="16"></uni-icons>
            </view>
          </view>
          
          <!-- 产品列表 -->
          <view class="product-list" v-if="project.expanded">
            <view 
              v-for="product in project.products" 
              :key="product.productId" 
              class="product-item"
            >
              <view class="product-select">
                <checkbox 
                  :checked="product.selected"
                  @click.stop="toggleProductSelect(product.productId)"
                />
              </view>
              <view class="product-info">
                <text class="product-name">{{ product.productName }}</text>
                <text class="product-price">¥{{ product.price.toFixed(2) }}</text>
              </view>
              <view class="product-quantity">
                <button 
                  size="mini" 
                  :disabled="product.quantity <= 1"
                  @click="updateQuantity(product.productId, -1)"
                >-</button>
                <input 
                  type="number" 
                  v-model.number="product.quantity" 
                  min="1"
                  class="quantity-input"
                  @change="validateQuantity(product)"
                />
                <button 
                  size="mini" 
                  @click="updateQuantity(product.productId, 1)"
                >+</button>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="empty-tip">
        <text v-if="loading">数据加载中...</text>
        <text v-else>暂无项目数据</text>
      </view>
      
      <!-- 报价区 -->
      <view class="quote-section">
        <view class="quote-item">
          <text>成本总价:</text>
          <text>¥{{ totalCost.toFixed(2) }}</text>
        </view>
        <view class="quote-item">
          <text>市场销售价:</text>
          <input 
            type="number" 
            v-model.number="marketPrice" 
            placeholder="输入价格"
            class="price-input"
          />
        </view>
        <view class="quote-item">
          <text>实际成交价:</text>
          <input 
            type="number" 
            v-model.number="actualPrice" 
            placeholder="输入价格"
            class="price-input"
          />
        </view>
        <view class="quote-item profit">
          <text>预计利润:</text>
          <text :class="{ 'negative': profit < 0 }">
            ¥{{ profit.toFixed(2) }}
            <text v-if="profit !== 0" class="profit-percent">
              ({{ ((profit / totalCost) * 100).toFixed(1) }}%)
            </text>
          </text>
        </view>
      </view>
  
      <!-- 底部操作按钮 -->
      <view class="bottom-actions">
        <button class="reset-btn" @click="resetAll">重置</button>
        <button class="submit-btn" @click="submitQuote">生成报价单</button>
      </view>
       <!-- 权限控制按钮区域 -->
    <view class="permission-buttons" v-if="userRole">
      <button 
        class="permission-btn"
        v-if="userRole === 'admin'"
        @click="navigateToProduct"
      >
        产品管理
      </button>
      
      <button 
        class="permission-btn"
        v-if="userRole === 'admin'"
        @click="navigateToUser"
      >
        用户管理
      </button>
    </view>
    </view>
  </template>
  
  <script setup>
  import { ref, reactive, computed ,onMounted} from 'vue'
  import { onShow } from '@dcloudio/uni-app'
  
  // 项目数据（嵌套结构）
  const projects = reactive([])
  const loading = ref(false)
  
  // 价格数据
  const marketPrice = ref(0)
  const actualPrice = ref(0)

// 获取用户角色
const userRole = ref('')

onMounted(() => {
  // 从缓存中读取用户角色
  userRole.value = uni.getStorageSync('userRole') || ''
})

// 跳转到产品页
const navigateToProduct = () => {
  uni.navigateTo({
    url: '/pages/product/list'
  })
}

// 跳转到用户页
const navigateToUser = () => {
  uni.navigateTo({
    url: '/pages/user/user'
  })
}
  // 获取服务端数据
  const fetchData = async () => {
    loading.value = true
    try {
    //   const [res] = await uni.request({
    //     url: 'https://your-api-domain.com/api/projects-with-products',
    //     method: 'GET'
    //   })
      const productData = [
    {
      "projectId": 1,
      "projectName": "洗牙项目",
      "products": [
        {
          "productId": 1,
          "projectId": 1,
          "productName": "超声波洗牙",
          "price": 200.00,
          "description": "基础清洁"
        },
        {
          "productId": 2,
          "projectId": 1,
          "productName": "喷砂洁牙",
          "price": 350.00,
          "description": "深度清洁"
        }
      ]
    },
    {
      "projectId": 2,
      "projectName": "补牙项目",
      "products": [
        {
          "productId": 3,
          "projectId": 2,
          "productName": "树脂补牙",
          "price": 150.00,
          "description": "前牙修复"
        }
      ]
    }
  ]// res.data
      // 清空旧数据
      projects.splice(0, projects.length)
      
      // 转换数据结构
      productData.forEach(project => {
        projects.push({
          projectId: project.projectId,
          projectName: project.projectName,
          expanded: false,
          products: project.products.map(product => ({
            ...product,
            productId: product.productId || product.id, // 兼容不同字段名
            selected: false,
            quantity: 1
          }))
        })
      })
  
    } catch (error) {
      console.error('数据加载失败:', error)
      uni.showToast({ 
        title: '数据加载失败', 
        icon: 'none',
        duration: 2000
      })
    } finally {
      loading.value = false
    }
  }
  
  // 页面显示时加载数据
  onShow(() => {
    fetchData()
  })
  
  // 展开/折叠项目
  const toggleExpand = (projectId) => {
    const project = projects.find(p => p.projectId === projectId)
    if (project) project.expanded = !project.expanded
  }
  
  // 切换产品选择状态
  const toggleProductSelect = (productId) => {
    for (const project of projects) {
      const product = project.products.find(p => p.productId === productId)
      if (product) {
        product.selected = !product.selected
        if (product.selected && product.quantity < 1) {
          product.quantity = 1
        }
        break
      }
    }
  }
  
  // 切换项目选择状态
  const toggleProjectSelect = (projectId) => {
    const project = projects.find(p => p.projectId === projectId)
    if (!project) return
  
    const shouldSelect = !project.products.every(p => p.selected)
    project.products.forEach(product => {
      product.selected = shouldSelect
      if (product.selected && product.quantity < 1) {
        product.quantity = 1
      }
    })
  }
  
  // 更新产品数量
  const updateQuantity = (productId, delta) => {
    for (const project of projects) {
      const product = project.products.find(p => p.productId === productId)
      if (product) {
        product.quantity = Math.max(1, product.quantity + delta)
        if (!product.selected) product.selected = true
        break
      }
    }
  }
  
  // 验证数量输入
  const validateQuantity = (product) => {
    if (isNaN(product.quantity) || product.quantity < 1) {
      product.quantity = 1
    }
  }
  
  // 获取项目下已选产品数量
  const getSelectedProductCount = (projectId) => {
    const project = projects.find(p => p.projectId === projectId)
    return project ? project.products.filter(p => p.selected).length : 0
  }
  
  // 检查项目是否被选中
  const isProjectSelected = (projectId) => {
    const project = projects.find(p => p.projectId === projectId)
    return project ? project.products.some(p => p.selected) : false
  }
  
  // 重置所有选择
  const resetAll = () => {
    projects.forEach(project => {
      project.products.forEach(product => {
        product.selected = false
        product.quantity = 1
      })
    })
    marketPrice.value = 0
    actualPrice.value = 0
  }
  
  // 提交报价单
  const submitQuote = () => {
    const selectedProducts = []
    
    // 收集所有选中的产品
    projects.forEach(project => {
      project.products.forEach(product => {
        if (product.selected) {
          selectedProducts.push({
            projectId: project.projectId,
            productId: product.productId,
            name: product.productName,
            price: product.price,
            quantity: product.quantity
          })
        }
      })
    })
  
    if (selectedProducts.length === 0) {
      return uni.showToast({ title: '请至少选择一个产品', icon: 'none' })
    }
    
    // 提交到服务端
    uni.request({
      url: 'https://your-api-domain.com/api/quotes',
      method: 'POST',
      data: {
        products: selectedProducts,
        marketPrice: marketPrice.value,
        actualPrice: actualPrice.value,
        totalCost: totalCost.value
      },
      success: () => {
        uni.navigateTo({ url: '/pages/quote/success' })
      },
      fail: () => {
        uni.showToast({ title: '提交失败', icon: 'none' })
      }
    })
  }
  
  // 计算总成本
  const totalCost = computed(() => {
    return projects.reduce((sum, project) => {
      return sum + project.products.reduce((projSum, product) => {
        return projSum + (product.selected ? product.price * product.quantity : 0)
      }, 0)
    }, 0)
  })
  
  // 计算利润
  const profit = computed(() => {
    return actualPrice.value - totalCost.value
  })
  </script>
  
  <style >
  /* 样式与之前版本保持一致 */
  .container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header .title {
  font-size: 36px;
  font-weight: bold;
}

.header .refresh-btn {
  padding: 0 20px;
  height: 60px;
  line-height: 60px;
  font-size: 26px;
  background-color: #4a90e2;
  color: white;
  border-radius: 30px;
}

.action-bar {
  margin-bottom: 20px;
}

.import-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 14px;
}

.empty-tip {
  text-align: center;
  padding: 40px;
  color: #888;
}

.project-list {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.project-item {
  border-bottom: 1px solid #eee;
}

.project-header {
  display: flex;
  align-items: center;
  padding: 15px;
  cursor: pointer;
}

.project-select {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.project-name {
  flex: 1;
  font-size: 16px;
  font-weight: bold;
}

.expand-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #666;
}

.product-list {
  padding: 0 15px 15px 15px;
  background-color: #fafafa;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dashed #eee;
}

.product-info {
  flex: 1;
}

.product-quantity {
  display: flex;
  align-items: center;
}

.quantity-input {
  width: 50px;
  text-align: center;
  margin: 0 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 2px;
}

.quote-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
}

.quote-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.profit .negative {
  color: #f56c6c;
}

.permission-buttons {
  display: flex;
  justify-content: space-between;
  margin: 40rpx 0;
  gap: 20rpx; /* 按钮间距 */

}

.permission-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100rpx;
    border-radius: 16rpx;
    font-size: 30rpx;
  }
  </style>