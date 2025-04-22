import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    user: null,
    token: ''
  }),
  actions: {
    setUser(user) {
      this.user = user
      uni.setStorageSync('user', user)
    },
    setToken(token) {
      this.token = token
      uni.setStorageSync('token', token)
    },
    logout() {
      this.user = null
      this.token = ''
      uni.removeStorageSync('user')
      uni.removeStorageSync('token')
    }
  }
})