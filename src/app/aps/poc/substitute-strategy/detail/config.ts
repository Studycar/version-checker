const BASE_URL = '/afs/serverpocsubstitutestrategy/substitutestrategy';

/** 获取明细 */
const GET_CODE_URL = `${BASE_URL}/querydetail`;
/** 根据ID删除明细 */
const DELETE_URL = `${BASE_URL}/deletedetail`;
/** 更新明细 */
const UPDATE_URL = `${BASE_URL}/updatedetail`;
/** 保存明细 */
const SAVE_URL = `${BASE_URL}/savedetail`;
/** 获取策略值信息 */
const GET_STRATEGY_INFO_URL = `${BASE_URL}/querystrategyinfo`;
/** 保存策略值信息 */
const SAVE_STRATEGY_INFO_URL = `${BASE_URL}/savestrategyinfo`;
/** 更新策略值信息 */
const UPDATE_STRATEGY_INFO_URL = `${BASE_URL}/updatestrategyinfo`;
/** 根据ID删除策略值信息 */
const DELETE_STRATEGY_INFO_URL = `${BASE_URL}/deletestrategyinfo`;

export const codeUrl = {
  getCode: GET_CODE_URL,
  delete: DELETE_URL,
  save: SAVE_URL,
  update: UPDATE_URL,
  getStrategyInfo: GET_STRATEGY_INFO_URL,
  saveStrategyInfo: SAVE_STRATEGY_INFO_URL,
  updateStrategyInfo: UPDATE_STRATEGY_INFO_URL,
  deleteStrategyInfo: DELETE_STRATEGY_INFO_URL,
};
