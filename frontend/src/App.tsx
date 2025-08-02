import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CoursePublish from './pages/CoursePublish'
import MentorManagement from './pages/MentorManagement'
import SeminarManagement from './pages/SeminarManagement'
import CourseTimeline from './pages/CourseTimeline'
import StudentPreference from './pages/StudentPreference'
import MentorScreening from './pages/MentorScreening'
import MatchingVisualization from './pages/MatchingVisualization'
import AdjustmentManagement from './pages/AdjustmentManagement'
import TaskPublishing from './pages/TaskPublishing'
import ProgressTracking from './pages/ProgressTracking'
import WeeklyMeeting from './pages/WeeklyMeeting'
import LearningReport from './pages/LearningReport'
import InstantMessaging from './pages/InstantMessaging'
import PosterDesigner from './pages/PosterDesigner'
import ResearchReport from './pages/ResearchReport'
import DefenseScheduling from './pages/DefenseScheduling'
import OnlineDefensePlatform from './pages/OnlineDefensePlatform'
import AchievementShowcase from './pages/AchievementShowcase'
import MultidimensionalScoringForm from './pages/MultidimensionalScoringForm'
import ScoringStandardConfig from './pages/ScoringStandardConfig'
import BatchScoringInterface from './pages/BatchScoringInterface'
import GradeInquiry from './pages/GradeInquiry'
import GradeAnalysisReport from './pages/GradeAnalysisReport'
import EvaluationPlanPublishing from './pages/EvaluationPlanPublishing'
import ExpertGroupManagement from './pages/ExpertGroupManagement'
import EvaluationStandardConfig from './pages/EvaluationStandardConfig'
import TimelinePlanning from './pages/TimelinePlanning'
import InformationCollectionForm from './pages/InformationCollectionForm'
import MaterialUploadSystem from './pages/MaterialUploadSystem'
import OCRRecognitionIntegration from './pages/OCRRecognitionIntegration'
import PreliminaryReviewWorkbench from './pages/PreliminaryReviewWorkbench'
import ProgressTrackingPanel from './pages/ProgressTrackingPanel'
import DimensionalScoringInterface from './pages/DimensionalScoringInterface'
import GradeImportSystem from './pages/GradeImportSystem'
import ExpertReviewPlatform from './pages/ExpertReviewPlatform'
import ScoringCalibrationTool from './pages/ScoringCalibrationTool'
import RealtimeStatisticsPanel from './pages/RealtimeStatisticsPanel'
import MoralCharacterEvaluationInterface from './pages/MoralCharacterEvaluationInterface'
import AutomaticCalculationEngine from './pages/AutomaticCalculationEngine'
import GradePreview from './pages/GradePreview'
import AnomalyDetectionSystem from './pages/AnomalyDetectionSystem'
import ReviewConfirmationProcess from './pages/ReviewConfirmationProcess'
import GradeLockingMechanism from './pages/GradeLockingMechanism'
import GradeAnnouncementSystem from './pages/GradeAnnouncementSystem'
import TestModeIndicator from './components/TestModeIndicator'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
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
      </Routes>
      <TestModeIndicator />
    </div>
  )
}

export default App