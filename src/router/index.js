import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/engineer',
    name: '工程',
    meta: { title: '工程', icon: 'dashboard' },
    children: [
      {
        path: 'money',
        name: '资金流概况一览表',
        component: () => import('@/views/engineer/cashFlow'),
        meta: { title: '资金流概况一览表' }
      },
      {
        path: 'engineer',
        name: 'engineer',
        component: () => import('@/views/engineer/index'),
        meta: { title: '工程列表', affix: true }
      },
      {
        path: 'budget',
        name: 'budget',
        component: () => import('@/views/engineer/budget'),
        meta: { title: '预算分析' },
        hidden: true
      },
      {
        path: 'cost',
        name: 'cost',
        component: () => import('@/views/engineer/cost'),
        meta: { title: '成本分析' },
        hidden: true
      },
      {
        path: 'collection',
        name: 'collection',
        component: () => import('@/views/engineer/collection'),
        meta: { title: '工程收款' },
        hidden: true
      },
      {
        path: 'engineer/create',
        name: 'createEngineer',
        component: () => import('@/views/engineer/updateEngineer'),
        meta: { title: '新建工程' },
        hidden: true
      },
      {
        path: 'engineer/update',
        name: 'updateEngineer',
        component: () => import('@/views/engineer/updateEngineer'),
        meta: { title: '更新工程' },
        hidden: true
      }
    ]
  },
  
  {
    path: '/purchase',
    component: Layout,
    redirect: '/purchase/contract',
    name: '采购',
    meta: { title: '采购', icon: 'dashboard' },
    children: [
      {
        path: 'contract',
        name: 'contract',
        component: () => import('@/views/purchase/index'),
        meta: { title: '采购合同', icon: 'dashboard' }
      },
      {
        path: 'order',
        name: 'order',
        component: () => import('@/views/purchase/order'),
        meta: { title: '采购订单', icon: 'dashboard' }
      },
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/purchase/list'),
        meta: { title: '采购明细查询', icon: 'dashboard' }
      },
      {
        path: 'contract/create',
        name: 'createContract',
        component: () => import('@/views/purchase/contractDetail'),
        meta: { title: '新建采购合同' },
        hidden: true
      },
      {
        path: 'contract/update',
        name: 'updateContract',
        component: () => import('@/views/purchase/contractDetail'),
        meta: { title: '更新采购合同' },
        hidden: true
      },
      {
        path: 'contract/detail',
        name: 'fetchContract',
        component: () => import('@/views/purchase/contractDetail'),
        meta: { title: '查看采购合同' },
        hidden: true
      },
      {
        path: 'order/create',
        name: 'createOrder',
        component: () => import('@/views/purchase/orderDetail'),
        meta: { title: '新建采购订单' },
        hidden: true
      },
      {
        path: 'order/update',
        name: 'updateOrder',
        component: () => import('@/views/purchase/orderDetail'),
        meta: { title: '更新采购订单' },
        hidden: true
      },
      {
        path: 'order/detail',
        name: 'fetchOrder',
        component: () => import('@/views/purchase/orderDetail'),
        meta: { title: '查看采购订单' },
        hidden: true
      }
    ]
  },

  {
    path: '/warehouse',
    component: Layout,
    redirect: '/warehouse/in',
    name: '仓库',
    meta: { title: '仓库', icon: 'dashboard' },
    children: [
      {
        path: 'in',
        name: 'in',
        component: () => import('@/views/inout/in'),
        meta: { title: '入仓单', icon: 'dashboard' },
      },
      {
        path: 'pick',
        name: 'pick',
        component: () => import('@/views/inout/pick'),
        meta: { title: '出仓单(领料单)', icon: 'dashboard' },
      },
      {
        path: 'slip',
        name: 'slip',
        component: () => import('@/views/inout/slip'),
        meta: { title: '退库单', icon: 'dashboard' },
      },
      {
        path: 'return',
        name: 'return',
        component: () => import('@/views/inout/return'),
        meta: { title: '退货单', icon: 'dashboard' },
      },
      {
        path: 'inventory',
        name: 'inventory',
        component: () => import('@/views/warehouse/index'),
        meta: { title: '库存概览', icon: 'dashboard' }
      },
      {
        path: 'inventory-batch',
        name: 'inventory-batch',
        component: () => import('@/views/warehouse/batch'),
        meta: { title: '库存批次明细', icon: 'dashboard' },
        hidden: true
      },
      {
        path: 'record',
        name: 'record',
        component: () => import('@/views/warehouse/record'),
        meta: { title: '出入库记录', icon: 'dashboard' }
      },
      {
        path: 'in/create',
        name: 'createIn',
        component: () => import('@/views/inout/inDetail'),
        meta: { title: '新建入仓单' },
        hidden: true
      },
      {
        path: 'in/update',
        name: 'updateIn',
        component: () => import('@/views/inout/inDetail'),
        meta: { title: '更新入仓单' },
        hidden: true
      },
      {
        path: 'pick/create',
        name: 'createPick',
        component: () => import('@/views/inout/pickDetail'),
        meta: { title: '新建出仓单(领料单)' },
        hidden: true
      },
      {
        path: 'pick/update',
        name: 'updatePick',
        component: () => import('@/views/inout/pickDetail'),
        meta: { title: '更新出仓单(领料单)' },
        hidden: true
      },
      {
        path: 'slip/create',
        name: 'createSlip',
        component: () => import('@/views/inout/slipDetail'),
        meta: { title: '新建退库单' },
        hidden: true
      },
      {
        path: 'slip/update',
        name: 'updateSlip',
        component: () => import('@/views/inout/slipDetail'),
        meta: { title: '更新退库单' },
        hidden: true
      },
      {
        path: 'return/create',
        name: 'createReturn',
        component: () => import('@/views/inout/returnDetail'),
        meta: { title: '新建退货单' },
        hidden: true
      },
      {
        path: 'return/update',
        name: 'updateReturn',
        component: () => import('@/views/inout/returnDetail'),
        meta: { title: '更新退货单' },
        hidden: true
      },
    ]
  },

  {
    path: '/supplier',
    component: Layout,
    redirect: '/warehouse/supplier',
    name: 'supplier',
    meta: { title: '供应商', icon: 'dashboard' },
    children: [
      {
        path: 'supplier',
        name: 'supplier',
        component: () => import('@/views/supplier/index'),
        meta: { title: '供应商列表', icon: 'dashboard' }
      },
      {
        path: 'supplier/create',
        name: 'createSupplier',
        component: () => import('@/views/supplier/supplierDetail'),
        meta: { title: '新建供应商', icon: 'dashboard' }
      },
      {
        path: 'supplier/update',
        name: 'updateSupplier',
        component: () => import('@/views/supplier/supplierDetail'),
        meta: { title: '更新供应商', icon: 'dashboard' }
      },
      {
        path: 'material',
        name: 'material',
        component: () => import('@/views/supplier/material'),
        meta: { title: '材料列表', icon: 'dashboard' }
      },
      {
        path: 'category',
        name: 'category',
        component: () => import('@/views/supplier/category'),
        meta: { title: '材料列表管理' },
        hidden: true
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    hidden: true,
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
