import request from '@/utils/request'

// 查询报表配置列表
export function listReport(query) {
  return request({
    url: '/report/stats/list',
    method: 'get',
    params: query
  })
}

// 查询报表配置详细
export function getReport(ID) {
  return request({
    url: '/report/stats/' + ID,
    method: 'get'
  })
}

// 新增报表配置
export function addReport(data) {
  return request({
    url: '/report/config',
    method: 'post',
    data: data
  })
}

// 修改报表配置
export function updateReport(data) {
  return request({
    url: '/report/config',
    method: 'put',
    data: data
  })
}

// 删除报表配置
export function delReport(ID) {
  return request({
    url: '/report/config/' + ID,
    method: 'delete'
  })
}

// 统计报表
export function reportStatistics(ID) {
  return request({
    url: '/report/statistic/' + ID,
    method: 'get'
  })
}
