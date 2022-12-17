# APS 审批流代码逻辑说明文档

[TOC]

## 1 中转页 idePortal

### 初始化流程表单

#### 情况一：没有传入 instanceId

- 说明是在单页应用内部跳转发起流程
- 跳转时通过 `getFormParams` 指定的业务接口获取表单数据

#### 情况二：传入了 instanceId

- 说明该流程已经提交了，需要通过 instanceId 获取表单数据（接口：/pi/pi-ide/get-form-data-by-procinstid）
- 返回的表单数据中会包含了对应的 `formCode` 流程表单编码

## 2 流程引擎页(iframe)

### 初始化

#### 获取 templateCode

`情况一：若传入了 modelId`

说明是流程已经提交了（一般就是从宏旺门户跳转过来的），modelId 实际上就是 `formCode`

`情况二：没传入 modelId`

- 说明是在单页应用内部跳转发起流程
- 根据传入的参数/路径和快码（PI_CONFIG_IDE_FORM_LIST）判断用哪个 `modelCode`（流程**模型**编码）
- 然后根据 `modelCode` 获取 `templateCode`（流程**模板**编码）

#### 拼接 iframe URL

根据 `templateCode` 获取对应的 iframe URL（接口：/api/pi/pi-ide/get-ide-sign)）

iframe URL 要满足以下条件：

- 如果是首次提交（即不存在 formDataId 和 instanceId） ，还需要加入 `beforeActionList=start,approve,hold` 参数以启用 beforeProcessEnterAction 钩子
- 非首次提交（一般就是从门户跳转进来），必须传入 `procInstId`、`formDataId` 等参数，若存在 `id`（todoId）、`taskId`、`taskKey` 等参数也需要加入
- 若是移动端传入 `iframeType=app`，否则传入 `iframeType=v2`
- 传入自定义流程名称，`top_title` 代表 PC 端页面标题，`title` 代表 APP 端页面标题
- 传入 `showButton=prev` 要求流程引擎在提交和审批流程时都显示“上一步”按钮

### 初始化页面

- 获取并显示当前流程实例需要显示的操作按钮列表（等初始化信息）
（接口：/lcdp/meiflow-integration-api/v1/approval-process/process/instance/code/{templateCode}/button）
- 获取并初始化当前审批节点列表
（接口：/lcdp/meiflow-integration-api/v1/approval-process/operate/proc/init/assignee/post）

### 点击流程按钮

#### 前置操作

- 表单验证
- 判空
- 若有错误信息，显示错误信息，退出操作流程
- 更新 actionData

#### 点“提交”按钮

- 首次提交时会首先触发 beforeProcessEnterAction 钩子
  - 保存表单
  （保存后会发 postFlowFrame 通知 iframe，iframe 再发送 flowStart 的 message  事件）

- 触发 flowStart 钩子
  - 首次提交（没传入了 instanceId）
    - 绑定表单和流程的关系
    （/api/pi/pi-ide/set-relation，传递 formDataId 和 instanceId）
    - 绑定后会通过 initFlow() 刷新 iframe URL
  - 二次提交（指撤回/驳回后提交，传入了 instanceId）
    - 保存表单，隐藏流程 iframe 页

#### 点击“暂存”按钮

（e.data.action === button 且 e.data.info.callback === flowHold）

- 保存表单，隐藏流程 iframe  页

#### 点其他按钮

- 显示操作反馈信息
- 隐藏流程 iframe 页
