import React from "react";

interface Props {
  className?: string;
  title: string;
}

const TopHeading = (props: Props) => {
  return (
    <div
      className={`w-full bg-white font-medium text-xl rounded-[5px] px-6 py-3 ${props.className}`}
    >
      <h1 className="">{props.title}</h1>
    </div>
  );
};

export default TopHeading;
