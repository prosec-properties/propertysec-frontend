import React from "react";

const ListingIcon = (props: React.SVGProps<SVGSVGElement>) => {
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
        d="M7.3125 15.1875V10.6875H10.6875V15.1875H15.1875V8.43752C15.1876 8.36362 15.1731 8.29045 15.1448 8.22216C15.1166 8.15388 15.0752 8.09182 15.023 8.03955L9.39797 2.41455C9.34573 2.36225 9.28369 2.32076 9.2154 2.29245C9.14712 2.26414 9.07392 2.24957 9 2.24957C8.92608 2.24957 8.85288 2.26414 8.7846 2.29245C8.71631 2.32076 8.65427 2.36225 8.60203 2.41455L2.97703 8.03955C2.92481 8.09182 2.8834 8.15388 2.85517 8.22216C2.82694 8.29045 2.81244 8.36362 2.8125 8.43752V15.1875H7.3125Z"
        stroke="#464646"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ListingIcon;
