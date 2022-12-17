# APS Cloud


## 前言

`APS Cloud`项目致力于打造一个完整的，功能强大的分布式系统，采用现阶段流行技术实现。

## 文档

- 文档地址：建设中……

## 介绍

建设中……

### 演示

#### 后台管理系统

演示地址： [http://10.16.40.172:8002/](http://10.16.40.172:8002/)  

### 代码结构

``` lua
APS Cloud
├── aps-framework -- cloud框架代码
    ├── aps-nacos -- 服务注册和配置中心
    ├── aps-sentinel -- 服务熔断与限流模块
    ├── aps-gateway -- 服务网关
    ├── aps-core -- 框架核心模块
├── aps-common -- 工具类及通用代码
├── aps-mbg -- MyBatisGenerator生成的数据库操作代码
├── aps-security -- 安全认证模块
├── aps-serverjob -- 任务调试模块
├── aps-serverbase -- 后台系统基础模块
├── aps-serverps -- 后台业务模块
├── aps-serverpp -- 后台业务模块
├── ……
└── aps-demo -- 测试代码
```

### 技术选型

#### 后端技术

| 技术                 | 说明                | 官网                                                 |
| -------------------- | ------------------- | ---------------------------------------------------- |
| SpringCloud(Hoxton SR3) | SpringCloud框架        | https://spring.io/projects/spring-cloud               |
| SpringCloud Alibaba(2.2.1)   | SpringCloud Alibaba框架        | https://spring.io/projects/spring-cloud-alibaba               |
| SpringBoot(2.2.6)           | 容器+MVC框架        | https://spring.io/projects/spring-boot               |
| SpringSecurity       | 认证和授权框架      | https://spring.io/projects/spring-security           |
| MyBatis              | ORM框架             | http://www.mybatis.org/mybatis-3/zh/index.html       |
| MyBatisGenerator     | 数据层代码生成      | http://www.mybatis.org/generator/index.html          |
| PageHelper           | MyBatis物理分页插件 | http://git.oschina.net/free/Mybatis_PageHelper       |
| Swagger-UI           | 文档生产工具        | https://github.com/swagger-api/swagger-ui            |
| Hibernator-Validator | 验证框架            | http://hibernate.org/validator                       |
| Elasticsearch        | 搜索引擎            | https://github.com/elastic/elasticsearch             |
| RabbitMq             | 消息队列            | https://www.rabbitmq.com/                            |
| Redis                | 分布式缓存          | https://redis.io/                                    |
| MongoDb              | NoSql数据库         | https://www.mongodb.com                              |
| Docker               | 应用容器引擎        | https://www.docker.com                               |
| Druid                | 数据库连接池        | https://github.com/alibaba/druid                     |
| OSS                  | 对象存储            | https://github.com/aliyun/aliyun-oss-java-sdk        |
| MinIO                | 对象存储            | https://github.com/minio/minio                       |
| JWT                  | JWT登录支持         | https://github.com/jwtk/jjwt                         |
| LogStash             | 日志收集工具        | https://github.com/logstash/logstash-logback-encoder |
| Lombok               | 简化对象封装工具    | https://github.com/rzwitserloot/lombok               |
| Jenkins              | 自动化部署工具      | https://github.com/jenkinsci/jenkins                 |
| Quartz               | 作业调度框架      | http://www.quartz-scheduler.org/                 |

#### 前端技术

| 技术       | 说明                  | 官网                                   |
| ---------- | --------------------- | -------------------------------------- |
| Angular        | 前端框架              | https://angular.cn/                     |

#### 架构图

##### 系统架构图

<img src="/assets/apscloud.jpg" width="1200" hegiht="970"/>

##### 业务架构图

建设中……

#### 模块介绍

建设中……

#### 开发进度

建设中……

## 环境搭建

### 开发工具

| 工具          | 说明                | 官网                                            |
| ------------- | ------------------- | ----------------------------------------------- |
| IDEA          | 开发IDE             | https://www.jetbrains.com/idea/download         |
| RedisDesktop  | redis客户端连接工具 | https://redisdesktop.com/download               |
| Robomongo     | mongo客户端连接工具 | https://robomongo.org/download                  |
| SwitchHosts   | 本地host管理        | https://oldj.github.io/SwitchHosts/             |
| X-shell       | Linux远程连接工具   | http://www.netsarang.com/download/software.html |
| HeidiSQL      | 数据库连接工具      | https://www.heidisql.com/download.php             |
| PowerDesigner | 数据库设计工具      | http://powerdesigner.de/                        |
| Axure         | 原型设计工具        | https://www.axure.com/                          |
| MindMaster    | 思维导图设计工具    | http://www.edrawsoft.cn/mindmaster              |
| ProcessOn     | 流程图绘制工具      | https://www.processon.com/                      |
| Postman       | API接口调试工具      | https://www.postman.com/                        |
| Typora        | Markdown编辑器      | https://typora.io/                              |

### 开发环境

| 工具          | 版本号 | 下载                                                         |
| ------------- | ------ | ------------------------------------------------------------ |
| JDK           | 1.8    | https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html |
| Mysql         | 5.7    | https://www.mysql.com/                                       |
| Redis         | 3.2    | https://redis.io/download                                    |
| Elasticsearch | 6.2.2  | https://www.elastic.co/downloads                             |
| MongoDb       | 3.2    | https://www.mongodb.com/download-center                      |
| RabbitMq      | 3.7.14 | http://www.rabbitmq.com/download.html                        |
| Nginx         | 1.10   | http://nginx.org/en/download.html                            |

### 搭建步骤

> Windows环境部署

建设中……

> Docker环境部署

建设中……
