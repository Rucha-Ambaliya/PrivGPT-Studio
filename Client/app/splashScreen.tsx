import { Zap } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from '@/components/theme-provider';

export default function SplashScreen() {
  const { darkMode } = useTheme();

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-white">
      <Image
        src={darkMode ? '/logos/logo-dark.svg' : '/logos/logo-light.svg'}
        alt="PrivGPT Studio Logo"
        width={290}
        height={53}
        priority
        className="w-[240px] h-auto"
      />
    </div>
  );
}
