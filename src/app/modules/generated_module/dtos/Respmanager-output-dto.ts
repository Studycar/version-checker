/** 职责管理 */
export class RespmanagerOutputDto {
    /** 主键ID */
  public RESPID: string;

    /** 职责名称 */
  public RESPSNAME: string;

    /**职责代码  */
  public RESPSCODE: string;

    /**应用模块  */
  public APPLICATIONID: string;

  /** 描述 */
  public DESCRIPTION: string;

  /** 语言 */
  public LANGUAGE: string;

  /** 生效日期 */
  public STARTDATE: string;

  /** 失效日期 */
  public ENDDATE: string;
  
    /** 菜单组 */
  public MENUGROUPID: string;

  /** BASE_RESP_MENU表主键 */
  public ID: string;

  /** 请求组ID */
  public REQUESTGROUPID: string;

}
