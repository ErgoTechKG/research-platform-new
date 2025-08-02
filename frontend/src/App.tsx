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
      </Routes>
      <TestModeIndicator />
    </div>
  )
}

export default App