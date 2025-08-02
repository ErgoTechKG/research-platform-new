---
status: TODO
priority: high
complexity: complex
dependencies: []
user_role: 学生
module: 综合素质评价课程
phase: 信息采集阶段
ui_reference: course-module-workflow.md lines 501-526
---

# 信息采集表设计

## 用户故事
作为学生，我需要信息采集表设计功能，以便使用动态表单，支持多类型材料。

## 功能描述
动态表单，支持多类型材料，提供灵活的信息采集和填报功能。

## 详细需求
- 分步骤表单填写（基本信息、竞赛获奖、科研项目、社会实践）
- 动态添加获奖信息
- 级别和奖项选择器
- 时间和角色设置
- 证明材料上传
- 文件格式验证（PDF, JPG, PNG，最大5MB）
- 完成度进度显示
- 暂存功能
- 表单验证和提示

## 验收标准
- [ ] 分步表单功能完整
- [ ] 动态添加功能正常
- [ ] 文件上传验证有效
- [ ] 进度显示准确
- [ ] 暂存功能可用

## UI设计参考
参考学生信息填报界面设计（course-module-workflow.md lines 501-526），包含分步表单和文件上传功能。