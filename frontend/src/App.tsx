import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import UserProfile from './pages/UserProfile'
import UserManagement from './pages/UserManagement'
import ProgressTimeline from './pages/ProgressTimeline'
import Dashboard from './pages/Dashboard'

// Lab Rotation Course - Stage 1: 前期筹备阶段
import CoursePublish from './pages/CoursePublish'
import MentorManagement from './pages/MentorManagement'
import SeminarManagement from './pages/SeminarManagement'
import CourseTimeline from './pages/CourseTimeline'

// Lab Rotation Course - Stage 2: 双选匹配阶段
import StudentPreference from './pages/StudentPreference'
import MentorScreening from './pages/MentorScreening'
import MatchingVisualization from './pages/MatchingVisualization'
import AdjustmentManagement from './pages/AdjustmentManagement'

// Lab Rotation Course - Stage 3: 过程管理阶段
import TaskPublishing from './pages/TaskPublishing'
import ProgressTracking from './pages/ProgressTracking'
import WeeklyMeeting from './pages/WeeklyMeeting'
import LearningReport from './pages/LearningReport'
import InstantMessaging from './pages/InstantMessaging'

// Lab Rotation Course - Stage 4: 成果验收阶段
import PosterDesigner from './pages/PosterDesigner'
import ResearchReport from './pages/ResearchReport'
import DefenseScheduling from './pages/DefenseScheduling'
import OnlineDefensePlatform from './pages/OnlineDefensePlatform'
import AchievementShowcase from './pages/AchievementShowcase'

// Lab Rotation Course - Stage 5: 成绩评定阶段
import MultidimensionalScoringForm from './pages/MultidimensionalScoringForm'
import ScoringStandardConfig from './pages/ScoringStandardConfig'
import BatchScoringInterface from './pages/BatchScoringInterface'
import GradeInquiry from './pages/GradeInquiry'
import GradeAnalysisReport from './pages/GradeAnalysisReport'

// Quality Assessment Course - Stage 1: 评价准备阶段
import EvaluationPlanPublishing from './pages/EvaluationPlanPublishing'
import ExpertGroupManagement from './pages/ExpertGroupManagement'
import EvaluationStandardConfig from './pages/EvaluationStandardConfig'
import TimelinePlanning from './pages/TimelinePlanning'

// Quality Assessment Course - Stage 2: 信息采集阶段
import InformationCollectionForm from './pages/InformationCollectionForm'
import MaterialUploadSystem from './pages/MaterialUploadSystem'
import OCRRecognitionIntegration from './pages/OCRRecognitionIntegration'
import PreliminaryReviewWorkbench from './pages/PreliminaryReviewWorkbench'
import ProgressTrackingPanel from './pages/ProgressTrackingPanel'

// Quality Assessment Course - Stage 3: 多维度评价阶段
import DimensionalScoringInterface from './pages/DimensionalScoringInterface'
import GradeImportSystem from './pages/GradeImportSystem'
import ExpertReviewPlatform from './pages/ExpertReviewPlatform'
import ScoringCalibrationTool from './pages/ScoringCalibrationTool'
import RealtimeStatisticsPanel from './pages/RealtimeStatisticsPanel'
import MoralCharacterEvaluationInterface from './pages/MoralCharacterEvaluationInterface'

// Quality Assessment Course - Stage 4: 综合核算阶段
import AutomaticCalculationEngine from './pages/AutomaticCalculationEngine'
import GradePreview from './pages/GradePreview'
import AnomalyDetectionSystem from './pages/AnomalyDetectionSystem'
import ReviewConfirmationProcess from './pages/ReviewConfirmationProcess'
import GradeLockingMechanism from './pages/GradeLockingMechanism'

