/** 通用的回应 */
export class ActionResponseDto {
    /** 是否成功 */
    public Success: boolean;
    /** 消息 */
    public Message: string;
    public msg: string;
    /** 附加数据 */
    public Extra: any;
    public data: any;
    public code: number;
}
