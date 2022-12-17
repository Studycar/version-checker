import { KeyValuePair } from './key-value-pair';

export class GetPlantPlatformDataInputDto {
    /// <summary>
    /// 组织编码
    /// </summary>
    public PlantCode: string;

    /// <summary>
    /// 开始时间
    /// </summary>
    public StartDate: Date;

    /// <summary>
    /// 结束时间
    /// </summary>
    public EndDate: Date;

    /// <summary>
    /// KEY:计划组 VALUES:资源（生产线）
    /// </summary>
    public ScheduleGroupResources: Array<KeyValuePair>;
}
