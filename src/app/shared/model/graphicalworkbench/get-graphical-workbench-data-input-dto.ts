import { KeyValuePair } from './key-value-pair';

export class GetGraphicalWorkbenchDataInputDto {

    /**
     * 组织编码
     *
     * @type {string}
     * @memberof GetGraphicalWorkbenchDataInputDto
     */
    public PlantCode: string;

    /**
     * 开始时间
     *
     * @type {Date}
     * @memberof GetGraphicalWorkbenchDataInputDto
     */
    public StartDate: Date;

    /**
     * 结束时间
     *
     * @type {Date}
     * @memberof GetGraphicalWorkbenchDataInputDto
     */
    public EndDate: Date;

    /**
     * KEY:计划组 VALUES:资源（生产线）
     *
     * @type {Array<KeyValuePair>}
     * @memberof GetGraphicalWorkbenchDataInputDto
     */
    public ScheduleGroupResources: Array<KeyValuePair>;
}
