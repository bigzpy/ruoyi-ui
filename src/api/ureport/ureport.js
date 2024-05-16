import request from '@/utils/request'

// 查询测试列表
export function listUreport(query) {
  return request({
    url: '/ureport2/ureport2/list',
    method: 'get',
    params: query
  })
}

// 查询测试详细
export function getUreport(FId) {
  return request({
    url: '/ureport2/ureport2/' + FId,
    method: 'get'
  })
}

// 新增测试
export function addUreport(data) {
  return request({
    url: '/ureport2/ureport2/add',
    method: 'post',
    data: data
  })
}

// 修改测试
export function updateUreport(data) {
  return request({
    url: '/ureport2/ureport2/update',
    method: 'post',
    data: data
  })
}

// 删除测试
export function delUreport(FId) {
  return request({
    url: '/ureport2/ureport2/delete/' + FId,
    method: 'post'
  })
}
