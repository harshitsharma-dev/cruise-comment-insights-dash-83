
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, TrendingUp, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  // Mock data for the dashboard metrics
  const metrics = [
    {
      title: "Overall Rating",
      value: "8.2",
      change: "+0.3",
      icon: BarChart3,
      color: "text-blue-600"
    },
    {
      title: "Total Reviews",
      value: "2,847",
      change: "+127",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Satisfaction Score",
      value: "87%",
      change: "+2%",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Critical Issues",
      value: "23",
      change: "-5",
      icon: AlertTriangle,
      color: "text-red-600"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your sailing analytics dashboard</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-gray-600 mt-1">
                  <span className={metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {metric.change}
                  </span>
                  {' '}from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest feedback and ratings overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">New reviews processed</p>
                  <p className="text-sm text-gray-600">From last sailing batch</p>
                </div>
                <span className="text-2xl font-bold text-blue-600">127</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Issues identified</p>
                  <p className="text-sm text-gray-600">Requiring attention</p>
                </div>
                <span className="text-2xl font-bold text-red-600">8</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Navigation</CardTitle>
            <CardDescription>Access key features quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <BarChart3 className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-medium">Rating Summary</p>
                <p className="text-sm text-gray-600">View detailed ratings</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <TrendingUp className="h-6 w-6 text-green-600 mb-2" />
                <p className="font-medium">Metric Filter</p>
                <p className="text-sm text-gray-600">Filter by metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
