import React from 'react'
import HeroText from '../icons/HeroText'

const Herosection = () => {
  return (
    <div 
      className='h-screen w-full flex justify-center items-center bg-black'
      style={{
        backgroundImage: "url('/KissoJapaneseRestaurantatTheWestinGrandeSukhumvit1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      >
      <HeroText />
    </div>
  )
}

export default Herosection