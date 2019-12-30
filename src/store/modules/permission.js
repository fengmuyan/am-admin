import { constantRoutes, accountRoutes, dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'

const permission = {
  state: {
    routes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.routes = routes
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({ getters, commit }) {
      return new Promise(resolve => {
        if (getters.roles.includes('admin')) {
          getRouters().then(res => {
            const accessedRoutes = filterAsyncRouter(res.data)
            const routes = [...constantRoutes, ...accessedRoutes, ...dynamicRoutes]
            commit('SET_ROUTES', routes)
            resolve(routes)
          })
        } else {
          if (Number(getters.isReal) !== 3) {
            commit('SET_ROUTES', constantRoutes)
            resolve(constantRoutes)
          } else {
            if (getters.isOpenAccount !== true) {
              const routes = [...constantRoutes, ...accountRoutes]
              commit('SET_ROUTES', routes)
              resolve(routes)
            } else {
              getRouters().then(res => {
                const accessedRoutes = filterAsyncRouter(res.data)
                const routes = [...constantRoutes, ...accessedRoutes, ...dynamicRoutes]
                commit('SET_ROUTES', routes)
                resolve(routes)
              })
            }
          }
        }
      })
    }
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}

export const loadView = (view) => { // 路由懒加载
  return () => import(`@/views/${view}`)
}

export default permission
