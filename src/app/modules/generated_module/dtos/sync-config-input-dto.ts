/** 同步配置信息 */
export class SyncConfigInputDto {
    /** 表ID，主键，供其他表做外键 */
    public ConfigId: string;
    /** 系统代码 */
    public SystemCode: string;
    /** DBLINK名称 */
    public DblinkName: string;
    /** 来源表OWNER */
    public SourceTableOwner: string;
    /** 来源表名称 */
    public SourceTableName: string;
    /** 来源删除表 */
    public SourceTableNameForDel: string;
    /** 目标表名称 */
    public TargetTableName: string;
    /** 目标表唯一性索引列1 */
    public PkColumn1: string;
    /** 目标表唯一性索引列2 */
    public PkColumn2: string;
    /** 目标表唯一性索引列3 */
    public PkColumn3: string;
    /** 目标表唯一性索引列4 */
    public PkColumn4: string;
    /** 目标表唯一性索引列5 */
    public PkColumn5: string;
    /** 目标表唯一性索引列6 */
    public PkColumn6: string;
    /** 目标表唯一性索引列7 */
    public PkColumn7: string;
    /** 目标表唯一性索引列8 */
    public PkColumn8: string;
    /** 目标表唯一性索引列9 */
    public PkColumn9: string;
    /** 目标表唯一性索引列10 */
    public PkColumn10: string;
    /** 目标表唯一性索引列11 */
    public PkColumn11: string;
    /** 目标表唯一性索引列12 */
    public PkColumn12: string;
    /** 目标表唯一性索引列13 */
    public PkColumn13: string;
    /** 目标表唯一性索引列14 */
    public PkColumn14: string;
    /** 目标表唯一性索引列15 */
    public PkColumn15: string;
    /** 额外的限制条件1 */
    public AdditionalWhereClause1: string;
    /** 额外的限制条件2 */
    public AdditionalWhereClause2: string;
    /** 调用的API名称 */
    public ApiFullName: string;
    /** 扩展属性处理API */
    public HookApiName: string;
    /** 刷新模式，全部或增量刷新 */
    public RefreshMode: string;
    /** Job运行频率（小时） */
    public Freq: string;
    /** 删除跟踪日志程序包名称 */
    public TraceLogPackage: string;
    /** 删除跟踪表所有者 */
    public DelTableOwner: string;
    /**  */
    public CreationDate: string;
    /**  */
    public EndDate: string;
    /**  */
    public LastUpdateDate: string;
    /** Sync lead time on last refresh date. */
    public SyncLeadTime: string;
}
