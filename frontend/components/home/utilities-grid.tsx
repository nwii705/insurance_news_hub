// components/home/utilities-grid.tsx
const utilities = [
  {
    icon: "🏥",
    title: "Bệnh viện bảo lãnh",
    desc: "Tra cứu nhanh danh sách bệnh viện, phòng khám chấp nhận bảo lãnh viện phí.",
  },
  {
    icon: "🚗",
    title: "Garage liên kết",
    desc: "Danh sách garage sửa chữa ô tô liên kết với các hãng bảo hiểm.",
  },
  {
    icon: "📄",
    title: "Biểu mẫu & đơn từ",
    desc: "Tải mẫu đơn yêu cầu bồi thường, hủy hợp đồng, khôi phục hiệu lực.",
  },
  {
    icon: "⚖️",
    title: "Quy tắc điều khoản",
    desc: "Tra cứu quy tắc, điều khoản sản phẩm bảo hiểm phổ biến.",
  },
];

export function UtilitiesGrid() {
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
            <p className="text-sm text-slate-600">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
