"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface FeaturedArticle {
  id: string;
  title: string;
  summary: string;
  featuredImageUrl: string;
  slug: string;
  publishedAt: string;
  category: string;
}

interface LegalUpdate {
  id: string;
  docNumber: string;
  title: string;
  docType: string;
  issueDate: string;
  status: string;
}

const FALLBACK_FEATURED: FeaturedArticle = {
  id: "fallback",
  title: "Bộ Tài chính lấy ý kiến sửa đổi Luật Kinh doanh bảo hiểm 2025",
  summary:
    "Dự thảo Luật mới dự kiến siết chặt quy định tư vấn, minh bạch thông tin sản phẩm và tăng chế tài xử phạt với hành vi bán sai cam kết.",
  featuredImageUrl: "/placeholder-news.jpg",
  slug: "du-thao-luat-kinh-doanh-bao-hiem-2025",
  publishedAt: "2025-12-03T00:00:00.000Z",
  category: "Vĩ mô",
};

const PILLAR_STORIES = [
  {
    id: 1,
    pillar: "Thương mại",
    label: "Bảo hiểm doanh nghiệp",
    title: "Doanh nghiệp FDI đẩy mạnh mua bảo hiểm sức khỏe cho nhân viên",
    summary:
      "Nhiều tập đoàn nước ngoài xem bảo hiểm sức khỏe là phúc lợi bắt buộc để giữ chân nhân sự chủ chốt.",
    href: "/articles",
  },
  {
    id: 2,
    pillar: "Xã hội",
    label: "BHXH & An sinh",
    title:
      "Dự thảo tăng lương hưu tối thiểu từ năm 2026: Những nhóm được hưởng lợi",
    summary:
      "Người lao động đóng BHXH dài năm, lao động nữ và nhóm về hưu trước tuổi là các đối tượng được quan tâm.",
    href: "/articles",
  },
  {
    id: 3,
    pillar: "Tranh luận",
    label: "Góc nhìn thị trường",
    title:
      "Có nên mua bảo hiểm nhân thọ chỉ để đầu tư? Chuyên gia lên tiếng",
    summary:
      "Các chuyên gia nhấn mạnh vai trò bảo vệ rủi ro thay vì kỳ vọng lợi nhuận như chứng khoán hay bất động sản.",
    href: "/articles",
  },
];


export function FeaturedHeroSection() {
  const [featuredArticle, setFeaturedArticle] =
    useState<FeaturedArticle | null>(null);
  const [legalUpdates, setLegalUpdates] = useState<LegalUpdate[]>([]);

  useEffect(() => {
    // Featured article (có thì dùng, không thì fallback)
    fetch("/api/articles?featured=true&limit=1")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.[0]) setFeaturedArticle(data.data[0]);
      })
      .catch(() => {
        // im lặng, dùng fallback
      });

    // Legal updates
    fetch("/api/legal-docs?limit=5&sort=-issue_date")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) setLegalUpdates(data.data);
      })
      .catch(() => {
        // nếu fail thì để mảng rỗng -> hiện skeleton
      });
  }, []);

  const main = featuredArticle ?? FALLBACK_FEATURED;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT: khung xám bự = featured + 3 tin nhỏ */}
      <div className="lg:col-span-2">
        <div className="bg-softGray-50 rounded-3xl border border-softGray-200 shadow-sm p-4 md:p-6 lg:p-8 h-full flex flex-col gap-6">
          {/* Khu vực tin nổi bật (ảnh + text) */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* Ảnh bên trái */}
            <Link
              href={`/articles/${main.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-slate-300 aspect-video sm:aspect-[16/11]"
            >
              <Image
                src={main.featuredImageUrl || "/placeholder-news.jpg"}
                alt={main.title}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Tiêu đề overlay dưới ảnh (mobile vẫn đọc được) */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="text-xs text-blue-100 mb-1">{main.category}</p>
                <p className="text-sm font-semibold line-clamp-2">
                  {main.title}
                </p>
              </div>
            </Link>

            {/* Text bên phải */}
            <div className="flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-softGray-200 font-semibold text-trustBlue-700">
                    {main.category || "Tin tức"}
                  </span>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="h-3 w-3" />
                    <time>
                      {new Date(main.publishedAt).toLocaleDateString("vi-VN")}
                    </time>
                  </div>
                </div>

                <Link
                  href={`/articles/${main.slug}`}
                  className="block group"
                >
                  <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 group-hover:text-trustBlue-700 leading-snug">
                    {main.title}
                  </h2>
                  <p className="mt-3 text-sm md:text-base text-slate-700 line-clamp-3">
                    {main.summary}
                  </p>
                </Link>
              </div>

              <div className="text-xs text-slate-500">
                Cập nhật từ Bộ Tài chính • Nguồn: tổng hợp từ các báo kinh tế
              </div>
            </div>
          </div>

          {/* 3 tin nhỏ phía dưới – vẫn trong cùng khung xám */}
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {PILLAR_STORIES.map((story) => (
              <Link
                key={story.id}
                href={story.href}
                className="bg-white rounded-2xl border border-softGray-200 px-4 py-3 flex flex-col gap-2
                          hover:border-trustBlue-200 hover:shadow-sm hover:-translate-y-[1px]
                          transition-all duration-150 cursor-pointer"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-trustBlue-700">
                    {story.pillar}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">{story.label}</span>
                </div>

                <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-3">
                  {story.title}
                </h3>

                <p className="text-xs md:text-sm text-slate-600 line-clamp-3">
                  {story.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Card Cập nhật Pháp luật */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-3xl border-2 border-trustBlue-500 h-full flex flex-col overflow-hidden">
          <div className="bg-trustBlue-500 text-white p-4">
            <h3 className="font-serif text-xl font-bold">
              📜 Cập nhật Pháp luật
            </h3>
            <p className="text-sm text-blue-100">Từ Thư viện Pháp luật</p>
          </div>

          <div className="max-h-[450px] overflow-y-auto flex-1">
            {legalUpdates.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {legalUpdates.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/legal-docs/${doc.docNumber}`}
                    className="block p-4 hover:bg-softGray-100 transition-colors"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                          doc.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {doc.status === "active"
                          ? "Còn hiệu lực"
                          : "Hết hiệu lực"}
                      </span>
                      <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                        {doc.docType}
                      </span>
                    </div>

                    <div className="mb-1">
                      <span className="font-mono text-sm font-bold text-trustBlue-600">
                        {doc.docNumber}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                      {doc.title}
                    </h4>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {new Date(doc.issueDate).toLocaleDateString("vi-VN")}
                      </span>
                      <span className="text-trustBlue-600 hover:underline">
                        Xem chi tiết →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <Link
              href="/thu-vien"
              className="block text-center text-trustBlue-600 hover:text-trustBlue-700 font-semibold text-sm hover:underline"
            >
              Xem toàn bộ Thư viện Pháp luật →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
