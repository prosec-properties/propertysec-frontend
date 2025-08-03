import { CircleCheck } from "lucide-react";
import React from "react";
import { useQueryString } from "@/hooks/useQueryString";
import { cn } from "@/lib/utils";

interface Props {
  completedSteps?: number[];
  visitedSteps?: number[];
  currentStep: string;
}

const LoanSteps = (props: Props) => {
  const { setQueryParam } = useQueryString();
  
  const steps = [
    { title: "Loan Info", step: 1 },
    { title: "Bank Info", step: 2 },
    { title: "Office Info", step: 3 },
    { title: "Other Info", step: 4 },
    { title: "Landlord Info", step: 5 },
    { title: "Guarantor Info", step: 6 },
  ];

  const handleStepClick = (stepNumber: number) => {
    // Allow navigation to any step, but completion status remains unchanged
    setQueryParam("step", stepNumber.toString());
  };

  return (
    <div className="bg-white relative w-full px-4 md:px-6 py-4">
      <h2 className="sr-only">Steps</h2>

      <div className="after:mt-4 after:block after:h-[0.0625rem] after:w-full after:rounded-lg after:bg-gray-200">
        <ol className="flex justify-between text-xs sm:text-sm font-medium text-gray-500">
          {steps.map((step, i) => {
            const isCompleted = props.completedSteps?.includes(step.step);
            const isVisited = props.visitedSteps?.includes(step.step);
            const isCurrentStep = props.currentStep === step.step.toString();
            const previousStepsCompleted = Array.from({ length: step.step - 1 }, (_, i) => i + 1)
              .every(prevStep => props.completedSteps?.includes(prevStep));
            
            return (
              <li 
                key={i + step.title} 
                className={cn(
                  "relative flex flex-col items-center w-1/6",
                  "cursor-pointer hover:opacity-80"
                )}
                onClick={() => handleStepClick(step.step)}
              >
                <div className={cn(
                  "size-5 sm:size-6 rounded-full border flex items-center justify-center text-white text-[10px] sm:text-xs font-bold mb-2",
                  isCurrentStep ? "border-blue-600 bg-blue-50" : "border-gray-300",
                  isCompleted ? "bg-blue-600 border-blue-600" : "",
                  !previousStepsCompleted && !isVisited ? "opacity-50" : ""
                )}>
                  {isCompleted ? (
                    <CircleCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    <span className={cn(
                      "text-xs sm:text-sm",
                      isCurrentStep ? "text-blue-600" : "text-greyBody"
                    )}>{step.step}</span>
                  )}
                </div>
                <span className={cn(
                  "text-center text-xs sm:text-sm hidden sm:block",
                  isCurrentStep ? "text-blue-600 font-medium" : "text-greyBody",
                  !previousStepsCompleted && !isVisited ? "opacity-50" : ""
                )}>{step.title}</span>
                <span className={cn(
                  "text-center text-[10px] block sm:hidden",
                  isCurrentStep ? "text-blue-600 font-medium" : "text-greyBody",
                  !previousStepsCompleted && !isVisited ? "opacity-50" : ""
                )}>{step.title.split(" ")?.[0]}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export default LoanSteps;
