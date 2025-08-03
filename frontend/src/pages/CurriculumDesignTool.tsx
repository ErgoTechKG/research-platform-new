import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { 
  BookOpen, 
  Users, 
  Target, 
  Download, 
  Save, 
  Plus,
  Minus,
  ArrowRight,
  ArrowDown,
  CheckCircle,
  AlertTriangle,
  FileText,
  BarChart3,
  Shuffle,
  Copy,
  RefreshCw,
  Palette
} from 'lucide-react';

interface Course {
  id: string;
  name: string;
  credits: number;
  type: 'core' | 'elective';
  prerequisites?: string[];
  description?: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  lastUsed: string;
  totalCredits: number;
  icon: string;
}

interface SemesterPlan {
  term: number;
  courses: Course[];
  totalCredits: number;
}

interface CurriculumDesign {
  id: string;
  name: string;
  semesters: SemesterPlan[];
  totalCredits: number;
  coreCredits: number;
  electiveCredits: number;
}

const CurriculumDesignTool: React.FC = () => {
  const [templates] = useState<Template[]>([
    { id: '1', name: 'Computer Science', description: '4-Year Program', lastUsed: '2 days ago', totalCredits: 48, icon: '💻' },
    { id: '2', name: 'Biology Major', description: 'Graduate Level', lastUsed: '1 week ago', totalCredits: 52, icon: '🧪' },
    { id: '3', name: 'Business Analytics', description: 'Professional Track', lastUsed: 'New template', totalCredits: 45, icon: '📊' },
  ]);

  const [availableCourses] = useState<Course[]>([
    { id: '1', name: 'Programming Basics', credits: 3, type: 'core', description: 'Introduction to programming concepts' },
    { id: '2', name: 'Data Structures', credits: 4, type: 'core', description: 'Fundamental data structures and algorithms' },
    { id: '3', name: 'Software Engineering', credits: 4, type: 'core', description: 'Software development lifecycle and methodologies' },
    { id: '4', name: 'Database Management', credits: 3, type: 'core', description: 'Database design and management systems' },
    { id: '5', name: 'Mathematics Foundations', credits: 4, type: 'core', description: 'Mathematical foundations for CS' },
    { id: '6', name: 'Web Dev Frameworks', credits: 3, type: 'elective', description: 'Modern web development frameworks' },
    { id: '7', name: 'Machine Learning', credits: 4, type: 'elective', description: 'Introduction to machine learning algorithms' },
    { id: '8', name: 'Mobile Development', credits: 3, type: 'elective', description: 'Mobile app development' },
    { id: '9', name: 'Cybersecurity', credits: 3, type: 'elective', description: 'Information security principles' },
    { id: '10', name: 'UI/UX Design', credits: 3, type: 'elective', description: 'User interface and experience design' },
    { id: '11', name: 'Capstone Project', credits: 6, type: 'core', description: 'Final year capstone project' },
    { id: '12', name: 'Industry Internship', credits: 3, type: 'elective', description: 'Industry placement and experience' },
  ]);

  const [currentDesign, setCurrentDesign] = useState<CurriculumDesign>({
    id: '1',
    name: 'Current Design',
    semesters: [
      { term: 1, courses: [
        { id: '1', name: 'Programming Basics', credits: 3, type: 'core' },
        { id: '5', name: 'Mathematics Foundations', credits: 4, type: 'core' }
      ], totalCredits: 7 },
      { term: 2, courses: [
        { id: '2', name: 'Data Structures & Algorithms', credits: 4, type: 'core' },
        { id: '4', name: 'Database Management', credits: 3, type: 'core' }
      ], totalCredits: 7 },
      { term: 3, courses: [
        { id: '3', name: 'Software Engineering', credits: 4, type: 'core' },
        { id: '6', name: 'Web Dev Frameworks', credits: 3, type: 'elective' }
      ], totalCredits: 7 },
      { term: 4, courses: [
        { id: '11', name: 'Capstone Project', credits: 6, type: 'core' },
        { id: '12', name: 'Industry Internship', credits: 3, type: 'elective' }
      ], totalCredits: 9 }
    ],
    totalCredits: 30,
    coreCredits: 20,
    electiveCredits: 10
  });

  const [templateDesign] = useState<CurriculumDesign>({
    id: 'template',
    name: 'Computer Science Template',
    semesters: [
      { term: 1, courses: [
        { id: '1', name: 'Programming Basics', credits: 3, type: 'core' },
        { id: '5', name: 'Mathematics Foundations', credits: 4, type: 'core' }
      ], totalCredits: 7 },
      { term: 2, courses: [
        { id: '2', name: 'Data Structures', credits: 4, type: 'core' },
        { id: '4', name: 'Database Management', credits: 3, type: 'core' }
      ], totalCredits: 7 },
      { term: 3, courses: [
        { id: '3', name: 'Software Engineering', credits: 4, type: 'core' },
        { id: '7', name: 'Machine Learning', credits: 4, type: 'elective' }
      ], totalCredits: 8 },
      { term: 4, courses: [
        { id: '11', name: 'Capstone Project', credits: 6, type: 'core' },
        { id: '8', name: 'Mobile Development', credits: 3, type: 'elective' }
      ], totalCredits: 9 }
    ],
    totalCredits: 31,
    coreCredits: 21,
    electiveCredits: 10
  });

  const [autoSave, setAutoSave] = useState(true);
  const [draggedCourse, setDraggedCourse] = useState<Course | null>(null);

  const handleDragStart = useCallback((course: Course) => {
    setDraggedCourse(course);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((termIndex: number) => {
    if (draggedCourse) {
      setCurrentDesign(prev => {
        const newSemesters = [...prev.semesters];
        const targetSemester = newSemesters[termIndex];
        
        // Check if course already exists in this semester
        if (!targetSemester.courses.find(c => c.id === draggedCourse.id)) {
          targetSemester.courses.push(draggedCourse);
          targetSemester.totalCredits += draggedCourse.credits;
          
          // Recalculate totals
          const totalCredits = newSemesters.reduce((sum, sem) => sum + sem.totalCredits, 0);
          const coreCredits = newSemesters.reduce((sum, sem) => 
            sum + sem.courses.filter(c => c.type === 'core').reduce((cSum, c) => cSum + c.credits, 0), 0);
          const electiveCredits = totalCredits - coreCredits;
          
          return {
            ...prev,
            semesters: newSemesters,
            totalCredits,
            coreCredits,
            electiveCredits
          };
        }
        return prev;
      });
      setDraggedCourse(null);
    }
  }, [draggedCourse]);

  const removeCourseFromSemester = useCallback((termIndex: number, courseId: string) => {
    setCurrentDesign(prev => {
      const newSemesters = [...prev.semesters];
      const targetSemester = newSemesters[termIndex];
      const courseIndex = targetSemester.courses.findIndex(c => c.id === courseId);
      
      if (courseIndex !== -1) {
        const removedCourse = targetSemester.courses[courseIndex];
        targetSemester.courses.splice(courseIndex, 1);
        targetSemester.totalCredits -= removedCourse.credits;
        
        // Recalculate totals
        const totalCredits = newSemesters.reduce((sum, sem) => sum + sem.totalCredits, 0);
        const coreCredits = newSemesters.reduce((sum, sem) => 
          sum + sem.courses.filter(c => c.type === 'core').reduce((cSum, c) => cSum + c.credits, 0), 0);
        const electiveCredits = totalCredits - coreCredits;
        
        return {
          ...prev,
          semesters: newSemesters,
          totalCredits,
          coreCredits,
          electiveCredits
        };
      }
      return prev;
    });
  }, []);

  const getValidationStatus = (design: CurriculumDesign) => {
    const issues = [];
    const strengths = [];
    
    if (design.totalCredits < 48) {
      issues.push('Credit shortage');
    } else if (design.totalCredits > 50) {
      issues.push('Credit overflow');
    } else {
      strengths.push('Meets requirements');
    }
    
    if (design.coreCredits >= 18) {
      strengths.push('Adequate core courses');
    } else {
      issues.push('Insufficient core courses');
    }
    
    strengths.push('Logical prerequisites');
    
    return { issues, strengths };
  };

  const currentValidation = getValidationStatus(currentDesign);
  const templateValidation = getValidationStatus(templateDesign);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Curriculum Design Visual Tool</h1>
          <p className="text-gray-600 mt-1">Design and optimize curriculum structures with drag-and-drop interface</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Auto-save</span>
          <Switch checked={autoSave} onCheckedChange={setAutoSave} />
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="designer" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Designer
          </TabsTrigger>
          <TabsTrigger value="compare" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Compare
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </TabsTrigger>
          <TabsTrigger value="save" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Template Library */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Template Library
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{template.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-gray-600">{template.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Last used: {template.lastUsed}</p>
                          <p className="text-xs text-blue-600 mt-1">{template.totalCredits} credits</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">Load</Button>
                    <Button variant="outline" size="sm" className="flex-1">Create New</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Components */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Course Components
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Core Courses
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {availableCourses.filter(c => c.type === 'core').map((course) => (
                        <div 
                          key={course.id}
                          className="flex items-center justify-between p-3 border rounded cursor-move hover:bg-gray-50"
                          draggable
                          onDragStart={() => handleDragStart(course)}
                        >
                          <div>
                            <span className="font-medium text-sm">{course.name}</span>
                            <span className="text-xs text-gray-500 ml-2">({course.credits} credits)</span>
                          </div>
                          <Badge variant="default" className="text-xs">Core</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Electives
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {availableCourses.filter(c => c.type === 'elective').map((course) => (
                        <div 
                          key={course.id}
                          className="flex items-center justify-between p-3 border rounded cursor-move hover:bg-gray-50"
                          draggable
                          onDragStart={() => handleDragStart(course)}
                        >
                          <div>
                            <span className="font-medium text-sm">{course.name}</span>
                            <span className="text-xs text-gray-500 ml-2">({course.credits} credits)</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">Elective</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Alert>
                    <AlertDescription>
                      Drag courses from above to the semester map in the Designer tab
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="designer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Visual Course Map Designer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentDesign.semesters.map((semester, index) => (
                  <div 
                    key={index}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-48"
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                  >
                    <h4 className="font-medium mb-3 text-center">Term {semester.term}</h4>
                    <div className="space-y-2">
                      {semester.courses.map((course) => (
                        <div key={course.id} className="relative group">
                          <div className="p-2 bg-blue-100 border border-blue-200 rounded">
                            <div className="text-sm font-medium">{course.name}</div>
                            <div className="text-xs text-gray-600">{course.credits} Credits</div>
                            <button
                              onClick={() => removeCourseFromSemester(index, course.id)}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                          </div>
                          {index < currentDesign.semesters.length - 1 && (
                            <div className="flex justify-center mt-1">
                              <ArrowDown className="h-3 w-3 text-gray-400" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-2 border-t">
                      <div className="text-sm font-medium text-center">
                        Total: {semester.totalCredits} credits
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-6 p-4 bg-gray-100 rounded-lg">
                <div className="text-lg font-medium">
                  Total Credits: {currentDesign.totalCredits} / 48 required
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                  </Button>
                  <Button variant="outline" size="sm">
                    <Minus className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                  <Button variant="outline" size="sm">
                    <Shuffle className="h-4 w-4 mr-2" />
                    Rearrange
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compare" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Side-by-Side Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Design */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Current Design</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Credits:</span>
                      <span className="font-medium">{currentDesign.totalCredits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Core Courses:</span>
                      <span className="font-medium">{currentDesign.semesters.reduce((sum, sem) => sum + sem.courses.filter(c => c.type === 'core').length, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Electives:</span>
                      <span className="font-medium">{currentDesign.semesters.reduce((sum, sem) => sum + sem.courses.filter(c => c.type === 'elective').length, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">4 years</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    {currentValidation.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">{strength}</span>
                      </div>
                    ))}
                    {currentValidation.issues.map((issue, index) => (
                      <div key={index} className="flex items-center gap-2 text-orange-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">{issue}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm">Apply Changes</Button>
                    <Button variant="outline" size="sm">Reset</Button>
                  </div>
                </div>

                {/* Template Design */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Template: Computer Science</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Credits:</span>
                      <span className="font-medium">{templateDesign.totalCredits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Core Courses:</span>
                      <span className="font-medium">{templateDesign.semesters.reduce((sum, sem) => sum + sem.courses.filter(c => c.type === 'core').length, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Electives:</span>
                      <span className="font-medium">{templateDesign.semesters.reduce((sum, sem) => sum + sem.courses.filter(c => c.type === 'elective').length, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">4 years</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    {templateValidation.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">{strength}</span>
                      </div>
                    ))}
                    {templateValidation.issues.map((issue, index) => (
                      <div key={index} className="flex items-center gap-2 text-orange-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">{issue}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm">Use This</Button>
                    <Button variant="outline" size="sm">Merge Elements</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <FileText className="h-8 w-8" />
                  PDF
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <BarChart3 className="h-8 w-8" />
                  Excel
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <FileText className="h-8 w-8" />
                  Word
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <ArrowRight className="h-8 w-8" />
                  Share Link
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Export Preview</h4>
                <p className="text-sm text-gray-600 mb-4">Your curriculum design will include:</p>
                <ul className="text-sm space-y-1">
                  <li>• Course schedule by semester</li>
                  <li>• Credit distribution analysis</li>
                  <li>• Prerequisite relationships</li>
                  <li>• Validation report</li>
                  <li>• Comparison with template standards</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="save" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="h-5 w-5" />
                Save & Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="h-16 flex-col gap-2">
                    <Save className="h-6 w-6" />
                    Save Current Design
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-2">
                    <Copy className="h-6 w-6" />
                    Save as Template
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Recent Saves</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">CS Program v2.1</span>
                        <span className="text-sm text-gray-500 ml-2">Saved 5 minutes ago</span>
                      </div>
                      <Button variant="outline" size="sm">Load</Button>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">Bio Track Draft</span>
                        <span className="text-sm text-gray-500 ml-2">Saved 2 hours ago</span>
                      </div>
                      <Button variant="outline" size="sm">Load</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Bar */}
      <div className="bg-white border rounded-lg p-3 text-sm text-gray-600 flex items-center justify-between">
        <span>📥 Export Options: PDF | Excel | Word | Share Link • Auto-save: {autoSave ? 'ON' : 'OFF'}</span>
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Last saved: 2 minutes ago</span>
        </div>
      </div>
    </div>
  );
};

export default CurriculumDesignTool;