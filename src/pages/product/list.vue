<template>
  <view class="container">
    <!-- 顶部操作栏 -->
    <view class="header">
      <button class="add-project-btn" @click="showAddProjectDialog">
        <uni-icons type="plus" size="16" color="#fff"></uni-icons>
        添加项目
      </button>
    </view>

    <!-- 项目列表 -->
    <view class="project-list" v-if="projects.length > 0">
      <view 
        v-for="project in projects" 
        :key="project.projectId" 
        class="project-card"
        :class="{ expanded: project.expanded }"
      >
        <!-- 项目卡片头部 -->
        <view class="card-header" @click="toggleExpand(project.projectId)">
          <view class="header-left">
            <text class="project-name">{{ project.projectName }}</text>
            <text class="product-count">
              <uni-icons type="list" size="14" color="#999"></uni-icons>
              {{ project.products.length }}个产品
            </text>
          </view>
          <view class="header-right">
            <button class="icon-btn" @click.stop="showAddProductDialog(project.projectId)">
              添加产品
            </button>
            <button class="icon-btn" @click.stop="confirmDeleteProject(project.projectId)">
              <uni-icons type="trash" size="18" color="#ff4d4f"></uni-icons>
            </button>
            <uni-icons 
              type="arrowdown" 
              size="18" 
              color="#666"
              class="expand-icon"
            ></uni-icons>
          </view>
        </view>
        
        <!-- 产品列表 -->
        <view class="product-container">
          <view class="product-list">
            <view 
              v-for="product in project.products" 
              :key="product.productId" 
              class="product-item"
            >
              <view class="product-info">
                <uni-icons type="shop" size="16" color="#4a90e2" style="margin-right:8rpx"></uni-icons>
                <text class="product-name">{{ product.productName }}</text>
                <text class="product-price">
                  <uni-icons type="money" size="14" color="#ff6b6b"></uni-icons>
                  ¥{{ product.price }}
                </text>
              </view>
              <view class="product-actions">
                <button class="icon-btn" @click.stop="showEditProductDialog(product)">
                  <uni-icons type="compose" size="18" color="#666"></uni-icons>
                </button>
                <button class="icon-btn" @click.stop="confirmDeleteProduct(product.productId, project.projectId)">
                  <uni-icons type="trash" size="18" color="#ff4d4f"></uni-icons>
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-tip">
      <uni-icons type="info" size="48" color="#ccc"></uni-icons>
      <text v-if="loading">数据加载中...</text>
      <text v-else>暂无项目数据</text>
      <button class="add-project-btn" @click="showAddProjectDialog">
        <uni-icons type="plus" size="16" color="#fff"></uni-icons>
        创建第一个项目
      </button>
    </view>

    <!-- 添加项目弹窗 -->
    <custom-popup v-model="addProjectPopup">
      <view class="popup-content">
        <view class="popup-header">
          <text class="title">添加新项目</text>
          <uni-icons 
            type="close" 
            size="24" 
            color="#999" 
            @click="cancelAddProject"
          />
        </view>
        <view class="form-item">
          <input 
            v-model="newProjectName" 
            placeholder="请输入项目名称" 
            class="input"
          />
        </view>
        <button class="submit-btn" @click="confirmAddProject">确认</button>
      </view>
    </custom-popup>

    <!-- 添加产品弹窗 -->
    <custom-popup v-model="addProductPopup">
      <view class="popup-content">
        <view class="popup-header">
          <text class="title">添加新产品</text>
          <uni-icons 
            type="close" 
            size="24" 
            color="#999" 
            @click="cancelAddProduct"
          />
        </view>
        <view class="form-item">
          <input 
            v-model="newProductName" 
            placeholder="请输入产品名称" 
            class="input"
          />
        </view>
        <view class="form-item">
          <text class="label">产品价格</text>
          <input 
            type="number" 
            v-model="newProductPrice" 
            placeholder="0.00" 
            class="input"
          />
        </view>
        <button class="submit-btn" @click="confirmAddProduct">确认</button>
      </view>
    </custom-popup>

    <!-- 编辑产品弹窗 -->
    <custom-popup v-model="editProductPopup">
      <view class="popup-content">
        <view class="popup-header">
          <text class="title">编辑产品</text>
          <uni-icons 
            type="close" 
            size="24" 
            color="#999" 
            @click="cancelEditProduct"
          />
        </view>
        <view class="form-item">
          <input 
            v-model="editingProduct.productName" 
            placeholder="请输入产品名称" 
            class="input"
          />
        </view>
        <view class="form-item">
          <text class="label">产品价格</text>
          <input 
            type="number" 
            v-model="editingProduct.price" 
            placeholder="0.00" 
            class="input"
          />
        </view>
        <button class="submit-btn" @click="confirmEditProduct">确认</button>
      </view>
    </custom-popup>
  </view>
