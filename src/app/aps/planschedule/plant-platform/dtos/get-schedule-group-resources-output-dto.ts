/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2021-03-23 09:36:06
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-23 19:18:55
 * @Note: ...
 */
export class GetScheduleGroupResourcesOutputDto {
    public scheduleGroupResources: Array<ScheduleGroupResourceDto>;
}

export class ScheduleGroupResourceDto {
    /// <summary>
    /// 编号
    /// </summary>
    public code: string;

    /// <summary>
    /// 描述
    /// </summary>
    public descriptions: string;

    /// <summary>
    /// 选中
    /// </summary>
    public checked: boolean;

    public resources: Array<ScheduleGroupResourceDto>;
}
