import React from "react";
import Image from "next/image";

const SingleImageSection = ({image}: {image: string}) => {
    return (
        <div className="w-full h-screen p-12 bg-black">
            <Image src={image} width={1920} height={1080} alt="" />
        </div>
    );
};

export default SingleImageSection;
