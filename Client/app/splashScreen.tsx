import Image from "next/image";

export default function SplashScreen() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-white">
      <h1 className="flex items-center text-4xl font-bold text-black">
        <Image
          src="/assets/logo-icon-dark.svg"
          alt="PrivGPT Studio Logo"
          width={48}
          height={48}
          className="mr-5 animate-pulse"
        />
        PrivGPT Pro
      </h1>
    </div>
  );
}
