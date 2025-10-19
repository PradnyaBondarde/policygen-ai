import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Download, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

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
      console.log("Generating policy with formData:", formData);

      const { data, error } = await supabase.functions.invoke("generate-policy", {
        body: formData,
      });

      console.log("Response from generate-policy:", { data, error });

      if (error) {
        console.error("Error from generate-policy:", error);
        throw error;
      }

      if (!data || !data.policy) {
        console.error("No policy data received:", data);
        throw new Error("No policy content received from server");
      }

      console.log("Policy received, length:", data.policy?.length);
      const plain = data.policy
        .replace(/<!DOCTYPE[^>]*>/gi, '')
        .replace(/<head[\s\S]*?<\/head>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      setPolicy(plain);
    } catch (error: any) {
      console.error("Error generating policy:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate policy",
        variant: "destructive",
      });
      // Navigate back to generate page on error
      setTimeout(() => navigate("/generate"), 2000);
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

  const handleDownloadHTML = () => {
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    let updatedPolicy = policy;
    
    // Replace date placeholders with current date
    updatedPolicy = updatedPolicy.replace(/\[Insert Date This Policy Becomes Effective[^\]]*\]/g, currentDate);
    updatedPolicy = updatedPolicy.replace(/Effective Date:\s*\[.*?\]/g, `Effective Date: ${currentDate}`);
    
    const safePolicy = updatedPolicy
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
      
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Privacy Policy</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1, h2, h3 { color: #333; }
    p { margin-bottom: 1em; }
    pre { white-space: pre-wrap; font-family: Arial, sans-serif; }
  </style>
</head>
<body>
  <pre>${safePolicy}</pre>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename = (formData?.appName || formData?.websiteUrl || formData?.businessName || "policy").replace(/\s+/g, "-").toLowerCase();
    a.download = `privacy-policy-${filename}.html`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "HTML policy downloaded successfully",
    });
  };

  const handleDownloadWord = () => {
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    let updatedPolicy = policy;
    
    // Replace date placeholders with current date
    updatedPolicy = updatedPolicy.replace(/\[Insert Date This Policy Becomes Effective[^\]]*\]/g, currentDate);
    updatedPolicy = updatedPolicy.replace(/Effective Date:\s*\[.*?\]/g, `Effective Date: ${currentDate}`);

    const escape = (s: string) =>
      s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const lines = updatedPolicy.split(/\r?\n/);
    const htmlBody = lines
      .map((line) => {
        const t = line.trim();
        const isNumbered = /^[0-9]+(\.[0-9]+)*\s+/.test(t);
        const letters = t.replace(/[^A-Za-z]+/g, '');
        const isUpper = letters.length > 0 && letters === letters.toUpperCase();
        if (t === '') return '<br />';
        if (isNumbered || isUpper) return `<h2 style="color:#2563eb;font-weight:700;margin:16px 0 8px;">${escape(t)}</h2>`;
        return `<p style="margin:8px 0;">${escape(line)}</p>`;
      })
      .join('\n');

    const wordDoc = `
      <!DOCTYPE html>
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head>
        <meta charset='utf-8'>
        <title>Privacy Policy</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          h2 { color: #2563eb; font-weight: 700; }
          p { margin: 8px 0; }
        </style>
      </head>
      <body>${htmlBody}</body>
      </html>
    `;
    const blob = new Blob([wordDoc], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename = (formData?.appName || formData?.websiteUrl || formData?.businessName || "policy").replace(/\s+/g, "-").toLowerCase();
    a.download = `privacy-policy-${filename}.doc`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Word document downloaded successfully",
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Export",
      description: "Use the HTML download and your browser's Print to PDF to export.",
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

      // Get the latest version for this user's policies with similar title
      const { data: existingPolicies } = await supabase
        .from("policies")
        .select("version")
        .eq("user_id", user.id)
        .ilike("title", `%${formData?.appName || formData?.websiteUrl || formData?.businessName || "Untitled"}%`)
        .order("version", { ascending: false })
        .limit(1);

      const nextVersion = existingPolicies && existingPolicies.length > 0 ? existingPolicies[0].version + 1 : 1;

      const { error } = await supabase.from("policies").insert({
        user_id: user.id,
        title,
        content: policy,
        metadata: formData,
        version: nextVersion,
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
            <Button variant="outline" onClick={handleDownloadHTML}>
              <Download className="mr-2 h-4 w-4" />
              HTML
            </Button>
            <Button variant="outline" onClick={handleDownloadWord}>
              <Download className="mr-2 h-4 w-4" />
              Word
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save to Dashboard
            </Button>
          </div>
        </div>

        <div className="bg-white text-black p-8 rounded-2xl shadow-md">
          {!policy || policy.trim() === '' ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No policy content available. Please try generating again.</p>
              <Button onClick={() => navigate('/generate')}>
                Back to Generator
              </Button>
            </div>
          ) : (
            <div className="prose max-w-none">
              <div className="text-black leading-relaxed">
                {policy.split(/\r?\n/).map((line, i) => {
                  const t = line.trim();
                  const isNumbered = /^[0-9]+(\.[0-9]+)*\s+/.test(t);
                  const letters = t.replace(/[^A-Za-z]+/g, '');
                  const isUpper = letters.length > 0 && letters === letters.toUpperCase();
                  if (t === '') return <div key={i} className="h-4" />;
                  if (isNumbered || isUpper) return <div key={i} className="font-bold text-blue-600 mt-6 mb-2">{t}</div>;
                  return <p key={i} className="mb-2">{line}</p>;
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Result;
