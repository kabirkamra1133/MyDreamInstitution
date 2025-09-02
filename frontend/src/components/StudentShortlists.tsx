import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, MapPin, Trash2 } from 'lucide-react';
import { useMainContext } from '../context/mainContext';

interface ShortlistedCourse {
  parent: string;
  name: string;
  addedAt: string;
}

interface ShortlistedCollege {
  _id: string;
  college: {
    _id: string;
    name: string;
    profile?: {
      address?: {
        city?: string;
        state?: string;
      };
    };
  };
  interestedCourses: ShortlistedCourse[];
  notes?: string;
  createdAt: string;
}

export const StudentShortlists: React.FC = () => {
  const { server } = useMainContext();
  const [shortlists, setShortlists] = useState<ShortlistedCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchShortlists = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`${server}/api/shortlists/my-shortlists`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setShortlists(data.shortlists || []);
        } else {
          setError('Failed to fetch your shortlisted colleges');
        }
      } catch (err) {
        setError('Error loading shortlisted colleges');
        console.error('Error fetching shortlists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShortlists();
  }, [server]);

  const removeFromShortlist = async (shortlistId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${server}/api/shortlists/${shortlistId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setShortlists(prev => prev.filter(s => s._id !== shortlistId));
      } else {
        console.error('Failed to remove from shortlist');
      }
    } catch (error) {
      console.error('Error removing from shortlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading your shortlisted colleges...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            My Shortlisted Colleges ({shortlists.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {shortlists.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">You haven't shortlisted any colleges yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Browse colleges and add them to your shortlist to see them here.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {shortlists.map((shortlist) => (
                <Card key={shortlist._id} className="border border-border/50 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{shortlist.college.name}</h3>
                        {shortlist.college.profile?.address && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {shortlist.college.profile.address.city}, {shortlist.college.profile.address.state}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Added on: {new Date(shortlist.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromShortlist(shortlist._id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {shortlist.interestedCourses && shortlist.interestedCourses.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          Interested Courses:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {shortlist.interestedCourses.map((course, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {course.parent} - {course.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {shortlist.notes && (
                      <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm">
                          <span className="font-medium">Notes: </span>
                          {shortlist.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
