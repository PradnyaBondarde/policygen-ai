import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Sparkles, Lock, FileText } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient glow background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent" style={{ background: 'var(--gradient-glow)' }} />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm backdrop-blur-sm border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-primary">AI-Powered Privacy Policies</span>
            </div>
            
            <h1 className="mb-6 text-5xl md:text-7xl font-bold bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              PolicyPro AI
            </h1>
            
            <p className="mb-8 text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Generate GDPR, CCPA & COPPA-compliant Privacy Policies instantly with AI
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/generate")}
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
              >
                Start Generating
                <FileText className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="text-lg px-8 py-6 backdrop-blur-sm"
              >
                Sign In
              </Button>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-32 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
              <div className="mb-4 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Legally Compliant</h3>
              <p className="text-muted-foreground">
                Automatically generate policies that comply with GDPR, CCPA, and COPPA regulations
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
              <div className="mb-4 h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">AI-Powered</h3>
              <p className="text-muted-foreground">
                Leverage advanced AI to create comprehensive policies tailored to your business
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
              <div className="mb-4 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Version Control</h3>
              <p className="text-muted-foreground">
                Track changes and maintain multiple versions of your privacy policies
              </p>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>&copy; 2025 PolicyPro AI. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-foreground transition-colors">About</a>
                <a href="https://github.com" className="hover:text-foreground transition-colors">GitHub</a>
                <a href="#" className="hover:text-foreground transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
