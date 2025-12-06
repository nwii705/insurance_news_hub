"use client";

import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { useRef } from "react";

export function HotTopicsStrip() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const hotTopics = [
    "Bảo hiểm bắt buộc ô tô – xe máy",
    "BHXH 2025",
    "Luật Kinh doanh bảo hiểm",
    "Phí bảo hiểm sức khỏe",
    "Thị trường nhân thọ",
    "Phi nhân thọ",
    "Bảo hiểm xe cơ giới",
    "Bảo hiểm cháy nổ",
    "Quy tắc điều khoản",
    "Minh bạch tư vấn",
    "Thanh tra bảo hiểm",
    "Bồi thường bảo hiểm",
  ];

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = dir === "left" ? -250 : 250;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="w-full border-t border-b bg-white py-4">
      <div className="container mx-auto px-4 flex items-center gap-4">

        {/* Icon */}
        <div className="flex items-center gap-2 text-slate-600 whitespace-nowrap">
          <TrendingUp className="w-5 h-5 text-primary" />
          <span className="font-semibold">Tiêu điểm</span>
        </div>

        {/* Scroll Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto hide-scrollbar flex gap-3"
        >
          {hotTopics.map((topic) => (
            <span
              key={topic}
              className="px-4 py-1.5 rounded-full border text-sm text-primary cursor-pointer hover:bg-blue-50 whitespace-nowrap"
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Nav buttons */}
        <button
          onClick={() => scroll("left")}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>

        <button
          onClick={() => scroll("right")}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
