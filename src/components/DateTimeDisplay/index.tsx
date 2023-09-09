import React from "react";

import { IDateTimeProps } from "@/types/Countdown";

const DateTimeDisplay = (props: IDateTimeProps) => {
  const { value, type, isDanger } = props;

  return (
    <div
      className={`${
        isDanger ? "countdown danger" : "countdown"
      } flex flex-col max-[430px]:px-2`}
    >
      <span className="rounded rounded-md bg-black px-5 py-2 text-3xl font-bold text-white max-[430px]:px-4 max-[430px]:py-2 max-[430px]:text-2xl">
        {value}
      </span>
      <span className="uppercase text-white max-[430px]:text-sm">{type}</span>
    </div>
  );
};

export default DateTimeDisplay;
