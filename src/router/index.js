import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
    affix: true                  // if set true, the tag will affix in the tags-view
    noCache: true                // if set true, the page will no be cached(default is false)
    activeMenu: '/example/list'  // if set path, the sidebar will highlight the path you set
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/register',
    hidden: true,
    meta: { title: '注册账号', icon: 'user' },
    component: () => import('@/views/login/register/index'),
  },
  {
    path: '/real-authorize',
    hidden: true,
    meta: { title: '实名认证', icon: '' },
    component: () => import('@/views/login/real-authorize/index'),
    beforeEnter: (to, from, next) => {
      if (Number(store.getters.isReal) === 0 || Number(store.getters.isReal) === 2) {
        next()
      }
    }
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: '个人中心',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: '字典数据',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  },
  {
    path: '/publish',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'detail/:code',
        component: () => import('@/views/product/detail/index'),
        name: '商品详情',
        meta: { title: '商品详情', icon: '' }
      }
    ]
  },
  {
    path: '/dynamic',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'authorize-edit/:code',
        component: () => import('@/views/distributor/authorize-edit/index'),
        name: '经销商授权修改',
        meta: { title: '经销商授权修改', icon: '' }
      },
      {
        path: 'discount/:code',
        component: () => import('@/views/distributor/discount/index'),
        name: '调整折扣',
        meta: { title: '调整折扣', icon: '' }
      }
    ]
  }
]

export const realAuthRoutes = [
  {
    path: '/account',
    component: Layout,
    name: "收款账户",
    alwaysShow: true,
    meta: {
      icon: "money",
      title: "收款账户"
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/account/list/index'),
        name: '渠道列表',
        meta: { title: '渠道列表', icon: 'list' }
      }
    ]
  }
]

export const accountRoutes = [
  {
    path: '/account',
    component: Layout,
    name: "收款账户",
    alwaysShow: true,
    meta: {
      icon: "money",
      title: "收款账户"
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/account/list/index'),
        name: '渠道列表',
        meta: { title: '渠道列表', icon: 'list' }
      }
    ]
  }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
