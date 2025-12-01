import { FeaturedHeroSection } from "@/components/home/featured-hero-section";
import { LifeVsNonLifeTabs } from "@/components/home/life-vs-nonlife-tabs";
import { SocialSecurityGrid } from "@/components/home/social-security-grid";
import { MarketDataWidget } from "@/components/home/market-data-widget";

export default async function Home() {
  return (
    <div className="bg-softGray-100 min-h-screen">
      {/* Section A: Featured & Urgent (Hero Section) */}
      <section className="container mx-auto px-4 py-8">
        <FeaturedHeroSection />
      </section>

      {/* Section B: Life vs Non-Life (Tabs) */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="font-serif text-3xl font-bold text-trustBlue-500 mb-6">
          Bảo hiểm Nhân thọ & Phi nhân thọ
        </h2>
        <LifeVsNonLifeTabs />
      </section>

      {/* Section C: Social Security & Welfare (SEO Magnet) */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-trustBlue-500 mb-2">
            Bảo hiểm Xã hội & Phúc lợi
          </h2>
          <p className="text-muted-foreground mb-6">
            Hướng dẫn chi tiết về BHXH, BHYT - Tra cứu nhanh & Thủ tục đơn giản
          </p>
          <SocialSecurityGrid />
        </div>
      </section>

      {/* Section D: Data Visualization Widget */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-serif text-3xl font-bold text-trustBlue-500 mb-6">
          Phân tích thị trường
        </h2>
        <MarketDataWidget />
      </section>
    </div>
  );
}
