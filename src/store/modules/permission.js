import { constantRoutes, accountRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'

const permission = {
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = [...constantRoutes, ...routes]
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({ getters, commit }) {
      return new Promise(resolve => {
        if (getters.roles.includes('admin')) {
          getRouters().then(res => {
            const accessedRoutes = filterAsyncRouter(res.data)
            commit('SET_ROUTES', accessedRoutes)
            resolve(accessedRoutes)
          })
        } else {
          if (Number(getters.isReal) !== 3) {
            commit('SET_ROUTES', [])
            resolve([])
          } else {
            if (getters.isOpenAccount !== true) {
              commit('SET_ROUTES', accountRoutes)
              resolve(accountRoutes)
            } else {
              getRouters().then(res => {
                const accessedRoutes = filterAsyncRouter(res.data)
                commit('SET_ROUTES', accessedRoutes)
                resolve(accessedRoutes)
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
