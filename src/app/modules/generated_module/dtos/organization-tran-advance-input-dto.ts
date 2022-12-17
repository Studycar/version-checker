/** 多语言翻译 */
export class OrganizationTranAdvanceInputDto {
    /** Id */
    public userId: string;

    /** 组织从Code */
    public fromOrgCode: string;

    /** 组织从Id */
    public fromOrgId: string;

    /** 到组织Id */
    public toOrgId: string;

    /** 到组织Code */
    public toOrgCode: string;

    /** 计划组从ID */
    public from_planning_group_id: string;

    /** 计划组从 */
    public from_planning_group_name: string;

    /** 到计划组Id */
    public to_planning_group_id: string;
    /** 到计划组 */
    public to_planning_group_name: string;

    /** 传输时间 */
    public PG_TRANSFER_LT: string;

    /** 判断操作类型 */
    public operationFlag: string;
}
