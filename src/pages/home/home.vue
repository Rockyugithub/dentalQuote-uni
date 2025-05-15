<template>
  <view class="container">
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
            <uni-icons :type="project.expanded ? 'down' : 'up'" size="16"></uni-icons>
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
                @click.stop="toggleProductSelect(project.projectId,product.productId)"
              />
            </view>
            <view class="product-info">
              <text class="product-name">{{ product.productName }}</text>
              <text class="product-price">¥{{ product.price }}</text>
            </view>
            <view class="product-quantity">
              <button 
                size="mini" 
                :disabled="product.quantity <= 1"
                @click="updateQuantity(project.projectId,product.productId, -1)"
              >-</button>
              <input 
                type="number" 
                v-model.number="product.quantity" 
                min="1"
                class="quantity-input"
                @change="e => updateQuantity(project.projectId, product.productId, 0)"
              />
              <button 
                size="mini" 
                @click="updateQuantity(project.projectId,product.productId, 1)"
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
        <text>零售价:</text>
        <text>¥{{ totalCost }}</text>
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
      <view class="quote-item commission">
        <text>业务员佣金:</text>
        <text v-if="commission.message" class="warning">
          {{ commission.message }}
        </text>
        <text v-else class="amount">
          ¥{{ commission.value.toFixed(2) }}
        </text>
      </view>
    </view>

    <!-- 底部操作按钮 -->
    <view class="bottom-actions">
      <button class="reset-btn" @click="resetAll">重置</button>
      <button class="submit-btn" @click="submitQuote">生成报价单</button>
    </view>

    <!-- 报价单预览区域 -->
    <view class="preview-section" v-if="quoteImage">
    <image 
      :src="quoteImage" 
      mode="widthFix" 
      class="quote-image"
      :style="{height: canvasHeight + 'px'}"
      @click="downloadQuoteImage"
    ></image>
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

    <!-- 隐藏的Canvas元素 -->
    <canvas 
    canvas-id="quoteCanvas" 
    style="position: fixed; top: -9999px; left: -9999px; width: 100%;"
    :style="{height: canvasHeight + 'px'}"
  ></canvas>
  </view>
</template>

<script setup>
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getAllProject } from '@/api/project'

// 项目数据
const projects = reactive([])
const loading = ref(false)
const quoteImage = ref('')
const actualPrice = ref(0)

// 用户角色相关
const user = ref()
const userRole = ref()
// 添加canvas高度响应式变量
const canvasHeight = ref(800) // 初始值，会被动态计算覆盖
// 初始化
onMounted(() => {
  user.value = uni.getStorageSync('userInfo')
  userRole.value = user.value?.role?.value
  setupListeners()
})

onUnmounted(() => {
  cleanupListeners()
})

// 事件监听
const setupListeners = () => {
  uni.$on('productUpdated', fetchData)
}

const cleanupListeners = () => {
  uni.$off('productUpdated', fetchData)
}

// 数据获取
const fetchData = async () => {
  loading.value = true
  const res = await getAllProject()
  const productData = res.data
  projects.splice(0, projects.length)
  
  productData.forEach(project => {
    projects.push({
      projectId: project.id,
      projectName: project.name,
      expanded: false,
      products: project.products.map(product => ({
        ...product,
        projectId: project.id,
        productId: product.id,
        productName: product.name,
        selected: false,
        quantity: 1
      }))
    })
  })
  loading.value = false
}

onShow(() => {
  fetchData()
})

// 项目操作
const toggleExpand = (projectId) => {
  const project = projects.find(p => p.projectId === projectId)
  if (project) project.expanded = !project.expanded
}

const toggleProductSelect = (projectId, productId) => {
  const project = projects.find(p => p.projectId === projectId)
  if (!project) return
  
  const product = project.products.find(p => p.productId === productId)
  if (product) {
    product.selected = !product.selected
    if (product.selected && (!product.quantity || product.quantity < 1)) {
      product.quantity = 1
    }
  }
}

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

// 数量操作
const updateQuantity = (projectId, productId, delta) => {
  const project = projects.find(p => p.projectId === projectId)
  if (!project) return
  
  const product = project.products.find(p => p.productId === productId)
  if (product) {
    const newQuantity = Math.max(1, (product.quantity || 0) + delta)
    product.quantity = newQuantity
    
    if (!product.selected) {
      product.selected = true
    }
  }
}

// 辅助函数
const getSelectedProductCount = (projectId) => {
  const project = projects.find(p => p.projectId === projectId)
  return project ? project.products.filter(p => p.selected).length : 0
}

const isProjectSelected = (projectId) => {
  const project = projects.find(p => p.projectId === projectId)
  return project ? project.products.some(p => p.selected) : false
}

