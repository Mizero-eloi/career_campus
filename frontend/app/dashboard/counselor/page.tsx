'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '@/lib/api';
import { Calendar, Users, BookOpen, TrendingUp } from 'lucide-react';

export default function CounselorDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'counselor')) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    try {
      const [sessionsRes, studentsRes] = await Promise.all([
        api.get('/sessions'),
        api.get('/counselors/students'),
      ]);

      setSessions(sessionsRes.data.sessions || []);
      setStudents(studentsRes.data.students || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSessionStatus = async (sessionId: number, status: string) => {
    try {
      await api.patch(`/sessions/${sessionId}`, { status });
      fetchData();
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  const upcomingSessions = sessions.filter(
    (s) => (s.status === 'confirmed' || s.status === 'pending') &&
    new Date(s.scheduled_at) > new Date()
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Counselor Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.firstName}!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingSessions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.filter((s) => s.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>Manage your counseling sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.length > 0 ? (
                    sessions.map((session: any) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          {session.first_name} {session.last_name}
                        </TableCell>
                        <TableCell>
                          {new Date(session.scheduled_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge>{session.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {session.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => updateSessionStatus(session.id, 'confirmed')}
                            >
                              Confirm
                            </Button>
                          )}
                          {session.status === 'confirmed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateSessionStatus(session.id, 'completed')}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No sessions yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Students</CardTitle>
              <CardDescription>Students you're working with</CardDescription>
            </CardHeader>
            <CardContent>
              {students.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student: any) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          {student.first_name} {student.last_name}
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.phone || 'N/A'}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">View Profile</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No students yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Share Resources</CardTitle>
              <CardDescription>Upload and share resources with students</CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Upload Resource</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

