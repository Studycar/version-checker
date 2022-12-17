/** 通用的回应 */
export class ConcurrentProgramParameterDto {
 /// <summary>
        /// 主键
        /// </summary>
        public  CONCURRENTPARAMETERID: number;

        /// <summary>
        /// 程序ID
        /// </summary>
        public CONCURRENTPROGRAMID: number;

        /// <summary>
        /// 序号
        /// </summary>
        public  COLUMNSEQNUM: number;

        /// <summary>
        /// 参数名
        /// </summary>
        public  ENDUSERCOLUMNNAME: string;

        /// <summary>
        /// 参数描述
        /// </summary>
        public  DESCRIPTION: string;

        /// <summary>
        /// 参数互斥标识
        /// </summary>
        public  CONFICTFLAG: string;
        public  CONFICTFLAGNAME: string;

        /// <summary>
        /// 生效标识
        /// </summary>
        public  ENABLEDFLAG: string;
        public  ENABLEDFLAGNAME: string;

        /// <summary>
        /// 值集名称
        /// </summary>
        public  FLEXVALUESETID: number;
        public  FLEXVALUESETNAME: string;

        /// <summary>
        /// 默认值类型:S,SQL 语句; C,常量；P，配置文件
        /// </summary>
        public  DEFAULTTYPE: string;
        public  DEFAULTTYPENAME: string;

        /// <summary>
        /// 默认值
        /// </summary>
        public  DEFAULTVALUE: string;


        /// <summary>
        /// 必需标识
        /// </summary>
        public  REQUIREDFLAG: string;

        /// <summary>
        /// 数值范围
        /// </summary>
        public  RANGECODE: string;
        public  RANGECODENAME: string;

        /// <summary>
        /// 显示标识
        /// </summary>
        public  DISPLAYFLAG: string;

        public  DISPLAYFLAGNAME: string;

        /// <summary>
        /// 值显示尺寸,包含界面和LOV
        /// </summary>
        public  DISPLAYSIZE: number;

        /// <summary>
        /// 说明大小,包含界面和LOV
        /// </summary>
        public  MAXIMUMDESCRIPTIONLEN: number;

        /// <summary>
        /// 提示
        /// </summary>
        public USERPROMPTNAME: string;
}
