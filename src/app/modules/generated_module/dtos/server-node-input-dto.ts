export class ServerNodesInputDto {
        // 节点ID
        public NODE_ID: number;

        // 节点名称
        public NODE_NAME: string;

        // 平台
        public PLATFORM_CODE: string;

        // IP
        public SERVER_ADDRESS: string;

        // 支持并发
        public SUPPORT_CP: string;

        // 并发优先级
        public CONCURRENT_PRIORITY: string;

        // 主节点
        public PRIMARY_NODE: string;

        // 状态
        public STATUS: string;

        // 说明
        public DESCRIPTION: string;

        public CREATION_DATE: string;
        public CREATED_BY: string;
        public LAST_UPDATE_DATE: string;
        public LAST_UPDATED_BY: string;
}
