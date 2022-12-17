import { Injectable } from '@angular/core';

const STORE_KEY = 'aps_navigate_transfer_data'

interface GetDataOptions {
  /** 是否保留存储的数据 */
  keep?: boolean
}

/**
 * 跳转页面时进行数据传递
 */
@Injectable({
  providedIn: 'root',
})
export class NavigateDataTransferService {
  constructor() {}

  setData (data) {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  }

  getData (options: GetDataOptions = {}): any {
    const { keep } = options
    let data = {}
    try {
      data = JSON.parse(localStorage.getItem(STORE_KEY)) || {}
    } catch (e) {
      console.error("解析 JSON 时出错 ==>", e)
    } finally {
      if (!keep) {
        localStorage.removeItem(STORE_KEY)
      }
      return data
    }
  }

  removeData () {
    localStorage.removeItem(STORE_KEY)
  }
}
