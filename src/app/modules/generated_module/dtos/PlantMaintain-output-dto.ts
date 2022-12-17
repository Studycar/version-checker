/** 工厂维护管理 */
export class PlantMaintainOutputDto {
   /** 主键ID */
  public PLANTID: string;

  /**新增NEWFLAG */
  public NEWFLAG: string;

    /** 组织 */
  public PLANTCODE: string;

    /**工厂描述  */
  public DESCRIPTIONS: string;

    /**事业部  */
  public SCHEDULEREGIONID: string;

  /** 事业部名称 */
  public BUORGID: string;

  /** 主组织 */
  public MASTERORGANIZATIONID: string;

  /** 发运集警告天数 */
  public WARNINGDAY: string;

  /** 小单数量 */
  public SMALLQTY: string;

  /** 自动调整不满足时间工单 */
  public AUTOADJUSTMENTFLAG: string;

  /** 是否有效 */
  public ENABLEFLAG: string;

  /**AFP计划  */
  public PUBLISHPLAN: string;

   /**业务实体  */
  public OPERATINGUNIT: string;

}
