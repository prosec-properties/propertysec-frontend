import React from "react";
import CustomButton from "../buttons/CustomButton";
import CustomInput from "../inputs/CustomInput";

const NewsLetterInput = () => {
  return (
    <div className="flex w-full max-w-sm items-center">
      <CustomInput
        label="'"
        hideLabel
        type="email"
        placeholder="Email"
        className="rounded-r-none h-[40px] focus-within:to-white focus-visible:ring-0 focus-visible:ring-offset-0 outline-none border-grey4 bg-transparent"
      />
      <CustomButton
        type="submit"
        variant="secondary"
        className="rounded-l-none text-grey11 h-10 sm:h-12 hover:bg-white hover:text-grey11 border-grey4 font-semibold"
      >
        Subscribe
      </CustomButton>
    </div>
  );
};

export default NewsLetterInput;
