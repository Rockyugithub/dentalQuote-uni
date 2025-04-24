import { defineStore } from 'pinia'
import { ref } from 'vue'
import { create, loginApi, updatePassword , getUserList, delUser} from '../api/auth'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(uni.getStorageSync('userInfo') || null)

  const getAllUsers = async (data) => {
    const res = await getUserList()
    return res
  }

  const deleteUser = async (data) => {
    const res = await delUser(data)
    return res
  }

  const createUser = async (data) => {
    const res = await create(data)
    return res
  }

  const updataPwd = async (data) => {
    const res = await updatePassword(data)
    return res
  }

  const login = async (data) => {
    const res = await loginApi(data)
    userInfo.value = res.data.user
    uni.setStorageSync('userInfo', userInfo.value)
    return res
  }

  const logout = () => {
    userInfo.value = null
    uni.removeStorageSync('userInfo')
  }

  return { userInfo, login, logout ,deleteUser,createUser,getAllUsers,updataPwd}
})