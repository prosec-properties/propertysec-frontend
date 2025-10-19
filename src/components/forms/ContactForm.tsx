"use client";

import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import CustomInput from "../inputs/CustomInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactFormSchema } from "@/store/schema/contactFormSchema";
import CustomButton from "../buttons/CustomButton";
import TextArea from "../inputs/TextArea";
import { z } from "zod";
import { $requestWithoutToken } from "@/api/general";
import { useToast } from "@/components/ui/use-toast";

const ContactForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof ContactFormSchema>>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
      phoneNumber: "",
    },
  });

  const { toast } = useToast();

  const onSubmit: SubmitHandler<z.infer<typeof ContactFormSchema>> = async (
    payload
  ) => {
    try {
      const response = await $requestWithoutToken.post<{
        message: string;
        success: boolean;
      }>("/contact", payload);

      if (response?.success) {
        toast({
          title: "Message sent",
          description:
            response.message ||
            "Thanks for reaching out. We'll respond shortly.",
        });
        reset();
        return;
      }

      toast({
        title: "Unable to send message",
        description:
          response?.message ||
          "Please try again or contact us through another channel.",
        variant: "destructive",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to send message",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h1 className="font-medium mb-4 text-3xl">GET IN TOUCH</h1>
      <p className="text-greyBody mb-8">
        Our friendly team would love to hear from you!
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <article className="md:flex gap-6">
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Title"
                hideLabel
                name={field.name}
                type="text"
                placeholder="Enter your first name"
                wrapperClassName="mb-6 md:w-1/2"
                errorMessage={errors.firstName?.message}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Title"
                hideLabel
                name={field.name}
                type="text"
                placeholder="Enter your last name"
                wrapperClassName="mb-6 md:w-1/2"
                errorMessage={errors.lastName?.message}
              />
            )}
          />
        </article>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Title"
              hideLabel
              name={field.name}
              type="email"
              placeholder="Enter your email"
              wrapperClassName="mb-6"
              errorMessage={errors.email?.message}
            />
          )}
        />
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Title"
              hideLabel
              name={field.name}
              type="text"
              placeholder="Enter your phone number"
              wrapperClassName="mb-6"
              errorMessage={errors.phoneNumber?.message}
            />
          )}
        />

        <Controller
          name="message"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              label="Description"
              name={field.name}
              placeholder="Enter your message"
              wrapperClassName="mb-6"
              errorMessage={errors.message?.message}
            />
          )}
        />
        <CustomButton className="w-full" loading={isSubmitting}>
          Send
        </CustomButton>
      </form>
    </div>
  );
};

export default ContactForm;
