<template>
    <view class="container">
        <!-- 顶部操作栏 -->
    <view class="action-bar">
      <button class="import-btn" @click="importExcel">导入Excel数据</button>
    </view>
      <!-- 项目列表 -->
      <view class="project-list"  v-if="projects.length > 0">
        <view 
          v-for="project in projects" 
          :key="project.id" 
          class="project-item"
        >
          <view class="project-header" @click="toggleExpand(project.id)">
            <view class="project-select">
              <checkbox 
                :checked="isProjectSelected(project.id)"
                @click.stop="toggleProjectSelect(project.id)"
              />
              <text class="selected-count" v-if="getSelectedProductCount(project.id) > 0">
                ({{getSelectedProductCount(project.id)}})
              </text>
            </view>
            <text class="project-name">{{project.name}}</text>
            <view class="expand-icon">
              <text>{{project.expanded ? '−' : '+'}}</text>
            </view>
          </view>
          
          <!-- 产品列表 -->
          <view class="product-list" v-if="project.expanded">
            <view 
              v-for="product in getProductsByProject(project.id)" 
              :key="product.id" 
              class="product-item"
            >
              <view class="product-select">
                <checkbox 
                  :checked="product.selected"
                  @click.stop="toggleProductSelect(product.id)"
                />
              </view>
              <view class="product-info">
                <text class="product-name">{{product.name}}</text>
                <text class="product-price">¥{{product.price}}</text>
              </view>
              <view class="product-quantity">
                <button 
                  size="mini" 
                  :disabled="product.quantity <= 1"
                  @click="updateQuantity(product.id, -1)"
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
                  @click="updateQuantity(product.id, 1)"
                >+</button>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 报价区 -->
      <view class="quote-section">
        <view class="quote-item">
          <text>成本总价:</text>
          <text>¥{{totalCost.toFixed(2)}}</text>
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
          <text :class="{'negative': profit < 0}">¥{{profit.toFixed(2)}}</text>
        </view>
      </view>
    </view>
  </template>
  
  <script setup>
  import { ref, computed, reactive } from 'vue'
 import * as XLSX from 'xlsx'
  
  // 项目数据
  const projects = reactive([])
  
  // 产品数据（默认数量为1，初始不选中）
  const products = reactive([])
  
  // 价格数据
  const marketPrice = ref(0)
  const actualPrice = ref(0)
  
  // 导入Excel文件（单表版本）
const importExcel = async () => {
  try {
    // 1. 选择文件
    const [file] = await uni.chooseFile({
      count: 1,
      type: 'file',
      extension: ['.xlsx', '.xls']
    })
    
    // 2. 读取文件内容
    const arrayBuffer = await readFileAsArrayBuffer(file)
    
    // 3. 解析Excel
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    const sheetName = workbook.SheetNames[0] // 获取第一个工作表
    const worksheet = workbook.Sheets[sheetName]
    
    // 4. 读取数据并转换为JSON
    const excelData = XLSX.utils.sheet_to_json(worksheet)
    
    // 5. 处理单表数据
    processSingleTableData(excelData)
    
    uni.showToast({ title: '数据导入成功', icon: 'success' })
  } catch (error) {
    console.error('导入失败:', error)
    uni.showToast({ 
      title: '导入失败: ' + error.message,
      icon: 'none',
      duration: 3000
    })
  }
}

// 小程序环境读取文件
const readMiniProgramFile = (file) => {
  return new Promise((resolve, reject) => {
    // 微信小程序
    if (file.path && wx.getFileSystemManager) {
      wx.getFileSystemManager().readFile({
        filePath: file.path,
        encoding: 'binary',
        success: (res) => {
          resolve(res.data)
        },
        fail: (err) => {
          reject(new Error('文件读取失败: ' + err.errMsg))
        }
      })
    }
    // H5环境
    else if (file instanceof File) {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (e) => reject(new Error('文件读取失败'))
      reader.readAsArrayBuffer(file)
    }
    else {
      reject(new Error('不支持的文件类型'))
    }
  })
}

