import { PaystackMainConfig } from "@/interface/payment";

declare global {
  interface Window {
    PaystackPop: {
      new (): PaystackPopInstance;
    };
    initCarousels: () => void;
  }
}

interface PaystackPopInstance {
  newTransaction(config: PaystackMainConfig): void;
  // Add other methods and properties as needed
}

export {};
