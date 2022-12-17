const BASE_URL = '/api/admin/baselookuptypesb';

/** 获取快码 */
const GET_CODE_URL = `${BASE_URL}/querylookupvalue`;
/** 根据ID删除快码 */
const DELETE_URL = `${BASE_URL}/deletelookupcodevalue`;
/** 更新快码 */
const UPDATE_URL = `${BASE_URL}/updatelookupvalue`;
/** 保存快码 */
const SAVE_URL = `${BASE_URL}/savelookupvalue`;

export const codeUrl = {
  getCode: GET_CODE_URL,
  delete: DELETE_URL,
  save: SAVE_URL,
  update: UPDATE_URL,
};
