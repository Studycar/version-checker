/** 用户会话上下文信息 */
export class SessionContextDto {
    /** 用户Id */
    public UserId: string;
    /** 用户名 */
    public UserName: string;
    /** 组织代码 */
    public PlantCode: string;
    /** 职责代码 */
    public RespCode: string;
    /** 当前语言 */
    public Culture: string;
    /** 会话Id */
    public SessionId: string;
    /** 系统名 */
    public SysName: string;
    /** 事业部Id */
    public ScheduleRegionID: string;
}
