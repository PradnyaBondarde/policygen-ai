import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PlatformSelection } from "@/components/FormSteps/PlatformSelection";
import { OwnerEntityDetails } from "@/components/FormSteps/OwnerEntityDetails";
import { WebsiteAppDetails } from "@/components/FormSteps/WebsiteAppDetails";
import { UserData } from "@/components/FormSteps/UserData";
import { DevicePermissions } from "@/components/FormSteps/DevicePermissions";
import { TrackingMarketing } from "@/components/FormSteps/TrackingMarketing";
import { LegalCompliance } from "@/components/FormSteps/LegalCompliance";
import { ThirdPartiesSharing } from "@/components/FormSteps/ThirdPartiesSharing";
import { RetentionSecurity } from "@/components/FormSteps/RetentionSecurity";
import { CookiesConsent } from "@/components/FormSteps/CookiesConsent";
import { ContactFinalization } from "@/components/FormSteps/ContactFinalization";

const TOTAL_STEPS = 11;

const Generate = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isStepValid, setIsStepValid] = useState(false);
  const [formData, setFormData] = useState<any>({
    platformType: "",
    ownerType: "",
    languages: [],
    operationScope: [],
    targetAgeGroups: [],
    userDataCollected: [],
    devicePermissions: [],
    collectionMethods: [],
    analytics: { enabled: false, tools: [] },
    emailMarketing: { enabled: false, tools: [] },
    advertising: { enabled: false, tools: [] },
    payments: { enabled: false, tools: [] },
    remarketing: { enabled: false, tools: [] },
    legalCompliance: [],
    appStoreUrls: [],
    thirdPartiesSharing: { categories: [], details: "" },
    retentionSecurity: {},
    cookiesConsent: { usesCookies: false, cookieTypes: [], consentMethod: "" },
    contactFinalization: {},
    confirmAccuracy: false,
  });
  const navigate = useNavigate();

  const updateFormData = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (!isStepValid && currentStep < TOTAL_STEPS) {
      return; // Don't proceed if current step is invalid
    }
    
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      setIsStepValid(false); // Reset validation for next step
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
    const isFinalStep = currentStep === TOTAL_STEPS;
    
    switch (currentStep) {
      case 1:
        return <PlatformSelection formData={formData} updateFormData={updateFormData} onValidation={setIsStepValid} />;
      case 2:
        return <OwnerEntityDetails formData={formData} updateFormData={updateFormData} onValidation={setIsStepValid} />;
      case 3:
        return <WebsiteAppDetails formData={formData} updateFormData={updateFormData} onValidation={setIsStepValid} />;
      case 4:
        return <UserData formData={formData} updateFormData={updateFormData} onValidation={setIsStepValid} />;
      case 5:
        return <DevicePermissions formData={formData} updateFormData={updateFormData} onValidation={setIsStepValid} />;
      case 6:
        return <TrackingMarketing formData={formData} updateFormData={updateFormData} onValidation={setIsStepValid} />;
      case 7:
        return <ThirdPartiesSharing formData={formData} updateFormData={updateFormData} onValidation={setIsStepValid} />;
      case 8:
        return <LegalCompliance formData={formData} updateFormData={updateFormData} onValidation={setIsStepValid} />;
      case 9:
        return <RetentionSecurity formData={formData} updateFormData={updateFormData} onValidation={setIsStepValid} />;
      case 10:
        return <CookiesConsent formData={formData} updateFormData={updateFormData} onValidation={setIsStepValid} />;
      case 11:
        return <ContactFinalization formData={formData} updateFormData={updateFormData} onValidation={setIsStepValid} />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    const titles = [
      "Platform Selection",
      "Owner / Entity Details",
      "Website / App Details",
      "Data Collected",
      "How Data Is Collected",
      "Purpose of Processing",
      "Third Parties & Data Sharing",
      "Legal Frameworks & Compliance",
      "Retention, Security & Breach Response",
      "Cookies, Consent & User Controls",
      "Contact & Finalization",
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
      <Button onClick={handleNext} disabled={!isStepValid && currentStep !== TOTAL_STEPS}>
            {currentStep === TOTAL_STEPS ? "Generate Policy" : "Next"}
            {currentStep !== TOTAL_STEPS && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Generate;
