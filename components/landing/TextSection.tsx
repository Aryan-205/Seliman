import React from "react";

const TextSection = () => {
    return (
        <div className="w-full h-[60vh] flex items-center justify-center relative">
            <p className="text-5xl font-light leading-10 text-center max-w-6xl">Orenchi positions itself not simply as a restaurant, but as a destination for connoisseurs who value authenticity, cultural respect, and uncompromising quality in Japanese fine dining.</p>
            <div className="flex w-full absolute bottom-0 items-center justify-between px-24">
              <p className="text-5xl font-semibold text-[#A00000]">メニュー</p>
              <p className="text-5xl font-light text-[#A00000]">01</p>
            </div>
        </div>
    );
};

export default TextSection;