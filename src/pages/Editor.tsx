import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Lightbulb, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [policy, setPolicy] = useState<any>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState("");

  useEffect(() => {
    fetchPolicy();
  }, [id]);

  const fetchPolicy = async () => {
    try {
      const { data, error } = await supabase
        .from("policies")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setPolicy(data);
      setContent(data.content);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch policy",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save changes",
          variant: "destructive",
        });
        return;
      }

      // Create new version
      const { error } = await supabase.from("policies").insert({
        user_id: user.id,
        title: policy.title,
        content: content,
        metadata: policy.metadata,
        version: policy.version + 1,
      });

      if (error) throw error;

      toast({
        title: "Saved!",
        description: `New version ${policy.version + 1} created`,
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAISuggest = async () => {
    try {
      setIsSuggesting(true);
      const { data, error } = await supabase.functions.invoke("ai-suggest", {
        body: { content },
      });

      if (error) throw error;

      setSuggestions(data.suggestions);
      
      toast({
        title: "Suggestions generated!",
        description: "Review the AI suggestions below",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate suggestions",
        variant: "destructive",
      });
    } finally {
      setIsSuggesting(false);
    }
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start">
          <div>
            <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">{policy?.title}</h1>
            <p className="text-muted-foreground">Version {policy?.version}</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleAISuggest}
              disabled={isSuggesting}
            >
              {isSuggesting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lightbulb className="mr-2 h-4 w-4" />
              )}
              AI Suggest
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save as New Version
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">Edit Policy</h2>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[600px] font-mono text-sm"
              placeholder="Edit your policy content..."
            />
          </Card>

          {suggestions && (
            <Card className="p-6 bg-card/50 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4">AI Suggestions</h2>
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-sm">{suggestions}</p>
              </div>
            </Card>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Editor;
