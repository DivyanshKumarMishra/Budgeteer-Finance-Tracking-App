'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const slogans = [
  'Manage your expenses effortlessly.',
  'Plan your budget like a pro.',
  'Stay on top of your financial goals.',
  'Make smarter decisions with insights.',
];

function HeroSection() {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (charIndex < slogans[index].length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + slogans[index][charIndex]);
        setCharIndex(charIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setText('');
        setCharIndex(0);
        setIndex((prev) => (prev + 1) % slogans.length);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, index]);

  return (
    <div className="flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-between">
        {/* Text Section */}
        <div className="w-full lg:w-2/3 text-center lg:text-left space-y-6 my-5 lg:my-0 lg:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold space-y-2">
            <p className="bg-gradient-to-b from-green-400 to-green-700 bg-clip-text text-transparent">
              Plan Better.
            </p>
            <p className="bg-gradient-to-b from-green-400 to-green-700 bg-clip-text text-transparent">
              Spend Smarter.
            </p>
          </h1>
          <h2 className="text-lg md:text-2xl h-8 text-white font-semibold">
            {text}
            <span className="animate-pulse">|</span>
          </h2>
          <p className="text-muted-foreground max-w-md md:max-w-xl lg:max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            Smart budgeting made easy with Budgeteer, so you can focus on what
            matters. An AI-powered platform that helps you track, analyze and
            optimize your expenses with real-time insights.
          </p>
        </div>

        {/* Illustration Section */}
        <div className="relative w-full h-80 md:h-[70vh] lg:h-[90vh]">
          <Image
            src="/welcome.png"
            alt="Budget Illustration"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
