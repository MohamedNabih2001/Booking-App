import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <div className="w-full h-screen text-white dark:text-black flex flex-col items-center justify-center gap-9 bg-[url('/home/bgHeroSec.png')] bg-cover bg-center">
      <div className="w-full flex flex-col gap-2 items-center justify-center">
        <h1 className="font-special text-2xl md:text-5xl  font-bold uppercase">
          Wild Cabins
        </h1>
        <h2 className="font-special text-lg md:text-3xl font-bold uppercase">
          Booking Cabin
        </h2>
      </div>
      <Link
        to="/cabins"
        className="font-special text-sm md:text-xl p-2 rounded-2xl hover:scale-110 animation bg-orange-800 hover:bg-orange-600 font-bold capitalize"
      >
        Discover all cabins
      </Link>
    </div>
  );
}

export default HeroSection;
