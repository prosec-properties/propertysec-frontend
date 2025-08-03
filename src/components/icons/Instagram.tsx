import React from "react";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_2029_78)">
        <path
          d="M16 21C18.7614 21 21 18.7614 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21Z"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
        />
        <path
          d="M22 4H10C6.68629 4 4 6.68629 4 10V22C4 25.3137 6.68629 28 10 28H22C25.3137 28 28 25.3137 28 22V10C28 6.68629 25.3137 4 22 4Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22.2444 10.4889C22.9317 10.4889 23.4889 9.93173 23.4889 9.24444C23.4889 8.55716 22.9317 8 22.2444 8C21.5572 8 21 8.55716 21 9.24444C21 9.93173 21.5572 10.4889 22.2444 10.4889Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_2029_78">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default InstagramIcon;
