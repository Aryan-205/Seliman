import React from "react";
import Image from "next/image";

const SingleImageSection = ({image}: {image: string}) => {
    return (
        <div className="w-full h-[50vh] md:h-screen p-4 md:p-12 bg-black">
            <Image src={image} width={1920} height={1080} alt="" className="w-full h-full object-cover" />
        </div>
    );
};

export default SingleImageSection;
