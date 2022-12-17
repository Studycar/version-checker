import { formatDate } from '@angular/common';
/** 快码 */
export class SubstituteStrategyDetail {
  /** Id */
  public ID: number;
  /** 工厂编码 */
  public PLANT_CODE = '';
  /** 替代编号 */
  public SUBSTITUTE_CODE = '';
  /** 替代组 */
  public SUBSTITUTE_GROUP = '';
  /** 消耗优先级 */
  public USE_PRIORITY = '';
  /** 采购比例 */
  public BUY_PERSENT = '';
  /** 物料编码 */
  public ITEM_CODE = '';
  /** 单位使用量 */
  public USAGE = '';
  /** 关键物料 */
  public KEY_FLAG = '';
  /** 生效日期 */
  public EFFECTIVITY_DATE: string = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'zh-cn');
  /** 失效日期 */
  public DISABLE_DATE: string = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'zh-cn');

}
