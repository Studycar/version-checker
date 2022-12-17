export class EtyRequestPlan {
    /// <summary>
    /// 计划类型,A，立即；O，一次；P，定期
    /// </summary>
    scheduleType: string;

    /// <summary>
    /// 调度标识，非立即运行的请求，这个值给’Y’；立即运行请求，这个值给’N’
    /// </summary>
    scheduleFlag: string;

    /// <summary>
    /// 重复提交标志，计划设置为“定期”的，给值“Y”，其它情况给值“N”；
    /// </summary>
    resubmitted: string;

    /// <summary>
    /// 运行时间；如果是立即运行，这个时间给系统当前日期；
    /// 如果是一次性，则为指定的时间；如果是定期，则为请求运行的“起始日期”
    /// </summary>
    runningTime: any;

    /// <summary>
    /// 终止日期，计划设置为“定期”的，给值“终止日期”，其它情况不给值；
    /// </summary>
    resubmitEndDate: any;

    /// <summary>
    /// 重新提交时间间隔
    /// </summary>
    resubmitInterval: number;

    /// <summary>
    /// 重新提交时间间隔单位
    /// </summary>
    resubmitIntervalUnitCode: string;

    /// <summary>
    /// 计算间隔时间是以请求开始时间还是结束时间开始计算start,end
    /// </summary>
    resubmitIntervalTypeCode: string;

    /// <summary>
    /// 设置每次运行的日期增量参数,Y，没勾选给N
    /// </summary>
    incrementDates: boolean;
}
