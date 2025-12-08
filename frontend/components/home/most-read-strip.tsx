"use client";

import Image from "next/image";
import Link from "next/link";

export function MostReadStrip() {
  const mockMostRead = [
    {
      id: 1,
      category: "Vĩ mô",
      title:
        "Bộ Tài chính lấy ý kiến sửa đổi Luật Kinh doanh bảo hiểm 2025",
      date: "03/12/2025",
      image: "/placeholder-news.jpg",
    },
    {
      id: 2,
      category: "Thị trường",
      title:
        "Doanh thu phí bảo hiểm nhân thọ tăng 12,3% sau 9 tháng",
      date: "02/12/2025",
      image: "/placeholder-news.jpg",
    },
    {
      id: 3,
      category: "BHXH",
      title:
        "Từ 2026, lương hưu tối thiểu dự kiến tăng theo lộ trình",
      date: "01/12/2025",
      image: "/placeholder-news.jpg",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          🔥 Đọc nhiều nhất 24 giờ qua
        </h3>
        <button className="text-sm text-primary hover:underline">
          Xem tất cả
        </button>
      </div>

      {/* List */}
      <ul className="divide-y divide-slate-100">
        {mockMostRead.map((item, index) => (
          <li key={item.id}>
            <Link
              href="/articles"
              className="flex gap-4 px-4 py-3 items-center group hover:bg-softGray-50 transition-colors"
            >
              {/* RANK #1 #2 #3 */}
              <div className="w-8 text-center flex-shrink-0">
                <span className="block font-extrabold text-red-600 text-xl leading-none">
                  #{index + 1}
                </span>
              </div>

              {/* Thumbnail */}
              <div className="w-24 h-16 md:w-28 md:h-20 relative rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Text */}
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-trustBlue-600">
                    {item.category}
                  </span>
                  •
                  <span>{item.date}</span>
                </div>

                <p className="text-sm text-slate-800 group-hover:text-trustBlue-700 line-clamp-2">
                  {item.title}
                </p>
              </div>

              {/* Arrow */}
              <span className="text-slate-400 text-xs group-hover:text-trustBlue-600 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
