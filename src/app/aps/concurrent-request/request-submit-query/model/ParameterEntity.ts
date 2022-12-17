export class ParameterEntity {
    // 值
    public value: string;

    // 是否必填
    public requiredFlag: Boolean;

    // 默认值
    public defaultValue: string;

    // 共享字段名称
    public sharedParameterName: string;

    // 共享值
    public sharedValue: string;

    // 参数描述
    public label: string;
}
