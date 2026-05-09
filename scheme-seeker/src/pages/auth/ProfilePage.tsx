import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Calendar, Bell, 
  ChevronRight, LogOut, Clock, CheckCircle2,
  Settings, FileText
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedCard } from '@/components/ui/animated-card';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/auth/me", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const data = await res.json();

        // Demo extra fields for presentation
        const enhancedProfile = {
          ...data,
          phone: data.phone || "6306776991",
          savedProfile: {
            age: 21,
            state: "Uttar Pradesh",
            category: "General"
          },
          matchedSchemes: [
            { id: 1, name: "PM Kisan", category: "Agriculture", type: "Central" },
            { id: 2, name: "Startup India", category: "Business", type: "Central" }
          ],
          lastChecked: new Date().toISOString()
        };

        setProfile(enhancedProfile);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold">My Profile</h1>
          </motion.div>

          {isLoading ? (
            <Skeleton className="h-40 w-full rounded-xl" />
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">

              <div className="lg:col-span-2 space-y-6">

                <AnimatedCard index={0}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                      {profile?.name?.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{profile?.name}</h2>
                      <p className="text-sm text-muted-foreground">{profile?.email}</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">{profile?.phone}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Role</p>
                      <p className="font-medium">{profile?.role}</p>
                    </div>
                  </div>
                </AnimatedCard>

                <AnimatedCard index={1}>
                  <h3 className="text-lg font-semibold mb-4">Saved Eligibility Info</h3>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <p className="text-2xl font-bold">{profile?.savedProfile.age}</p>
                      <p className="text-xs text-muted-foreground">Age</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <p className="font-bold">{profile?.savedProfile.state}</p>
                      <p className="text-xs text-muted-foreground">State</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <p className="font-bold">{profile?.savedProfile.category}</p>
                      <p className="text-xs text-muted-foreground">Category</p>
                    </div>
                  </div>
                </AnimatedCard>

                <AnimatedCard index={2}>
                  <h3 className="text-lg font-semibold mb-4">Matched Schemes</h3>

                  <div className="space-y-3">
                    {profile?.matchedSchemes.map((scheme: any) => (
                      <div key={scheme.id} className="p-4 bg-muted/50 rounded-lg flex justify-between">
                        <div>
                          <p className="font-medium">{scheme.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {scheme.category} • {scheme.type}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                </AnimatedCard>

              </div>

              <div className="space-y-6">

                <AnimatedCard index={3}>
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

                  <div className="space-y-2">
                    <Button className="w-full" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </Button>
                  </div>
                </AnimatedCard>

              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
