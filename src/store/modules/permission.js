import { asyncRouterMap, constantRouterMap } from '@/router'
import { generateRoutes } from '@/api/login'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise((resolve, reject) => {
        generateRoutes().then(response => {
          // commit('SET_ROLES', data)
          // const { roles } = data
          // let accessedRouters
          // if (roles.includes('admin')) {
          //   accessedRouters = asyncRouterMap
          // } else {
          //   accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
          // }
          // commit('SET_ROUTERS', accessedRouters)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default permission
