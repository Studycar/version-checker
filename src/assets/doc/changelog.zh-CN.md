# [8.6.0](http://git.meicloud.com/APS/creative-aps-web/commits/dev) (2019-12-10)

## 中间件

* 基础框架:升级 .net core 3.1
* 增强安全性

### 新增特性
* **中间件框架:** 框架dll增加签名，增强防篡改的安全性保护
* **中间件:** 增加License验证
* **中间件:** 其他一系列优化

# [8.5.1](http://git.meicloud.com/APS/creative-aps-web/commits/dev) (2019-10-10)

## 中间件

* 基础框架:升级 .net core 3.0
* ORM:更新SqlSugar

### 新增特性
* **中间件插件:** 支持热加载，改插件代码不重启程序可以自动重新编译加载，开发减少编译等待，提高开发效率，不依赖K8s可实现灰度发布
* **中间件:** 更新Swagger，调试信息更详细
* **中间件:** 性能优化
* **ORM:** 其他一系列优化

# [8.5.0](http://git.meicloud.com/APS/creative-aps-web/commits/dev) (2019-09-11)

## 并发管理器

* 基础框架:升级 .net core 3.0
* ORM:更新为SqlSugar5

## 并发程序

* 基础框架:升级 netstandard2.0
* ORM:更新为SqlSugar5

### 新增特性
* **并发管理:** 跨平台，可部署docker
* **并发管理:** 性能优化
* **ORM:** 分布式事务
* **ORM:** 多数据库和实时切换
* **ORM:** 分布式事务
* **ORM:** 支持线程安全可单例使用
* **ORM:** 重构异步底层，优化所有不合理设计，异步性能极大提升（不再支持`.net framework 4.0`）4.5+
* **ORM:** 其他一系列优化

# [8.4.0](http://git.meicloud.com/APS/creative-aps-web/commits/dev) (2019-09-02)

## 前端

* 更新 angular 8.2，ng-zorro-antd 8.2.1， ng-alain 8.4.0

### 升级 Angular 8 版本

8.0版本有一些破坏性变更，以下几个问题需要额外注意：

