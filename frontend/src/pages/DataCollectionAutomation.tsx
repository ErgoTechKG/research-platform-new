import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { 
  Database, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Download,
  Filter,
  Eye,
  Wrench,
  Plus,
  Settings,
  BarChart3,
  Clock,
  FileText,
  PlayCircle
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  status: 'running' | 'warning' | 'failed' | 'stopped';
  type: string;
  lastSync: string;
  records: number;
  quality: number;
}

interface QualityMetric {
  name: string;
  value: number;
  target: number;
  color: string;
}

interface Activity {
  id: string;
  time: string;
  source: string;
  records: number;
  status: 'success' | 'warning' | 'failed';
  quality: number;
}

interface Alert {
  id: string;
  message: string;
  type: 'warning' | 'error' | 'info';
  time: string;
}

const DataCollectionAutomation: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    { id: '1', name: 'Academic Database', status: 'running', type: 'Database', lastSync: '2 min ago', records: 1247, quality: 92 },
    { id: '2', name: 'Student Portal', status: 'running', type: 'Web API', lastSync: '5 min ago', records: 856, quality: 87 },
    { id: '3', name: 'Email System', status: 'warning', type: 'IMAP', lastSync: '15 min ago', records: 423, quality: 45 },
    { id: '4', name: 'External API', status: 'failed', type: 'REST API', lastSync: '1 hour ago', records: 0, quality: 0 },
    { id: '5', name: 'File Server', status: 'running', type: 'FTP', lastSync: '1 min ago', records: 634, quality: 94 },
    { id: '6', name: 'Survey Platform', status: 'running', type: 'Web API', lastSync: '3 min ago', records: 189, quality: 98 },
  ]);

  const [qualityMetrics] = useState<QualityMetric[]>([
    { name: 'Completeness', value: 92, target: 95, color: 'bg-blue-500' },
    { name: 'Accuracy', value: 87, target: 90, color: 'bg-green-500' },
    { name: 'Consistency', value: 94, target: 95, color: 'bg-purple-500' },
    { name: 'Timeliness', value: 76, target: 85, color: 'bg-orange-500' },
    { name: 'Validity', value: 89, target: 90, color: 'bg-red-500' },
  ]);

  const [activities] = useState<Activity[]>([
    { id: '1', time: '14:25', source: 'Academic Database', records: 1247, status: 'success', quality: 92 },
    { id: '2', time: '14:20', source: 'Student Portal', records: 856, status: 'success', quality: 87 },
    { id: '3', time: '14:15', source: 'Email System', records: 423, status: 'warning', quality: 45 },
    { id: '4', time: '14:10', source: 'Survey Platform', records: 189, status: 'success', quality: 98 },
    { id: '5', time: '14:05', source: 'External API', records: 0, status: 'failed', quality: 0 },
  ]);

  const [alerts] = useState<Alert[]>([
    { id: '1', message: 'Email sync delayed 15min', type: 'warning', time: '14:10' },
    { id: '2', message: 'API rate limit exceeded', type: 'error', time: '14:05' },
    { id: '3', message: 'Duplicate records found', type: 'warning', time: '13:58' },
  ]);

  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        // Simulate data updates
        setDataSources(prev => prev.map(source => ({
          ...source,
          lastSync: source.status === 'running' ? 'Just now' : source.lastSync
        })));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <RefreshCw className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      running: 'default',
      warning: 'secondary',
      failed: 'destructive',
      stopped: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const activeSources = dataSources.filter(source => source.status === 'running').length;
  const totalRecords = dataSources.reduce((sum, source) => sum + source.records, 0);
  const avgQuality = dataSources.reduce((sum, source) => sum + source.quality, 0) / dataSources.length;

  const handleSyncAll = () => {
    setDataSources(prev => prev.map(source => ({
      ...source,
      lastSync: 'Just now',
      status: Math.random() > 0.8 ? 'warning' : 'running'
    })));
  };

  const handleSourceToggle = (sourceId: string) => {
    setDataSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, status: source.status === 'running' ? 'stopped' : 'running' }
        : source
    ));
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Collection Control Center</h1>
          <p className="text-gray-600 mt-1">Automated data collection and quality monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Auto-refresh</span>
          <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="sources" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Sources
          </TabsTrigger>
          <TabsTrigger value="validation" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Validation
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Sources</p>
                    <p className="text-2xl font-bold">{activeSources}/15</p>
                  </div>
                  <Database className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Records Today</p>
                    <p className="text-2xl font-bold">{totalRecords.toLocaleString()}</p>
                  </div>
                  <FileText className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Quality</p>
                    <p className="text-2xl font-bold">{avgQuality.toFixed(0)}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Alerts</p>
                    <p className="text-2xl font-bold">{alerts.length}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Sources Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Sources Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dataSources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(source.status)}
                        <div>
                          <p className="font-medium">{source.name}</p>
                          <p className="text-sm text-gray-500">{source.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(source.status)}
                        <Switch 
                          checked={source.status === 'running'} 
                          onCheckedChange={() => handleSourceToggle(source.id)}
                          size="sm"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Source
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSyncAll} className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real-time Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-time Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Collection Rate</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Validation Rate</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Storage Rate</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Active Alerts ({alerts.length})
                    </h4>
                    <div className="space-y-2">
                      {alerts.slice(0, 3).map((alert) => (
                        <Alert key={alert.id} className={alert.type === 'error' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}>
                          <AlertDescription className="text-sm">
                            • {alert.message}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">View All</Button>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Quality Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Data Quality Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Quality Metrics</h4>
                  {qualityMetrics.map((metric) => (
                    <div key={metric.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{metric.name}</span>
                        <span>{metric.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${metric.color} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${metric.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Today's Goals vs Actual</h4>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <span>Records Collected:</span>
                      <span className="font-medium">2,847 / 3,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Validation Rate:</span>
                      <span className="font-medium">94% / 95%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Error Rate:</span>
                      <span className="font-medium">1.2% / &lt;2%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Button variant="outline" className="flex items-center gap-2" onClick={handleSyncAll}>
                  <RefreshCw className="h-4 w-4" />
                  Force Sync All
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Manual Import
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Run Validation
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Quality Report
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Update Rules
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Data Sources Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataSources.map((source) => (
                  <div key={source.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(source.status)}
                        <div>
                          <h4 className="font-medium">{source.name}</h4>
                          <p className="text-sm text-gray-500">{source.type} • Last sync: {source.lastSync}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{source.records.toLocaleString()} records</p>
                          <p className="text-sm text-gray-500">Quality: {source.quality}%</p>
                        </div>
                        {getStatusBadge(source.status)}
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation">
          <Card>
            <CardHeader>
              <CardTitle>Data Validation & Quality Control</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Validation Rules</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>Email format validation</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>Duplicate detection</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>Required field check</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>Data range validation</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Quality Metrics</h4>
                  <div className="space-y-4">
                    {qualityMetrics.map((metric) => (
                      <div key={metric.name} className="flex items-center justify-between">
                        <span>{metric.name}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={metric.value} className="w-24 h-2" />
                          <span className="text-sm font-medium w-12">{metric.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Data Collection Activity
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Time</th>
                      <th className="text-left p-2">Source</th>
                      <th className="text-left p-2">Records</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Quality</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((activity) => (
                      <tr key={activity.id} className="border-b">
                        <td className="p-2">{activity.time}</td>
                        <td className="p-2">{activity.source}</td>
                        <td className="p-2">{activity.records.toLocaleString()}</td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(activity.status)}
                            <span className="capitalize">{activity.status}</span>
                          </div>
                        </td>
                        <td className="p-2">{activity.quality}%</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Wrench className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Alert Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <Alert key={alert.id} className={alert.type === 'error' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{alert.message}</span>
                        <span className="text-sm text-gray-500 ml-2">• {alert.time}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Resolve</Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Bar */}
      <div className="bg-white border rounded-lg p-3 text-sm text-gray-600 flex items-center justify-between">
        <span>Status: {activeSources} sources active • Last update: 2 minutes ago • Next sync: 3 min</span>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}</span>
        </div>
      </div>
    </div>
  );
};

export default DataCollectionAutomation;