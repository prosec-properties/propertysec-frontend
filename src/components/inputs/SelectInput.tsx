import React, { useCallback, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Small from "../misc/Small";
import ErrorMessage from "../misc/ErrorMessage";

export interface ISelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface ISelectOptionData {
  label?: string;
  options: ISelectOption[];
}

interface Props {
  options: ISelectOption[];
  optionGroups?: ISelectOptionData[];
  name: string;
  value: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  formLabel: string;
  defaultValue?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  wrapperClassName?: string;
  disabled?: boolean;
  errorMessage?: string;
  errorClass?: string;
  emptyMessage?: string;
  onValueChange?: (value: string) => void;
}

const SelectInput = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      wrapperClassName,
      options,
      value,
      errorClass,
      errorMessage,
      setValue,
      onValueChange,
      formLabel,
      placeholder,
      disabled,
      name,
      inputProps,
      defaultValue,
      optionGroups,
      emptyMessage,
      ...props
    },
    ref
  ) => {
    const [selectedValue, setSelectedValue] = useState("");

    const itemDefaultClass = useCallback(
      (itemValue: string, isDisabled?: boolean) =>
        cn("cursor-pointer", {
          "bg-primary text-white hover:bg-primary focus:bg-primary focus:text-white":
            selectedValue === itemValue,
          "pointer-events-none text-grey5": isDisabled,
        }),
      [selectedValue]
    );

    return (
      <article className={cn("flex flex-col w-full gap-y-1", wrapperClassName)}>
        <Label
          htmlFor={formLabel}
          className="mb-3 block font-medium text-xs md:text-sm"
        >
          {formLabel}
        </Label>

        <Select
          name={name || inputProps?.name}
          value={value || inputProps?.value || defaultValue || ("" as any)}
          onValueChange={(value) => {
            if (!value) return;
            onValueChange && onValueChange(value);
            setValue && setValue(value);
            setSelectedValue(value);
            const e = {
              target: {
                name: name || inputProps?.name,
                value,
              },
            };
            inputProps?.onChange?.(e as any);
          }}
          {...(defaultValue
            ? {
                defaultValue,
              }
            : {})}
          disabled={disabled || false}
          {...props}
        >
          <SelectTrigger
            className={cn({
              "border-grey10 w-full hover:border-grey10 focus:border-grey10 active:border-grey10":
                !!selectedValue || !!value,
            })}
          >
            <SelectValue
              placeholder={placeholder}
              className={"truncate text-ellipsis overflow-hidden outline-none"}
            />
          </SelectTrigger>
          <SelectContent
            className={cn(
              `
               shadow-drop-down
               bg-white
               transition
               max-h-[300px]
            `
            )}
          >
            {optionGroups?.map((group, i) => (
              <SelectGroup key={i}>
                <SelectLabel
                  className={cn(`
                    px-2
                    uppercase
                    text-xs
                    sm:text-sm
               `)}
                >
                  {group.label}
                </SelectLabel>
                {group.options.map((option, index) => (
                  <SelectItem
                    className={itemDefaultClass(option.value, option.disabled)}
                    value={option.value}
                    disabled={option.disabled}
                    key={index}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
            {options?.map((option, index) => (
              <SelectItem
                className={itemDefaultClass(option.value, option.disabled)}
                value={option.value}
                disabled={option.disabled}
                key={index}
              >
                {option.label}
              </SelectItem>
            ))}

            {!options?.length && !optionGroups?.length ? (
              <SelectItem
                className={itemDefaultClass("null")}
                value={"null"}
                disabled
              >
                {emptyMessage || "No options available"}
              </SelectItem>
            ) : null}
          </SelectContent>
        </Select>
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
      </article>
    );
  }
);

SelectInput.displayName = "SelectInput";
export default SelectInput;
