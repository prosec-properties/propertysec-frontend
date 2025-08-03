import React from "react";

const CartIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="51"
      height="50"
      viewBox="0 0 51 50"
      fill="none"
      {...props}
    >
      <g clipPath="url(#clip0_544_346)">
        <path
          d="M17.4375 45.3125C19.1634 45.3125 20.5625 43.9134 20.5625 42.1875C20.5625 40.4616 19.1634 39.0625 17.4375 39.0625C15.7116 39.0625 14.3125 40.4616 14.3125 42.1875C14.3125 43.9134 15.7116 45.3125 17.4375 45.3125Z"
          fill="#0476B9"
        />
        <path
          d="M37.75 45.3125C39.4759 45.3125 40.875 43.9134 40.875 42.1875C40.875 40.4616 39.4759 39.0625 37.75 39.0625C36.0241 39.0625 34.625 40.4616 34.625 42.1875C34.625 43.9134 36.0241 45.3125 37.75 45.3125Z"
          fill="#0476B9"
        />
        <path
          d="M3.375 6.25H8.0625L15.2402 32.0859C15.4229 32.7439 15.8161 33.324 16.3596 33.7374C16.9031 34.1507 17.5671 34.3747 18.25 34.375H37.5547C38.2379 34.3751 38.9023 34.1514 39.4463 33.7379C39.9902 33.3245 40.3836 32.7442 40.5664 32.0859L45.5625 14.0625H10.2324"
          stroke="#0476B9"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_544_346">
          <rect
            width="50"
            height="50"
            fill="white"
            transform="translate(0.25)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default CartIcon;
