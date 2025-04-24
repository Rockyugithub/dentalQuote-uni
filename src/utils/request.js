import axios from 'axios'

// 自定义微信小程序的 axios adapter
axios.defaults.adapter = function(config) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.baseURL + config.url, // 拼接 baseURL
      method: config.method,
      data: config.method === 'GET' ? config.params : config.data,
      header: config.headers,
      success(res) {
        // 构造 axios 格式的响应
        const response = {
          data: res.data,
          status: res.statusCode,
          statusText: 'OK',
          headers: res.header,
          config: config,
          request: null
        }
        resolve(response)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

const service = axios.create({
  baseURL: 'http://localhost:3000', // 替换为你的后端地址
  timeout: 10000,
})

// 请求拦截器（添加 token）
service.interceptors.request.use(config => {
  const token = wx.getStorageSync('token') // 微信小程序用 wx.getStorageSync
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// 响应拦截器（统一错误处理）
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) { // 假设后端返回 code=200 表示成功
      wx.showToast({ title: res.message || '请求失败', icon: 'none' })
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res // 直接返回后端数据（去掉 axios 包装）
  },
  error => {
    wx.showToast({ title: error.errMsg || '网络错误', icon: 'none' })
    return Promise.reject(error)
  }
)

export default service