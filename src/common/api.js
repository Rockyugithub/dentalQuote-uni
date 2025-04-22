const BASE_URL = 'http://your-server-address/api/v1'

export default {
  // 登录接口
  login(username, password) {
    return uni.request({
      url: `${BASE_URL}/auth/login`,
      method: 'POST',
      data: { username, password }
    })
  },

  // 获取产品列表
  getProducts() {
    return uni.request({
      url: `${BASE_URL}/products`,
      method: 'GET',
      header: {
        'Authorization': uni.getStorageSync('token')
      }
    })
  },

  // 创建产品（管理员）
  createProduct(productData) {
    return uni.request({
      url: `${BASE_URL}/products`,
      method: 'POST',
      data: productData,
      header: {
        'Authorization': uni.getStorageSync('token')
      }
    })
  }
}