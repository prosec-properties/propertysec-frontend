import React from "react";

interface Props extends React.SVGProps<SVGSVGElement> {
  strokeColor?: string;
}

const SubscriptionIcon = ({ strokeColor, ...props }: Props) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_2314_715)">
        <path
          d="M15.75 3.9375H2.25C1.93934 3.9375 1.6875 4.18934 1.6875 4.5V13.5C1.6875 13.8107 1.93934 14.0625 2.25 14.0625H15.75C16.0607 14.0625 16.3125 13.8107 16.3125 13.5V4.5C16.3125 4.18934 16.0607 3.9375 15.75 3.9375Z"
          stroke={strokeColor || "#464646"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.8125 11.8125H14.0625"
          stroke={strokeColor || "#464646"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.4375 11.8125H9.5625"
          stroke={strokeColor || "#464646"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.6875 6.75H16.3125"
          stroke={strokeColor || "#464646"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2314_715">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default SubscriptionIcon;
