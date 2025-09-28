"use client";

import { PropertyFormSchema } from "@/store/schema/uploadPropertySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import CustomInput from "../inputs/CustomInput";
import SelectInput from "../inputs/SelectInput";
import TitleWithHR from "../misc/TitleWithHR";
import TextArea from "../inputs/TextArea";
import CustomButton from "../buttons/CustomButton";
import { currencies } from "@/store/data/payment";
import { propertyTypes } from "@/store/data/property";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useUser } from "@/hooks/useUser";
import {
  extractNumFromString,
  extractServerErrorMessage,
  showToaster,
} from "@/lib/general";
import NewImagePreview, { IExistingImage } from "../files/NewImagePreview";
import { NumericFormat } from "react-number-format";
import { ICategory } from "@/interface/category";
import { SelectedImagePreview } from "@/interface/image";
import { ICity, ICountry } from "@/interface/location";
import { useMutation } from "@tanstack/react-query";
import { createProperty, updateProperty } from "@/services/properties.service";
import { useRouter } from "next/navigation";
import { IProperty } from "@/interface/property";

interface Props {
  country: ICountry;
  categories: ICategory[];
  property?: IProperty;
  mode?: "create" | "edit";
  adminMode?: boolean;
  targetUserId?: string;
}

const PropertyForm = (props: Props) => {
  const [files, setFiles] = useState<File[] | undefined>([]);
  const [newFiles, setNewFiles] = useState<File[] | undefined>([]); // Only new files for upload
  const [selectedStateId, setSelectedStateId] = useState<string>("");
  const { data: sessionData } = useSession();
  const { user } = useUser();
  const [selectedPhoto, setSelectedPhoto] =
    useState<SelectedImagePreview | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("NGN");
  const [cities, setCities] = useState<ICity[]>([]);
  const router = useRouter();
  const [existingImages, setExistingImages] = useState<IExistingImage[] | null>(
    null
  );
  const [removedExistingImages, setRemovedExistingImages] = useState<string[]>([]);

  const isVideoUploadAllowed = React.useMemo(() => {
    return user?.subscriptionStatus === "active";
  }, [user]);

  const handleSuccess = (data: IProperty) => {
    showToaster(
      `Property ${props.mode === "edit" ? "updated" : "created"} successfully`,
      "success"
    );

    const propertyId = props.mode === "edit" ? props.property?.id : data?.id;

    if (propertyId) {
      if (props.adminMode && props.targetUserId) {
        router.push(`/admin/users/${props.targetUserId}/properties`);
      } else {
        router.push(`/properties/${propertyId}`);
      }
    }
  };

  const createMutation = useMutation({
    mutationFn: createProperty,
    onSuccess: (data) => handleSuccess(data?.data as IProperty),
    onError: (error: any) => {
      console.error("Create property error:", error);
      let errorMessage = "Failed to create property";

      if (
        error?.message?.includes("timed out") ||
        error?.message?.includes("aborted")
      ) {
        errorMessage =
          "Upload timed out. Please try with smaller files or check your internet connection.";
      } else {
        const serverMessage = extractServerErrorMessage(error);
        if (serverMessage.includes("property upload limit")) {
          errorMessage = serverMessage;
        } else {
          errorMessage = serverMessage || errorMessage;
        }
      }

      showToaster(errorMessage, "destructive");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProperty,
    onSuccess: (data) => handleSuccess(data?.data as IProperty),
    onError: (error: any) => {
      console.error("Update property error:", error);
      let errorMessage = "Failed to update property";

      if (
        error?.message?.includes("timed out") ||
        error?.message?.includes("aborted")
      ) {
        errorMessage =
          "Upload timed out. Please try with smaller files or check your internet connection.";
      } else {
        errorMessage = extractServerErrorMessage(error) || errorMessage;
      }

      showToaster(errorMessage, "destructive");
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<z.infer<typeof PropertyFormSchema>>({
    resolver: zodResolver(PropertyFormSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      type: "",
      purpose: "sale",
      bedrooms: "",
      bathrooms: "",
      toilets: "",
      stateId: "",
      cityId: "",
      address: "",
      street: "",
      price: "",
      currency: "NGN",
      description: "",
    },
  });

  const getCurrency = (): string => {
    return (
      currencies.find((currency) => currency.code === selectedCurrency)
        ?.symbol ?? "₦"
    );
  };

  const watchedPurpose = watch("purpose");

  const onSubmit: SubmitHandler<z.infer<typeof PropertyFormSchema>> = async (
    payload
  ) => {
    if (!sessionData?.user || !sessionData?.accessToken) {
      showToaster("Please login to continue", "destructive");
      return;
    }

    // For create mode, check if files exist
    // For edit mode, allow submission even without new files (since existing images may be sufficient)
    if (props.mode !== "edit" && !files?.length && !newFiles?.length) {
      showToaster(
        "Please add at least one image of the property",
        "destructive"
      );
      return;
    }

    const formData = new FormData();

    // Append other form fields
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "price") {
        const price = String(extractNumFromString(value));
        formData.append("price", price);
      } else {
        formData.append(key, String(value));
      }
    });

    // Append removed existing images
    if (props.mode === "edit" && removedExistingImages.length > 0) {
      removedExistingImages.forEach((imageId) => {
        formData.append("removedImages[]", imageId);
      });
    }

    // Only append new files to avoid re-uploading existing ones
    const filesToUpload = props.mode === "edit" ? newFiles || [] : files || [];

    console.log(
      `Uploading ${filesToUpload.length} files in ${props.mode} mode`
    );

    // Check for large files and warn user
    const totalSize = filesToUpload.reduce((acc, file) => acc + file.size, 0);
    const totalSizeMB = totalSize / 1024 / 1024;

    if (totalSizeMB > 50) {
      console.warn(`Large upload detected: ${totalSizeMB.toFixed(2)}MB total`);
    }

    filesToUpload.forEach((file, index) => {
      console.log(
        `File ${index + 1}: ${file.name} (${(file.size / 1024 / 1024).toFixed(
          2
        )}MB)`
      );
      formData.append("files[]", file);
    });

    try {
      if (props.mode === "edit" && props.property?.id) {
        await updateMutation.mutateAsync({
          formData,
          accessToken: sessionData.accessToken,
          propertyId: props.property.id,
        });
      } else {
        await createMutation.mutateAsync({
          formData,
          accessToken: sessionData.accessToken,
          userId: props.adminMode ? props.targetUserId : undefined,
        });
      }
      reset();
      setFiles([]);
      setNewFiles([]);
      setSelectedPhoto(null);
      setRemovedExistingImages([]);
    } catch (error) {
      console.error("Property submission error:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (!selectedStateId) return;
    const stateData = props.country.states.find(
      (state) => String(state.id) === selectedStateId
    );
    if (stateData) {
      setCities(stateData.cities);
    }
  }, [selectedStateId, props.country.states]);

  useEffect(() => {
    if (props.mode === "edit" && props.property) {
      if (props.property.files) {
        const imageUrls = props.property.files.map((img) => ({
          id: img.id,
          url: img.fileUrl,
          itemId: img.propertyId,
        }));
        setExistingImages(imageUrls);

        // Don't create dummy File objects for existing files
        // setFiles will only contain new files added during edit
        setFiles([]);
        setNewFiles([]);

        if (props.property.defaultImageUrl) {
          const defaultImage = props.property.files.find(
            (file) => file.fileUrl === props.property?.defaultImageUrl
          );

          if (defaultImage) {
            // Create a minimal dummy file for the interface requirement
            const dummyFile = new File(
              [],
              defaultImage.fileName || `image-${defaultImage.id}`,
              {
                type: defaultImage.fileType || "image/jpeg",
              }
            );

            setSelectedPhoto({
              image: {
                url: defaultImage.fileUrl,
                name: defaultImage.fileName || `image-${defaultImage.id}`,
                file: dummyFile,
              },
              fileName: defaultImage.fileName || `image-${defaultImage.id}`,
            });
          }
        }
      }

      reset({
        title: props.property.title,
        categoryId: props.property.categoryId,
        type: props.property.type,
        purpose: props.property.purpose || "sale",
        bedrooms: String(props.property.bedrooms),
        bathrooms: String(props.property.bathrooms),
        toilets: String(props.property.toilets),
        stateId: String(props.property.stateId),
        cityId: String(props.property.cityId),
        address: props.property.address,
        street: props.property.street,
        price: String(props.property.price),
        currency: props.property.currency,
        // append: props.property.append,
        description: props.property.description,
      });

      const stateId = String(props.property.stateId);
      setSelectedStateId(stateId);

      const stateData = props.country.states.find(
        (state) => String(state.id) === stateId
      );
      if (stateData) {
        setCities(stateData.cities);
      }
    }
  }, [props.property, props.mode, props.country.states, reset]);

  useEffect(() => {
    return () => {
      setFiles([]);
      setNewFiles([]);
      setSelectedPhoto(null);
    };
  }, []);

  return (
    <div className={`p-10 w-full bg-white  md:basis-[80%]"md:max-w-[1200px] `}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TitleWithHR title="Property Details" className="mb-6" />
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Title"
              name={field.name}
              type="text"
              placeholder="e.g. 4 Bedroom semi-detached duplex"
              wrapperClassName="mb-6"
              errorMessage={errors.title?.message}
            />
          )}
        />
        <article className="md:flex gap-6">
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <SelectInput
                inputProps={{ ...field }}
                name={field.name}
                formLabel="Category"
                placeholder="Select property category"
                value={field.value || ""}
                options={props.categories?.map((category) => ({
                  label: category.name,
                  value: category.id,
                }))}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                wrapperClassName="mb-6 w-full"
                errorMessage={errors.categoryId?.message}
              />
            )}
          />
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <SelectInput
                inputProps={{ ...field }}
                name={field.name}
                formLabel="Select type"
                placeholder="Select type"
                value={field.value || ""}
                options={propertyTypes.map((type) => ({
                  label: type,
                  value: type,
                }))}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                wrapperClassName="mb-6 w-full"
                errorMessage={errors.type?.message}
              />
            )}
          />
        </article>
        <article className="md:flex gap-6">
          <Controller
            name="purpose"
            control={control}
            render={({ field }) => (
              <SelectInput
                inputProps={{ ...field }}
                name={field.name}
                formLabel="Purpose"
                placeholder="Select purpose"
                value={field.value || ""}
                options={[
                  { label: "For Sale", value: "sale" },
                  { label: "For Rent", value: "rent" },
                  { label: "Shortlet", value: "shortlet" },
                ]}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                wrapperClassName="mb-6 w-full"
                errorMessage={errors.purpose?.message}
              />
            )}
          />
        </article>
        {watchedPurpose && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              {watchedPurpose === "sale" && (
                <>For Sale: This property is available for purchase. The price will be displayed per year.</>
              )}
              {watchedPurpose === "rent" && (
                <>For Rent: This property is available for long-term rental. The price will be displayed per year.</>
              )}
              {watchedPurpose === "shortlet" && (
                <>Shortlet: This property is available for short-term rental (typically daily). The price will be displayed per day.</>
              )}
            </p>
          </div>
        )}
        <article className="md:flex gap-6">
          <Controller
            name="bedrooms"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Bed Rooms"
                name={field.name}
                type="text"
                placeholder="Enter how many bed rooms"
                wrapperClassName="mb-6 md:w-1/2"
                errorMessage={errors.bedrooms?.message}
              />
            )}
          />
          <Controller
            name="bathrooms"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Bath Rooms"
                name={field.name}
                type="number"
                placeholder="Enter how many bath rooms"
                wrapperClassName="mb-6 md:w-1/2"
                errorMessage={errors.bathrooms?.message}
              />
            )}
          />
          <Controller
            name="toilets"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Toilets"
                name={field.name}
                type="number"
                placeholder="Enter how many toilets"
                wrapperClassName="mb-6 md:w-1/2"
                errorMessage={errors.toilets?.message}
              />
            )}
          />
        </article>

        {/* Address */}

        <TitleWithHR title="Property Address" className="mb-6" />

        <article className="md:flex gap-6">
          <Controller
            name="stateId"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                formLabel="State"
                options={
                  props.country?.states?.map((state) => ({
                    label: state.name,
                    value: String(state.id),
                  })) || []
                }
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedStateId(value);
                }}
                name={field.name}
                placeholder="Select state"
                wrapperClassName="mb-6 md:w-1/2"
                errorMessage={errors.stateId?.message}
              />
            )}
          />
          <Controller
            name="cityId"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                formLabel="City"
                name={field.name}
                options={
                  cities?.map((city) => ({
                    label: city.name,
                    value: String(city.id),
                  })) || []
                }
                disabled={!cities?.length}
                placeholder="Select city"
                wrapperClassName="mb-6 md:w-1/2"
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                errorMessage={errors.cityId?.message}
              />
            )}
          />
        </article>

        <article className="md:flex gap-6">
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Area"
                name={field.name}
                type="text"
                placeholder="eg G.R.A Phase 1 Ikeja"
                wrapperClassName="mb-6 md:w-1/2"
                errorMessage={errors.address?.message}
              />
            )}
          />
          <Controller
            name="street"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Street / Estate"
                name={field.name}
                type="text"
                placeholder="eg. 12, Allen Avenue"
                wrapperClassName="mb-6 md:w-1/2"
                errorMessage={errors.street?.message}
              />
            )}
          />
        </article>

        <TitleWithHR title="Price details" className="mb-6" />

        <article className="md:flex md:items-center gap-6">
          {/* <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                formLabel="Currency"
                name={field.name}
                placeholder="Select currency"
                options={currencies.map((currency) => ({
                  label: `(${currency.symbol}) ${currency.code}`,
                  value: currency.code,
                }))}
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedCurrency(value);
                }}
                defaultValue="NGN"
                wrapperClassName="mb-6 md:w-1/2"
                errorMessage={errors.currency?.message}
              />
            )}
          /> */}
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <NumericFormat
                {...field}
                label="Price"
                prefix={getCurrency()}
                name={field.name}
                placeholder="eg 1,000,000"
                // wrapperClassName="mb-6 md:w-1/2"
                wrapperClassName="mb-6 w-full"
                errorMessage={errors.price?.message}
                thousandSeparator={true}
                customInput={CustomInput}
              />
            )}
          />

          {/* <Controller
            name="append"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Append to"
                name={field.name}
                type="text"
                placeholder="Append to"
                wrapperClassName="mb-6 md:w-1/2"
                errorMessage={errors.append?.message}
              />
            )}
          /> */}
        </article>

        <TitleWithHR title="Description" className="mb-6" />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              label="Description"
              name={field.name}
              placeholder="Write a short description about your property"
              wrapperClassName="mb-6"
              errorMessage={errors.description?.message}
            />
          )}
        />

        <TitleWithHR title="Property Image" className="mb-6" />
        <article className="mb-6">
          <span className="mb-2 font-medium text-grey6 text-sm block">
            Add at least one photo of your property here
          </span>
          <span className="mb-2 font-medium text-grey6 text-sm block">
            Each file must not exceed 5MB for images and 10MB for videos.
          </span>
          <span className="mb-6 font-medium text-grey6 text-sm block">
            Supported formats are JPEG and PNG for images and mp4, webm, ogg for
            videos.
          </span>
          <NewImagePreview
            existingImages={existingImages}
            format="multiple"
            name="files"
            files={props.mode === "edit" ? newFiles : files}
            setFiles={props.mode === "edit" ? setNewFiles : setFiles}
            selectedPhoto={selectedPhoto as SelectedImagePreview}
            setSelectedPhoto={setSelectedPhoto}
            fileType="both"
            isVideoUploadAllowed={isVideoUploadAllowed}
            onRemoveExistingImage={(imageId) => {
              setRemovedExistingImages(prev => [...prev, imageId]);
              setExistingImages(prev => prev ? prev.filter(img => img.id !== imageId) : null);
            }}
          />
        </article>

        <article className="mb-6 flex flex-col-reverse md:flex-row md:justify-end">
          <CustomButton variant="tertiary">Cancel</CustomButton>
          <CustomButton
            className="mb-2 md:mb-0"
            type="submit"
            loading={isSubmitting}
          >
            {props.mode === "edit" ? "Update Property" : "Post Property"}
          </CustomButton>
        </article>
      </form>
    </div>
  );
};

export default PropertyForm;
