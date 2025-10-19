import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, FileText, Calendar, Trash2, Eye, LogOut, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [policies, setPolicies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
    fetchPolicies();
  };

  const fetchPolicies = async () => {
    try {
      const { data, error } = await supabase
        .from("policies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPolicies(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch policies",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("policies").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Policy deleted successfully",
      });

      fetchPolicies();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete policy",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Policies</h1>
            <p className="text-muted-foreground">Manage your privacy policies</p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={() => navigate("/generate")}>
              <Plus className="mr-2 h-4 w-4" />
              New Policy
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {policies.length === 0 ? (
          <Card className="p-12 text-center bg-card/50 backdrop-blur-sm">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No policies yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first privacy policy to get started
            </p>
            <Button onClick={() => navigate("/generate")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Policy
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {policies.map((policy, index) => (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                    <span className="text-xs text-muted-foreground">
                      v{policy.version}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold mb-2 line-clamp-2">{policy.title}</h3>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(policy.created_at).toLocaleDateString()}
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                    {policy.content?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/editor/${policy.id}`)}
                      className="flex-1"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View/Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(policy.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
