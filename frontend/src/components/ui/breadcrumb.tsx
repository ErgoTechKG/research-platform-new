import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

interface BreadcrumbProps {
  className?: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ className }) => {
  const location = useLocation()
  
  const getWorkflowBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { label: '首页', href: '/' }
    ]

    if (segments.length === 0) {
      return [{ label: '首页', isActive: true }]
    }

    // Lab Rotation Course workflow mapping
    if (segments[0] === 'lab-rotation') {
      breadcrumbs.push({ label: '实验室轮转课程', href: '/lab-rotation' })
      
      if (segments[1]) {
        const stageMap: Record<string, string> = {
          'preparation': '前期筹备阶段',
          'matching': '双选匹配阶段', 
          'management': '过程管理阶段',
          'verification': '成果验收阶段',
          'grading': '成绩评定阶段'
        }
        
        const stageName = stageMap[segments[1]]
        if (stageName) {
          breadcrumbs.push({ 
            label: stageName, 
            href: `/lab-rotation/${segments[1]}` 
          })
          
          // Add specific page if exists
          if (segments[2]) {
            const pageMap: Record<string, string> = {
              'course-publish': '课程信息发布',
              'mentor-management': '导师资源管理', 
              'seminar-management': '宣讲会管理',
              'course-timeline': '课程时间轴',
              'student-preference': '学生志愿填报',
              'mentor-screening': '导师筛选工作台',
              'matching-visualization': '匹配算法可视化',
              'adjustment-management': '调剂管理',
              'task-publishing': '任务发布系统',
              'progress-tracking': '进度追踪看板',
              'weekly-meeting': '周会管理',
              'learning-report': '学习报告提交',
              'instant-messaging': '师生互动',
              'poster-designer': '海报制作工具',
              'research-report': '大报告提交',
              'defense-scheduling': '答辩安排',
              'online-defense': '在线答辩平台',
              'achievement-showcase': '成果展示墙',
              'multidimensional-scoring': '多维度评分表',
              'batch-scoring': '批量评分界面',
              'grade-inquiry': '成绩查询系统',
              'grade-analysis-report': '成绩分析报告'
            }
            
            const pageName = pageMap[segments[2]]
            if (pageName) {
              breadcrumbs.push({ 
                label: pageName, 
                isActive: true 
              })
            }
          } else {
            breadcrumbs[breadcrumbs.length - 1].isActive = true
          }
        }
      } else {
        breadcrumbs[breadcrumbs.length - 1].isActive = true
      }
    }
    
    // Quality Assessment Course workflow mapping
    else if (segments[0] === 'quality-assessment') {
      breadcrumbs.push({ label: '综合素质评价课程', href: '/quality-assessment' })
      
      if (segments[1]) {
        const stageMap: Record<string, string> = {
          'preparation': '评价准备阶段',
          'collection': '信息采集阶段',
          'evaluation': '多维度评价阶段', 
          'calculation': '综合核算阶段',
          'application': '结果应用阶段'
        }
        
        const stageName = stageMap[segments[1]]
        if (stageName) {
          breadcrumbs.push({
            label: stageName,
            href: `/quality-assessment/${segments[1]}`
          })
          
          if (segments[2]) {
            const pageMap: Record<string, string> = {
              'evaluation-plan-publishing': '评价方案发布',
              'expert-group-management': '专家组管理',
              'evaluation-standard-config': '评价标准配置',
              'timeline-planning': '时间线规划',
              'information-collection-form': '信息采集表设计',
              'material-upload-system': '材料上传系统',
              'ocr-recognition-integration': 'OCR识别集成',
              'preliminary-review-workbench': '初审工作台',
              'progress-tracking-panel': '进度追踪面板',
              'dimensional-scoring': '分维度评分界面',
              'grade-import-system': '成绩导入系统',
              'expert-review-platform': '专家评审平台',
              'scoring-calibration-tool': '评分校准工具',
              'realtime-statistics-panel': '实时统计面板',
              'moral-character-evaluation': '思想品德评价',
              'automatic-calculation-engine': '自动计算引擎',
              'grade-preview': '成绩预览界面',
              'anomaly-detection': '异常检测系统',
              'review-confirmation': '审核确认流程',
              'grade-locking': '成绩锁定机制',
              'grade-announcement': '成绩公示系统',
              'appeal-management': '申诉管理平台',
              'experimental-class-screening': '实验班筛选工具',
              'archive-filing-system': '档案归档系统',
              'report-generator': '报告生成器'
            }
            
            const pageName = pageMap[segments[2]]
            if (pageName) {
              breadcrumbs.push({
                label: pageName,
                isActive: true
              })
            }
          } else {
            breadcrumbs[breadcrumbs.length - 1].isActive = true
          }
        }
      } else {
        breadcrumbs[breadcrumbs.length - 1].isActive = true
      }
    }
    
    // Dashboard routes
    else if (segments[0] === 'dashboard') {
      breadcrumbs.push({ label: '仪表盘', href: '/dashboard' })
      
      if (segments[1]) {
        const roleMap: Record<string, string> = {
          'student': '学生仪表盘',
          'professor': '教授仪表盘',
          'secretary': '秘书仪表盘',
          'leader': '领导仪表盘'
        }
        
        const roleName = roleMap[segments[1]]
        if (roleName) {
          breadcrumbs.push({
            label: roleName,
            isActive: true
          })
        }
      } else {
        breadcrumbs[breadcrumbs.length - 1].isActive = true
      }
    }
    
    // Other routes
    else {
      const routeMap: Record<string, string> = {
        'login': '登录',
        'register': '注册',
        'profile': '个人资料',
        'user-management': '用户管理',
        'notification-center': '通知中心',
        'data-analysis-center': '数据分析中心',
        'ai-teaching-assistant': 'AI教学助手',
        'social-learning-network': '社交学习网络',
        'resource-sharing-center': '资源共享中心'
      }
      
      const routeName = routeMap[segments[0]]
      if (routeName) {
        breadcrumbs.push({
          label: routeName,
          isActive: true
        })
      } else {
        breadcrumbs.push({
          label: segments[0],
          isActive: true
        })
      }
    }

    return breadcrumbs
  }

  const breadcrumbs = getWorkflowBreadcrumbs(location.pathname)

  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          )}
          {item.isActive || !item.href ? (
            <span className="font-medium text-foreground">
              {index === 0 && <Home className="h-4 w-4 inline mr-1" />}
              {item.label}
            </span>
          ) : (
            <Link
              to={item.href}
              className="hover:text-foreground transition-colors"
            >
              {index === 0 && <Home className="h-4 w-4 inline mr-1" />}
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export { Breadcrumb }