// 重置
const resetAll = () => {
  projects.forEach(project => {
    project.products.forEach(product => {
      product.selected = false
      product.quantity = 1
    })
  })
  actualPrice.value = 0
  quoteImage.value = ''
}

// 导航
const navigateToProduct = () => {
  uni.navigateTo({
    url: '/pages/product/list'
  })
}

const navigateToUser = () => {
  uni.navigateTo({
    url: '/pages/user/user'
  })
}

// 新增下载功能
const downloadQuoteImage = () => {
  if (!quoteImage.value) return
  
  uni.showLoading({ title: '保存中...', mask: true })
  uni.saveImageToPhotosAlbum({
    filePath: quoteImage.value,
    success: () => {
      uni.hideLoading()
      uni.showToast({ title: '保存成功', icon: 'success' })
    },
    fail: (err) => {
      console.error('保存失败:', err)
      uni.hideLoading()
      
      // 处理iOS权限问题
      if (err.errMsg.includes('authorize')) {
        uni.showModal({
          title: '需要相册权限',
          content: '请允许访问相册以保存图片',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting() // 引导用户打开设置
            }
          }
        })
      } else {
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    }
  })
}

// 报价单生成
const submitQuote = async () => {
  try {
    uni.showLoading({ title: '生成报价单中...', mask: true })
    
    // 1. 收集产品和计算基础高度
    const selectedProducts = []
    const baseHeights = {
      header: 100,  // 标题+表头高度
      footer: 120,  // 汇总信息高度
      row: 20       // 每行产品高度
    }
    
    projects.forEach(project => {
      project.products.forEach(product => {
        if (product.selected) {
          selectedProducts.push({
            projectName: project.projectName,
            productName: product.productName,
            price: product.price,
            quantity: product.quantity,
            subtotal: (product.price * product.quantity).toFixed(2)
          })
        }
      })
    })

    if (selectedProducts.length === 0) {
      uni.hideLoading()
      return uni.showToast({ title: '请至少选择一个产品', icon: 'none' })
    }

    // 2. 动态计算Canvas尺寸
    const systemInfo = uni.getSystemInfoSync()
    const canvasWidth = systemInfo.windowWidth * 0.95
    canvasHeight.value = baseHeights.header + 
                        (selectedProducts.length * baseHeights.row) + 
                        baseHeights.footer
    
    // 3. 创建Canvas上下文
    const context = uni.createCanvasContext('quoteCanvas', this)
    
    // 4. 绘制背景（使用动态高度）
    context.setFillStyle('#ffffff')
    context.fillRect(0, 0, canvasWidth, canvasHeight.value)
    
    // 5. 绘制标题（位置根据动态高度调整）
    context.setFontSize(20)
    context.setFillStyle('#333333')
    context.setTextAlign('center')
    context.fillText('报价单', canvasWidth / 2, 30)
    
    // 6. 绘制表头（保持原有逻辑，位置动态计算）
    context.setFontSize(14)
    context.setFillStyle('#666666')
    context.setTextAlign('left')
    const columnWidth = canvasWidth / 5
    const headers = ['项目名称', '产品名称', '单价', '数量', '小计']
    const headerY = 60
    
    headers.forEach((text, index) => {
      const x = index * columnWidth + 10
      context.fillText(text, x, headerY)
    })
    
    // 7. 绘制产品行（动态计算Y坐标）
    let currentY = headerY + 30
    selectedProducts.forEach((product) => {
      context.setFontSize(12)
      context.setFillStyle('#333333')
      
      // 项目名称
      context.fillText(product.projectName, 10, currentY)
      // 产品名称
      context.fillText(product.productName, columnWidth + 10, currentY)
      // 单价
      context.setTextAlign('right')
      context.fillText(`¥${product.price}`, columnWidth * 2 + 10, currentY)
      // 数量
      context.setTextAlign('center')
      context.fillText(product.quantity.toString(), columnWidth * 3 + 10, currentY)
      // 小计
      context.setTextAlign('right')
      context.fillText(`¥${product.subtotal}`, columnWidth * 4 + 10, currentY)
      
      context.setTextAlign('left')
      currentY += baseHeights.row
    })
    
    // 8. 绘制汇总信息（位置动态计算）
    const summaryY = currentY + 20
    context.setFontSize(14)
    
    // 零售价总计
    context.fillText('零售价总计:', 10, summaryY)
    context.setTextAlign('right')
    context.fillText(`¥${totalCost.value.toFixed(2)}`, canvasWidth - 10, summaryY)
    
    // 实际成交价
    context.setTextAlign('left')
    context.fillText('实际成交价:', 10, summaryY + 25)
    context.setTextAlign('right')
    context.fillText(`¥${actualPrice.value.toFixed(2)}`, canvasWidth - 10, summaryY + 25)
    
    // 业务员佣金
    context.setTextAlign('left')
    context.fillText('业务员佣金:', 10, summaryY + 50)
    context.setTextAlign('right')
    if (commission.value?.message) {
  // 显示错误消息（红色）
  context.setFillStyle('#f56c6c') // 红色
  context.fillText(commission.value.message, canvasWidth - 10, summaryY + 50)
} else {
  // 正常显示佣金金额
  const commissionValue = typeof commission.value === 'object' ? 
                         commission.value.value : 
                         (typeof commission.value === 'number' ? commission.value : 0)
  context.setFillStyle('#333333') // 恢复默认颜色
  context.fillText(`¥${commissionValue.toFixed(2)}`, canvasWidth - 10, summaryY + 50)
}
   
    // 生成时间
    context.setFontSize(12)
    context.setFillStyle('#888888')
    context.setTextAlign('right')
    context.fillText(`生成时间: ${new Date().toLocaleString()}`, canvasWidth - 10, summaryY + 80)
    
    // 9. 绘制边框（使用动态高度）
    context.setStrokeStyle('#eaeaea')
    context.strokeRect(5, 5, canvasWidth - 10, canvasHeight.value - 10)
    
    // 10. 生成图片
    context.draw(false, () => {
      setTimeout(() => {
        uni.canvasToTempFilePath({
          canvasId: 'quoteCanvas',
          success: (res) => {
            // 确保生成的临时路径可用
            uni.getFileSystemManager().saveFile({
              tempFilePath: res.tempFilePath,
              success: (savedRes) => {
                quoteImage.value = savedRes.savedFilePath // 使用持久化路径
                uni.hideLoading()
              },
              fail: () => {
                quoteImage.value = res.tempFilePath // 降级使用临时路径
                uni.hideLoading()
              }
            })
          },
          fail: (err) => {
            console.error('生成失败:', err)
            uni.hideLoading()
            uni.showToast({ title: '生成失败', icon: 'none' })
          }
        }, this)
      }, 500)
    })
    
  } catch (error) {
    console.error('生成出错:', error)
    uni.hideLoading()
    uni.showToast({ title: '生成失败', icon: 'none' })
  }
}
// 计算属性
const totalCost = computed(() => {
  return projects.reduce((sum, project) => {
    return sum + project.products.reduce((projSum, product) => {
      return projSum + (product.selected ? product.price * product.quantity : 0)
    }, 0)
  }, 0)
})

