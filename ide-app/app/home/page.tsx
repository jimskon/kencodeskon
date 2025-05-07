"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Intro() {
  const router = useRouter();
  const features = [
    {
      title: "Build & Test",
      description:
        "Get work done quicker by building out entire projects or isolating code to test features and animations.",
      link: "/editor/multiple",
    },
    {
      title: "Learn & Discover",
      description:
        "Upgrade your skills and get noticed! Join coding challenges and have a chance to be featured.",
        
      link: "https://open.kattis.com/",
    },
    {
      title: "Explore Trending",
      description:
        "Get to know what is happening in the world of coding.",

      link: "https://www.bbc.com/news/topics/cndrem6wvwlt",
    },
  ];

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      {/* Hero Section with Pop-in Effect */}
      <div className="mt-32 mb-8 text-center">
        <h1 className="text-5xl font-black mb-2 animate-bold-pop-in text-purple-700 drop-shadow-lg">
          Welcome to KenCode
        </h1>
        <p className="text-lg font-semibold text-gray-900 leading-relaxed max-w-xl mx-auto mb-8">
  The best place for Kenyon College students to build, test, and discover code.
  Join a vibrant community of front-end designers and developers. Build projects, test features, and find inspiration!
</p>

        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl text-xl font-extrabold shadow-lg transition"
          onClick={() => router.push("/editor/single")}
        >
          Start Coding
        </button>
      </div>

      {/* Features Dropdown */}
      {/* Features Dropdown */}
<div className="relative mb-16">
  <button
    className="bg-white border border-gray-300 px-6 py-2 rounded-lg shadow hover:bg-black-100 font-bold"
    onClick={() => setDropdownOpen((open) => !open)}
  >
    Features ▼
  </button>
  {dropdownOpen && (
    <div className="absolute left-0 mt-2 w-72 bg-black border border-black-200 rounded-lg shadow-lg z-10">
      {features.map((feature) => (
        <a
          key={feature.title}
          href={feature.link}
          target={feature.link.startsWith("http") ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className="block px-5 py-4 hover:bg-blue-50 transition"
        >
          <div className="font-extrabold text-base">{feature.title}</div>
          <div className="text-sm font-bold text-black-800">{feature.description}</div>
        </a>
      ))}
    </div>
  )}
</div>

      {/* Inspiration Section */}
      <div className="mt-auto mb-10 text-center text-gray-500">
        <h2 className="text-2xl font-extrabold mb-2 text-gray-700">Develop your coding skills</h2>
        <p className="font-bold">Made with ❤️ for Kenyon College students.</p>
      </div>

      {/* Pop-in and bold animation style */}
      <style jsx>{`
        .animate-bold-pop-in {
          animation: bold-pop-in 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes bold-pop-in {
          0% {
            opacity: 0;
            transform: scale(0.7);
            text-shadow: 0 0 0rgb(56, 52, 69);
          }
          60% {
            opacity: 1;
            transform: scale(1.08);
            text-shadow: 0 4px 24pxrgba(86, 76, 118, 0.4);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            text-shadow: 0 2px 8px #a78bfa44;
          }
        }
      `}</style>
    </div>
  );
}
