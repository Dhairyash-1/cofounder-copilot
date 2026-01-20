"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Mail, Calendar, ArrowRight, Check, 
  Loader2, Shield, Zap, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    title: "Connect your inbox",
    description: "We'll scan your Gmail to surface what needs attention",
    icon: Mail,
    color: "accent-blue",
    features: [
      "Find unanswered important emails",
      "Generate smart reply drafts",
      "Track follow-up commitments"
    ]
  },
  {
    id: 2,
    title: "Sync your calendar",
    description: "We'll detect meetings and help you prepare",
    icon: Calendar,
    color: "accent-green",
    features: [
      "Show today's meeting schedule",
      "Alert on scheduling conflicts",
      "Suggest meeting prep tasks"
    ]
  },
  {
    id: 3,
    title: "Ready to focus",
    description: "Your AI copilot is set up and ready",
    icon: Zap,
    color: "accent-orange",
    features: [
      "Daily prioritized task list",
      "One-click email replies",
      "Smart reminders"
    ]
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;
  const isLastStep = currentStep === steps.length - 1;

  // Initial enter animation
  useState(() => {
    setTimeout(() => setIsEntering(false), 100);
  });

  const handleNext = async () => {
    if (isLastStep) {
      router.push("/dashboard");
      return;
    }

    // Start scanning
    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning animation
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);

    // Wait for "scanning" to complete
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setIsScanning(false);
    setCompletedSteps(prev => [...prev, currentStep]);
    
    // Exit animation
    setIsExiting(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Change step
    setCurrentStep(prev => prev + 1);
    
    // Enter animation
    setIsEntering(true);
    await new Promise(resolve => setTimeout(resolve, 50));
    setIsEntering(false);
    setIsExiting(false);
  };

  const handleSkip = async () => {
    setCompletedSteps(prev => [...prev, currentStep]);
    setIsExiting(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    setCurrentStep(prev => prev + 1);
    setIsEntering(true);
    await new Promise(resolve => setTimeout(resolve, 50));
    setIsEntering(false);
    setIsExiting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-main overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-green/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-2xl mx-auto px-6 pt-8">
        {/* Logo and privacy - properly spaced */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-blue/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent-blue" />
            </div>
            <span className="text-sm font-medium text-text-primary">Cofounder Copilot</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Shield className="w-3.5 h-3.5" />
            <span>Your data stays private</span>
          </div>
        </div>

        {/* Step indicators - centered with fixed width */}
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center w-full max-w-xs">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 flex-shrink-0",
                    completedSteps.includes(index)
                      ? "bg-accent-green text-white"
                      : index === currentStep
                      ? "bg-accent-blue text-white ring-4 ring-accent-blue/20"
                      : "bg-bg-panel border border-border-subtle text-text-muted"
                  )}
                >
                  {completedSteps.includes(index) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 bg-bg-panel rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full bg-accent-blue transition-all duration-500 ease-out",
                        completedSteps.includes(index) ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 py-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Step content with smooth animation */}
          <div
            className={cn(
              "transition-all duration-300 ease-out",
              isExiting && "opacity-0 -translate-y-4",
              isEntering && "opacity-0 translate-y-4",
              !isExiting && !isEntering && "opacity-100 translate-y-0"
            )}
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div
                className={cn(
                  "relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
                  currentStepData.color === "accent-blue" && "bg-accent-blue/10 border border-accent-blue/20",
                  currentStepData.color === "accent-green" && "bg-accent-green/10 border border-accent-green/20",
                  currentStepData.color === "accent-orange" && "bg-accent-orange/10 border border-accent-orange/20"
                )}
              >
                <IconComponent
                  className={cn(
                    "w-8 h-8",
                    currentStepData.color === "accent-blue" && "text-accent-blue",
                    currentStepData.color === "accent-green" && "text-accent-green",
                    currentStepData.color === "accent-orange" && "text-accent-orange"
                  )}
                />
                {/* Scanning ring animation */}
                {isScanning && (
                  <>
                    <div className="absolute inset-0 rounded-2xl border-2 border-accent-blue/50 animate-ping" />
                    <div className="absolute inset-0 rounded-2xl border border-accent-blue/30 animate-pulse" />
                  </>
                )}
              </div>
            </div>

            {/* Title and description */}
            <div className="text-center mb-6">
              <h1 className="text-xl font-semibold text-text-primary mb-2">
                {currentStepData.title}
              </h1>
              <p className="text-text-secondary text-sm">
                {currentStepData.description}
              </p>
            </div>

            {/* Scanning progress or features */}
            <div className="min-h-[180px]">
              {isScanning ? (
                <div className="bg-bg-panel border border-border-subtle rounded-xl p-5 animate-fade-in">
                  <div className="flex items-center gap-3 mb-3">
                    <Loader2 className="w-4 h-4 text-accent-blue animate-spin" />
                    <span className="text-sm text-text-primary">
                      {currentStep === 0 ? "Scanning inbox..." : "Syncing calendar..."}
                    </span>
                  </div>
                  <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-blue to-accent-green rounded-full transition-all duration-200 ease-out"
                      style={{ width: `${Math.min(scanProgress, 100)}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-text-muted">
                    <span>Analyzing patterns...</span>
                    <span>{Math.min(Math.round(scanProgress), 100)}%</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {currentStepData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-bg-panel/50 border border-border-subtle transition-all duration-300 ease-out"
                      style={{ 
                        opacity: isEntering ? 0 : 1,
                        transform: isEntering ? 'translateY(8px)' : 'translateY(0)',
                        transitionDelay: `${index * 80}ms`
                      }}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                        currentStepData.color === "accent-blue" && "bg-accent-blue/10",
                        currentStepData.color === "accent-green" && "bg-accent-green/10",
                        currentStepData.color === "accent-orange" && "bg-accent-orange/10"
                      )}>
                        <CheckCircle2 className={cn(
                          "w-3.5 h-3.5",
                          currentStepData.color === "accent-blue" && "text-accent-blue",
                          currentStepData.color === "accent-green" && "text-accent-green",
                          currentStepData.color === "accent-orange" && "text-accent-orange"
                        )} />
                      </div>
                      <span className="text-sm text-text-primary">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="mt-6">
              <button
                onClick={handleNext}
                disabled={isScanning}
                className={cn(
                  "w-full h-11 flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 group",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                  isLastStep 
                    ? "bg-gradient-to-r from-accent-blue to-accent-green text-white hover:shadow-lg hover:shadow-accent-blue/20"
                    : "bg-accent-blue text-white hover:bg-accent-blue/90"
                )}
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{isLastStep ? "Launch Dashboard" : "Continue"}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              {/* Skip option for non-final steps */}
              {!isLastStep && !isScanning && (
                <button
                  onClick={handleSkip}
                  className="w-full mt-3 py-2 text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  Skip for now
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 pb-6">
        <p className="text-center text-xs text-text-muted">
          We only analyze to prioritize — nothing is stored or shared
        </p>
      </footer>
    </div>
  );
}
