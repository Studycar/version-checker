import { KeyValuePair } from './key-value-pair';
import { GanttTaskProgress } from './gantt-task-progress';
import { GanttTaskDependence } from './gantt-task-dependence';
import { GanttTaskTooltipsContent } from './Gantt-task-tooltips-content';
import { GanttTaskException } from './gantt-task-exception';

export class GanttTask {
    /**
     * Unique id of the task (Optional)
     *
     * @type {string}
     * @memberof GanttTask
     */
    public id: string;

    /**
     * Name shown on top of each task
     *
     * @type {string}
     * @memberof GanttTask
     */
    public name: string;

    /**
     * Date can be a String, Timestamp, Date object or moment object
     *
     * @type {Date}
     * @memberof GanttTask
     */
    public from: Date;

    /**
     * Date can be a String, Timestamp, Date object or moment object
     *
     * @type {Date}
     * @memberof GanttTask
     */
    public to: Date;

    /**
     * Color of the task in HEX format (Optional)
     *
     * @type {string}
     * @memberof GanttTask
     */
    public color: string;

    /**
     * 工单状态对应的颜色
     *
     * @type {string}
     * @memberof GanttTask
     */
    public moStatusColor: string;

    /**
     * 工单提前延后对应的颜色
     *
     * @type {string}
     * @memberof GanttTask
     */
    public moAheadDelayColor: string;

    /**
     * 工单齐套颜色
     *
     * @type {string}
     * @memberof GanttTask
     */
    public moKitColor: string;

    /**
     * 产线 方便跨产线调整
     *
     * @type {string}
     * @memberof GanttTask
     */
    public resCode: string;

    /**
     * 进度
     *
     * @type {GanttTaskProgress}
     * @memberof GanttTask
     */
    public progress: GanttTaskProgress;

    /**
     * 依赖
     *
     * @type {Array<GanttTaskDependence>}
     * @memberof GanttTask
     */
    public dependencies: Array<GanttTaskDependence>;

    /**
     * 依赖
     *
     * @type {Array<GanttTaskDependence>}
     * @memberof GanttTask
     */
    public tempDependencies: Array<GanttTaskDependence>;

    /**
     * Defines which of an overlapping task is on top (Optional). Tip: Leave property away for default behaviour
     *
     * @type {number}
     * @memberof GanttTask
     */
    public priority: number;

    /**
     * 是否可以移动
     *
     * @type {boolean}
     * @memberof GanttTask
     */
    public movable: boolean;

    /**
     * 任务可呈现的内容
     *
     * @type {GanttTaskTooltipsContent}
     * @memberof GanttTask
     */
    public taskTooltipsContent: GanttTaskTooltipsContent;

    /**
     * 功能能移动的产线和优先级
     *
     * @type {Array<KeyValuePair>}
     * @memberof GanttTask
     */
    public moResCodePriorities: Array<KeyValuePair>;

    /**
     * 可见性
     *
     * @type {boolean}
     * @memberof GanttTask
     */
    public visible: boolean;

    /**
     * 1、当同一资源下面； 2、非固定的工单； 3、相同物料号； 4、to == from； 组成一个大工单，此属性用来保存组成大工单的子工单。
     *
     * @type {Array<GanttTask>}
     * @memberof GanttTask
     */
    public childTasks: Array<GanttTask>;

    /**
     * 工单例外标识
     *
     * @type {GanttTaskException}
     * @memberof GanttTask
     */
    public exception: GanttTaskException;

    /**
     * 尾数标识
     *
     * @type {string}
     * @memberof GanttTask
     */
    public BACKLOG_FLAG: string;

    /**
     * 工单状态
     *
     * @type {string}
     * @memberof GanttTask
     */
    public MAKE_ORDER_STATUS: string;

    /**
     * 工序编码
     *
     * @type {string}
     * @memberof GanttTask
     */
    public PROCESS_CODE: string;

    /**
     * 物料编码ID
     *
     * @type {string}
     * @memberof GanttTask
     */
    public ITEM_ID: string;

    /**
     * 来源工单号
     *
     * @type {string}
     * @memberof GanttTask
     */
    public SOURCE_MAKE_ORDER_NUM: string;
}




