// 切边标识
const NEED_SITE_CUT: any[] = [
  { 'label': '切', 'value': '1' },
  { 'label': '不切', 'value': '0' }
];

// 齐套类型
const LOCK_FLAG: any[] = [
  {
    label: '已锁料',
    value: 'L'
  },
  {
    label: '已选料',
    value: 'Y'
  },
  {
    label: '未选料',
    value: 'N'
  },
  {
    label: '已领料',
    value: 'P'
  },
];

// 生成工单状态
const MO_FLAG: any[] = [
  {
    label: '已生成',
    value: 'Y'
  },
  {
    label: '未生成',
    value: 'N'
  },
];

// 需求状态
const REQ_STATUS: any[] = [
  {
    label: '新增',
    value: 'NEW'
  },
  {
    label: '取消',
    value: 'CANCELLED'
  },
];

// 计划生产审核标记
const PLAN_AUDIT_FLAG: any[] = [
  {
    label: '已审核',
    value: 'Y'
  },
  {
    label: '未审核',
    value: 'N'
  },
];

// 需求类型--原材料采购需求
const DEMAND_TYPE: any[] = [
  {
    label: '系统创建',
    value: 'system'
  },
  {
    label: '人工创建',
    value: 'manual'
  },
];

// 推送SRM标识--原材料采购需求
const PUSH_STATE: any[] = [
  {
    label: '已推送',
    value: 'Y'
  },
  {
    label: '未推送',
    value: 'N'
  },
  {
    label: '推送中',
    value: 'M'
  },
  {
    label: '推送失败',
    value: 'E'
  },
];

export const LOOKUP_CODE = {
  REQ_STATUS,
  MO_FLAG,
  LOCK_FLAG,
  NEED_SITE_CUT,
  PLAN_AUDIT_FLAG,
  DEMAND_TYPE,
  PUSH_STATE,
}