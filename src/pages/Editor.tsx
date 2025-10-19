import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Lightbulb, Loader2, Download, Copy, Edit, X, Eye, Save, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [policy, setPolicy] = useState<any>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState("");
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiInstruction, setAIInstruction] = useState("");
  const [isAIEditing, setIsAIEditing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [originalContent, setOriginalContent] = useState("");

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
      // Strip HTML tags for clean text display
      const cleanContent = data.content
        ?.replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ')  // Replace non-breaking spaces
        .replace(/&amp;/g, '&')      // Replace HTML entities
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim();
      setContent(cleanContent || data.content);
      setOriginalContent(cleanContent || data.content);
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

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Policy copied to clipboard",
    });
  };

  const handleCancelEdit = () => {
    setContent(originalContent);
    setIsEditing(false);
    toast({
      title: "Cancelled",
      description: "Changes discarded",
    });
  };

  const handleDownloadHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${policy?.title || 'Privacy Policy'}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1, h2, h3 { color: #333; }
    p { margin-bottom: 1em; }
  </style>
</head>
<body>
  <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${content}</pre>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${policy?.title || 'policy'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "HTML policy downloaded successfully",
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Export",
      description: "Please use the HTML download and convert to PDF using your browser's print function",
    });
  };

  const handleDownloadWord = () => {
    const wordDoc = `
      <!DOCTYPE html>
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head>
        <meta charset='utf-8'>
        <title>${policy?.title || 'Privacy Policy'}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          pre { white-space: pre-wrap; font-family: Arial, sans-serif; }
        </style>
      </head>
      <body><pre>${content}</pre></body>
      </html>
    `;
    const blob = new Blob([wordDoc], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${policy?.title || 'policy'}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Word document downloaded successfully",
    });
  };

  const handleAIEdit = async () => {
    if (!aiInstruction.trim()) {
      toast({
        title: "Error",
        description: "Please enter instructions for the AI",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAIEditing(true);
      const { data, error } = await supabase.functions.invoke("ai-edit", {
        body: { 
          content,
          instruction: aiInstruction
        },
      });

      if (error) throw error;

      setContent(data.editedContent);
      setShowAIDialog(false);
      setAIInstruction("");
      
      toast({
        title: "Success!",
        description: "The content has been updated with AI suggestions",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to apply AI edits",
        variant: "destructive",
      });
    } finally {
      setIsAIEditing(false);
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

  if (!policy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Policy not found</p>
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
          
          <div className="flex flex-wrap gap-2">
            {!isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
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
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
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
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Policy" : "Policy Content"}</h2>
            {isEditing ? (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[600px] font-mono text-sm"
                placeholder="Edit your policy content..."
              />
            ) : (
              <div className="min-h-[600px] p-4 bg-white rounded-md overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-900">{content}</pre>
              </div>
            )}
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

        {/* AI Edit Dialog */}
        <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit with AI</DialogTitle>
              <DialogDescription>
                Describe what changes you'd like to make to your privacy policy
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="aiInstruction">Your Instructions</Label>
                <Textarea
                  id="aiInstruction"
                  placeholder="E.g., 'Make the tone more formal' or 'Add a section about data retention'"
                  value={aiInstruction}
                  onChange={(e) => setAIInstruction(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAIDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAIEdit} disabled={isAIEditing}>
                  {isAIEditing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Apply AI Edit
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default Editor;
