---
status: TODO
priority: high
complexity: medium
dependencies: [story-33-dimensional-scoring-interface, story-34-grade-import-system, story-35-expert-review-platform, story-38-moral-character-evaluation-interface]
user_role: 系统
module: 综合素质评价课程
phase: 综合核算阶段
ui_reference: course-module-workflow.md lines 647-671
---

# 自动计算引擎

## 用户故事
作为系统，我需要自动计算引擎，以便按权重自动汇总各维度分数。

## 功能描述
按权重自动汇总各维度分数，提供准确的成绩计算功能。

## 详细需求
- 权重配置应用
- 多维度分数汇总
- 自动等级划分
- 计算规则验证
- 成绩分布统计
- 异常分数检测
- 重新计算功能
- 计算日志记录

## 验收标准
- [ ] 权重应用正确
- [ ] 汇总计算准确
- [ ] 等级划分合理
- [ ] 异常检测有效
- [ ] 日志记录完整

## UI设计参考
参考综合成绩计算界面设计（course-module-workflow.md lines 647-671），包含计算规则和分布统计。

## 依赖关系
- 依赖所有维度评分完成
- 需要评价标准配置完成