</template>

<script setup>
// 在script setup顶部添加
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
import { ref, reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { 
  getAllProject, 
  addProject, 
  addProduct, 
  deleteProject, 
  deleteProduct,
  updateProduct
} from '@/api/project'
import CustomPopup from '@/components/custom-popup.vue'


// 数据状态
const projects = reactive([])
const loading = ref(false)

// 弹窗控制
const addProjectPopup = ref(false)
const addProductPopup = ref(false)
const editProductPopup = ref(false)

// 表单数据
const newProjectName = ref('')
const currentProjectId = ref('')
const newProductName = ref('')
const newProductPrice = ref('')
const editingProduct = reactive({
  productId: '',
  projectId: '',
  productName: '',
  price: 0
})

// 初始化加载数据
const fetchData = async () => {
  try {
    loading.value = true
    const res = await getAllProject()
    projects.splice(0, projects.length, ...res.data.map(project => ({
      projectId: project.id,
      projectName: project.name,
      expanded: true,
      products: project.products.map(product => ({
        productId: product.id,
        productName: product.name,
        price: product.price,
        projectId: project.id
      }))
    })))
  } catch (error) {
    console.error('获取数据失败:', error)
    uni.showToast({ title: '数据加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 项目操作
const showAddProjectDialog = () => {
  newProjectName.value = ''
  addProjectPopup.value = true
}

const confirmAddProject = async () => {
  if (!newProjectName.value.trim()) {
    uni.showToast({ title: '项目名称不能为空', icon: 'none' })
    return
  }

  try {
    await addProject({ name: newProjectName.value })
    await fetchData()
    uni.showToast({ title: '添加成功' })
    addProjectPopup.value = false
  } catch (error) {
    console.error('添加项目失败:', error.message)
    uni.showToast({ title: `添加失败:${error.message}`, icon: 'none' })
  }
}

const cancelAddProject = () => {
  addProjectPopup.value = false
}

const confirmDeleteProject = (projectId) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个项目吗？项目下的所有产品也将被删除',
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteProject({projectId})
          await fetchData()
          uni.showToast({ title: '删除成功' })
        } catch (error) {
          console.error('删除项目失败:', error)
          uni.showToast({ title: `删除失败:${error.message}`, icon: 'none' })
        }
      }
    }
  })
}

// 产品操作
const showAddProductDialog = (projectId) => {
  currentProjectId.value = projectId
  newProductName.value = ''
  newProductPrice.value = ''
  addProductPopup.value = true
}

const confirmAddProduct = async () => {
  if (!newProductName.value.trim()) {
    uni.showToast({ title: '产品名称不能为空', icon: 'none' })
    return
  }

  const price = parseFloat(newProductPrice.value)
  if (isNaN(price) || price <= 0) {
    uni.showToast({ title: '请输入有效的价格', icon: 'none' })
    return
  }

  try {
    await addProduct({
      projectId: currentProjectId.value,
      name: newProductName.value.trim(),
      price: price
    })
    await fetchData()
    uni.showToast({ title: '添加成功' })
    addProductPopup.value = false
  } catch (error) {
    console.error('添加产品失败:', error)
    uni.showToast({ title: `添加失败:${error.message}`, icon: 'none' })
  }
}

const cancelAddProduct = () => {
  addProductPopup.value = false
}

