import { KeyValuePair } from "./key-value-pair";

export class GanttTask {
    /// <summary>
    /// Unique id of the task (Optional)
    /// </summary>
    public id: string;

    /// <summary>
    ///  Name shown on top of each task
    /// </summary>
    public name: string;

    /// <summary>
    /// Date can be a String, Timestamp, Date object or moment object
    /// </summary>
    public from: Date;

    /// <summary>
    /// Date can be a String, Timestamp, Date object or moment object
    /// </summary>
    public to: Date;

    /// <summary>
    /// Color of the task in HEX format (Optional)
    /// </summary>
    public color: string;

    /// <summary>
    /// 工单状态对应的颜色
    /// </summary>
    public moStatusColor: string;

    /// <summary>
    /// 工单提前延后对应的颜色
    /// </summary>
    public moAheadDelayColor: string;

    /// <summary>
    /// 工单齐套颜色
    /// </summary>
    public moKitColor: string;

    /// <summary>
    /// 产线 方便跨产线调整
    /// </summary>
    public resCode: string;

    /// <summary>
    /// 进度
    /// </summary>
    public progress: GanttTaskProgress;

    /// <summary>
    /// 依赖
    /// </summary>
    public dependencies: Array<GanttTaskDependence>;

    /// <summary>
    /// 依赖
    /// </summary>
    public tempDependencies: Array<GanttTaskDependence>;

    /// <summary>
    ///  Defines which of an overlapping task is on top (Optional). Tip: Leave property away for default behaviour
    /// </summary>
    public priority: number;

    /// <summary>
    /// 是否可以移动
    /// </summary>
    public movable: boolean;

    /// <summary>
    /// 任务可呈现的内容
    /// </summary>
    public taskTooltipsContent: TaskTooltipsContent;

    /// <summary>
    /// 功能能移动的产线和优先级
    /// </summary>
    public moResCodePriorities: Array<KeyValuePair>;

    /// <summary>
    /// 可见性
    /// </summary>
    public visible: boolean;

    /// <summary>
    /// 1、当同一资源下面； 2、非固定的工单； 3、相同物料号； 4、to == from； 组成一个大工单，此属性用来保存组成大工单的子工单。
    /// </summary>
    public childTasks: Array<GanttTask>;

    /// <summary>
    /// 工单例外标识
    /// </summary>
    public exception: GanttTaskException;
}

/// <summary>
/// 任务进度
/// </summary>
export class GanttTaskProgress {
    /// <summary>
    /// 百分比
    /// </summary>
    public percent: number;

    /// <summary>
    /// 颜色
    /// </summary>
    public color: string;
}

/// <summary>
/// 任务依赖
/// </summary>
export class GanttTaskDependence {
    /// <summary>
    ///  "tast.id"
    /// </summary>
    public to: string;
}

/// <summary>
/// 任务可呈现的内容
/// </summary>
export class TaskTooltipsContent {

    /// <summary>
    /// 工单号
    /// </summary>
    public MAKE_ORDER_NUM: string;

    /// <summary>
    /// 物理编码
    /// </summary>
    public ITEM_CODE: string;

    /// <summary>
    /// 物料描述
    /// </summary>
    public DESCRIPTIONS_CN: string;

    /// <summary>
    /// 要求时间
    /// </summary>
    public DEMAND_DATE: string;

    /// <summary>
    /// 工单数量
    /// </summary>
    public MO_QTY: Number;

    /// <summary>
    /// 项目号
    /// </summary>
    public PROJECT_NUMBER: string;

    /// <summary>
    /// 标准工单 Y\N
    /// </summary>
    public STANDARD_FLAG: string;
}

/// <summary>
/// 工单例外
/// </summary>
export class GanttTaskException {
    /// <summary> 
    /// 工单例外标识 
    /// </summary> 
    public warnningFlag: boolean;
    /// <summary> 
    /// 颜色 
    /// </summary> 
    public color: string;
}
