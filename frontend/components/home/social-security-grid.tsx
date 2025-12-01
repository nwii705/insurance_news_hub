"use client";

import Link from "next/link";
import { FileText, Building2, Car, FileSearch, ArrowRight } from "lucide-react";

interface GuideCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  views: number;
}

const GUIDES: GuideCard[] = [
  {
    id: "1",
    title: "Cách rút BHXH 1 lần",
    description: "Hướng dẫn chi tiết thủ tục rút bảo hiểm xã hội một lần theo quy định mới nhất",
    icon: <FileText className="h-8 w-8" />,
    href: "/guides/rut-bhxh-1-lan",
    color: "bg-blue-500",
    views: 15420,
  },
  {
    id: "2",
    title: "Tra cứu BHYT online",
    description: "Kiểm tra thẻ bảo hiểm y tế còn hiệu lực hay không qua mạng",
    icon: <FileSearch className="h-8 w-8" />,
    href: "/guides/tra-cuu-bhyt",
    color: "bg-emerald-500",
    views: 23150,
  },
  {
    id: "3",
    title: "Danh sách bệnh viện bảo lãnh",
    description: "1.200+ bệnh viện liên kết bảo lãnh viện phí trực tiếp",
    icon: <Building2 className="h-8 w-8" />,
    href: "/thu-vien?filter=hospitals",
    color: "bg-red-500",
    views: 31200,
  },
  {
    id: "4",
    title: "Garage liên kết bảo hiểm xe",
    description: "Mạng lưới sửa chữa xe ô tô được bảo hiểm bảo lãnh chi phí",
    icon: <Car className="h-8 w-8" />,
    href: "/thu-vien?filter=garages",
    color: "bg-amber-500",
    views: 18900,
  },
  {
    id: "5",
    title: "Tính phí BHXH tự nguyện",
    description: "Công cụ tính toán mức đóng bảo hiểm xã hội tự nguyện theo thu nhập",
    icon: <FileText className="h-8 w-8" />,
    href: "/tools/tinh-phi-bhxh",
    color: "bg-purple-500",
    views: 12300,
  },
  {
    id: "6",
    title: "Biểu mẫu bảo hiểm",
    description: "Tải về các mẫu đơn, hợp đồng bảo hiểm thông dụng",
    icon: <FileSearch className="h-8 w-8" />,
    href: "/thu-vien?filter=forms",
    color: "bg-indigo-500",
    views: 9870,
  },
];

export function SocialSecurityGrid() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GUIDES.map((guide) => (
          <Link
            key={guide.id}
            href={guide.href}
            className="group magazine-card border-2 border-transparent hover:border-trustBlue-300"
          >
            <div className="p-6">
              {/* Icon with colored background */}
              <div className={`${guide.color} w-16 h-16 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {guide.icon}
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl font-bold text-trustBlue-500 mb-2 group-hover:text-trustBlue-600 transition-colors">
                {guide.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {guide.description}
              </p>

              {/* Stats & CTA */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  👁️ {guide.views.toLocaleString("vi-VN")} lượt xem
                </div>
                <div className="text-trustBlue-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Xem hướng dẫn
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* SEO-Rich Footer */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-serif text-lg font-bold text-trustBlue-500 mb-3">
          📚 Tìm hiểu thêm về Bảo hiểm Xã hội & Y tế
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <Link href="/guides/bhxh" className="text-trustBlue-600 hover:underline">
            → Bảo hiểm xã hội bắt buộc
          </Link>
          <Link href="/guides/bhyt" className="text-trustBlue-600 hover:underline">
            → Bảo hiểm y tế toàn dân
          </Link>
          <Link href="/guides/bhtn" className="text-trustBlue-600 hover:underline">
            → Bảo hiểm thất nghiệp
          </Link>
          <Link href="/guides/bhxh-tu-nguyen" className="text-trustBlue-600 hover:underline">
            → BHXH tự nguyện
          </Link>
          <Link href="/guides/che-do-huu" className="text-trustBlue-600 hover:underline">
            → Chế độ hưu trí
          </Link>
          <Link href="/guides/truy-thu-bhxh" className="text-trustBlue-600 hover:underline">
            → Truy thu BHXH
          </Link>
          <Link href="/guides/cap-so-bhxh" className="text-trustBlue-600 hover:underline">
            → Cấp số BHXH mới
          </Link>
          <Link href="/guides/tra-cuu-so-bhxh" className="text-trustBlue-600 hover:underline">
            → Tra cứu mã số BHXH
          </Link>
        </div>
      </div>
    </div>
  );
}
