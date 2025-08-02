import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CoursePublish from './pages/CoursePublish'
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
      </Routes>
      <TestModeIndicator />
    </div>
  )
}

export default App