import React from "react";
import Image from "next/image";
import CardIcon from "../icons/CardIcon";
import CardBottomText from "../icons/CardBottomText";
import CardLeftText from "../icons/CardLeftText";
import CardRightText from "../icons/CardRightText";

const CardSection = () => {
  return (
    <div className="w-full h-screen bg-black p-24 flex justify-between gap-2">
      {/* card */}
      <div className="flex justify-center items-center w-full flex-1 h-full bg-[#FFF9E9]">
        <div className="flex flex-col gap-4">
          <div className="w-full flex justify-center">
            <CardIcon />
          </div>
          <div className="flex gap-2">
            <div className="h-full flex flex-col justify-end">
              <CardLeftText />
            </div>
            <Image src="/CardImage1.png" width={320} height={420} alt="" />
            <div className="h-full flex flex-col justify-start">
              <CardRightText />
            </div>
          </div>
          <div className="w-full flex justify-end">
            <CardBottomText />
          </div>
        </div>
      </div>
      {/* card */}
      <div className="flex justify-center items-center w-full flex-1 h-full bg-[#FFF9E9]">
        <div className="flex flex-col gap-4">
          <div className="w-full flex justify-center">
            <CardIcon />
          </div>
          <div className="flex gap-2">
            <div className="h-full flex flex-col justify-end">
              <CardLeftText />
            </div>
            <Image src="/CardImage2.png" width={320} height={420} alt="" />
            <div className="h-full flex flex-col justify-start">
              <CardRightText />
            </div>
          </div>
          <div className="w-full flex justify-end">
            <CardBottomText />
          </div>
        </div>
      </div>
      {/* card */}
      <div className="flex justify-center items-center w-full flex-1 h-full bg-[#FFF9E9]">
        <div className="flex flex-col gap-4">
          <div className="w-full flex justify-center">
            <CardIcon />
          </div>
          <div className="flex gap-2">
            <div className="h-full flex flex-col justify-end">
              <CardLeftText />
            </div>
            <Image src="/CardImage3.png" width={320} height={420} alt="" />
            <div className="h-full flex flex-col justify-start">
              <CardRightText />
            </div>
          </div>
          <div className="w-full flex justify-end">
            <CardBottomText />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSection;