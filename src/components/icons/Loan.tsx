import React from "react";

interface Props extends React.SVGProps<SVGSVGElement> {
  strokeColor?: string;
}

const LoanIcon = ({ strokeColor, ...props }: Props) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_291_2039)">
        <path
          d="M1.6759 6.78958H16.3009L8.9884 2.28958L1.6759 6.78958Z"
          stroke={strokeColor || "#464646"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.9259 6.78958V12.4146"
          stroke={strokeColor || "#464646"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.3009 6.78958V12.4146"
          stroke={strokeColor || "#464646"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.6759 6.78958V12.4146"
          stroke={strokeColor || "#464646"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.0509 6.78958V12.4146"
          stroke={strokeColor || "#464646"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.2384 12.4146H15.7384"
          stroke={strokeColor || "#464646"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.1134 14.6646H16.8634"
          stroke={strokeColor || "#464646"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_291_2039">
          <rect
            width="18"
            height="18"
            fill="white"
            transform="translate(-0.0115967 0.0395813)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default LoanIcon;
