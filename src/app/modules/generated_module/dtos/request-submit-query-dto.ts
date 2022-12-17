/// <summary>
/// 请求实体
/// </summary>
export class EtyRequest {
    public requestedBy: string;
    public scheduleType: string;
    public requestedStartDate: string;
    public responsibilityId: string;
    public concurrentProgramId: string;
    public requestId: string;
    public numberOfArguments?: number;
    public description: string;
    public resubmitInterval?: number;
    public resubmitIntervalUnitCode: string;
    public resubmitIntervalTypeCode: string;
    public scheduleStartDate: string;
    public scheduleEndDate: string;
    public resubmitted: string;
    public scheduleFlag: string;
    public incrementDates: string;
    public dicParaValue: { [key: string]: any; };
}

/// <summary>
/// 请求集实体
/// </summary>
export class EtyRequestSet {
    public requestedBy: string;
    public scheduleType: string;
    public requestedStartDate: string;
    public responsibilityId: string;
    public concurrentProgramId: string;
    public requestId: string;
    public numberOfArguments?: number;
    public description: string;
    public resubmitInterval?: number;
    public resubmitIntervalUnitCode: string;
    public resubmitIntervalTypeCode: string;
    public scheduleStartDate: string;
    public scheduleEndDate: string;
    public resubmitted: string;
    public scheduleFlag: string;
    public incrementDates: string;
    public dicParaValue: { [key: string]: any; };
}
