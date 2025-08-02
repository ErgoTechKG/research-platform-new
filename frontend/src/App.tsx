import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CoursePublish from './pages/CoursePublish'
import MentorManagement from './pages/MentorManagement'
import SeminarManagement from './pages/SeminarManagement'
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
      </Routes>
      <TestModeIndicator />
    </div>
  )
}

export default App