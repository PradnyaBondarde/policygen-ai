import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Download, Edit, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [policy, setPolicy] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const formData = location.state?.formData;

  useEffect(() => {
    if (!formData) {
      navigate("/generate");
      return;
    }

    generatePolicy();
  }, [formData, navigate]);

  const generatePolicy = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("generate-policy", {
        body: formData,
      });

      if (error) throw error;

      setPolicy(data.policy);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate policy",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(policy);
    toast({
      title: "Copied!",
      description: "Policy copied to clipboard",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([policy], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename = (formData?.appName || formData?.websiteUrl || formData?.businessName || "policy").replace(/\s+/g, "-").toLowerCase();
    a.download = `privacy-policy-${filename}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Policy downloaded successfully",
    });
  };

  const handleSave = async () => {
    if (!policy) {
      toast({
        title: "Error",
        description: "No policy to save. Please generate a policy first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save policies",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const title = `Privacy Policy - ${formData?.appName || formData?.websiteUrl || formData?.businessName || "Untitled"} - ${new Date().toLocaleDateString()}`;

      const { error } = await supabase.from("policies").insert({
        user_id: user.id,
        title,
        content: policy,
        metadata: formData,
        version: 1,
      });

      if (error) throw error;

      toast({
        title: "Saved!",
        description: "Policy saved to your dashboard",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save policy",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Generating Your Policy</h2>
          <p className="text-muted-foreground">Our AI is crafting your privacy policy...</p>
        </div>
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
            <h1 className="text-3xl font-bold mb-2">Your Privacy Policy</h1>
            <p className="text-muted-foreground">Review and customize your generated policy</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save to Dashboard
            </Button>
          </div>
        </div>

        <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm prose prose-invert max-w-none">
          <ReactMarkdown>{policy}</ReactMarkdown>
        </Card>
      </motion.div>
    </div>
  );
};

export default Result;
