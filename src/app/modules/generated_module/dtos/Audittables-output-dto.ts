/** 审计表定义 */
export class AudittablesOutputDto {
  /** 主键ID */
  public TABLEID: number;

  /** 用户表名 */
  public USERTABLENAME: string;

  /**应用模块  */
  public APPLICATIONID: string;

  /**表名  */
  public TABLENAME: string;

  /** 描述 */
  public DESCRIPTION: string;

  /** 状态 */
  public STATUS: string;

  /** 修改审计 */
  public AUDITUPDATE: string;

  /** 删除审计 */
  public AUDITDELETE: string;

  /** 审计表名 */
  public AUDITTABLENAME: string;

  /** 修改触发器 */
  public UPDATETRIGGERNAME: string;

  /**删除触发器  */
  public DELETETRIGGERNAME: string;
}
