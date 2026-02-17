import React from "react";
import Image from "next/image";

const DualCardSection = () => {
    return (
        <div className="w-full min-h-screen py-12 md:py-0 md:h-screen flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="flex flex-col items-start justify-center gap-4 w-full md:w-auto px-6 md:px-0">
            <p className="text-2xl md:text-4xl font-semibold">
              名刺
            </p>
            <Image src="/DualCardImage1.jpg" width={780} height={440} alt="" className="w-full h-auto object-cover"/>
          </div>
          <div className="flex flex-col items-end justify-center gap-4 w-full md:w-auto px-6 md:px-0">
            <p className="text-3xl md:text-5xl font-semibold text-[#A00000]">
              01
            </p>
            <Image src="/DualCardImage2.jpg" width={780} height={440} alt=""  className="shadow-[0_0_1px_rgba(255,255,255,0.5)] w-full h-auto object-cover"/>
          </div>
        </div>
    );
};

export default DualCardSection;
