import React from "react";

const InfoSection = () => {
  return (
    <div className="w-full min-h-screen bg-black p-6 md:p-24 flex flex-col justify-between">
      <p className="text-[#8E8E8E] text-lg md:text-3xl leading-relaxed md:leading-10 text-left font-light">Orenchi represents a refined fusion of traditional Japanese culinary heritage and modern luxury dining. Every detail of the brand is designed to honor centuries-old craftsmanship from premium, ethically sourced ingredients to meticulous preparation rooted in authentic regional techniques. Sushi is hand-crafted with precision and discipline; ramen is slow-cooked to achieve depth, balance, and purity. The dining experience is elevated through elegant interiors inspired by classic Japanese architecture, discreet service, and an atmosphere that prioritizes calm, sophistication, and exclusivity. </p>
      <div className="flex flex-col justify-center items-start md:items-end mt-8 md:mt-0">
        <div className="flex items-center gap-4 md:gap-8 text-sm md:text-base text-[#8E8E8E]">
          <p>DESIGNER</p>
          <p>KUSHAL BYSANI | CROCO STUDIO</p>
        </div>
        <div className="flex items-center gap-4 md:gap-8 text-sm md:text-base text-[#8E8E8E]">
          <p>YEAR</p>
          <p>2026</p>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;