// 处理单表数据
const processSingleTableData = (excelData) => {
  // 清空现有数据
  projects.splice(0, projects.length)
  products.splice(0, products.length)
  
  // 用于去重的项目集合
  const projectSet = new Set()
  
  // 处理每一行数据
  excelData.forEach(row => {
    const projectId = row['项目ID']
    const projectName = row['项目名称']
    const productId = row['产品ID']
    const productName = row['产品名称']
    const productPrice = Number(row['产品单价']) || 0
    
    // 添加项目（去重）
    if (!projectSet.has(projectId)) {
      projectSet.add(projectId)
      projects.push({
        id: projectId,
        name: projectName,
        expanded: false
      })
    }
    
    // 添加产品
    products.push({
      id: productId,
      projectId: projectId,
      name: productName,
      price: productPrice,
      selected: false,
      quantity: 1
    })
  })
  
  // 按项目ID排序
  projects.sort((a, b) => a.id - b.id)
  products.sort((a, b) => a.projectId - b.projectId)
}

// 导出单表模板
const exportTemplate = () => {
  // 示例数据
  const templateData = [
    { '项目ID': 1, '项目名称': '洗牙', '产品ID': 1, '产品名称': '普通洗牙', '产品单价': 150 },
    { '项目ID': 1, '项目名称': '洗牙', '产品ID': 2, '产品名称': '超声波洗牙', '产品单价': 300 },
    { '项目ID': 2, '项目名称': '补牙', '产品ID': 3, '产品名称': '普通补牙材料', '产品单价': 200 }
  ]
  
  // 创建工作表
  const ws = XLSX.utils.json_to_sheet(templateData)
  
  // 创建工作簿
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '保养项目')
  
  // 生成Excel文件并下载
  XLSX.writeFile(wb, '牙齿保养报价模板(单表).xlsx')
}

// 读取文件为ArrayBuffer
const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

  // 展开/折叠项目
  const toggleExpand = (projectId) => {
    const project = projects.find(p => p.id === projectId)
    if (project) project.expanded = !project.expanded
  }
  
  // 切换产品选择状态（核心修复）
  const toggleProductSelect = (productId) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      product.selected = !product.selected
      // 选中时确保数量≥1
      if (product.selected && product.quantity < 1) {
        product.quantity = 1
      }
      // 取消选中时重置数量为1（可选）
      if (!product.selected) {
        product.quantity = 1
      }
    }
  }
  
  // 切换项目选择状态（核心修复）
  const toggleProjectSelect = (projectId) => {
    const projProducts = products.filter(p => p.projectId === projectId)
    const shouldSelect = !projProducts.every(p => p.selected)
    
    projProducts.forEach(product => {
      product.selected = shouldSelect
      if (product.selected && product.quantity < 1) {
        product.quantity = 1
      }
    })
  }
  
  // 更新产品数量
  const updateQuantity = (productId, delta) => {
    const product = products.find(p => p.id === productId)
    debugger
    if (product) {
      product.quantity = Math.max(1, product.quantity + delta)
      // 数量变化时自动选中产品
      if (!product.selected) {
        product.selected = true
      }
    }
  }
  
  // 验证数量输入
  const validateQuantity = (product) => {
    if (isNaN(product.quantity) || product.quantity < 1) {
      product.quantity = 1
    }
    // 确保数量>0时产品是选中状态
    if (product.quantity > 0 && !product.selected) {
      product.selected = true
    }
  }
  
  // 获取项目下的产品
  const getProductsByProject = (projectId) => {
    return products.filter(p => p.projectId === projectId)
  }
  
  // 获取项目下已选产品数量
  const getSelectedProductCount = (projectId) => {
    return products.filter(p => p.projectId === projectId && p.selected).length
  }
  
  // 检查项目是否被选中（部分或全部）
const isProjectSelected = (projectId) => {
    const projProducts = products.filter(p => p.projectId === projectId)
    return projProducts.some(p => p.selected)
    }
  
  // 计算总成本（实时更新）
  const totalCost = computed(() => {
    return products.reduce((sum, product) => {
      return sum + (product.selected ? product.price * product.quantity : 0)
    }, 0)
  })
  
  // 计算利润（实时更新）
  const profit = computed(() => {
    return actualPrice.value - totalCost.value
  })
  </script>
  
  <style>
  /* 新增样式 */
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
  /* 样式保持不变 */
  .container {
    padding: 20px;
    background-color: #f5f5f5;
    min-height: 100vh;
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
  </style>