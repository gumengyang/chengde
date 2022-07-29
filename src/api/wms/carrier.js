import request from '@/utils/request'

// 查询承运商列表
export function listWmsCarrier(query, pageReq) {
  return request({
    url: '/wms/wmsCarrier/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询承运商详细
export function getWmsCarrier(id) {
  return request({
    url: '/wms/wmsCarrier/' + id,
    method: 'get'
  })
}

// 新增承运商
export function addWmsCarrier(data) {
  return request({
    url: '/wms/wmsCarrier',
    method: 'post',
    data: data
  })
}

// 修改承运商
export function updateWmsCarrier(data) {
  return request({
    url: '/wms/wmsCarrier',
    method: 'put',
    data: data
  })
}

// 删除承运商
export function delWmsCarrier(id) {
  return request({
    url: '/wms/wmsCarrier/' + id,
    method: 'delete'
  })
}

// 导出承运商
export function exportWmsCarrier(query) {
  return request({
    url: '/wms/wmsCarrier/export',
    method: 'get',
    params: query
  })
}
