export class ExecutablesInputDto {
  // 主键
  public ExecutableID: number;

  // 执行简称
  public ExecutableName: string;

  // "描述"
  public Description: string;

  // "执行方法,I, PL/SQL存储过程；H, Host")
  public ExecutionMethodCode: string;

  // "执行程序名称"
  public ExecutionFileName: string;

  // "应用模块ID"
  public ApplicationID: number;
  
    // "应用模块"
    public ApplicationName: string;
}
