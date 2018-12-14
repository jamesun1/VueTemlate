import request from '@/utils/request'

export function getDataSource(data) {
  return request({
    url: '/dataSource/getDataSource',
    method: 'post',
    data: data
  })
}

export function getDataSourceByType(data) {
  return request({
    url: '/dataSource/getDataSourceByType',
    method: 'post',
    data: data
  })
}