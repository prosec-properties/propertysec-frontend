"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { NumericFormat } from "react-number-format";

import CustomInput from "../inputs/CustomInput";
import SelectInput, { ISelectOption } from "../inputs/SelectInput";
import TitleWithHR from "../misc/TitleWithHR";
import TextArea from "../inputs/TextArea";
import CustomButton from "../buttons/CustomButton";
import NewImagePreview, { IExistingImage } from "../files/NewImagePreview";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import {
  extractNumFromString,
  extractServerErrorMessage,
  showToaster,
} from "@/lib/general";
import { SelectedImagePreview } from "@/interface/image";
import { ICategory } from "@/interface/category";
import { IProduct } from "@/interface/product";
import { ICountry } from "@/interface/location";
import { createProduct, updateProduct } from "@/services/product.service";

const PRODUCT_CONDITIONS = [
  { label: "New", value: "new" },
  { label: "Used", value: "used" },
  { label: "Refurbished", value: "refurbished" },
  { label: "Not Applicable", value: "not_applicable" },
];

const ProductFormSchema = z.object({
  // Basic Information
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  condition: z.enum(["new", "used", "refurbished", "not_applicable"]),

  // Product Details
  brand: z.string().optional(),
  model: z.string().optional(),
  specifications: z.string().optional(),

  // Pricing & Inventory
  price: z.string().min(1, "Price is required"),
  quantity: z.string().min(1, "Quantity is required"),
  negotiable: z.boolean().default(false),

  // Category Information
  categoryId: z.string().min(1, "Category is required"),
  subcategoryId: z.string().min(1, "Subcategory is required"),

  // Location Information
  stateId: z.string().min(1, "State is required"),
  cityId: z.string().min(1, "City is required"),
  address: z.string().optional(),
});

type ProductFormData = z.infer<typeof ProductFormSchema>;

interface Props {
  country: ICountry;
  categories: ICategory[];
  product?: IProduct;
  mode?: "create" | "edit";
}

