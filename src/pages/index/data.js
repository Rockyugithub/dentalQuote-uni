// 保养项目数据
export const projects = [
    { id: 1, name: '洗牙' },
    { id: 2, name: '补牙' },
    { id: 3, name: '拔牙' },
    { id: 4, name: '牙齿矫正' },
    { id: 5, name: '种植牙' },
    { id: 6, name: '牙齿美白' }
  ]
  
  // 产品数据
  export const products = [
    { id: 1, projectId: 1, name: '普通洗牙', price: 150, quantity: 0 },
    { id: 2, projectId: 1, name: '超声波洗牙', price: 300, quantity: 0 },
    { id: 3, projectId: 1, name: '喷砂洗牙', price: 450, quantity: 0 },
    
    { id: 4, projectId: 2, name: '普通补牙材料', price: 200, quantity: 0 },
    { id: 5, projectId: 2, name: '进口补牙材料', price: 500, quantity: 0 },
    { id: 6, projectId: 2, name: '3M纳米树脂', price: 800, quantity: 0 },
    
    { id: 7, projectId: 3, name: '普通拔牙', price: 300, quantity: 0 },
    { id: 8, projectId: 3, name: '复杂拔牙', price: 800, quantity: 0 },
    { id: 9, projectId: 3, name: '智齿拔除', price: 1200, quantity: 0 },
    
    { id: 10, projectId: 4, name: '金属托槽矫正', price: 12000, quantity: 0 },
    { id: 11, projectId: 4, name: '陶瓷托槽矫正', price: 18000, quantity: 0 },
    { id: 12, projectId: 4, name: '隐形矫正', price: 25000, quantity: 0 },
    
    { id: 13, projectId: 5, name: '国产种植体', price: 6000, quantity: 0 },
    { id: 14, projectId: 5, name: '韩国种植体', price: 10000, quantity: 0 },
    { id: 15, projectId: 5, name: '瑞士种植体', price: 15000, quantity: 0 },
    
    { id: 16, projectId: 6, name: '冷光美白', price: 1500, quantity: 0 },
    { id: 17, projectId: 6, name: '激光美白', price: 3000, quantity: 0 },
    { id: 18, projectId: 6, name: '瓷贴面美白', price: 5000, quantity: 0 }
  ]