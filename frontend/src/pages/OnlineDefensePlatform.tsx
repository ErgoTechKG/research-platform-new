import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Slider } from '../components/ui/slider';
import { 
  Video, VideoOff, Mic, MicOff, Monitor, MonitorOff, 
  MessageCircle, Users, Settings, Wifi, WifiOff,
  Circle, Download, Clock, Send,
  PhoneOff, Volume2, VolumeX, Star, FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface Participant {
  id: string;
  name: string;
  role: 'student' | 'chair' | 'reviewer' | 'observer';
  videoEnabled: boolean;
  audioEnabled: boolean;
  isPresenting?: boolean;
  stream?: MediaStream;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  type: 'chat' | 'question' | 'system';
}

interface Score {
  reviewerId: string;
  reviewerName: string;
  presentation: number;
  content: number;
  qa: number;
  overall: number;
  comments: string;
  submitted: boolean;
}

export default function OnlineDefensePlatform() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defenseId = searchParams.get('id') || 'defense-123';
  
  // Video conference state
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isPresenting, setIsPresenting] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [networkQuality, setNetworkQuality] = useState<'good' | 'fair' | 'poor'>('good');
  
  // UI state
  const [activeTab, setActiveTab] = useState('video');
  const [showSettings, setShowSettings] = useState(false);
  const [showScoring, setShowScoring] = useState(false);
  const [message, setMessage] = useState('');
  const [question, setQuestion] = useState('');
  const [volume, setVolume] = useState(80);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  
  // Mock data
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: '张教授', role: 'chair', videoEnabled: true, audioEnabled: true },
    { id: '2', name: '李教授', role: 'reviewer', videoEnabled: true, audioEnabled: false },
    { id: '3', name: '王教授', role: 'reviewer', videoEnabled: false, audioEnabled: true },
    { id: '4', name: '我', role: 'student', videoEnabled: true, audioEnabled: true },
  ]);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: '系统', message: '答辩会议已开始', timestamp: new Date(), type: 'system' },
    { id: '2', sender: '张教授', message: '请开始您的陈述', timestamp: new Date(), type: 'chat' },
  ]);
  
  const [scores, setScores] = useState<Score[]>([
    { reviewerId: '1', reviewerName: '张教授', presentation: 0, content: 0, qa: 0, overall: 0, comments: '', submitted: false },
    { reviewerId: '2', reviewerName: '李教授', presentation: 0, content: 0, qa: 0, overall: 0, comments: '', submitted: false },
    { reviewerId: '3', reviewerName: '王教授', presentation: 0, content: 0, qa: 0, overall: 0, comments: '', submitted: false },
  ]);
  
  // Initialize media
  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };
    
    initMedia();
    
    // Start timer
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    // Simulate network quality monitoring
    const networkInterval = setInterval(() => {
      const qualities: ('good' | 'fair' | 'poor')[] = ['good', 'good', 'fair', 'poor'];
      setNetworkQuality(qualities[Math.floor(Math.random() * qualities.length)]);
    }, 5000);
    
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      clearInterval(networkInterval);
    };
  }, []);
  
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoEnabled;
        setVideoEnabled(!videoEnabled);
      }
    }
  };
  
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioEnabled;
        setAudioEnabled(!audioEnabled);
      }
    }
  };
  
  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true,
        audio: false 
      });
      setScreenStream(stream);
      setIsPresenting(true);
      
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };
  
  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setIsPresenting(false);
    }
  };
  
  const startRecording = () => {
    if (localStream) {
      const recorder = new MediaRecorder(localStream);
      mediaRecorderRef.current = recorder;
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };
      
      recorder.start();
      setIsRecording(true);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Create download link
      setTimeout(() => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `defense-recording-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setRecordedChunks([]);
      }, 1000);
    }
  };
  
  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: user?.name || '我',
        message: message,
        timestamp: new Date(),
        type: 'chat'
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };
  
  const sendQuestion = () => {
    if (question.trim()) {
      const newQuestion: ChatMessage = {
        id: Date.now().toString(),
        sender: user?.name || '我',
        message: `[问题] ${question}`,
        timestamp: new Date(),
        type: 'question'
      };
      setMessages([...messages, newQuestion]);
      setQuestion('');
    }
  };
  
  const updateScore = (reviewerId: string, field: keyof Score, value: any) => {
    setScores(scores.map(score => 
      score.reviewerId === reviewerId 
        ? { ...score, [field]: value }
        : score
    ));
  };
  
  const submitScore = (reviewerId: string) => {
    setScores(scores.map(score => 
      score.reviewerId === reviewerId 
        ? { ...score, submitted: true }
        : score
    ));
    alert('评分已提交');
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getNetworkIcon = () => {
    switch (networkQuality) {
      case 'good':
        return <Wifi className="w-4 h-4 text-green-600" />;
      case 'fair':
        return <Wifi className="w-4 h-4 text-yellow-600" />;
      case 'poor':
        return <WifiOff className="w-4 h-4 text-red-600" />;
    }
  };
  
  const isReviewer = user?.role === 'professor' || user?.role === 'teacher' || user?.role === 'admin';
  
  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-white text-lg font-semibold">在线答辩平台</h1>
          <Badge variant="outline" className="text-white border-white">
            答辩进行中
          </Badge>
          <div className="flex items-center space-x-2 text-white">
            <Clock className="w-4 h-4" />
            <span>{formatTime(elapsedTime)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {getNetworkIcon()}
            <span className="text-white text-sm">网络{networkQuality === 'good' ? '良好' : networkQuality === 'fair' ? '一般' : '较差'}</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="text-white hover:bg-gray-700"
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm('确定要离开答辩会议吗？')) {
                navigate('/defense-scheduling');
              }
            }}
          >
            <PhoneOff className="w-4 h-4 mr-2" />
            离开会议
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 p-4">
          <div className="h-full bg-black rounded-lg relative">
            {/* Main Video (Presenter or Selected) */}
            <div className="h-full flex items-center justify-center">
              {isPresenting && screenStream ? (
                <video
                  className="h-full w-full object-contain"
                  autoPlay
                  ref={el => {
                    if (el && screenStream) {
                      el.srcObject = screenStream;
                    }
                  }}
                />
              ) : (
                <video
                  ref={localVideoRef}
                  className="h-full w-full object-contain"
                  autoPlay
                  muted
                />
              )}
            </div>
            
            {/* Participant Videos */}
            <div className="absolute bottom-4 left-4 right-4 flex space-x-2 overflow-x-auto">
              {participants.map(participant => (
                <div key={participant.id} className="relative">
                  <video
                    ref={el => remoteVideoRefs.current[participant.id] = el}
                    className="w-32 h-24 bg-gray-800 rounded object-cover"
                    autoPlay
                  />
                  <div className="absolute bottom-1 left-1 right-1 flex justify-between items-center px-2">
                    <span className="text-white text-xs truncate">{participant.name}</span>
                    <div className="flex space-x-1">
                      {!participant.videoEnabled && <VideoOff className="w-3 h-3 text-red-500" />}
                      {!participant.audioEnabled && <MicOff className="w-3 h-3 text-red-500" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-96 bg-white border-l">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b">
              <TabsTrigger value="video">视频控制</TabsTrigger>
              <TabsTrigger value="chat">聊天</TabsTrigger>
              <TabsTrigger value="qa">问答</TabsTrigger>
              {isReviewer && <TabsTrigger value="score">评分</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="video" className="flex-1 p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">会议控制</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={videoEnabled ? "default" : "secondary"}
                      onClick={toggleVideo}
                      className="w-full"
                    >
                      {videoEnabled ? <Video className="w-4 h-4 mr-2" /> : <VideoOff className="w-4 h-4 mr-2" />}
                      {videoEnabled ? '关闭视频' : '开启视频'}
                    </Button>
                    
                    <Button
                      variant={audioEnabled ? "default" : "secondary"}
                      onClick={toggleAudio}
                      className="w-full"
                    >
                      {audioEnabled ? <Mic className="w-4 h-4 mr-2" /> : <MicOff className="w-4 h-4 mr-2" />}
                      {audioEnabled ? '静音' : '取消静音'}
                    </Button>
                  </div>
                  
                  <Button
                    variant={isPresenting ? "destructive" : "outline"}
                    onClick={isPresenting ? stopScreenShare : startScreenShare}
                    className="w-full"
                  >
                    {isPresenting ? <MonitorOff className="w-4 h-4 mr-2" /> : <Monitor className="w-4 h-4 mr-2" />}
                    {isPresenting ? '停止共享' : '共享屏幕'}
                  </Button>
                  
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    onClick={isRecording ? stopRecording : startRecording}
                    className="w-full"
                  >
                    {isRecording ? <Circle className="w-4 h-4 mr-2 text-red-600 animate-pulse" /> : <Circle className="w-4 h-4 mr-2" />}
                    {isRecording ? '停止录制' : '开始录制'}
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">参会人员</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {participants.map(participant => (
                      <div key={participant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">{participant.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {participant.role === 'chair' ? '主席' : 
                             participant.role === 'reviewer' ? '评委' :
                             participant.role === 'student' ? '学生' : '观察员'}
                          </Badge>
                        </div>
                        <div className="flex space-x-1">
                          {participant.videoEnabled ? 
                            <Video className="w-4 h-4 text-green-600" /> : 
                            <VideoOff className="w-4 h-4 text-red-600" />
                          }
                          {participant.audioEnabled ? 
                            <Mic className="w-4 h-4 text-green-600" /> : 
                            <MicOff className="w-4 h-4 text-red-600" />
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="chat" className="flex-1 flex flex-col p-4">
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-3">
                  {messages.filter(m => m.type !== 'question').map(msg => (
                    <div key={msg.id} className={`p-3 rounded-lg ${
                      msg.type === 'system' ? 'bg-gray-100 text-center' : 
                      msg.sender === (user?.name || '我') ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'
                    }`}>
                      {msg.type !== 'system' && (
                        <div className="font-medium text-sm text-gray-700 mb-1">{msg.sender}</div>
                      )}
                      <div className="text-sm">{msg.message}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="flex space-x-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="输入消息..."
                  className="flex-1"
                  rows={2}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button onClick={sendMessage} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="qa" className="flex-1 flex flex-col p-4">
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-3">
                  {messages.filter(m => m.type === 'question').map(msg => (
                    <div key={msg.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="font-medium text-sm text-gray-700 mb-1">{msg.sender}</div>
                      <div className="text-sm">{msg.message.replace('[问题] ', '')}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                  {messages.filter(m => m.type === 'question').length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-8">
                      暂无提问
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="space-y-3">
                <Alert>
                  <AlertDescription className="text-sm">
                    请在问答环节提出您的问题，答辩人将进行回答。
                  </AlertDescription>
                </Alert>
                
                <div className="flex space-x-2">
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="输入您的问题..."
                    className="flex-1"
                    rows={2}
                  />
                  <Button onClick={sendQuestion} size="sm">
                    提问
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {isReviewer && (
              <TabsContent value="score" className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">评分标准</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">陈述表现 (30%)</label>
                          <Slider
                            value={[scores[0].presentation]}
                            onValueChange={(value) => updateScore(scores[0].reviewerId, 'presentation', value[0])}
                            max={100}
                            step={5}
                            className="mt-2"
                          />
                          <div className="text-right text-sm text-gray-500 mt-1">
                            {scores[0].presentation} 分
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">内容质量 (40%)</label>
                          <Slider
                            value={[scores[0].content]}
                            onValueChange={(value) => updateScore(scores[0].reviewerId, 'content', value[0])}
                            max={100}
                            step={5}
                            className="mt-2"
                          />
                          <div className="text-right text-sm text-gray-500 mt-1">
                            {scores[0].content} 分
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">问答表现 (30%)</label>
                          <Slider
                            value={[scores[0].qa]}
                            onValueChange={(value) => updateScore(scores[0].reviewerId, 'qa', value[0])}
                            max={100}
                            step={5}
                            className="mt-2"
                          />
                          <div className="text-right text-sm text-gray-500 mt-1">
                            {scores[0].qa} 分
                          </div>
                        </div>
                        
                        <div className="pt-3 border-t">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">总分</span>
                            <span className="text-lg font-bold">
                              {Math.round(scores[0].presentation * 0.3 + scores[0].content * 0.4 + scores[0].qa * 0.3)}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">评语</label>
                          <Textarea
                            value={scores[0].comments}
                            onChange={(e) => updateScore(scores[0].reviewerId, 'comments', e.target.value)}
                            placeholder="请输入评语..."
                            className="mt-2"
                            rows={3}
                          />
                        </div>
                        
                        <Button 
                          onClick={() => submitScore(scores[0].reviewerId)}
                          className="w-full"
                          disabled={scores[0].submitted}
                        >
                          {scores[0].submitted ? '已提交' : '提交评分'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">其他评委评分状态</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {scores.slice(1).map(score => (
                          <div key={score.reviewerId} className="flex items-center justify-between">
                            <span className="text-sm">{score.reviewerName}</span>
                            <Badge variant={score.submitted ? "default" : "secondary"}>
                              {score.submitted ? '已评分' : '待评分'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
      
      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>会议设置</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">音量</label>
              <div className="flex items-center space-x-2 mt-2">
                <VolumeX className="w-4 h-4 text-gray-600" />
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  max={100}
                  className="flex-1"
                />
                <Volume2 className="w-4 h-4 text-gray-600" />
                <span className="text-sm w-12 text-right">{volume}%</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">视频质量</label>
              <select className="w-full mt-2 p-2 border rounded">
                <option value="high">高清 (720p)</option>
                <option value="medium">标清 (480p)</option>
                <option value="low">流畅 (360p)</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">录制设置</label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">录制所有参与者视频</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">录制屏幕共享</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">录制聊天记录</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                取消
              </Button>
              <Button onClick={() => setShowSettings(false)}>
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}