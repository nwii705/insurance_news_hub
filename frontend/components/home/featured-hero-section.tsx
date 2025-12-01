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

export function FeaturedHeroSection() {
  const [featuredArticle, setFeaturedArticle] = useState<FeaturedArticle | null>(null);
  const [legalUpdates, setLegalUpdates] = useState<LegalUpdate[]>([]);

  useEffect(() => {
    // Fetch featured article
    fetch("/api/articles?featured=true&limit=1")
      .then((res) => res.json())
      .then((data) => setFeaturedArticle(data.data[0]))
      .catch(console.error);

    // Fetch legal updates
    fetch("/api/legal-docs?limit=5&sort=-issue_date")
      .then((res) => res.json())
      .then((data) => setLegalUpdates(data.data))
      .catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 70% - Big Featured Story */}
      <div className="lg:col-span-2">
        <div className="magazine-card h-full">
          {featuredArticle ? (
            <Link href={`/articles/${featuredArticle.slug}`}>
              <div className="relative h-[400px] md:h-[500px]">
                <Image
                  src={featuredArticle.featuredImageUrl || "/placeholder-news.jpg"}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Urgent Badge */}
                <div className="absolute top-4 left-4">
                  <span className="urgent-banner flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    TIÊU ĐIỂM
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <div className="mb-2">
                    <span className="inline-block bg-trustBlue-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
                      {featuredArticle.category || "Tin tức"}
                    </span>
                  </div>
                  
                  <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
                    {featuredArticle.title}
                  </h2>
                  
                  <p className="text-lg md:text-xl text-gray-200 mb-4 line-clamp-2">
                    {featuredArticle.summary}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <time>{new Date(featuredArticle.publishedAt).toLocaleDateString("vi-VN")}</time>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="h-[400px] md:h-[500px] bg-gray-200 animate-pulse" />
          )}
        </div>
      </div>

      {/* Right 30% - Legal Update Feed (Scrolling Ticker) */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg border-2 border-trustBlue-500 h-full">
          <div className="bg-trustBlue-500 text-white p-4">
            <h3 className="font-serif text-xl font-bold">📜 Cập nhật Pháp luật</h3>
            <p className="text-sm text-blue-100">Từ Thư viện Pháp luật</p>
          </div>
          
          <div className="max-h-[450px] overflow-y-auto">
            {legalUpdates.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {legalUpdates.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/legal-docs/${doc.docNumber}`}
                    className="block p-4 hover:bg-softGray-100 transition-colors"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                        doc.status === "active" 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {doc.status === "active" ? "Còn hiệu lực" : "Hết hiệu lực"}
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
                      <span>{new Date(doc.issueDate).toLocaleDateString("vi-VN")}</span>
                      <span className="text-trustBlue-600 hover:underline">Xem chi tiết →</span>
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
