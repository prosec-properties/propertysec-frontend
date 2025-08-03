"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import CustomInput from "../inputs/CustomInput";
import SelectInput, { ISelectOption } from "../inputs/SelectInput";
import TextArea from "../inputs/TextArea";
import { NumericFormat } from "react-number-format";

interface ControlledInputProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  wrapperClassName?: string;
  defaultValue?: string;
  prefix?: string;
  thousandSeparator?: boolean;
  disabled?: boolean;
}

const ControlledInput: React.FC<ControlledInputProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  options,
  wrapperClassName,
  defaultValue,
  prefix,
  thousandSeparator,
  disabled,
}) => {
  const { control } = useFormContext();

  const renderInput = (field: any, errorMessage?: string) => {
    switch (type) {
      case "select":
        return (
          <SelectInput
            inputProps={{ ...field }}
            name={field.name}
            formLabel={label as string}
            placeholder={placeholder as string}
            value={field.value || ""}
            options={options || []}
            onValueChange={(value) => field.onChange(value)}
            wrapperClassName={wrapperClassName}
            errorMessage={errorMessage}
            disabled={disabled}
          />
        );
      case "textarea":
        return (
          <TextArea
            {...field}
            label={label}
            name={field.name}
            placeholder={placeholder}
            wrapperClassName={wrapperClassName}
            errorMessage={errorMessage}
          />
        );
      case "numeric":
        return (
          <NumericFormat
            {...field}
            label={label}
            prefix={prefix}
            name={field.name}
            placeholder={placeholder}
            wrapperClassName={wrapperClassName}
            errorMessage={errorMessage}
            thousandSeparator={thousandSeparator}
            customInput={CustomInput}
          />
        );
      default:
        return (
          <CustomInput
            {...field}
            label={label}
            name={field.name}
            type={type}
            placeholder={placeholder}
            wrapperClassName={wrapperClassName}
            errorMessage={errorMessage}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) =>
        renderInput(field, error?.message)
      }
    />
  );
};

export default ControlledInput;