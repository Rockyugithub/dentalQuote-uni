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
            <text class="password">密码：{{ user.password }}</text>
            <text class="role">角色：{{ user.role }}</text>
          </view>
          
          <view class="user-actions">
            <button size="mini" @click="showEditPwd(user)">改密</button>
            <button 
              size="mini" 
              type="warn" 
              :disabled="user.role === 'admin'"
              @click="handleDelete(user.id)"
            >
              删除
            </button>
          </view>
        </view>
      </view>
    </view>
      
     <!-- 微信小程序需要包裹组件 -->
  <view v-if="showPopup === 'add'">
    <uni-popup-dialog ref="addUserPopup"  mode="base">
      <add-user @success="fetchUserList" @close="closePopup" />
    </uni-popup-dialog>
  </view>

  <view v-if="showPopup === 'edit'">
    <uni-popup-dialog ref="editPwdPopup"  mode="base">
      <edit-pwd :user="currentUser" @success="fetchUserList" @close="closePopup" />
    </uni-popup-dialog>
  </view>
  </template>
  <script setup>
  import { ref,onMounted} from 'vue'
  import addUser from './add-user.vue'
  import editPwd from './edit-pwd.vue'
  
  // 用户列表数据
  const userList = ref([
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'user1', password: '123456', role: 'user' }
  ])
  const showPopup = ref('')
  const addUserPopup = ref(null)
const editPwdPopup = ref(null)
const currentUser = ref({ id: 1, username: 'test' })
  
  // 获取用户列表
  const fetchUserList = async () => {
    // try {
    //   const res = await uni.request({
    //     url: '/api/users',
    //     method: 'GET'
    //   })
    //   userList.value = res.data
    // } catch (e) {
    //   uni.showToast({ title: '获取用户列表失败', icon: 'none' })
    // }
  }
  
  // 删除用户
  const handleDelete = async (userId) => {
    try {
      await uni.request({
        url: `/api/users/${userId}`,
        method: 'DELETE'
      })
      fetchUserList()
      uni.showToast({ title: '删除成功' })
    } catch (e) {
      uni.showToast({ title: '删除失败', icon: 'none' })
    }
  }
  
  // 微信专用打开方式
  const showAddUser = () => {
  // 微信环境必须使用nextTick
  this.$nextTick(() => {
    setTimeout(() => {
      this.$refs.addUserPopup.open()
    }, 300) // 必须延迟
  })
}

const showEditPwd = (user) => {
  currentUser.value = user
  this.$nextTick(() => {
    setTimeout(() => {
      this.$refs.editPwdPopup.open()
    }, 300) // 必须延迟
  })
}

const closeAddUser = () => {
  addUserPopup.value?.close?.()
}

const closePopup = () => {
  showPopup.value = ''
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