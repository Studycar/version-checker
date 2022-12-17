import { KeyValuePair } from './key-value-pair';

export class GetGraphicalWorkbenchQueryConditionsOutputDto {

    /**
     * 事业部（Key：ScheduleRegionCode, Value：PlantCode）
     *
     * @type {Array<KeyValuePair>}
     * @memberof GetGraphicalWorkbenchQueryConditionsOutputDto
     */
    public ScheduleRegionPlants: Array<KeyValuePair>;

    /**
     * 开始时间 时间为 0:0:0
     *
     * @type {Date}
     * @memberof GetGraphicalWorkbenchQueryConditionsOutputDto
     */
    public StartDate: Date;

    /**
     * 需要读取系统参数配置 暂时默认StartDate + 15天 时间为 23：59：59
     * 结束时间
     * @type {Date}
     * @memberof GetGraphicalWorkbenchQueryConditionsOutputDto
     */
    public EndDate: Date;
}