const showEditProductDialog = (product) => {
  Object.assign(editingProduct, {
    productId: product.productId,
    projectId: product.projectId,
    productName: product.productName,
    price: product.price
  })
  editProductPopup.value = true
}

const confirmEditProduct = async () => {
  if (!editingProduct.productName.trim()) {
    uni.showToast({ title: '产品名称不能为空', icon: 'none' })
    return
  }

  const price = parseFloat(editingProduct.price)
  if (isNaN(price) || price <= 0) {
    uni.showToast({ title: '请输入有效的价格', icon: 'none' })
    return
  }

  try {
    let data = {
      projectId:editingProduct.projectId, 
      productId:editingProduct.productId,
      name: editingProduct.productName.trim(),
      price: price
    }
    console.info(data)
    await updateProduct(data)
    await fetchData()
    uni.showToast({ title: '更新成功' })
    editProductPopup.value = false
  } catch (error) {
    console.error('更新产品失败:', error)
    uni.showToast({ title: `更新失败:${error.message}`, icon: 'none' })
  }
}

const cancelEditProduct = () => {
  editProductPopup.value = false
}

const confirmDeleteProduct = (productId, projectId) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个产品吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteProduct({productId, projectId})
          await fetchData()
          uni.showToast({ title: '删除成功' })
        } catch (error) {
          console.error('删除产品失败:', error)
          uni.showToast({ title: `删除失败:${error.message}`, icon: 'none' })
        }
      }
    }
  })
}

// 展开/收起功能
const toggleExpand = (projectId) => {
  const project = projects.find(p => p.projectId === projectId)
  if (project) {
    projects.forEach(p => {
      if (p.projectId !== projectId) p.expanded = false
    })
    project.expanded = !project.expanded
  }
}

// 页面显示时刷新数据
onShow(() => {
  fetchData()
})
</script>

<style lang="scss">
.container {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.header {
  padding: 20rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: flex-end;
}

.add-project-btn {
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  height: 70rpx;
  line-height: 70rpx;
  font-size: 28rpx;
  background: linear-gradient(135deg, #4a90e2, #4361ee);
  color: white;
  border-radius: 35rpx;
  box-shadow: 0 4rpx 12rpx rgba(67, 97, 238, 0.3);
  
  .uni-icons {
    margin-right: 10rpx;
  }
}

.project-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24rpx;
  padding: 0 20rpx;
}

.project-card {
  background-color: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  overflow: hidden;
  
  &.expanded {
    .product-container {
      max-height: 1000px;
      opacity: 1;
    }
    .expand-icon {
      transform: rotate(180deg);
    }
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.header-left {
  flex: 1;
}

.project-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.product-count {
  font-size: 24rpx;
  color: #999;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 12px;
  padding: 0;
  margin: 0;
  line-height: 1;
  
  &::after {
    border: none;
  }
}

.expand-icon {
  transition: transform 0.3s;
}

.product-container {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-list {
  padding: 0;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
}

.product-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.product-name {
  font-size: 28rpx;
  color: #333;
}

.product-price {
  font-size: 26rpx;
  color: #ff6b6b;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.product-actions {
  display: flex;
  gap: 20rpx;
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 40rpx;
  text-align: center;
  
  text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 40rpx;
  }
  
  .add-project-btn {
    width: 60%;
  }
}

.popup-content {
  width: 80%;
  max-width: 600rpx;
  padding: 40rpx;
  background-color: #fff;
  border-radius: 32rpx;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
  
  .title {
    font-size: 36rpx;
    font-weight: bold;
  }
}

.form-item {
  margin-bottom: 30rpx;
  
  .label {
    display: block;
    margin-bottom: 15rpx;
    font-size: 28rpx;
    color: #666;
  }
  
  .input {
    width: 100%;
    height: 80rpx;
    padding: 0 20rpx;
    border: 1rpx solid #eee;
    border-radius: 8rpx;
    font-size: 28rpx;
  }
}

.submit-btn {
  margin-top: 40rpx;
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background: linear-gradient(90deg, #4a90e2, #5aa0ff);
  color: white;
  border-radius: 45rpx;
  font-size: 32rpx;
}
</style>