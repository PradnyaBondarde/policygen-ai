import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BasicInfo } from "@/components/FormSteps/BasicInfo";
import { UserData } from "@/components/FormSteps/UserData";
import { DevicePermissions } from "@/components/FormSteps/DevicePermissions";
import { TrackingMarketing } from "@/components/FormSteps/TrackingMarketing";
import { LegalCompliance } from "@/components/FormSteps/LegalCompliance";
import { ContactInfo } from "@/components/FormSteps/ContactInfo";

const TOTAL_STEPS = 6;

const Generate = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    userDataCollected: [],
    devicePermissions: [],
    analytics: { enabled: false, tools: [] },
    emailMarketing: { enabled: false, tools: [] },
    advertising: { enabled: false, tools: [] },
    payments: { enabled: false, tools: [] },
    remarketing: { enabled: false, tools: [] },
    legalCompliance: [],
  });
  const navigate = useNavigate();

  const updateFormData = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to result page with form data
      navigate("/result", { state: { formData } });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfo formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <UserData formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <DevicePermissions formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <TrackingMarketing formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <LegalCompliance formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <ContactInfo formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    const titles = [
      "Basic Information",
      "User Data Collected",
      "Device Permissions",
      "Tracking & Marketing",
      "Legal Compliance",
      "Contact Information",
    ];
    return titles[currentStep - 1];
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm text-muted-foreground">
            <span>Step {currentStep} of {TOTAL_STEPS}</span>
            <span>{Math.round((currentStep / TOTAL_STEPS) * 100)}%</span>
          </div>
          <Progress value={(currentStep / TOTAL_STEPS) * 100} />
        </div>

        {/* Form Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6">{getStepTitle()}</h2>
              {renderStep()}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>
          <Button onClick={handleNext}>
            {currentStep === TOTAL_STEPS ? "Generate Policy" : "Next"}
            {currentStep !== TOTAL_STEPS && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Generate;
