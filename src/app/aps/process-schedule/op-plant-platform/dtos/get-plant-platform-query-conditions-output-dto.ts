import { KeyValuePair } from './key-value-pair';

export class GetPlantPlatformQueryConditionsOutputDto {

    /// <summary>
    /// 事业部（Key：ScheduleRegionCode, Value：PlantCode）
    /// </summary>
    public ScheduleRegionPlants: Array<KeyValuePair>;

    /// <summary>
    /// 开始时间 时间为 0:0:0
    /// </summary>
    public StartDate: Date;

    /// <summary>
    /// 结束时间
    /// 需要读取系统参数配置 暂时默认StartDate + 15天 时间为 23：59：59
    /// </summary>
    public EndDate: Date;
}
