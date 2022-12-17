export class ValueTag {
    // 值集ID
    public flexValueSetId?: string;

    // 是否需要重复绑定数据
    public isRepeatBind?: boolean;

    // 值集查询定义
    public rowGFVT?: any;

    // 值集名
    public flexName?: string;

    // 查询条件
    public whereClause?: string;

    /// 关联的上级值集名,:$FLEX$.的使用是否为等于
    public dicParentFlexName?: { [key: string]: boolean } = {};
}
