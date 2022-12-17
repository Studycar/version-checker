/** 用户刷新 */
export class SyncRefreshHistoryInputDto {

    /** 系统名称 */
  public SYSTEM_CODE: string;
    /** 表名 */
  public TABLE_NAME: string;
    /** 最后刷新日期 */
  public LAST_REFRESH_DATE: string;
    /** 创建时间 */
  public CREATION_DATE: string;
    /** 最后更新时间 */
  public LAST_UPDATE_DATE: string;
    /** 创建人 */
  public CREATED_BY: string;

  /** 最后修改人 */
  public LAST_UPDATED_BY: string;
  /** 工厂ID */
  public PLANT_ID: string;
  /** 组织ID */
  public ORGANIZATION_ID: string;

}
