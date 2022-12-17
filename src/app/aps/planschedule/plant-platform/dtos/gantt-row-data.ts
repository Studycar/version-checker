import { GanttTask } from './gantt-task';

export class GanttRowData {

    public name: string;

    public height: string;

    public children: Array<string>;

    public tasks: Array<GanttTask>;

    public movable: GanttDataMovable;

    public publicTime: string;

    public publicTimeDisplay: string;

    public color: string;

    public priorityTips: string;
}


export class GanttDataMovable {
    public allowResizing: boolean;
}
