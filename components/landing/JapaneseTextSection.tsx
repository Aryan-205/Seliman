import React from "react";
import LogoIcon from "../icons/LogoIcon";

const JapaneseTextSection = () => {
    return (
        <div className="h-screen w-full flex justify-center items-center">
          <div className="max-w-7xl h-full flex justify-center items-center gap-12">
            <h1 className="text-center text-3xl leading-[45px]">「オレンチ」は、日本の食文化が誇る伝統と、現代のラグジュアリー体験を融合させた上質な寿司・ラーメンレストランです。厳選された食材を使用し、職人の技術と精神を受け継いだ丁寧な調理によって、本物の味わいを提供します。寿司は一貫ごとに繊細な技と温度管理を徹底し、ラーメンは旨味を最大限に引き出すために時間をかけて仕上げています。店内は伝統建築の要素を洗練されたデザインで再構築し、落ち着きと品格を兼ね備えた空間を演出。オレンチは、美食家の期待を超える“本物の日本”を届ける特別な場所として、唯一無二の体験をお客様へお届けします。</h1>
            <LogoIcon/>
          </div>
        </div>
    );
};

export default JapaneseTextSection;