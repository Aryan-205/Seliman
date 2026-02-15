import React from "react";

const MenuCardSection = () => {
    return (
        <div className="h-screen w-full flex justify-center items-center gap-8">
            {/* card */}
            <div
              className="h-full w-[320px] flex flex-col justify-between items-center py-8"
              style={{
                backgroundImage: "url('/BackgroundTexture1.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              
            </div>
        </div>
    );
};

export default MenuCardSection;