import { GanttRowData } from './gantt-row-data';

export class GetPlantPlatformDataOutputDto {
    public data: Array<GanttRowData>;

    public GanttResourceCalendars: any;

    public RowSelectedColor: string;

    public CellSelectedColor: string;

    /// <summary>
    /// 工单同物料
    /// </summary>
    public SameItemCodeColor: string;

    /// <summary>
    /// 工单同项目号
    /// </summary>
    public SameProjectNumColor: string;

    /// <summary>
    /// 标准工单
    /// </summary>
    public StandardFalgYColor: string;
}
