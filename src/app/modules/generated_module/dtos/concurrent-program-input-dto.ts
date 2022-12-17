// 并发程序定义
export class ConcurrentProgramInputDto {

        public  CONCURRENTPROGRAMID: string;
       /// <summary>
        /// 程序
        /// </summary>
        public  USERCONCURRENTPROGRAMNAME: string;

        /// <summary>
        /// 简称
        /// </summary>
        public  CONCURRENTPROGRAMNAME: string;

        /// <summary>
        /// 应用模块ID
        /// </summary>
        public  APPLICATIONID: string;

        /// <summary>
        /// 应用模块
        /// </summary>
        public  APPLICATIONNAME: string;

        /// <summary>
        /// 说明
        /// </summary>
        public DESCRIPTION: string;

        /// <summary>
        /// 可执行名称ID
        /// </summary>
        public  EXECUTABLEID: string;

        /// <summary>
        /// 可执行名称
        /// </summary>
        public  EXECUTABLENAME: string;

        /// <summary>
        /// 方法
        /// </summary>
        public EXECUTIONMETHODCODE: string;

        /// <summary>
        /// 优先级
        /// </summary>
        public  REQUESTPRIORITY: string;

        /// <summary>
        /// 请求类型ID
        /// </summary>
        public  CONCURRENTCLASSID: string;

        /// <summary>
        /// 请求类型
        /// </summary>
        public CONCURRENTCLASSMEANING: string;

         /// <summary>
        /// 输出格式
        /// </summary>
        public SOURCELANG: string;

        /// <summary>
        /// 输出格式
        /// </summary>
        public  OUTPUTFILETYPE: string;

        /// <summary>
        /// 启用跟踪
        /// </summary>
        public  ENABLETRACE: string;

        public CONFLICTPARAMETER: string;
}
