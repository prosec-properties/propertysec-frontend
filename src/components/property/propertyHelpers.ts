import { toast } from "../ui/use-toast";

export const handleCallSeller = (phoneNumber?: string) => {
  if (phoneNumber) {
    window.location.href = `tel:${phoneNumber}`;
  } else {
    toast({
      title: "Unable to call",
      description: "Seller phone number is not available",
      variant: "destructive",
      duration: 3000,
    });
  }
};

export const handleWhatsAppSeller = (phoneNumber?: string) => {
  if (phoneNumber) {
    // Format phone number by removing any non-digit characters
    const formattedPhone = phoneNumber.replace(/\D/g, "");
    // Open WhatsApp with the seller's phone number
    window.open(`https://wa.me/${formattedPhone}`, "_blank");
  } else {
    toast({
      title: "Unable to WhatsApp",
      description: "Seller phone number is not available",
      variant: "destructive",
      duration: 3000,
    });
  }
};
