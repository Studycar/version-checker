/** 值集定义 */
export class BaseFlexValidationTablesInputDto {
    // 值集ID
    public flexValueSetId: number;
    // 表名
    public applicationTableName: string;
    // 显示字段名
    public valueColumnName: string;
    // 显示字段类型
    public valueColumnType: string;
    // 显示字段SIZE
    public valueColumnSize: string;
    // ID字段名
    public idColumnName: string;
    // ID字段SIZE
    public idColumnSize: string;
    // ID字段类型
    public idColumnType: string;
    // 描述字段名
    public meaningColumnName: string;
    // 描述字段SIZE
    public meaningColumnSize: string;
    // 描述字段类型
    public meaningColumnType: string;
    // 附加where条件或者order by语句
    public additionalWhereClause: string;
}
