/** 用户职责关系 */
export class UserManagerRespInputDto {
    /** 用户ID */
    public user_id: string;
    /** 职责ID */
    public resp_id: string;
    /** 开始时间 */
    public start_date: string;
    /** 结束时间 */
    public end_date: string;
    /** 用户关系ID */
    public user_resp_id: string;
}
