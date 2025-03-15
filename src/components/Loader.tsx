import React from "react";

function Loader() {
  return (
    <div className="mx-auto max-w-sm rounded-md border border-gray-300 p-4 w-96">
      <div className="animate-pulse w-full">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-7 rounded bg-gray-200"></div>
          <div className="h-7 rounded bg-gray-200"></div>
          <div className="h-7 rounded bg-gray-200"></div>
          <div className="h-7 rounded bg-gray-200"></div>
          <div className="h-7 rounded bg-gray-200"></div>
          <div className="h-7 rounded bg-gray-200"></div>
          <div className="h-7 rounded bg-gray-200"></div>
          <div className="h-7 rounded bg-gray-200"></div>
          <div className="h-7 rounded bg-gray-200"></div>
          <div className="h-7 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}

export default Loader;