* `ViewChild` 与 `ContentChild` 用法发生了变化，参照 [Static Query Migration Guide](https://angular.io/guide/static-query-migration) 部分进行更新。
* 路由懒加载使用方式发生了变化，参照 [loadChildren string synatx](https://angular.io/guide/deprecations#loadchildren-string-syntax) 部分进行更新。
* 最新版本支持差异加载技术，可以显著降低打包体积，参照 [Differential Loading](https://angular.io/guide/deployment#differential-loading) 部分进行更新。

### bug 修复

* **theme:style:** 修复侧边栏用户模块样式 
* **abc:st:** 修复忽略 `STColumn` 里 `title` 为非必填性 
* **cli:plugin:icon:** 修复未识别 `nzType` 属性 
* **form:array:** 修复 `readOnly: true` 时应禁用添加、移除按钮
* **form:array:** 修复数组下标值经过增删后混乱问题 
* **form:upload:** 修复 `showUploadList` 无法设置复合参数 
* **form:*:** 修复部分小部件调用 `setValue` 方法无法渲染 
* **abc:reuse-tab:** 修复 URL 模式也应该从菜单数据中获取标题 
* **abc:sidebar:** 修复当包含徽章时无法展开子菜单问题 
* **abc:st:** 修复当组件被销毁时应该中断 HTTP 请求 
* **theme:title:** 修复路由跳转后在 `NavigationEnd` 事件里调用重置当前页无效问题 
* **abc:st:** 修复当 `strictBehavior` 为 `truncate` 时 `img` 列不应该截断 

### 新增特性

* **abc:st:** 新增按钮的 `tooltip` 属性 
* **abc:st:** 新增调用 `resetColumns` 
* **abc:down-file:** 新增 `down-file_not-support` & `down-file__disabled` 样式 
* **abc:st:** 新增 `confirmText`, `clearText` 国际化 
* **abc:st:** 新增关键词过滤器
* **form:** 新增 `optionalHelp` 
* **form:** 新增国际化 
* **util:deepMergeKey:** 新增支持传递 `null` & `undefined` 
* **abc:st:** 新增 `req.lazyLoad` 属性首次不发送请求
* **abc:st:** 新增 `STColumnTitle.title` 支持可选和帮助信息描述 
* **acl:** 新增支持在路由 `data` 属性里指定未授权跳转URL 
* **form:*:** 新增 `date` `time` 小部件对 date-fns 格式化的支持 

# [7.3.0](http://git.meicloud.com/APS/creative-aps-web/commits/dev) (2019-05-18)

## 前端

* 更新 ng-zorro-antd 7.3.0， ng-alain 7.4.0

### bug 修复

* form:*: 修复异步数据渲染不正确。
* form:date: 修复当未包含 end 属性时抛出异常。
* form:select: 修复国际化。
* form:select: form:select: 修复无效标签数量。
* theme:modal: 修复 nzWrapClassName 和 size 存在时无法并存问题 。
* theme:http: 修复 get 泛型返回错误类型。

### 新增特性

* 支持服务端渲染。
* acl: 新增 *aclIf 结构化指令。
* form: 新增按钮图标配置属性。
* form: 新增 loading 属性。
* form: 支持隐藏 label 的冒号。
* time-picker: 支持 12-hour 制。
* date-picker:`nzRanges` 支持回调函数。
* date-picker: 支持 `nzOnCalendarChange` 功能。

## 中间件

### 新增特性

* **ORM:** 多数据库和实时切换
* **ORM:** 分布式事务
* **ORM:** 支持线程安全可单例使用
* **ORM:** 重构异步底层，优化所有不合理设计，异步性能极大提升（不再支持`.net framework 4.0`）4.5+
* **ORM:** 其他一系列优化

# [7.2.0](http://git.meicloud.com/APS/creative-aps-web/commits/dev) (2019-04-12)

## 前端

* 更新 ng-zorro-antd 7.2.0， ng-alain 7.2.0

### bug 修复

* 标签:reuse-tab: 修复右击关闭其他或右侧标签应以当前选择项为基准。
* sf:checkbox: 修复点击复选框无法触发全选。
* sf:select: 修复无效清除按钮。

### 新增特性

* 标签:reuse-tab: 增加 tabBarExtraContent tabBarStyle tabBarGutter 属性，可扩展自定义属性。

## 中间件

### 新增特性

* **ORM:** 增加批量打包SQL，对性能有极限追求，可以把要执行的语句添加到上下文队列，后然打包成一个SQL一次性请求返回结果。（目前实现MSSQL、MYSQL、PGSQL，Oralce后续实现）
* **ORM:SqlFun** 增加SqlFun.Round()函数，支持自定义小数位
* **ORM:** 去除自定义的DataTable，统一支持原生的System.Data.DataTable

# [7.0.2](http://git.meicloud.com/APS/creative-aps-web/commits/dev) (2019-03-07)

## 前端

* 更新 ng-zorro-antd 7.0.0 正式版，更多请查看[升级日志](https://ng-zorro.gitee.io/docs/changelog/zh)

### 新增特性

* 全部组件默认工作在 *OnPush* 模式下，大幅度提升了组件性能
* 完成 web animation 与 antd 动画的对应，并支持对每个组件的动画进行全局和单独配置
* 增加了 *Empty*、*Statistic*、*CountDown*、*Comment* 等实用组件
* 支持了最新的 CDK 特性，Table 等组件支持*虚拟滚动*
* 增加了大量新的功能，并修复了大部分之前组件存在的问题
* 日期相关组件支持可选的 ISO 标准日期格式化（依赖Date-fns库），解决周数算法不一致等问题
* 更换了新的全局滚动策略，Modal Drawer 在特殊情况下弹出时页面不再抖动
* 更加严格的 *TSLint* 校验
* 全新的 LOGO 和 文档系统

## 中间件

### 新增特性

* **ORM:Insertable:** 重构批量插入，性能提高到万级每秒

### 并发管理器和并发程序

* 统一SqlSugar为 `.net core`，并发程序可转换为 `.net core` 版本
* 并发程序引入中间件框架Creative.AFS.Framework，可应用框架相应技术，如Ioc

### bug 修复

* **ORM:SqlFunc:** 修复 `ToDecimal` 在 `oracle` 转换问题

# [7.0.0-rc.4](http://git.meicloud.com/APS/creative-aps-web/commits/dev) (2019-01-21)

## 前端

### Bug 修复

* **module:*:** 修复所有无效复杂类型的全局配置
* **module:reuse-tab:** 修复路由切换时可能产生溢出 [#361](https://github.com/ng-alain/delon/issues/361)
* **module:se:** 修复错误消息样式不正确  [#370](https://github.com/ng-alain/delon/issues/370)
* **module:sf:autocomplete:** 修复 `SFSchemaEnum` 无法识别 `value` 值 
* **module:st:** 修复所有项都禁用时不应该允许操作全选操作  [#363](https://github.com/ng-alain/delon/issues/363)

### 新增特性

* **module:reuse-tab:** 新增支持自定义右键菜单 [#364](https://github.com/ng-alain/delon/issues/364)
* **module:sidebar-nav:** 新增 `recursivePath` 属性 [#373](https://github.com/ng-alain/delon/issues/373) [#365](https://github.com/ng-alain/delon/issues/365)

## 中间件

### 框架

- 升级ASP.NET CORE 2.2:
  - *引入端点路由，在MVC中提高了20％的路由性能*
  - *IIS进程内托管支持，吞吐量提高了400％*
  - *提高15%MVC模型验证性能*
  - *Linux上的HTTPClient性能提高了60％，Windows上提高了20％*
  - [更多改进请查看](https://www.cnblogs.com/stulzq/p/10069412.html) 
- 重构Ioc依赖注入容器:
  - *使用无锁算法*
  - *使用 ContainerFactoryData 创建实例*
  - *删除静态的 ContainerFactoryCache 简化代码*
  - *更新接口 IMultiConstructorResolver*
  - *更新接口 IRegistrator*
- 更新 Web服务器:
  - *不再要求使用异常表示请求结束*
    - *不再保证 `HttpManager.CurrentContext.Response.End` 会抛出异常*
    - *检查请求是否结束可以读取属性 `HttpManager.CurrentContext.Response.IsEnded`*
- 更新帮助类:
  - *在 RandomUtils 类中使用线程本地随机生成器防止多线程导致的问题*
  - *在 MemoryCache 类使用无锁数据结构*
  - *在 LazyCache 类使用内存屏障*
  - *从 SimpleDisposable 类删除析构函数*
* 更新最新版本依赖包

### bug 修复

* 修复路由大小写敏感失效问题

# [7.0.0-rc.3](http://git.meicloud.com/APS/creative-aps-web/commits/dev) (2019-01-09)

## 前端

### 框架

* **pro:theme:** 重构整个主题，整个项目主题以 `OnPush` 优先，提高性能
* **pro:theme:** 修复侧边栏固定时底部间距
* **pro:theme:** 默认隐藏侧边栏固定时滚动条
* **pro:theme:** 优化 `delay` 组件，并新增部分属性
* **pro:theme:** 优化 `@angular/cdk/drag-drop` 替代 `sortablejs`
* **pro:theme:** 更换首次加载动画效果

### Bug 修复

* **module:theme:** 修复未找到 `window` 值 

## 中间件

### 框架

* 项目代码架构调整，支持并发程序等共用一套实体和业务逻辑

### bug 修复

* **ORM:SqlFunc:** 修复 `HasValue` 在 `oracle` 失效问题
* **ORM:SqlFunc:** 修复 `IsNullOrEmpty` 在 `oracle` 失效问题
* **ORM:SqlFunc:** 修复 `GetDate` 在 `oracle` 取值问题
* **ORM:SqlFunc:** 修复 `ToString` 在 `oracle` 为 `nvarchar` 转换问题
* **ORM:Select():** 修复用实体别名传参可能会导致 `表名.字段` 过长问题
* **ORM:MergeTable:** 修复在 `oracle` 出错问题
* **ORM:QueryableProvider:** 修复在 `oracle` `ISugarQueryable` 出错问题

# [7.0.0-rc.2](http://git.meicloud.com/APS/creative-aps-web/commits/dev) (2018-12-28)

## 前端

### 框架

* 路由通配符指向 `/exception/404`
* 使用 `scrollPositionRestoration` 替代 `ScrollService` 来管理切换路由时滚动条位置
* 优化http拦截器 `default.interceptor.ts` 错误提示窗口显示增加到30秒 增加http状态码提示

### Bug 修复

* **module:cache:** 修复 `get` 无效指定存储参数 
* **module:reuse-tab:** 修复存储时应忽略不可关闭缓存
* **module:se:** 修复重置值时应触发一次变更检测
* **module:sf:** 修复数组添加按钮会触发提交事件
* **module:sf:** 修复异步可能会引起丢失数据问题

### 新增特性

* **module:reuse-tab:** 新增保持滚动条


# [7.0.0-rc.1](http://git.meicloud.com/APS/creative-aps-web/commits/dev) (2018-12-24)

## 前端

### 框架

* 新增异常触发示例页
* 新增波兰语
* 优化路径配置

### Bug 修复

* **module:auth:** 修复无法识别完整URL匿名键名
* **module:sf:** 修复重置值时应触发一次变更检测
* **module:sf:cascader:** 修复未指定 `labelProperty`、`valueProperty` 问题
* **module:st:** 修复调用 `removeRow` 方法应重新计算序号
* **module:theme:** 修复主菜单在Firefox下总是显示滚动条
* **module:theme:menu:** 标记过期属性 `linkExact`

### 新增特性

* **module:testing:** 增加 `@delon/testing` 测试套件库
* **module:auth:** 增加 `referrer` 属性，用于获取跳转前URL
* **module:mock:** 增加 `executeOtherInterceptors` 命中后继续执行后续拦截器
* **module:sidebar-nav:** 增加 `disabledAcl` 属性，当 ACL 未授权时以禁用状态显示
* **module:st:** 增加 `expandRowByClick` 属性，点击行展开与收缩
* **module:st:** 增加 `url` 模式下支持数组响应体
* **module:util:** 增加 `stringTemplateOutlet` 指令
* **module:theme:** 新增波兰语

### 兼容性更新

* **module:chart:timeline:** 移除 `tickCount`，同步 antd 3.4

# [7.0.0-rc.0](http://git.meicloud.com/APS/creative-aps-web/commits/dev) (2018-12-14)

## 前端

前端框架从这个版本开始，将和其他 Angular 第三方库一样，保持与 Angular 的主版本号一致。

- 支持 Angular 7.0
- 重构整个 `@delon/*` 系列库，重点两项变更请参考：
  - 移除部分类库 `.forRoot()`
  - `notify-icon` 组件需要额外增加 `btnClass`、`btnIconClass` 类名
- 重构默认主题及所有示例页使用 OnPush 模式

### Bug 修复

* **module:st:** 修复无过滤时依然显示过滤状态
* **module:st:** 修复无效 `body`
* **module:st:** 修复丢失配置参数
* **module:se:** 修复禁止状态时依然显示错误视觉
* **schematics:** 修复 `list` 模式使用过期代码

### 新增特性

* **module:theme:title:** 增加 `setTitleByI18n` 方法 ([#299](https://github.com/ng-alain/delon/issues/299)) ([80a9636](https://github.com/ng-alain/delon/commit/80a9636))
* **module:utils:** 增加 `isUrl` 校验
* **module:mock:** 增加允许舞台 `HttpResponse`, [#813](https://github.com/ng-alain/ng-alain/issues/813)
* **module:theme:** 增加 `@forced-turn-off-nz-modal-animation-enabled` 强制关闭 `nzModel` 动画效果
* **module:utils:** 增加 `deepMerge` 深度合并

### 兼容性更新

* **module:utils:** 移除 `yuan`
