/** 通用的回应 */
export class ConcurrentProgramSerialDto {
  /// <summary>
        /// 并发程序ID
        /// </summary>
        public  RUNNINGCONCURRENTPROGRAMID: number;

        /// <summary>
        /// 并发程序
        /// </summary>
        public  RUNNINGCONCURRENTPROGRAMNAME: number;

        /// <summary>
        /// 互斥并发程序ID
        /// </summary>
        public  TORUNCONCURRENTPROGRAMID: number;

        /// <summary>
        /// 互斥并发程序
        /// </summary>
        public  TORUNCONCURRENTPROGRAMNAME: string;

        /// <summary>
        /// 应用模块ID
        /// </summary>
        public  APPLICATIONID: number;

        /// <summary>
        /// 应用模块
        /// </summary>
        public  APPLICATIONNAME: string;

        /// <summary>
        /// 不兼容类型ID
        /// </summary>
        public  INCOMPATIBILITYTYPE: string;

        /// <summary>
        /// 不兼容类型
        /// </summary>
        public  INCOMPATIBILITYTYPENAME: string;
}
