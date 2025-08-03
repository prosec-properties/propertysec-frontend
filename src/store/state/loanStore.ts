import { create } from "zustand";
import { persist, createJSONStorage as createStore } from "zustand/middleware";
import localForage from "localforage";

export type IFormStep = '1' | '2' | '3' | '4' | '5' | '6';

export interface IPersonalInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
  stateOfOrigin: string;
  nationality: string;
  homeAddress: string;
  religion: string;
  nextOfKin: string;
  pictures: File;
  amount: string;
  duration: string;
}

export interface IBankInfo {
  averageSalary: string;
  bankName: string;
  salaryAccountNumber: string;
  nin: string;
  bvn: string;
}

export interface IOfficeInfo {
  officeName: string;
  employerName: string;
  positionInOffice: string;
  officeContact: string;
  officeAddress: string;
}

export interface ILoanDetails {
  amount: string;
  duration: string;
  noOfRooms: string;
  noOfYears: string;
  reasonForLoanRequest: string;
}

export interface ILandlordInfo {
  landlordName: string;
  landlordBankName: string;
  landlordAccountNumber: string;
  landlordAddress: string;
  landlordPhoneNumber: string;      
}

export interface IGuarantorInfo {
  guarantorName: string;
  guarantorEmail: string;
  guarantorHomeAddress: string;
  guarantorOfficeAddress: string;
  guarantorPhoneNumber: string;
}


export interface IFormProgress {
  currentStep: IFormStep;
  visitedSteps: number[];
  completedSteps: number[];
}

export interface ILoanRequestData extends 
  IPersonalInfo,
  IBankInfo,
  IOfficeInfo,
  ILoanDetails,
  ILandlordInfo,
  IGuarantorInfo,
  IFormProgress {
  // Personal Info setters
  setFullName: (fullName: string) => void;
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setStateOfOrigin: (stateOfOrigin: string) => void;
  setNationality: (nationality: string) => void;
  setHomeAddress: (homeAddress: string) => void;
  setReligion: (religion: string) => void;
  setNextOfKin: (nextOfKin: string) => void;
  setPictures: (pictures: File) => void;

  // Bank Info setters
  setAverageSalary: (averageSalary: string) => void;
  setBankName: (bankName: string) => void;
  setSalaryAccountNumber: (salaryAccountNumber: string) => void;
  setNin: (nin: string) => void;
  setBvn: (bvn: string) => void;

  // Office Info setters
  setOfficeName: (officeName: string) => void;
  setEmployerName: (employerName: string) => void;
  setPositionInOffice: (positionInOffice: string) => void;
  setOfficeContact: (officeContact: string) => void;
  setOfficeAddress: (officeAddress: string) => void;

  // Loan Details setters
  setAmount: (amount: string) => void;
  setDuration: (duration: string) => void;
  setNoOfRooms: (noOfRooms: string) => void;
  setNoOfYears: (noOfYears: string) => void;
  setReasonForLoanRequest: (reasonForLoanRequest: string) => void;

  // Landlord Info setters
  setLandlordName: (landlordName: string) => void;
  setLandlordBankName: (landlordBankName: string) => void;
  setLandlordAccountNumber: (landlordAccountNumber: string) => void;
  setLandlordAddress: (landlordAddress: string) => void;
  setLandlordPhoneNumber: (landlordPhoneNumber: string) => void;

  // Guarantor Info setters
  setGuarantorName: (guarantorName: string) => void;
  setGuarantorEmail: (guarantorEmail: string) => void;
  setGuarantorHomeAddress: (guarantorHomeAddress: string) => void;
  setGuarantorOfficeAddress: (guarantorOfficeAddress: string) => void;
  setGuarantorPhoneNumber: (guarantorPhoneNumber: string) => void;

  // Form progress methods
  setCurrentStep: (step: IFormStep) => void;
  addVisitedStep: (step: number) => void;
  addCompletedStep: (step: number) => void;
  removeCompletedStep: (step: number) => void;
  
  // Reset functionality
  resetAllForms: () => void;
}

