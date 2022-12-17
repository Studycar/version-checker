/** Function管理 */
export class FunctionmanagerInputDto {
    /** 主键ID */
  public id: string;

    /** 功能名称 */
  public functionName: string;

    /**功能代码  */
  public functionCode: string;

    /**应用模块  */
  public applicationName: string;

  /** 功能路径 */
  public functionPath: string;

  /** 功能类型 */
  public functionType: string;

  /** 参数 */
  public PARAMETERS: string;

  /** 有效 */
  public enabledFlag: string;

  /** 描述 */
  public description: string;

  /** 语言 */
  public language: string;

  /**引用  */
  public attribute1: string;

}