// Quality Assessment Course - Stage 5: 结果应用阶段
import GradeAnnouncementSystem from './pages/GradeAnnouncementSystem'
import AppealManagement from './pages/AppealManagement'
import ExperimentalClassScreening from './pages/ExperimentalClassScreening'
import ArchiveFilingSystem from './pages/ArchiveFilingSystem'
import ReportGenerator from './pages/ReportGenerator'

// Additional Features
import MilestoneReportSubmission from './pages/MilestoneReportSubmission'
import NotificationCenter from './pages/NotificationCenter'
import SmartReminderRuleEngine from './pages/SmartReminderRuleEngine'
import SmartTaskReminder from './pages/SmartTaskReminder'
import BatchImportTool from './pages/BatchImportTool'
import BatchOperationsManagement from './pages/BatchOperationsManagement'
import AutomaticReportGenerator from './pages/AutomaticReportGenerator'

// AI & Analytics
import AITeachingAssistant from './pages/AITeachingAssistant'
import SocialLearningNetwork from './pages/SocialLearningNetwork'
import DataAnalysisCenter from './pages/DataAnalysisCenter'
import ResourceSharingCenter from './pages/ResourceSharingCenter'
import AIHomeworkDetection from './pages/AIHomeworkDetection'
import AIScoringAssistant from './pages/AIScoringAssistant'
import AutomatedDataCollection from './pages/AutomatedDataCollection'
import DataCollectionAutomation from './pages/DataCollectionAutomation'
import CurriculumDesignTool from './pages/CurriculumDesignTool'
import WorkflowDesigner from './pages/WorkflowDesigner'
import LLMReportGeneration from './pages/LLMReportGeneration'
import RealtimeDataDashboard from './pages/RealtimeDataDashboard'
import PredictiveAnalytics from './pages/PredictiveAnalytics'
import AnnualReportGenerator from './pages/AnnualReportGenerator'
import StudentMentorComparison from './pages/StudentMentorComparison'
import StudentRecommendationDashboard from './pages/StudentRecommendationDashboard'
import ProfessorApplicationFilter from './pages/ProfessorApplicationFilter'
import ProfessorInterviewScheduler from './pages/ProfessorInterviewScheduler'
import SecretaryMatchingMonitor from './pages/SecretaryMatchingMonitor'
import SecretaryAutoAdjustment from './pages/SecretaryAutoAdjustment'
import StudentMaterialWizard from './pages/StudentMaterialWizard'

// Role-based Dashboards
import StudentDashboard from './pages/StudentDashboard'
import ProfessorDashboard from './pages/ProfessorDashboard'
import SecretaryDashboard from './pages/SecretaryDashboard'
import LeaderDashboard from './pages/LeaderDashboard'
import ProfessorAvailability from './pages/ProfessorAvailability'
import GradingAssistantWorkspace from './pages/GradingAssistantWorkspace'
import StudentProfile from './pages/StudentProfile'

// Demo Pages
import DesignSystemDemo from './pages/DesignSystemDemo'
import InteractionPatternsDemo from './pages/InteractionPatternsDemo'
import ResponsiveDemo from './pages/ResponsiveDemo'
import AccessibilityDemo from './pages/AccessibilityDemo'
import PerformanceDemo from './pages/PerformanceDemo'

