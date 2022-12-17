/** 计划组维护管理 */
export class ProlineGroupMaintainOutputDto {
    /** 主键ID */
  public ID: string;

     /**新增NEWFLAG */
  public NEWFLAG: string;

    /** 事业部编码 */
  public SCHEDULE_REGION_CODE: string;

    /**计划组编码  */
  public SCHEDULE_GROUP_CODE: string;

    /**计划组简码  */
  public SCHEDULE_GROUP_SHORT_CODE: string;

  /** 描述 */
  public DESCRIPTIONS: string;

  /** 排产滚动开始时间 */
  public SCHEDULE_START_TIME: string;

  /** 排产滚动周期 */
  public SCHEDULE_PERIOD: string;

  /** 排程算法 */
  public SCHEDULE_ALGORITHM: string;

  /** 固定时间栏(天) */
  public FIX_TIME_FENCE: string;

  /** 工单完工偏移量(小时) */
  public MO_COMPLETE_TIME_OFFSET: string;

  /** 排产平台的排序码  */
  public  ORDER_BY_CODE: string;

   /**  联动层级  */
  public LINKAGE_LEVEL: string;

    /**  联动发放下层跟单件  */
  public LINKAGE_RELEASE_FLAG: string;

    /**  冻结期默认天数  */
  public FREEZEN_DAYS: string;

    /**  冻结期间数量  */
  public FREEZEN_MAX_QTY: string;

   /**  自动打开冻结期  */
  public AUTO_OPEN_FREEZEN_FLAG: string;

    /**  启用模具  */
  public ENABLE_MOULD: string;

    /**  启用工序排产标识  */
  public OPERATION_SCHEDULE_FLAG: string;

    /**  工序排产算法  */
  public OPERATION_ARITHMETIC: string;

    /**  是否有效  */
  public ENABLE_FLAG: string;

}
