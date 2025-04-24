<template>
    <view class="user-management">
      <!-- 顶部操作栏 -->
      <view class="action-bar">
        <button class="add-btn" @click="showAddUser">新增用户</button>
      </view>
  
      <!-- 用户列表 -->
      <view class="user-list">
        <view v-for="user in userList" :key="user.id" class="user-card">
          <view class="user-info">
            <text class="username">{{ user.username }}</text>
            <text class="role">角色：{{ user.role.label }}</text>
          </view>
          
          <view class="user-actions" >
            <button size="mini" @click="showEditPwd(user)">改密</button>
            <button 
              size="mini" 
              type="warn" 
              :disabled="user.role.value === 'admin'"
              @click="handleDelete(user.id)"
            >
              删除
            </button>
          </view>
        </view>
      </view>
    </view>
      
    <custom-popup 
    v-model="addUserPopup" 
    :content-style="{ borderRadius: '32rpx' }"
  >
    <add-user @success="fetchUserList" @close="closePopup" />
  </custom-popup>


    <custom-popup v-model="editPwdPopup" custom-style="border-radius:32rpx;">
      <edit-pwd :user="currentUser" @success="fetchUserList" @close="closePopup" />
    </custom-popup>
  </template>
  <script setup>
  import { ref,onMounted} from 'vue'
  import addUser from './add-user.vue'
  import editPwd from './edit-pwd.vue'
  import CustomPopup from '@/components/custom-popup.vue'
  import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

  // 用户列表数据
  const userList = ref([
  ])

  const addUserPopup = ref(false)
const editPwdPopup = ref(false)
const currentUser = ref({ id: 1, username: 'test' })
  
  // 获取用户列表
  const fetchUserList = async () => {
    const res = await userStore.getAllUsers()
    userList.value = res.data
  }
  
  // 删除用户
  const handleDelete = async (userId) => {
    await userStore.deleteUser({"userId":userId})
    fetchUserList()
  }
  
  // 微信专用打开方式
  const showAddUser = () => {
    addUserPopup.value = true
}

const showEditPwd = (user) => {
  currentUser.value = user
  editPwdPopup.value = true
}

const closeAddUser = () => {
  addUserPopup.value = false
}

const closePopup = () => {
  editPwdPopup.value = false
  addUserPopup.value = false
}
  
  // 初始化加载
  onMounted(fetchUserList)
  </script>
  <style lang="scss">
  .user-management {
    padding: 20rpx;
  
    .action-bar {
      margin-bottom: 20rpx;
      
      .add-btn {
        background-color: #4a90e2;
        color: white;
      }
    }
  
    .user-list {
      .user-card {
        background: white;
        border-radius: 8rpx;
        padding: 20rpx;
        margin-bottom: 20rpx;
        display: flex;
        justify-content: space-between;
  
        .user-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          
          .username {
            font-weight: bold;
            margin-bottom: 10rpx;
          }
          
          .password, .role {
            font-size: 24rpx;
            color: #666;
          }
        }
  
        .user-actions {
          display: flex;
          align-items: center;
          
          button {
            margin-left: 10rpx;
            
            &[disabled] {
              opacity: 0.5;
            }
          }
        }
      }
    }
  }

  /* 强制覆盖微信样式 */
uni-popup-dialog {
  z-index: 99999 !important;
  position: fixed !important;
}

/* 隐藏背景遮罩层 */
.uni-popup__wrapper.uni-popup__wrapper--mask {
  display: none !important;
}
  </style>