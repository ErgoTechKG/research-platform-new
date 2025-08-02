---
status: TODO
priority: high
complexity: medium
dependencies: [story-7-matching-algorithm-visualization]
user_role: 秘书
module: 实验室轮转课程
phase: 双选匹配阶段
ui_reference: course-module-workflow.md lines 136-149
---

# 调剂管理系统

## 用户故事
作为秘书，我需要调剂管理系统，以便进行二次分配和手动调整。

## 功能描述
二次分配和手动调整功能，处理匹配失败或需要调整的学生分配。

## 详细需求
- 待调剂学生池管理
- 手动调整匹配结果
- 二次分配算法支持
- 调剂过程记录
- 最终匹配确认
- 调剂状态跟踪
- 异常情况处理

## 验收标准
- [ ] 待调剂池正确维护
- [ ] 手动调整功能正常
- [ ] 二次分配算法有效
- [ ] 调剂过程完整记录
- [ ] 最终确认功能正常

## UI设计参考
参考数据流程图中的调剂流程部分（course-module-workflow.md lines 136-149）。

## 依赖关系
- 依赖匹配算法的初步结果
- 需要在匹配算法完成后启动