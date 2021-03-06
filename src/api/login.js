import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/loginIndex',
    method: 'post',
    data: data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function generateRoutes() {
  return request({
    url: '/login/generateRoutes',
    method: 'get'
  })
}
