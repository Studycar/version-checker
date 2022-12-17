/**
 * 任务可呈现的内容
 *
 * @export
 * @class GanttTaskTooltipsContent
 */
export class GanttTaskTooltipsContent {
    /**
     * 工单号
     *
     * @type {string}
     * @memberof GanttTaskTooltipsContent
     */
    public MAKE_ORDER_NUM: string;

    /**
     * 物理编码
     *
     * @type {string}
     * @memberof GanttTaskTooltipsContent
     */
    public ITEM_CODE: string;

    /**
     * 物料描述
     *
     * @type {string}
     * @memberof GanttTaskTooltipsContent
     */
    public DESCRIPTIONS_CN: string;

    /**
     * 要求时间
     *
     * @type {string}
     * @memberof GanttTaskTooltipsContent
     */
    public DEMAND_DATE: string;

    /**
     * 工单数量
     *
     * @type {Number}
     * @memberof GanttTaskTooltipsContent
     */
    public MO_QTY: Number;

    /**
     * 完工数量
     *
     * @type {Number}
     * @memberof GanttTaskTooltipsContent
     */
    public MO_COMPLETED_QTY: Number;
    
    /**
     * 项目号
     *
     * @type {string}
     * @memberof GanttTaskTooltipsContent
     */
    public PROJECT_NUMBER: string;

    /**
     * 标准工单 Y\N
     *
     * @type {string}
     * @memberof GanttTaskTooltipsContent
     */
    public STANDARD_FLAG: string;

    /**
     * 工序描述
     *
     * @type {string}
     * @memberof GanttTaskTooltipsContent
     */
    public OPDESCRIPTION: string;
}
