import React from "react";

const ProfileIcon = (props: React.SVGProps<SVGSVGElement>) => {
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
        d="M9 11.25C11.4853 11.25 13.5 9.23528 13.5 6.75C13.5 4.26472 11.4853 2.25 9 2.25C6.51472 2.25 4.5 4.26472 4.5 6.75C4.5 9.23528 6.51472 11.25 9 11.25Z"
        stroke="#464646"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.25 15.1875C3.61195 12.8341 6.08555 11.25 9 11.25C11.9145 11.25 14.388 12.8341 15.75 15.1875"
        stroke="#464646"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ProfileIcon;
