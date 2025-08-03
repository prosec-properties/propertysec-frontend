"use client";

import React from "react";
import LoanInfoForm from "../forms/loan/LoanInfo";
import LoanSteps from "./LoanSteps";
import { ChevronLeft } from "lucide-react";
import { useQueryString } from "@/hooks/useQueryString";
import LoanBankInfo from "../forms/loan/LoanBankInfo";
import OfficeInfoForm from "../forms/loan/OfficeInfo";
import OtherInfoForm from "../forms/loan/OtherInfo";
import LandlordInfoForm from "../forms/loan/LandlordInfo";
import GuarantorInfoForm from "../forms/loan/GuarantorInfo";
import { ICountry } from "@/interface/location";
import { useLoanRequestStore, IFormStep } from "@/store/state/loanStore";

enum LoanStepsEnum {
  LoanInfo = "1",
  BankInfo = "2",
  OfficeInfo = "3",
  OtherInfo = "4",
  LandlordInfo = "5",
  GuarantorInfo = "6",
}

interface Props {
  token: string;
  countries: ICountry[];
}

const LoanFormWrapper = (props: Props) => {
  const { getQueryParam, setQueryParam } = useQueryString();
  const {
    currentStep,
    completedSteps,
    visitedSteps,
    setCurrentStep,
    addVisitedStep,
    addCompletedStep,
  } = useLoanRequestStore();

  React.useEffect(() => {
    // Redirect to saved step if no step in URL
    if (!getQueryParam("step") && currentStep) {
      setQueryParam("step", currentStep);
    }
  }, []);

  React.useEffect(() => {
    const step = getQueryParam("step");

    if (step) {
      setCurrentStep(step as IFormStep);
      addVisitedStep(parseInt(step));
    }
  }, [getQueryParam("step")]);

  const formStep = () => {
    const step = getQueryParam("step");
    const stepNumber = parseInt(step || "1");
    const previousStepsCompleted = Array.from(
      { length: stepNumber - 1 },
      (_, i) => i + 1
    ).every((prevStep) => completedSteps.includes(prevStep));

    const renderForm = (Component: React.ComponentType<any>) => {
      return <Component {...props} disabled={!previousStepsCompleted} />;
    };

    switch (step) {
      case LoanStepsEnum.LoanInfo:
        return <LoanInfoForm countries={props.countries} />;
      case LoanStepsEnum.BankInfo:
        return renderForm(LoanBankInfo);
      case LoanStepsEnum.OfficeInfo:
        return renderForm(OfficeInfoForm);
      case LoanStepsEnum.OtherInfo:
        return renderForm(OtherInfoForm);
      case LoanStepsEnum.LandlordInfo:
        return renderForm(LandlordInfoForm);
      case LoanStepsEnum.GuarantorInfo:
        return renderForm(GuarantorInfoForm);
      default:
        return <LoanInfoForm countries={props.countries} />;
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 bg-white p-6 rounded-[0.3125rem]">
        <ChevronLeft className="block" />
        <h2 className="text-2xl font-medium">Take Loan</h2>
      </div>
      <div className="mb-6 ">
        <LoanSteps
          completedSteps={completedSteps}
          visitedSteps={visitedSteps}
          currentStep={getQueryParam("step") || "1"}
        />
      </div>
      {formStep()}
    </div>
  );
};

export default LoanFormWrapper;
