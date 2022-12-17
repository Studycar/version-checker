/**  */
export class PsPrivilegeInputDto {
    /** Id */
  public id: string;

    /** 用户名称 */
  public userName: string;
    /** 用户描述 */
  public description: string;

    /** 工厂CODE */
  public plantCode: string;

    /**  产线组CODE*/
  public scheduleGroupCode: string;

    /**  产线CODE*/
  public resourceCode: string;
    /**  修改*/
  public modifyPrivilageFlag: string;
  /**  发放*/
  public publishPrivilageFlag: string;
  /**  是否发送邮件*/
  public sendEmailFlag: string;
  /**  接收消息类型*/
  public receiveMsgType: string;




}
