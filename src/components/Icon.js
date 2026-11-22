import React from "react";
export default function Icon({ name = "arrow", className = "", ...props }) {
  const paths = {
    arrow: <path d="M5 19 19 5M5 5h14v14" />,
    down: <path d="M12 4v16m-6-6 6 6 6-6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    download: <path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" />,
    spark: (
      <path
        d="M12 2c0 6-4 10-10 10 6 0 10 4 10 10 0-6 4-10 10-10-6 0-10-4-10-10Z"
        fill="currentColor"
        stroke="none"
      />
    ),
    grid: (
      <path
        d="M4 4h5v5H4zm11 0h5v5h-5zM4 15h5v5H4zm11 0h5v5h-5z"
        fill="currentColor"
        stroke="none"
      />
    ),
    code: <path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16" />,
  };
  return (
    <svg
      className={`icon ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name] || paths.arrow}
    </svg>
  );
}