const ProductForm = (props: Props) => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  const [files, setFiles] = useState<File[] | undefined>([]);
  const [selectedPhoto, setSelectedPhoto] =
    useState<SelectedImagePreview | null>(null);
  const [existingImages, setExistingImages] = useState<IExistingImage[] | null>(
    null
  );
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      title: "",
      description: "",
      condition: "new",
      brand: "",
      model: "",
      specifications: "",
      price: "",
      quantity: "1",
      negotiable: false,
      categoryId: "",
      subcategoryId: "",
      stateId: "",
      cityId: "",
      address: "",
    },
  });

  const handleSuccess = (data: IProduct) => {
    showToaster(
      `Product ${props.mode === "edit" ? "updated" : "created"} successfully`,
      "success"
    );

    const productId = props.mode === "edit" ? props.product?.id : data?.id;
    if (productId) {
      router.push(`/products/${productId}`);
    }
  };

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => handleSuccess(data?.data as IProduct),
    onError: (error: any) => {
      const errorMessage =
        extractServerErrorMessage(error) || "Failed to create product";
      showToaster(errorMessage, "destructive");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => handleSuccess(data?.data as IProduct),
    onError: (error: any) => {
      const errorMessage =
        extractServerErrorMessage(error) || "Failed to update product";
      showToaster(errorMessage, "destructive");
    },
  });

  const onSubmit: SubmitHandler<ProductFormData> = async (payload) => {
    if (!sessionData?.user || !sessionData?.accessToken) {
      showToaster("Please login to continue", "destructive");
      return;
    }

    if (!files?.length && !existingImages?.length) {
      showToaster(
        "Please add at least one image of the product",
        "destructive"
      );
      return;
    }

    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (key === "price") {
        const price = String(extractNumFromString(value as string));
        formData.append("price", price);
      } else {
        formData.append(key, String(value));
      }
    });

    if (files) {
      files.forEach((file) => {
        formData.append("files[]", file);
      });
    }

    // Append removed images if in edit mode
    if (props.mode === "edit" && removedImages.length > 0) {
      formData.append("removedImages", JSON.stringify(removedImages));
    }

    try {
      if (props.mode === "edit" && props.product?.id) {
        await updateMutation.mutateAsync({
          formData,
          accessToken: sessionData.accessToken,
          productId: props.product.id,
        });
      } else {
        await createMutation.mutateAsync({
          formData,
          accessToken: sessionData.accessToken,
        });
      }

      reset();
      setFiles([]);
      setSelectedPhoto(null);
      setExistingImages(null);
      setRemovedImages([]);
    } catch (error) {
      console.error("Product submission error:", error);
      throw error;
    }
  };

  const selectCategory = (): ISelectOption[] => {
    const category = props.categories.find(
      (cat) => cat.id === watch("categoryId")
    );
    if (!category) return [];
    return category.subcategories.map((subcat) => ({
      label: subcat.name,
      value: String(subcat.id),
    }));
  };

  const selectedState = (): ISelectOption[] => {
    const state = props.country.states.find(
      (state) => String(state.id) === watch("stateId")
    );
    if (!state) return [];
    return state.cities.map((city) => ({
      label: city.name,
      value: String(city.id),
    }));
  };

  const handleImageRemove = (imageId: string) => {
    if (existingImages) {
      setExistingImages(existingImages.filter((img) => img.id !== imageId));
      setRemovedImages([...removedImages, imageId]);
    }
  };

  useEffect(() => {
    if (props.mode === "edit" && props.product) {
      if (props.product.files) {
        const imageUrls = props.product.files.map((img) => ({
          id: img.id,
          url: img.fileUrl,
          itemId: img.productId,
        }));
        setExistingImages(imageUrls);
      }

      reset({
        title: props.product.title,
        description: props.product.description,
        condition: props.product.condition,
        brand: props.product.brand || "",
        model: props.product.model || "",
        specifications: props.product.specifications || "",
        price: String(props.product.price),
        quantity: String(props.product.quantity),
        negotiable: props.product.negotiable,
        categoryId: props.product.categoryId,
        subcategoryId: props.product.subCategoryId,
        stateId: props.product.stateId,
        cityId: props.product.cityId,
        address: props.product.address,
      });
    }
  }, [props.product, props.mode, reset]);

  return (
    <div className="p-6 md:p-10 w-full bg-white md:max-w-[1200px] mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information Section */}
        <section>
          <TitleWithHR title="Basic Information" />
          <div className="mt-6 space-y-6">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="Product Title*"
                  placeholder="Enter product title"
                  errorMessage={errors.title?.message}
                />
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="condition"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    formLabel="Condition*"
                    placeholder="Select condition"
                    options={PRODUCT_CONDITIONS}
                    onValueChange={field.onChange}
                    errorMessage={errors.condition?.message}
                  />
                )}
              />
            </div>
          </div>
        </section>

        {/* Product Details Section */}
        <section>
          <TitleWithHR title="Product Details" />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="brand"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="Brand (Optional)"
                  placeholder="e.g., Samsung, Apple"
                  errorMessage={errors.brand?.message}
                />
              )}
            />

            <Controller
              name="model"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="Model (Optional)"
                  placeholder="e.g., iPhone 15, Galaxy S23"
                  errorMessage={errors.model?.message}
                />
              )}
            />
          </div>
        </section>

        {/* Category Information */}
        <section>
          <TitleWithHR title="Category" />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <SelectInput
                  {...field}
                  placeholder="Select category*"
                  formLabel="Main Category*"
                  options={props.categories?.map((c) => ({
                    label: c.name,
                    value: c.id,
                  }))}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValue("subcategoryId", "");
                  }}
                  errorMessage={errors.categoryId?.message}
                />
              )}
            />

            <Controller
              name="subcategoryId"
              control={control}
              render={({ field }) => (
                <SelectInput
                  {...field}
                  placeholder="Select subcategory*"
                  formLabel="Subcategory*"
                  disabled={!watch("categoryId")}
                  options={selectCategory()}
                  onValueChange={field.onChange}
                  errorMessage={errors.subcategoryId?.message}
                />
              )}
            />
          </div>
        </section>

        {/* Pricing & Inventory */}
        <section>
          <TitleWithHR title="Pricing & Inventory" />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <NumericFormat
                  {...field}
                  label="Price*"
                  prefix={"₦"}
                  thousandSeparator
                  customInput={CustomInput}
                  placeholder="Enter price"
                  errorMessage={errors.price?.message}
                />
              )}
            />

            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  type="number"
                  min="1"
                  label="Quantity*"
                  placeholder="Enter quantity"
                  errorMessage={errors.quantity?.message}
                />
              )}
            />

            <div className="flex items-center space-x-2 pt-2">
              <Controller
                name="negotiable"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="negotiable"
                  />
                )}
              />
              <Label htmlFor="negotiable">Price is negotiable</Label>
            </div>
          </div>
        </section>

        {/* Location Information */}
        <section>
          <TitleWithHR title="Location" />
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="stateId"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    formLabel="State*"
                    options={props.country?.states?.map((state) => ({
                      label: state.name,
                      value: String(state.id),
                    }))}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue("cityId", "");
                    }}
                    placeholder="Select state"
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
                    formLabel="City*"
                    options={selectedState()}
                    disabled={!watch("stateId")}
                    placeholder="Select city"
                    onValueChange={field.onChange}
                    errorMessage={errors.cityId?.message}
                  />
                )}
              />
            </div>

            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="Full Address (Optional)"
                  placeholder="e.g., 123 Main Street, Apartment 4B"
                  errorMessage={errors.address?.message}
                />
              )}
            />
          </div>
        </section>

        {/* Description */}
        <section>
          <TitleWithHR title="Description" />
          <div className="mt-6">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  label="Detailed Description*"
                  rows={6}
                  placeholder="Describe your product in detail..."
                  errorMessage={errors.description?.message}
                />
              )}
            />
          </div>
        </section>

        {/* Specifications */}
        <section>
          <TitleWithHR title="Specifications" />
          <div className="mt-6">
            <Controller
              name="specifications"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  label="Technical Specifications (Optional)"
                  rows={4}
                  placeholder="List key specifications (e.g., RAM, Storage, Color)..."
                  errorMessage={errors.specifications?.message}
                />
              )}
            />
          </div>
        </section>

        {/* Media Section */}
        <section>
          <TitleWithHR title="Product Images" />
          <div className="mt-6 space-y-4">
            <p className="text-sm text-gray-600">
              Add at least one photo of your product (max 10 images). First
              image will be used as the main display image.
            </p>
            <NewImagePreview
              existingImages={existingImages}
              format="multiple"
              name="files"
              files={files}
              setFiles={setFiles}
              selectedPhoto={selectedPhoto as SelectedImagePreview}
              setSelectedPhoto={setSelectedPhoto}
              fileType="both"
              maxFileNumber={10}
            />
          </div>
        </section>

        {/* Form Actions */}
        <section className="flex flex-col-reverse md:flex-row md:justify-end gap-4 pt-6">
          <CustomButton
            variant="tertiary"
            type="button"
            onClick={() => router.back()}
          >
            Cancel
          </CustomButton>
          <CustomButton type="submit" loading={isSubmitting}>
            {props.mode === "edit" ? "Update Product" : "Publish Product"}
          </CustomButton>
        </section>
      </form>
    </div>
  );
};

export default ProductForm;
