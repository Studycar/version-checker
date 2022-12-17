export class GetScheduleGroupResourcesOutputDto {
    public ScheduleGroupResources: Array<ScheduleGroupResourceDto>;
}

export class ScheduleGroupResourceDto {
    /**
     * 编号
     *
     * @type {string}
     * @memberof ScheduleGroupResourceDto
     */
    public Code: string;

    /**
     * 描述
     *
     * @type {string}
     * @memberof ScheduleGroupResourceDto
     */
    public Descriptions: string;

    /**
     * 选中
     *
     * @type {boolean}
     * @memberof ScheduleGroupResourceDto
     */
    public Checked: boolean;

    public Resources: Array<ScheduleGroupResourceDto>;
}
