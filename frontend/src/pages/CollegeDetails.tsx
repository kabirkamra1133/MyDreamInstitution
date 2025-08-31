import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Media { url?: string }
interface Contact { primaryPhone?: string; email?: string }
interface Address { city?: string; state?: string; line1?: string; pincode?: string; country?: string }
interface Profile { description?: string; features?: string[]; address?: Address; contact?: Contact }
interface Course { name: string; subCourses: { name: string; fee: string; eligibility: string[] }[] }
interface CollegeAdminData {
  _id: string;
  name: string;
  logo?: Media;
  coverPhoto?: Media;
  profile?: Profile;
  courses?: Course[];
}

const CollegeDetails: React.FC = () => {
  const { id } = useParams();

  const [data, setData] = useState<CollegeAdminData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  // Course selection state for Apply section
  const [selectedParentCourse, setSelectedParentCourse] = useState<string>('');
  const [selectedSubCourse, setSelectedSubCourse] = useState<string>('');
  const [interestedCourses, setInterestedCourses] = useState<{ parent: string; name: string }[]>([]);

  useEffect(() => {
    if (!id) return;
    let abort = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/college-admins/${id}`);
        if (!res.ok) {
          const txt = await res.text();
            throw new Error(txt || 'Failed to load');
        }
        const json = await res.json();
        if (!abort) setData(json.data);
      } catch (e: unknown) {
        if (!abort) setError(e instanceof Error ? e.message : 'Error');
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => { abort = true; };
  }, [id]);

  const cover = data?.coverPhoto?.url || 'https://placehold.co/1200x400/E2E8F0/4A5568?text=Cover+Photo';
  const logo = data?.logo?.url || 'https://placehold.co/200x200/E2E8F0/4A5568?text=Logo';
  const name = data?.name || 'Loading...';
  const description = data?.profile?.description || 'No description provided yet.';
  const features = data?.profile?.features || [];
  const courses = (data?.courses || []).flatMap(c => c.subCourses.map(sc => ({ parent: c.name, ...sc })) ).slice(0,5);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        {loading && <p className="text-sm text-muted-foreground">Loading college details...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="relative rounded-lg overflow-hidden shadow-lg mt-2">
          <img src={cover} alt="cover" className="w-full h-56 object-cover" />
          <div className="absolute left-6 top-32 flex items-center space-x-6">
            <img src={logo} className="w-28 h-28 rounded-xl ring-4 ring-white object-cover" alt="logo" />
            <div>
              <h1 className="text-3xl font-bold text-white">{name}</h1>
              <p className="text-sm text-white/80">{data?.profile?.address?.city || ''}{data?.profile?.address?.city ? ', ' : ''}{data?.profile?.address?.state || ''}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card-elevated p-6">
              <h2 className="text-2xl font-bold mb-4">About the College</h2>
              <p className="text-muted-foreground whitespace-pre-line">{description}</p>
            </div>

            <div className="card-elevated p-6">
              <h3 className="text-xl font-bold mb-3">Popular Courses</h3>
              {courses.length === 0 ? (
                <p className="text-sm text-muted-foreground">No courses added yet.</p>
              ) : (
                <ul className="space-y-2">
                  {courses.map((c,i) => (
                    <li key={i} className="px-4 py-2 bg-card rounded flex justify-between">
                      <span>{c.parent} - {c.name}</span>
                      <span className="text-sm text-muted-foreground">₹{c.fee}/yr</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="card-elevated p-6">
              <h3 className="text-xl font-bold mb-3">Facilities</h3>
              {features.length === 0 ? (
                <p className="text-sm text-muted-foreground">No features listed.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {features.map((f, i) => (
                    <div key={i} className="px-4 py-3 bg-card rounded text-sm">{f}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="card-elevated p-6">
              <h3 className="text-lg font-bold">Contact</h3>
              <p className="text-muted-foreground mt-2">{data?.profile?.contact?.email || 'N/A'}</p>
              <p className="text-muted-foreground">{data?.profile?.contact?.primaryPhone || 'N/A'}</p>
              <div className="mt-4">
                <Link to="/" className="btn-secondary">Back to Search</Link>
              </div>
            </div>

            <div className="card-elevated p-6">
                      <h3 className="text-lg font-bold">Apply</h3>
                      <p className="text-muted-foreground mt-2">Select courses you're interested in and start your application.</p>
                      {/* Course selection UI */}
                      <div className="mt-4 space-y-3">
                        <label className="block text-sm font-medium">Choose Course</label>
                        <select
                          value={selectedParentCourse}
                          onChange={(e) => {
                            setSelectedParentCourse(e.target.value);
                            setSelectedSubCourse('');
                          }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">-- Select Course --</option>
                          {data?.courses?.map((c) => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                          ))}
                        </select>

                        <label className="block text-sm font-medium">Choose Specialisation / Sub-course</label>
                        <select
                          value={selectedSubCourse}
                          onChange={(e) => setSelectedSubCourse(e.target.value)}
                          className="w-full p-2 border rounded"
                          disabled={!selectedParentCourse}
                        >
                          <option value="">-- Select Sub-course --</option>
                          {(data?.courses || []).find(c => c.name === selectedParentCourse)?.subCourses?.map((sc) => (
                            <option key={sc.name} value={sc.name}>{sc.name} — ₹{sc.fee}</option>
                          ))}
                        </select>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="btn-outline"
                            onClick={() => {
                              if (!selectedParentCourse || !selectedSubCourse) return;
                              // avoid duplicates
                              const exists = interestedCourses.some(ic => ic.parent === selectedParentCourse && ic.name === selectedSubCourse);
                              if (exists) return;
                              setInterestedCourses(prev => [...prev, { parent: selectedParentCourse, name: selectedSubCourse }]);
                            }}
                            disabled={!selectedParentCourse || !selectedSubCourse}
                          >
                            Add to Interested Courses
                          </button>
                          <button
                            type="button"
                            className={`btn-primary ${(!selectedParentCourse && interestedCourses.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => {
                              // If nothing has been added yet but current selection exists, add it first
                              if (interestedCourses.length === 0) {
                                if (selectedParentCourse && selectedSubCourse) {
                                  const exists = interestedCourses.some(ic => ic.parent === selectedParentCourse && ic.name === selectedSubCourse);
                                  if (!exists) {
                                    // add synchronously to a local copy then proceed
                                    const newList = [...interestedCourses, { parent: selectedParentCourse, name: selectedSubCourse }];
                                    setInterestedCourses(newList);
                                    // proceed: update the shortlist on the backend
                                    (async () => {
                                      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                                      try {
                                        const res = await fetch('/api/shortlists', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                                          body: JSON.stringify({ collegeId: id, interestedCourses: newList })
                                        });
                                        if (!res.ok) {
                                          const txt = await res.text();
                                          throw new Error(txt || 'Failed to save interested courses');
                                        }
                                        // navigate to anchor (same behavior as old link)
                                        window.location.hash = 'apply';
                                      } catch (err) {
                                        console.error('Failed to save interested courses', err);
                                        alert(err instanceof Error ? err.message : 'Error');
                                      }
                                    })();
                                  }
                                } else {
                                  alert('Please add at least one interested course before applying.');
                                }
                              } else {
                                // We already have interested courses, proceed to save and navigate
                                (async () => {
                                  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                                  try {
                                    const res = await fetch('/api/shortlists', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                                      body: JSON.stringify({ collegeId: id, interestedCourses })
                                    });
                                    if (!res.ok) {
                                      const txt = await res.text();
                                      throw new Error(txt || 'Failed to save interested courses');
                                    }
                                    window.location.hash = 'apply';
                                  } catch (err) {
                                    console.error('Failed to save interested courses', err);
                                    alert(err instanceof Error ? err.message : 'Error');
                                  }
                                })();
                              }
                            }}
                            disabled={!selectedParentCourse && interestedCourses.length === 0}
                          >
                            Apply Now
                          </button>
                        </div>

                        {interestedCourses.length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-sm font-medium mb-2">Interested Courses</h4>
                            <ul className="space-y-2">
                              {interestedCourses.map((ic, idx) => (
                                <li key={`${ic.parent}-${ic.name}-${idx}`} className="flex items-center justify-between px-3 py-2 bg-card rounded">
                                  <div className="text-sm">{ic.parent} — {ic.name}</div>
                                  <div>
                                    <button className="text-sm text-destructive" onClick={() => setInterestedCourses(prev => prev.filter((_, i) => i !== idx))}>Remove</button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-3 flex gap-2">
                              <button
                                className="btn-primary"
                                onClick={async () => {
                                  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                                  try {
                                    const res = await fetch('/api/shortlists', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                                      body: JSON.stringify({ collegeId: id, interestedCourses })
                                    });
                                    if (!res.ok) {
                                      const txt = await res.text();
                                      throw new Error(txt || 'Failed to save interested courses');
                                    }
                                    alert('Interested courses saved to your shortlist.');
                                  } catch (e) {
                                    console.error('Failed to save interested courses', e);
                                    alert(e instanceof Error ? e.message : 'Error');
                                  }
                                }}
                              >
                                Save Interested Courses
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetails;
