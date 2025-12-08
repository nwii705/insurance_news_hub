"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// The 5 Pillars of Insurance Journalism
const NAVIGATION_PILLARS = [
  {
    name: "Vĩ mô",
    slug: "vi-mo",
    description: "Macro - Chính sách, Quy định",
    color: "text-trustBlue-500",
    subCategories: [
      {
        id: "mof-qlgsbh",
        label: "Thị trường & Pháp luật",
        href: "/vi-mo/bo-tai-chinh-qlgsbh",
      },
      {
        id: "insurance-finance",
        label: "Tài chính Bảo hiểm",
        href: "/vi-mo/tai-chinh-bao-hiem",
      },
      { id: "iav", label: "Hiệp hội Bảo hiểm (IAV)", href: "/vi-mo/iav" },
    ],
  },
  {
    name: "Thương mại",
    slug: "thuong-mai",
    description: "Commercial - Doanh nghiệp, Sản phẩm",
    color: "text-emerald-600",
    subCategories: [
      { id: "life", label: "Nhân thọ (Life)", href: "/thuong-mai/life" },
      {
        id: "nonlife",
        label: "Phi nhân thọ (Non-life)",
        href: "/thuong-mai/non-life",
      },
      {
        id: "health",
        label: "Bảo hiểm Sức khỏe (Health)",
        href: "/thuong-mai/health",
      },
    ],
  },
  {
    name: "Xã hội",
    slug: "xa-hoi",
    description: "Social - BHXH, BHYT",
    color: "text-blue-600",
    subCategories: [
      { id: "bhxh", label: "BHXH bắt buộc", href: "/xa-hoi/bhxh" },
      { id: "bhyt", label: "BHYT", href: "/xa-hoi/bhyt" },
      { id: "welfare", label: "An sinh & phúc lợi", href: "/xa-hoi/an-sinh" },
    ],
  },
  {
    name: "Tranh luận",
    slug: "tranh-luan",
    description: "Debate - Phân tích, Bình luận",
    color: "text-amber-600",
    subCategories: [
      {
        id: "case-study",
        label: "Phân tích Case Study",
        href: "/tranh-luan/case-study",
      },
      { id: "agent", label: "Góc Đại lý (Agent)", href: "/tranh-luan/agent" },
      { id: "expert", label: "Góc chuyên gia", href: "/tranh-luan/expert" },
    ],
  },
  {
    name: "Thư viện",
    slug: "thu-vien",
    description: "Library - Tài liệu, Tra cứu",
    color: "text-purple-600",
    subCategories: [
      {
        id: "legal-library",
        label: "Văn bản pháp luật",
        href: "/thu-vien/van-ban-phap-luat",
      },
      { id: "reports", label: "Báo cáo & thống kê", href: "/thu-vien/bao-cao" },
      { id: "lookup", label: "Thư viện tra cứu", href: "/thu-vien/tra-cuu" },
    ],
  },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePillarSlug, setActivePillarSlug] = useState<string | null>(null);

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

      {/* Main Header + Navigation in one row (desktop) */}
      <div className="border-b border-gray-200 bg-white">
        <nav
          onMouseLeave={() => setActivePillarSlug(null)}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between w-full gap-6">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center space-x-3 whitespace-nowrap"
              >
                <div className="w-10 h-10 bg-trustBlue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">BH</span>
                </div>
                <div className="leading-tight">
                  <h1 className="font-serif text-2xl font-bold text-trustBlue-500">
                    Insurance Vietnam
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Tin tức Bảo hiểm chuyên sâu
                  </p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <ul className="hidden md:flex items-center justify-center gap-8 flex-1 text-[15px] font-semibold">
                {NAVIGATION_PILLARS.map((pillar) => (
                  <li
                    key={pillar.slug}
                    className="relative"
                    onMouseEnter={() => setActivePillarSlug(pillar.slug)}
                  >
                    <Link
                      href={`/${pillar.slug}`}
                      className={`group inline-flex items-center gap-1 px-3 py-2 rounded-full border-b-2 transition-all ${
                        activePillarSlug === pillar.slug
                          ? "border-alertRed-500 bg-[#fff6f6] text-slate-900"
                          : "border-transparent text-slate-800 hover:border-alertRed-400 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span className="font-serif">{pillar.name}</span>
                      {pillar.subCategories?.length > 0 && (
                        <ChevronDown className="h-4 w-4 transition-transform group-hover:-rotate-180" />
                      )}
                    </Link>

                    {/* Dropdown submenu */}
                    {activePillarSlug === pillar.slug &&
                      pillar.subCategories &&
                      pillar.subCategories.length > 0 && (
                        <div className="absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 min-w-[240px] rounded-md border border-gray-200 bg-white py-3 shadow-lg">
                          <div className="px-4 pb-2 text-[11px] text-gray-500">
                            {pillar.description}
                          </div>
                          <div className="flex flex-col text-sm">
                            {pillar.subCategories.map((item) => (
                              <Link
                                key={item.id}
                                href={item.href}
                                className="flex items-center justify-between px-4 py-1.5 text-gray-800 hover:bg-slate-50 hover:text-alertRed-600"
                              >
                                <span>{item.label}</span>
                                <span aria-hidden className="text-base">
                                  ›
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                  </li>
                ))}
              </ul>

              {/* Desktop Search */}
              <form
                onSubmit={handleSearch}
                className="hidden md:flex w-64 whitespace-nowrap"
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
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 bg-trustBlue-500 hover:bg-trustBlue-600"
                  >
                    <Search className="h-4 w-4 text-white" />
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

            {/* Mobile Navigation + Search */}
            {isMenuOpen && (
              <div className="md:hidden pt-4 space-y-4">
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
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 bg-trustBlue-500 hover:bg-trustBlue-600"
                  >
                    <Search className="h-4 w-4 text-white" />
                  </Button>
                </form>

                {/* Mobile Menu Items */}
                <ul className="space-y-3">
                  {NAVIGATION_PILLARS.map((pillar) => (
                    <li key={pillar.slug}>
                      <Link
                        href={`/${pillar.slug}`}
                        className={`block px-4 py-2 font-serif font-bold ${pillar.color}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {pillar.name}
                        <span className="block text-xs text-muted-foreground font-normal">
                          {pillar.description}
                        </span>
                      </Link>

                      {pillar.subCategories &&
                        pillar.subCategories.length > 0 && (
                          <div className="mt-1 space-y-1 pl-6">
                            {pillar.subCategories.map((item) => (
                              <Link
                                key={item.id}
                                href={item.href}
                                className="block text-sm text-slate-700 hover:text-alertRed-600"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                • {item.label}
                              </Link>
                            ))}
                          </div>
                        )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
