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
              <p className="text-muted-foreground mt-2">Start your application for this college.</p>
              <div className="mt-4">
                <Link to="/" className="btn-primary">Apply Now</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetails;
