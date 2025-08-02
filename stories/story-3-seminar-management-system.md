---
status: TODO
priority: medium
complexity: medium
dependencies: [story-2-mentor-resource-management-panel]
user_role: 秘书/教授
module: 实验室轮转课程
phase: 前期筹备阶段
ui_reference: course-module-workflow.md lines 396-408
---

# 宣讲会管理系统

## 用户故事
作为秘书或教授，我需要一个宣讲会管理系统，以便进行在线预约、PPT管理、签到功能的管理。

## 功能描述
提供在线预约、PPT管理、签到功能，支持Intro Session的完整管理流程。

## 详细需求
- 参与教授指定和管理
- PPT上传状态跟踪
- 学生预约查看和统计
- 时间地点设置
- 线上直播支持
- 新建宣讲会功能
- 实时显示预约人数和状态

## 验收标准
- [ ] 教授指定功能完整
- [ ] PPT上传和状态跟踪正常
- [ ] 学生预约统计准确
- [ ] 时间地点设置功能正常
- [ ] 线上线下混合模式支持

## UI设计参考
参考Intro Session管理界面设计（course-module-workflow.md lines 396-408），包含教授管理和学生预约功能。

## 依赖关系
- 依赖导师资源管理面板中的导师信息
- 需要导师确认参与状态