/** 同步配置信息db字段 */
export class SyncConfigInputDtoDb {
    /** 表ID，主键，供其他表做外键 */
    public CONFIG_ID: string;
    /** 系统代码 */
    public SYSTEM_CODE: string;
    /** DBLINK名称 */
    public DBLINK_NAME: string;
    /** 来源表OWNER */
    public SOURCE_TABLE_OWNER: string;
    /** 来源表名称 */
    public SOURCE_TABLE_NAME: string;
    /** 来源删除表 */
    public SOURCE_TABLE_NAME_FOR_DEL: string;
    /** 目标表名称 */
    public TARGET_TABLE_NAME: string;
    /** 目标表唯一性索引列1 */
    public PK_COLUMN1: string;
    /** 目标表唯一性索引列2 */
    public PK_COLUMN2: string;
    /** 目标表唯一性索引列3 */
    public PK_COLUMN3: string;
    /** 目标表唯一性索引列4 */
    public PK_COLUMN4: string;
    /** 目标表唯一性索引列5 */
    public PK_COLUMN5: string;
    /** 目标表唯一性索引列6 */
    public PK_COLUMN6: string;
    /** 目标表唯一性索引列7 */
    public PK_COLUMN7: string;
    /** 目标表唯一性索引列8 */
    public PK_COLUMN8: string;
    /** 目标表唯一性索引列9 */
    public PK_COLUMN9: string;
    /** 目标表唯一性索引列10 */
    public PK_COLUMN10: string;
    /** 目标表唯一性索引列11 */
    public PK_COLUMN11: string;
    /** 目标表唯一性索引列12 */
    public PK_COLUMN12: string;
    /** 目标表唯一性索引列13 */
    public PK_COLUMN13: string;
    /** 目标表唯一性索引列14 */
    public PK_COLUMN14: string;
    /** 目标表唯一性索引列15 */
    public PK_COLUMN15: string;
    /** 额外的限制条件1 */
    public ADDITIONAL_WHERE_CLAUSE1: string;
    /** 额外的限制条件2 */
    public ADDITIONAL_WHERE_CLAUSE2: string;
    /** 调用的API名称 */
    public API_FULL_NAME: string;
    /** 扩展属性处理API */
    public HOOK_API_NAME: string;
    /** 刷新模式，全部或增量刷新 */
    public REFRESH_MODE: string;
    /** Job运行频率（小时） */
    public FREQ: string;
    /** 删除跟踪日志程序包名称 */
    public TRACE_LOG_PACKAGE: string;
    /** 删除跟踪表所有者 */
    public DEL_TABLE_OWNER: string;
    /**  */
    public CREATION_DATE: string;
    /**  */
    public LAST_UPDATE_DATE: string;
    /** Sync lead time on last refresh date. */
    public SYNC_LEAD_TIME: string;
}
