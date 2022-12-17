/** 事业部 */
export class ScheduleRegionDto {
  /**事业部ID  */
  public id: string;
  /**事业部  */
  public scheduleRegionCode: string;
  /**描述  */
  public descriptions: string;
  /**计划编号  */
  public planningCode: string;
  /**计划描述  */
  public description: string;
  /**是否有效  */
  public enableFlag: string;
  /** 计划类型ID */
  public planningTypeId: string;
  /** 计划类型CODE */
  public planningType: string;
  /**计划类型  */
  public meaning: string;
  /** 发运集警告天数 */
  public shipmentsetWarningdays: string;
  /** 父子集警告天数 */
  public subsetWarningdays: string;
  /** 计划滚动起始时间 */
  public planStartTime: string;
  /**计划滚动周期（天）  */
  public periodicTime: string;
  /** 计划ID */
  public planningId: string;
  /** 需求时间栏（天） */
  public demandTimeFence: string;
  /** 计划时间栏（天） */
  public scheduleTimeFence: string;
  /** 排产时间栏（天） */
  public planningTimeFence: string;
  /** 固定时间栏（天） */
  public fixTimeFence: string;
  /** 顺排时间栏（天） */
  public forwardPlanningTimeFence: string;
  /** 下达时间栏（天） */
  public releaseTimeFence: string;
  /** 订单时间栏（天） */
  public orderTimeFence: string;
  /**  */
  public creationDate: string;
  /**  */
  public createdBy: string;
  /**  */
  public lastUpdateDate: string;
  /**  */
  public lastUpdatedBy: string;
}
