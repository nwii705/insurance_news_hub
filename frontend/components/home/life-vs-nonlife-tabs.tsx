"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Building2, Users } from "lucide-react";

interface Product {
  id: string;
  title: string;
  company: string;
  type: "life" | "non-life";
  summary: string;
  imageUrl?: string;
  publishedAt: string;
}

const LIFE_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Manulife ra mắt sản phẩm bảo hiểm liên kết đầu tư ManuInvest Pro",
    company: "Manulife",
    type: "life",
    summary: "Sản phẩm kết hợp bảo vệ và đầu tư với lợi nhuận kỳ vọng 8-10%/năm",
    publishedAt: "2024-11-28",
  },
  {
    id: "2",
    title: "Bảo Việt Nhân thọ: Doanh thu phí tăng 25% trong quý 3",
    company: "Bảo Việt",
    type: "life",
    summary: "Đạt 15.000 tỷ đồng doanh thu, tăng trưởng mạnh ở kênh bancassurance",
    publishedAt: "2024-11-27",
  },
  {
    id: "3",
    title: "Prudential giới thiệu bảo hiểm ung thư giai đoạn sớm",
    company: "Prudential",
    type: "life",
    summary: "Chi trả lên đến 500 triệu đồng khi phát hiện ung thư giai đoạn 1-2",
    publishedAt: "2024-11-26",
  },
];

const NON_LIFE_PRODUCTS: Product[] = [
  {
    id: "4",
    title: "PVI ra mắt bảo hiểm xe điện với ưu đãi phí 20%",
    company: "PVI",
    type: "non-life",
    summary: "Bảo hiểm chuyên biệt cho xe điện, bao gồm pin và sạc",
    publishedAt: "2024-11-28",
  },
  {
    id: "5",
    title: "Bảo Minh: Tỷ lệ bồi thường bảo hiểm nông nghiệp đạt 85%",
    company: "Bảo Minh",
    type: "non-life",
    summary: "Chi trả 230 tỷ đồng cho nông dân sau bão số 12",
    publishedAt: "2024-11-27",
  },
  {
    id: "6",
    title: "VNI tăng giá bảo hiểm cháy nổ bắt buộc lên 15%",
    company: "VNI",
    type: "non-life",
    summary: "Điều chỉnh phí do chi phí bồi thường tăng cao",
    publishedAt: "2024-11-26",
  },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="magazine-card">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-md text-sm font-semibold">
            {product.company}
          </span>
          <time className="text-xs text-muted-foreground">
            {new Date(product.publishedAt).toLocaleDateString("vi-VN")}
          </time>
        </div>
        
        <h3 className="font-serif text-xl font-bold text-trustBlue-500 mb-3 line-clamp-2 hover:text-trustBlue-600 transition-colors">
          <Link href={`/articles/${product.id}`}>{product.title}</Link>
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {product.summary}
        </p>
        
        <Link
          href={`/articles/${product.id}`}
          className="text-trustBlue-600 hover:text-trustBlue-700 font-semibold text-sm hover:underline inline-flex items-center gap-1"
        >
          Đọc thêm
          <TrendingUp className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export function LifeVsNonLifeTabs() {
  const [activeTab, setActiveTab] = useState<"life" | "non-life">("life");

  return (
    <Tabs defaultValue="life" className="w-full" onValueChange={(v) => setActiveTab(v as any)}>
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
        <TabsTrigger value="life" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="font-serif font-bold">Nhân thọ</span>
        </TabsTrigger>
        <TabsTrigger value="non-life" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <span className="font-serif font-bold">Phi nhân thọ</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="life">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LIFE_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link
            href="/thuong-mai?type=life"
            className="inline-flex items-center gap-2 text-trustBlue-600 hover:text-trustBlue-700 font-semibold hover:underline"
          >
            Xem tất cả sản phẩm Nhân thọ
            <TrendingUp className="h-4 w-4" />
          </Link>
        </div>
      </TabsContent>

      <TabsContent value="non-life">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NON_LIFE_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link
            href="/thuong-mai?type=non-life"
            className="inline-flex items-center gap-2 text-trustBlue-600 hover:text-trustBlue-700 font-semibold hover:underline"
          >
            Xem tất cả sản phẩm Phi nhân thọ
            <TrendingUp className="h-4 w-4" />
          </Link>
        </div>
      </TabsContent>
    </Tabs>
  );
}
