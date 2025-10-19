"use client";

import React from "react";
import CustomButton from "../buttons/CustomButton";
import CustomInput from "../inputs/CustomInput";
import { subscribeToNewsletter } from "@/actions/newsletter";
import { useUser } from "@/hooks/useUser";
import { extractServerErrorMessage, showToaster } from "@/lib/general";

const NewsLetterInput = () => {
  const { token } = useUser();
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      showToaster("Please provide a valid email address.", "destructive");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await subscribeToNewsletter({
        email: email.trim().toLowerCase(),
        token,
      });

      if (!response || response.hasError || response.success === false) {
        const message = response?.message || "Unable to complete subscription.";
        showToaster(message, "destructive");
        return;
      }

      showToaster("You are now subscribed to our newsletter.", "success");
      setEmail("");
    } catch (error) {
      showToaster(
        extractServerErrorMessage(error) || "Unable to complete subscription.",
        "destructive"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm items-center"
      noValidate
    >
      <CustomInput
        label="Email"
        hideLabel
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        required
        className="rounded-r-none h-[40px] focus-visible:ring-0 focus-visible:ring-offset-0 outline-none border-grey4 bg-transparent caret-white text-white"
      />
      <CustomButton
        type="submit"
        variant="secondary"
        loading={isSubmitting}
        className="rounded-l-none text-grey11 h-10 sm:h-12 hover:bg-white hover:text-grey11 border-grey4 font-semibold"
      >
        Subscribe
      </CustomButton>
    </form>
  );
};

export default NewsLetterInput;