import TestModeIndicator from './components/TestModeIndicator'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* User Management */}
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/admin/user-management" element={<UserManagement />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/professor" element={<ProfessorDashboard />} />
        <Route path="/dashboard/secretary" element={<SecretaryDashboard />} />
        <Route path="/dashboard/leader" element={<LeaderDashboard />} />
        
        {/* Professor Availability */}
        <Route path="/professor-availability" element={<ProfessorAvailability />} />
        
        {/* Grading Assistant Workspace */}
        <Route path="/grading-assistant-workspace" element={<GradingAssistantWorkspace />} />
        
        {/* Student Profile System */}
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/student-profile/:studentId" element={<StudentProfile />} />

        {/* Lab Rotation Course (实验室轮转课程) */}
        {/* Stage 1: 前期筹备阶段 */}
        <Route path="/lab-rotation/preparation/course-publish" element={<CoursePublish />} />
        <Route path="/lab-rotation/preparation/mentor-management" element={<MentorManagement />} />
        <Route path="/lab-rotation/preparation/seminar-management" element={<SeminarManagement />} />
        <Route path="/lab-rotation/preparation/course-timeline" element={<CourseTimeline />} />

        {/* Stage 2: 双选匹配阶段 */}
        <Route path="/lab-rotation/matching/student-preference" element={<StudentPreference />} />
        <Route path="/lab-rotation/matching/mentor-screening" element={<MentorScreening />} />
        <Route path="/lab-rotation/matching/matching-visualization" element={<MatchingVisualization />} />
        <Route path="/lab-rotation/matching/adjustment-management" element={<AdjustmentManagement />} />

        {/* Stage 3: 过程管理阶段 */}
        <Route path="/lab-rotation/management/task-publishing" element={<TaskPublishing />} />
        <Route path="/lab-rotation/management/progress-tracking" element={<ProgressTracking />} />
        <Route path="/lab-rotation/management/weekly-meeting" element={<WeeklyMeeting />} />
        <Route path="/lab-rotation/management/learning-report" element={<LearningReport />} />
        <Route path="/lab-rotation/management/instant-messaging" element={<InstantMessaging />} />

        {/* Stage 4: 成果验收阶段 */}
        <Route path="/lab-rotation/verification/poster-designer" element={<PosterDesigner />} />
        <Route path="/lab-rotation/verification/research-report" element={<ResearchReport />} />
        <Route path="/lab-rotation/verification/defense-scheduling" element={<DefenseScheduling />} />
        <Route path="/lab-rotation/verification/online-defense" element={<OnlineDefensePlatform />} />
        <Route path="/lab-rotation/verification/achievement-showcase" element={<AchievementShowcase />} />

        {/* Stage 5: 成绩评定阶段 */}
        <Route path="/lab-rotation/grading/multidimensional-scoring" element={<MultidimensionalScoringForm />} />
        <Route path="/lab-rotation/grading/scoring-standard-config" element={<ScoringStandardConfig />} />
        <Route path="/lab-rotation/grading/batch-scoring" element={<BatchScoringInterface />} />
        <Route path="/lab-rotation/grading/grade-inquiry" element={<GradeInquiry />} />
        <Route path="/lab-rotation/grading/grade-analysis-report" element={<GradeAnalysisReport />} />

        {/* Quality Assessment Course (综合素质评价课程) */}
        {/* Stage 1: 评价准备阶段 */}
        <Route path="/quality-assessment/preparation/evaluation-plan-publishing" element={<EvaluationPlanPublishing />} />
        <Route path="/quality-assessment/preparation/expert-group-management" element={<ExpertGroupManagement />} />
        <Route path="/quality-assessment/preparation/evaluation-standard-config" element={<EvaluationStandardConfig />} />
        <Route path="/quality-assessment/preparation/timeline-planning" element={<TimelinePlanning />} />

        {/* Stage 2: 信息采集阶段 */}
        <Route path="/quality-assessment/collection/information-collection-form" element={<InformationCollectionForm />} />
        <Route path="/quality-assessment/collection/material-upload-system" element={<MaterialUploadSystem />} />
        <Route path="/quality-assessment/collection/ocr-recognition-integration" element={<OCRRecognitionIntegration />} />
        <Route path="/quality-assessment/collection/preliminary-review-workbench" element={<PreliminaryReviewWorkbench />} />
        <Route path="/quality-assessment/collection/progress-tracking-panel" element={<ProgressTrackingPanel />} />

        {/* Stage 3: 多维度评价阶段 */}
        <Route path="/quality-assessment/evaluation/dimensional-scoring" element={<DimensionalScoringInterface />} />
        <Route path="/quality-assessment/evaluation/grade-import-system" element={<GradeImportSystem />} />
        <Route path="/quality-assessment/evaluation/expert-review-platform" element={<ExpertReviewPlatform />} />
        <Route path="/quality-assessment/evaluation/scoring-calibration-tool" element={<ScoringCalibrationTool />} />
        <Route path="/quality-assessment/evaluation/realtime-statistics-panel" element={<RealtimeStatisticsPanel />} />
        <Route path="/quality-assessment/evaluation/moral-character-evaluation" element={<MoralCharacterEvaluationInterface />} />

        {/* Stage 4: 综合核算阶段 */}
        <Route path="/quality-assessment/calculation/automatic-calculation-engine" element={<AutomaticCalculationEngine />} />
        <Route path="/quality-assessment/calculation/grade-preview" element={<GradePreview />} />
        <Route path="/quality-assessment/calculation/anomaly-detection" element={<AnomalyDetectionSystem />} />
        <Route path="/quality-assessment/calculation/review-confirmation" element={<ReviewConfirmationProcess />} />
        <Route path="/quality-assessment/calculation/grade-locking" element={<GradeLockingMechanism />} />

        {/* Stage 5: 结果应用阶段 */}
        <Route path="/quality-assessment/application/grade-announcement" element={<GradeAnnouncementSystem />} />
        <Route path="/quality-assessment/application/appeal-management" element={<AppealManagement />} />
        <Route path="/quality-assessment/application/experimental-class-screening" element={<ExperimentalClassScreening />} />
        <Route path="/quality-assessment/application/archive-filing-system" element={<ArchiveFilingSystem />} />
        <Route path="/quality-assessment/application/report-generator" element={<ReportGenerator />} />

        {/* Support Systems */}
        <Route path="/system/milestone-report" element={<MilestoneReportSubmission />} />
        <Route path="/system/notification-center" element={<NotificationCenter />} />
        <Route path="/system/smart-reminder-rule-engine" element={<SmartReminderRuleEngine />} />
        <Route path="/system/smart-task-reminder" element={<SmartTaskReminder />} />
        <Route path="/system/batch-import-tool" element={<BatchImportTool />} />
        <Route path="/system/batch-operations" element={<BatchOperationsManagement />} />
        <Route path="/system/automatic-report-generator" element={<AutomaticReportGenerator />} />
        <Route path="/system/progress-timeline" element={<ProgressTimeline />} />

        {/* AI & Analytics */}
        <Route path="/ai/ai-teaching-assistant" element={<AITeachingAssistant />} />
        <Route path="/ai/ai-homework-detection" element={<AIHomeworkDetection />} />
        <Route path="/ai/ai-scoring-assistant" element={<AIScoringAssistant />} />
        <Route path="/data/data-analysis-center" element={<DataAnalysisCenter />} />
        <Route path="/data/automated-data-collection" element={<AutomatedDataCollection />} />
        <Route path="/data/data-collection-automation" element={<DataCollectionAutomation />} />
        <Route path="/tools/curriculum-design-tool" element={<CurriculumDesignTool />} />
        <Route path="/tools/workflow-designer" element={<WorkflowDesigner />} />
        <Route path="/data/llm-report-generation" element={<LLMReportGeneration />} />
        <Route path="/data/realtime-data-dashboard" element={<RealtimeDataDashboard />} />
        <Route path="/data/predictive-analytics" element={<PredictiveAnalytics />} />
        <Route path="/reports/annual-report-generator" element={<AnnualReportGenerator />} />
        <Route path="/lab-rotation/student-mentor-comparison" element={<StudentMentorComparison />} />
        <Route path="/lab-rotation/student-recommendation-dashboard" element={<StudentRecommendationDashboard />} />
        <Route path="/lab-rotation/professor-application-filter" element={<ProfessorApplicationFilter />} />
        <Route path="/lab-rotation/professor-interview-scheduler" element={<ProfessorInterviewScheduler />} />
        <Route path="/lab-rotation/secretary-matching-monitor" element={<SecretaryMatchingMonitor />} />
        <Route path="/lab-rotation/secretary-auto-adjustment" element={<SecretaryAutoAdjustment />} />
        <Route path="/quality-assessment/student-material-wizard" element={<StudentMaterialWizard />} />
        <Route path="/social/social-learning-network" element={<SocialLearningNetwork />} />
        <Route path="/resources/resource-sharing-center" element={<ResourceSharingCenter />} />

        {/* Legacy Routes (for backward compatibility) */}
        <Route path="/course-publish" element={<CoursePublish />} />
        <Route path="/mentor-management" element={<MentorManagement />} />
        <Route path="/seminar-management" element={<SeminarManagement />} />
        <Route path="/course-timeline" element={<CourseTimeline />} />
        <Route path="/student-preference" element={<StudentPreference />} />
        <Route path="/mentor-screening" element={<MentorScreening />} />
        <Route path="/matching-visualization" element={<MatchingVisualization />} />
        <Route path="/adjustment-management" element={<AdjustmentManagement />} />
        <Route path="/task-publishing" element={<TaskPublishing />} />
        <Route path="/progress-tracking" element={<ProgressTracking />} />
        <Route path="/weekly-meeting" element={<WeeklyMeeting />} />
        <Route path="/learning-report" element={<LearningReport />} />
        <Route path="/instant-messaging" element={<InstantMessaging />} />
        <Route path="/poster-designer" element={<PosterDesigner />} />
        <Route path="/research-report" element={<ResearchReport />} />
        <Route path="/defense-scheduling" element={<DefenseScheduling />} />
        <Route path="/online-defense" element={<OnlineDefensePlatform />} />
        <Route path="/achievement-showcase" element={<AchievementShowcase />} />
        <Route path="/multidimensional-scoring" element={<MultidimensionalScoringForm />} />
        <Route path="/scoring-standard-config" element={<ScoringStandardConfig />} />
        <Route path="/batch-scoring" element={<BatchScoringInterface />} />
        <Route path="/grade-inquiry" element={<GradeInquiry />} />
        <Route path="/grade-analysis-report" element={<GradeAnalysisReport />} />
        <Route path="/evaluation-plan-publishing" element={<EvaluationPlanPublishing />} />
        <Route path="/expert-group-management" element={<ExpertGroupManagement />} />
        <Route path="/evaluation-standard-config" element={<EvaluationStandardConfig />} />
        <Route path="/timeline-planning" element={<TimelinePlanning />} />
        <Route path="/information-collection-form" element={<InformationCollectionForm />} />
        <Route path="/material-upload-system" element={<MaterialUploadSystem />} />
        <Route path="/ocr-recognition-integration" element={<OCRRecognitionIntegration />} />
        <Route path="/preliminary-review-workbench" element={<PreliminaryReviewWorkbench />} />
        <Route path="/progress-tracking-panel" element={<ProgressTrackingPanel />} />
        <Route path="/dimensional-scoring" element={<DimensionalScoringInterface />} />
        <Route path="/grade-import-system" element={<GradeImportSystem />} />
        <Route path="/expert-review-platform" element={<ExpertReviewPlatform />} />
        <Route path="/scoring-calibration-tool" element={<ScoringCalibrationTool />} />
        <Route path="/realtime-statistics-panel" element={<RealtimeStatisticsPanel />} />
        <Route path="/moral-character-evaluation" element={<MoralCharacterEvaluationInterface />} />
        <Route path="/automatic-calculation-engine" element={<AutomaticCalculationEngine />} />
        <Route path="/grade-preview" element={<GradePreview />} />
        <Route path="/anomaly-detection" element={<AnomalyDetectionSystem />} />
        <Route path="/review-confirmation" element={<ReviewConfirmationProcess />} />
        <Route path="/grade-locking" element={<GradeLockingMechanism />} />
        <Route path="/grade-announcement" element={<GradeAnnouncementSystem />} />
        <Route path="/appeal-management" element={<AppealManagement />} />
        <Route path="/experimental-class-screening" element={<ExperimentalClassScreening />} />
        <Route path="/archive-filing-system" element={<ArchiveFilingSystem />} />
        <Route path="/report-generator" element={<ReportGenerator />} />
        <Route path="/milestone-report" element={<MilestoneReportSubmission />} />
        <Route path="/notification-center" element={<NotificationCenter />} />
        <Route path="/smart-reminder-rule-engine" element={<SmartReminderRuleEngine />} />
        <Route path="/smart-task-reminder" element={<SmartTaskReminder />} />
        <Route path="/batch-import-tool" element={<BatchImportTool />} />
        <Route path="/batch-operations" element={<BatchOperationsManagement />} />
        <Route path="/automatic-report-generator" element={<AutomaticReportGenerator />} />
        <Route path="/ai-teaching-assistant" element={<AITeachingAssistant />} />
        <Route path="/social-learning-network" element={<SocialLearningNetwork />} />
        <Route path="/data-analysis-center" element={<DataAnalysisCenter />} />
        <Route path="/resource-sharing-center" element={<ResourceSharingCenter />} />
        <Route path="/ai-homework-detection" element={<AIHomeworkDetection />} />
        <Route path="/ai-scoring-assistant" element={<AIScoringAssistant />} />
        <Route path="/automated-data-collection" element={<AutomatedDataCollection />} />
        <Route path="/data-collection-automation" element={<DataCollectionAutomation />} />
        <Route path="/curriculum-design-tool" element={<CurriculumDesignTool />} />
        <Route path="/workflow-designer" element={<WorkflowDesigner />} />
        <Route path="/llm-report-generation" element={<LLMReportGeneration />} />
        <Route path="/realtime-data-dashboard" element={<RealtimeDataDashboard />} />
        <Route path="/predictive-analytics" element={<PredictiveAnalytics />} />
        <Route path="/annual-report-generator" element={<AnnualReportGenerator />} />
        <Route path="/student-mentor-comparison" element={<StudentMentorComparison />} />
        <Route path="/student-recommendation-dashboard" element={<StudentRecommendationDashboard />} />
        <Route path="/professor-application-filter" element={<ProfessorApplicationFilter />} />
        <Route path="/professor-interview-scheduler" element={<ProfessorInterviewScheduler />} />
        <Route path="/secretary-matching-monitor" element={<SecretaryMatchingMonitor />} />
        <Route path="/secretary-auto-adjustment" element={<SecretaryAutoAdjustment />} />
        <Route path="/student-material-wizard" element={<StudentMaterialWizard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
        <Route path="/secretary-dashboard" element={<SecretaryDashboard />} />
        <Route path="/leader-dashboard" element={<LeaderDashboard />} />

        {/* Demo Pages */}
        <Route path="/demo/design-system" element={<DesignSystemDemo />} />
        <Route path="/demo/interaction-patterns" element={<InteractionPatternsDemo />} />
        <Route path="/demo/responsive-demo" element={<ResponsiveDemo />} />
        <Route path="/demo/accessibility-demo" element={<AccessibilityDemo />} />
        <Route path="/demo/performance-demo" element={<PerformanceDemo />} />

        {/* Legacy demo routes */}
        <Route path="/design-system" element={<DesignSystemDemo />} />
        <Route path="/interaction-patterns" element={<InteractionPatternsDemo />} />
        <Route path="/responsive-demo" element={<ResponsiveDemo />} />
        <Route path="/accessibility-demo" element={<AccessibilityDemo />} />
        <Route path="/performance-demo" element={<PerformanceDemo />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/progress-timeline" element={<ProgressTimeline />} />
      </Routes>
      <TestModeIndicator />
    </div>
  )
}

export default App