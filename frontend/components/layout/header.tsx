"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// The 5 Pillars of Insurance Journalism
const NAVIGATION_PILLARS = [
  {
    name: "Vĩ mô",
    slug: "vi-mo",
    description: "Macro - Chính sách, Quy định",
    color: "text-trustBlue-500",
  },
  {
    name: "Thương mại",
    slug: "thuong-mai",
    description: "Commercial - Doanh nghiệp, Sản phẩm",
    color: "text-emerald-600",
  },
  {
    name: "Xã hội",
    slug: "xa-hoi",
    description: "Social - BHXH, BHYT",
    color: "text-blue-600",
  },
  {
    name: "Tranh luận",
    slug: "tranh-luan",
    description: "Debate - Phân tích, Bình luận",
    color: "text-amber-600",
  },
  {
    name: "Thư viện",
    slug: "thu-vien",
    description: "Library - Tài liệu, Tra cứu",
    color: "text-purple-600",
  },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky-nav">
      {/* Top Bar - Alert/Breaking News */}
      <div className="bg-alertRed-500 text-white py-1 px-4">
        <div className="container mx-auto flex items-center justify-between text-sm">
          <span className="font-bold">🔴 KHẨN CẤP</span>
          <span className="hidden md:block">
            Bộ Tài chính thanh tra 4 doanh nghiệp bảo hiểm về hoa hồng
          </span>
          <Link href="/urgent" className="underline hover:no-underline">
            Xem chi tiết →
          </Link>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-trustBlue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">BH</span>
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold text-trustBlue-500">
                  Insurance Vietnam
                </h1>
                <p className="text-xs text-muted-foreground">
                  Tin tức Bảo hiểm chuyên sâu
                </p>
              </div>
            </Link>

            {/* Desktop Search */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md mx-8"
            >
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Tìm kiếm tin tức, pháp luật..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation - 5 Pillars */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center justify-center space-x-8 py-4">
            {NAVIGATION_PILLARS.map((pillar) => (
              <li key={pillar.slug}>
                <Link
                  href={`/${pillar.slug}`}
                  className="group flex flex-col items-center"
                >
                  <span
                    className={`font-serif text-lg font-bold ${pillar.color} group-hover:underline`}
                  >
                    {pillar.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {pillar.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              {/* Mobile Menu Items */}
              <ul className="space-y-2">
                {NAVIGATION_PILLARS.map((pillar) => (
                  <li key={pillar.slug}>
                    <Link
                      href={`/${pillar.slug}`}
                      className={`block py-2 px-4 rounded-md hover:bg-gray-100 ${pillar.color} font-serif font-bold`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {pillar.name}
                      <span className="block text-xs text-muted-foreground font-normal">
                        {pillar.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
