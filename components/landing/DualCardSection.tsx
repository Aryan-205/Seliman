import React from "react";
import Image from "next/image";

const DualCardSection = () => {
    return (
        <div className="w-full h-screen flex gap-8 items-center justify-center">
          <div className="flex flex-col items-start justify-center gap-4">
            <p className="text-4xl font-semibold">
              名刺
            </p>
            <Image src="/DualCardImage1.jpg" width={780} height={440} alt="" />
          </div>
          <div className="flex flex-col items-end justify-center gap-4">
            <p className="text-5xl font-semibold text-[#A00000]">
              01
            </p>
            <Image src="/DualCardImage2.jpg" width={780} height={440} alt=""  className="shadow-[0_0_1px_rgba(255,255,255,0.5)]"/>
          </div>
        </div>
    );
};

export default DualCardSection;
