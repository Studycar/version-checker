export class GetScheduleGroupResourcesOutputDto {
    public ScheduleGroupResources: Array<ScheduleGroupResourceDto>;
}

export class ScheduleGroupResourceDto {
    /// <summary>
    /// 编号
    /// </summary>
    public Code: string;

    /// <summary>
    /// 描述
    /// </summary>
    public Descriptions: string;

    /// <summary>
    /// 选中
    /// </summary>
    public Checked: boolean;

    public Resources: Array<ScheduleGroupResourceDto>;
}
