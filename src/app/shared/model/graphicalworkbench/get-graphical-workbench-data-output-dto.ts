import { GanttRowData } from './gantt-row-data';

export class GetGraphicalWorkbenchDataOutputDto {

    public data: Array<GanttRowData>;

    public GanttResourceCalendars: any;

    public RowSelectedColor: string;

    public CellSelectedColor: string;

    /**
     * 工单同物料
     *
     * @type {string}
     * @memberof GetGraphicalWorkbenchDataOutputDto
     */
    public SameItemCodeColor: string;

    /**
     * 工单同项目号
     *
     * @type {string}
     * @memberof GetGraphicalWorkbenchDataOutputDto
     */
    public SameProjectNumColor: string;

    /**
     * 标准工单
     *
     * @type {string}
     * @memberof GetGraphicalWorkbenchDataOutputDto
     */
    public StandardFalgYColor: string;
}
