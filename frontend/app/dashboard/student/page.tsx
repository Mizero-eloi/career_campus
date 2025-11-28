'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { Target, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'student')) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    try {
      const [recRes, goalsRes, sessionsRes] = await Promise.all([
        api.get('/students/recommendations'),
        api.get('/students/goals'),
        api.get('/sessions'),
      ]);

      setRecommendations(recRes.data.recommendations || []);
      setGoals(goalsRes.data.goals || []);
      setSessions(sessionsRes.data.sessions || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.firstName}!</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recommendations">Career Recommendations</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Career Recommendations</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recommendations.length}</div>
                <p className="text-xs text-muted-foreground">Available paths</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {goals.filter((g) => g.status === 'in_progress').length}
                </div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sessions.filter((s) => s.status === 'confirmed' || s.status === 'pending').length}
                </div>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sessions.filter((s) => s.status === 'completed').length}
                </div>
                <p className="text-xs text-muted-foreground">Total</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                {recommendations.slice(0, 3).length > 0 ? (
                  <div className="space-y-2">
                    {recommendations.slice(0, 3).map((rec: any) => (
                      <div key={rec.id} className="flex items-center justify-between">
                        <span>{rec.career_path}</span>
                        <Badge>{rec.match_score}% match</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Complete an assessment to get recommendations
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Goals</CardTitle>
              </CardHeader>
              <CardContent>
                {goals.slice(0, 3).length > 0 ? (
                  <div className="space-y-2">
                    {goals.slice(0, 3).map((goal: any) => (
                      <div key={goal.id} className="flex items-center justify-between">
                        <span>{goal.goal_title}</span>
                        <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
                          {goal.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No goals yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Career Recommendations</CardTitle>
              <CardDescription>
                Based on your assessment results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec: any) => (
                    <Card key={rec.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{rec.career_path}</CardTitle>
                          <Badge>{rec.match_score}% match</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Complete an assessment to receive personalized career recommendations
                  </p>
                  <Button>Take Assessment</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <div className="flex justify-between items-center">
            <CardTitle>My Sessions</CardTitle>
            <Link href="/dashboard/student/book-session">
              <Button>Book New Session</Button>
            </Link>
          </div>
          {sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.map((session: any) => (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        {session.first_name} {session.last_name}
                      </CardTitle>
                      <Badge>{session.status}</Badge>
                    </div>
                    <CardDescription>
                      {new Date(session.scheduled_at).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  {session.notes && (
                    <CardContent>
                      <p className="text-sm">{session.notes}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No sessions yet</p>
                <Link href="/dashboard/student/book-session">
                  <Button className="mt-4">Book Your First Session</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="flex justify-between items-center">
            <CardTitle>My Goals</CardTitle>
            <Button>Create New Goal</Button>
          </div>
          {goals.length > 0 ? (
            <div className="space-y-4">
              {goals.map((goal: any) => (
                <Card key={goal.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{goal.goal_title}</CardTitle>
                      <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
                        {goal.status}
                      </Badge>
                    </div>
                    {goal.goal_description && (
                      <CardDescription>{goal.goal_description}</CardDescription>
                    )}
                  </CardHeader>
                  {goal.target_date && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Target: {new Date(goal.target_date).toLocaleDateString()}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No goals yet</p>
                <Button className="mt-4">Create Your First Goal</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Resources</CardTitle>
              <CardDescription>Explore articles, videos, and courses</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/student/resources">
                <Button>Browse Resources</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