const operatingCost = computed(() => {
  return totalCost.value > 0 ? (totalCost.value * 0.65).toFixed(2) : 0
})

const retailPrice = computed(() => {
  return totalCost.value 
})

const commission = computed(() => {
  const A = retailPrice.value
  const B = operatingCost.value
  const C = actualPrice.value
  
  const profit = A - B
  const excess = C - B

  if (B > C) {
    return { value: 0, message: `请业务员补足成本${(B-C).toFixed(2)}` }
  }
  if (C === B) {
    return { value: B * 0.1, message: '' }
  }
  if (excess > 0 && excess <= profit * 0.6) {
    return { value: B * 0.1 + excess * 0.4, message: '' }
  }
  if (excess > profit * 0.6 && excess <= profit) {
    return { 
      value: B * 0.1 + (profit * 0.6 * 0.4) + (excess - profit * 0.6) * 0.6,
      message: '' 
    }
  }
  return { 
    value: B * 0.1 + (profit * 0.6 * 0.4) + (profit * 0.4 * 0.6) + (C - A) * 0.65,
    message: '' 
  }
})
</script>

<style>
.container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f5f5;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
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

.bottom-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.reset-btn {
  background-color: #f0f0f0;
  color: #333;
  flex: 1;
  margin-right: 10px;
}

.submit-btn {
  background-color: #4a90e2;
  color: white;
  flex: 1;
}

/* 修改预览区域样式 */
.preview-section {
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.quote-image {
  width: 100%;
  display: block;
}

.download-tip {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.5);
  color: white;
  text-align: center;
  padding: 8px;
  font-size: 12px;
}

/* 添加点击反馈效果 */
.quote-image:active {
  opacity: 0.9;
  transform: scale(0.99);
  transition: all 0.2s;
}

.permission-buttons {
  display: flex;
  justify-content: space-between;
  margin: 40rpx 0;
  gap: 20rpx;
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

.commission {
  font-weight: bold;
  color: #4a90e2;
}

.warning {
  color: #f56c6c;
  font-weight: bold;
}

.amount {
  color: #67c23a;
  font-weight: bold;
}

.empty-tip {
  text-align: center;
  padding: 40px;
  color: #888;
}
</style>