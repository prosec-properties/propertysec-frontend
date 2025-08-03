import React from "react";

interface Props extends React.SVGProps<SVGSVGElement> {
  strokeColor?: string;
}
const MarketPlaceIcon = ({ strokeColor, ...props }: Props) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.375 9.81491V15.1875H14.625V9.81491"
        stroke={strokeColor || "#464646"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.79688 2.8125H14.2031C14.3253 2.81252 14.4442 2.85233 14.5417 2.92591C14.6393 2.99949 14.7102 3.10283 14.7438 3.22031L15.75 6.75H2.25L3.25828 3.22031C3.29178 3.10318 3.36241 3.00009 3.45954 2.92655C3.55667 2.853 3.67505 2.81298 3.79688 2.8125Z"
        stroke={strokeColor || "#464646"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 6.75V7.875C6.75 8.47174 6.51295 9.04403 6.09099 9.46599C5.66903 9.88795 5.09674 10.125 4.5 10.125C3.90326 10.125 3.33097 9.88795 2.90901 9.46599C2.48705 9.04403 2.25 8.47174 2.25 7.875V6.75"
        stroke={strokeColor || "#464646"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.25 6.75V7.875C11.25 8.47174 11.0129 9.04403 10.591 9.46599C10.169 9.88795 9.59674 10.125 9 10.125C8.40326 10.125 7.83097 9.88795 7.40901 9.46599C6.98705 9.04403 6.75 8.47174 6.75 7.875V6.75"
        stroke={strokeColor || "#464646"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 6.75V7.875C15.75 8.47174 15.5129 9.04403 15.091 9.46599C14.669 9.88795 14.0967 10.125 13.5 10.125C12.9033 10.125 12.331 9.88795 11.909 9.46599C11.4871 9.04403 11.25 8.47174 11.25 7.875V6.75"
        stroke={strokeColor || "#464646"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MarketPlaceIcon;
