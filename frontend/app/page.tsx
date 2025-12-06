import { FeaturedHeroSection } from "@/components/home/featured-hero-section";
import { LifeVsNonLifeTabs } from "@/components/home/life-vs-nonlife-tabs";
import { SocialSecurityGrid } from "@/components/home/social-security-grid";
import { MarketDataWidget } from "@/components/home/market-data-widget";
import { HotTopicsStrip } from "@/components/home/hot-topics-strip";
import { MostReadStrip } from "@/components/home/most-read-strip";

// -----------------------------
// SUB-COMPONENT: Utilities Grid
// -----------------------------
function UtilitiesGrid() {
  const utilities = [
    {
      icon: "🏥",
      title: "Bệnh viện bảo lãnh",
      desc: "Danh sách bệnh viện chấp nhận bảo lãnh viện phí.",
    },
    {
      icon: "🚗",
      title: "Garage liên kết",
      desc: "Tra cứu garage sửa chữa ô tô liên kết.",
    },
    {
      icon: "📄",
      title: "Biểu mẫu & đơn từ",
      desc: "Tải mẫu đơn bồi thường – hủy hợp đồng – tái tục.",
    },
    {
      icon: "⚖️",
      title: "Quy tắc điều khoản",
      desc: "Tra cứu điều khoản sản phẩm bảo hiểm.",
    },
  ];

  return (
    <section>
      <h3 className="font-serif text-2xl font-bold text-trustBlue-500 mb-4">
        Tiện ích tra cứu
      </h3>

      <div className="grid gap-4 md:grid-cols-4">
        {utilities.map((item) => (
          <div
            key={item.title}
            className="bg-softGray-50 border border-softGray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <h4 className="font-semibold text-slate-800 mb-1">
              {item.title}
            </h4>
            <p className="text-sm text-slate-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}


// -----------------------------
// PAGE START
// -----------------------------
export default function HomePage() {
  return (
    <div className="bg-softGray-100 min-h-screen">

      {/* BREAKING BAR */}
      <div className="w-full bg-red-600 text-white text-sm">
        <div className="container mx-auto px-4 py-2">
          🚨 Bộ Tài chính thanh tra 4 doanh nghiệp bảo hiểm về hoa hồng
        </div>
      </div>

      {/* HERO + Latest */}
      <section className="container mx-auto px-4 py-8 space-y-8">
        <FeaturedHeroSection />
        <HotTopicsStrip />
        <MostReadStrip />
      </section>

      {/* LIFE / NON-LIFE */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="font-serif text-3xl font-bold text-trustBlue-500 mb-6">
          Bảo hiểm Nhân thọ & Phi nhân thọ
        </h2>
        <LifeVsNonLifeTabs />
      </section>

      {/* SOCIAL SECURITY */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 space-y-8">
          <div>
            <h2 className="font-serif text-3xl font-bold text-trustBlue-500 mb-2">
              Bảo hiểm Xã hội & Phúc lợi
            </h2>

            <SocialSecurityGrid />
          </div>

          <UtilitiesGrid />
        </div>
      </section>

      {/* DATA */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-serif text-3xl font-bold text-trustBlue-500 mb-6">
          Phân tích thị trường
        </h2>
        <MarketDataWidget />
      </section>
    </div>
  );
}
