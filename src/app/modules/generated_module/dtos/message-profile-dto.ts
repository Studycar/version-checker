export class MessageProfileDto {

        public Id: string;

        public MESSGAE_TYPE: string;

        /// <summary>
        /// Desc:标题
        /// Default:
        /// Nullable:False
        /// </summary>
        public TITLE: string;

        /// <summary>
        /// Desc:层级
        /// Default:DateTime.Now
        /// Nullable:False
        /// </summary>
        public LEVEL: string;

        /// <summary>
        /// Desc:值
        /// Default:
        /// Nullable:True
        /// </summary>
        public VALUVE: string;
        /// <summary>
        /// Desc:接收角色
        /// Default:
        /// Nullable:True
        /// </summary>
        public ROLE: string;

        /// <summary>
        /// Desc:接收人
        /// Default:
        /// Nullable:True
        /// </summary>
        public RECEIVER: string;
        /// <summary>
        /// Desc:规则
        /// Default:
        /// Nullable:True
        /// </summary>
        public RULE: string;
        /// <summary>
        /// Desc:是否启用
        /// Default:
        /// Nullable:True
        /// </summary>
        public ENABLED: string;
}