// Store creation with grouped state
export const useLoanRequestStore = create(
  persist<ILoanRequestData>(
    (set) => ({
      // Personal Info initial state
      fullName: "",
      email: "",
      phoneNumber: "",
      stateOfOrigin: "",
      nationality: "",
      homeAddress: "",
      religion: "",
      nextOfKin: "",
      pictures: new File([], ""),

      // Bank Info initial state
      averageSalary: "",
      bankName: "",
      salaryAccountNumber: "",
      nin: "",
      bvn: "",

      // Office Info initial state
      officeName: "",
      employerName: "",
      positionInOffice: "",
      officeContact: "",
      officeAddress: "",

      // Loan Details initial state
      amount: "",
      duration: "",
      noOfRooms: "",
      noOfYears: "",
      reasonForLoanRequest: "",

      // Landlord Info initial state
      landlordName: "",
      landlordBankName: "",
      landlordAccountNumber: "",
      landlordAddress: "",
      landlordPhoneNumber: "",

      // Guarantor Info initial state
      guarantorName: "",
      guarantorEmail: "",
      guarantorHomeAddress: "",
      guarantorOfficeAddress: "",
      guarantorPhoneNumber: "",

      // Form progress
      currentStep: "1" as IFormStep,
      visitedSteps: [],
      completedSteps: [],

      // Personal Info setters
      setFullName: (fullName: string) => set({ fullName }),
      setEmail: (email: string) => set({ email }),
      setPhoneNumber: (phoneNumber: string) => set({ phoneNumber }),
      setStateOfOrigin: (stateOfOrigin: string) => set({ stateOfOrigin }),
      setNationality: (nationality: string) => set({ nationality }),
      setHomeAddress: (homeAddress: string) => set({ homeAddress }),
      setReligion: (religion: string) => set({ religion }),
      setNextOfKin: (nextOfKin: string) => set({ nextOfKin }),
      setPictures: (pictures: File) => set({ pictures }),

      // Bank Info setters
      setAverageSalary: (averageSalary: string) => set({ averageSalary }),
      setBankName: (bankName: string) => set({ bankName }),
      setSalaryAccountNumber: (salaryAccountNumber: string) => set({ salaryAccountNumber }),
      setNin: (nin: string) => set({ nin }),
      setBvn: (bvn: string) => set({ bvn }),

      // Office Info setters
      setOfficeName: (officeName: string) => set({ officeName }),
      setEmployerName: (employerName: string) => set({ employerName }),
      setPositionInOffice: (positionInOffice: string) => set({ positionInOffice }),
      setOfficeContact: (officeContact: string) => set({ officeContact }),
      setOfficeAddress: (officeAddress: string) => set({ officeAddress }),

      // Loan Details setters
      setAmount: (amount: string) => set({ amount }),
      setDuration: (duration: string) => set({ duration }),
      setNoOfRooms: (noOfRooms: string) => set({ noOfRooms }),
      setNoOfYears: (noOfYears: string) => set({ noOfYears }),
      setReasonForLoanRequest: (reasonForLoanRequest: string) => set({ reasonForLoanRequest }),

      // Landlord Info setters
      setLandlordName: (landlordName: string) => set({ landlordName }),
      setLandlordBankName: (landlordBankName: string) => set({ landlordBankName }),
      setLandlordAccountNumber: (landlordAccountNumber: string) => set({ landlordAccountNumber }),
      setLandlordAddress: (landlordAddress: string) => set({ landlordAddress }),
      setLandlordPhoneNumber: (landlordPhoneNumber: string) => set({ landlordPhoneNumber }),

      // Guarantor Info setters
      setGuarantorName: (guarantorName: string) => set({ guarantorName }),
      setGuarantorEmail: (guarantorEmail: string) => set({ guarantorEmail }),
      setGuarantorHomeAddress: (guarantorHomeAddress: string) => set({ guarantorHomeAddress }),
      setGuarantorOfficeAddress: (guarantorOfficeAddress: string) => set({ guarantorOfficeAddress }),
      setGuarantorPhoneNumber: (guarantorPhoneNumber: string) => set({ guarantorPhoneNumber }),

      // Form progress methods
      setCurrentStep: (step: IFormStep) => set({ currentStep: step }),
      addVisitedStep: (step: number) => set((state) => ({
        visitedSteps: state.visitedSteps.includes(step) 
          ? state.visitedSteps 
          : [...state.visitedSteps, step]
      })),
      addCompletedStep: (step: number) => set((state) => ({
        completedSteps: state.completedSteps.includes(step)
          ? state.completedSteps
          : [...state.completedSteps, step]
      })),
      removeCompletedStep: (step: number) => set((state) => ({
        completedSteps: state.completedSteps.filter(s => s !== step)
      })),

      // Reset functionality
      resetAllForms: () => set({
        fullName: "",
        email: "",
        phoneNumber: "",
        stateOfOrigin: "",
        nationality: "",
        homeAddress: "",
        religion: "",
        nextOfKin: "",
        pictures: new File([], ""),
        averageSalary: "",
        bankName: "",
        salaryAccountNumber: "",
        officeName: "",
        employerName: "",
        positionInOffice: "",
        officeContact: "",
        officeAddress: "",
        amount: "",
        duration: "",
        noOfRooms: "",
        noOfYears: "",
        reasonForLoanRequest: "",
        landlordName: "",
        landlordBankName: "",
        landlordAccountNumber: "",
        landlordAddress: "",
        landlordPhoneNumber: "",
        guarantorName: "",
        guarantorEmail: "",
        guarantorHomeAddress: "",
        guarantorOfficeAddress: "",
        guarantorPhoneNumber: "",
        currentStep: "1" as IFormStep,
        visitedSteps: [],
        completedSteps: [],
      }),
    }),
    {
      name: "loan-request-data",
      storage: createStore(() => localForage as any),
    }
  )
);