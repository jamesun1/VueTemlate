import { getDataSource, getDataSourceByType } from '@/api/dataSource'
const dataSource = {
  namespaced: true,
  state: {
  },
  mutations: {
  },
  actions: {
    getDataSource({ commit }, data) {
      return new Promise((resolve, reject) => {
        getDataSource(data).then(response => {
          if (response.code === 200) {
            resolve(response.data)
          } else {
            reject(response.message)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    getDataSourceByType({ commit }, data) {
      return new Promise((resolve, reject) => {
        getDataSourceByType(data).then(response => {
          if (response.code === 200) {
            resolve(response.data)
          } else {
            reject(response.message)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

export default dataSource
