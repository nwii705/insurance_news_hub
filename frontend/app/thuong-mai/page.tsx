import Link from "next/link";

type Article = {
  id: string;
  title: string;
  summary?: string;
  tag?: string;
  time?: string;
  imageUrl?: string;
};

// Bài hero (lớn nhất) cho Thương mại
const FEATURED_ARTICLE: Article = {
  id: "feat-1",
  title:
    "Thị trường bảo hiểm thương mại xuất hiện loạt sản phẩm mới cho khách hàng cá nhân",
  summary:
    "Các doanh nghiệp đẩy mạnh cải tiến sản phẩm nhân thọ, phi nhân thọ và sức khỏe nhằm đáp ứng nhu cầu bảo vệ và đầu tư dài hạn.",
  tag: "Thương mại",
  time: "Cập nhật 3 giờ trước",
};

// 3 bài nhỏ phía dưới hero
const SECONDARY_ARTICLES: Article[] = [
  {
    id: "sec-1",
    title: "Cuộc đua nâng quyền lợi bảo hiểm sức khỏe giữa các hãng lớn",
    summary:
      "Quyền lợi khám chữa bệnh tại bệnh viện quốc tế, chi trả nhanh và dịch vụ chăm sóc khách hàng 24/7 trở thành yếu tố cạnh tranh chính.",
  },
  {
    id: "sec-2",
    title: "Bảo hiểm xe cơ giới bổ sung nhiều tiện ích gia tăng",
    summary:
      "Ngoài bồi thường tai nạn, nhiều gói mới bổ sung cứu hộ 24/7, hỗ trợ sửa chữa lưu động và bảo vệ phụ kiện.",
  },
  {
    id: "sec-3",
    title: "Sản phẩm bảo hiểm liên kết đầu tư được tái thiết kế sau giai đoạn siết chặt",
    summary:
      "Doanh nghiệp tập trung đơn giản hóa điều khoản, minh bạch thông tin và tăng phần bảo vệ thuần.",
  },
];

// Nhóm Nhân thọ (Life)
const LIFE_NEWS: Article[] = [
  {
    id: "life-1",
    title:
      "Doanh thu khai thác mới bảo hiểm nhân thọ phục hồi sau giai đoạn suy giảm",
    summary:
      "Các doanh nghiệp nhân thọ ghi nhận tăng trưởng trở lại nhờ điều chỉnh sản phẩm và nâng chất lượng tư vấn.",
  },
  {
    id: "life-2",
    title:
      "Khách hàng trẻ tăng mua sản phẩm bảo hiểm liên kết chung và liên kết đơn vị",
    summary:
      "Nhóm khách hàng 25–35 tuổi chú trọng tích lũy dài hạn, bảo vệ thu nhập và linh hoạt rút tiền khi cần.",
  },
  {
    id: "life-3",
    title:
      "Doanh nghiệp nhân thọ đẩy mạnh chuyển đổi số trong quy trình thẩm định",
    summary:
      "Ứng dụng eKYC và phân tích dữ liệu giúp rút ngắn thời gian phát hành hợp đồng và giảm sai sót giấy tờ.",
  },
];

// Nhóm Phi nhân thọ (Non-life)
const NONLIFE_NEWS: Article[] = [
  {
    id: "non-1",
    title: "Thị trường bảo hiểm xe cơ giới tăng trưởng nhờ nhu cầu mua mới",
    summary:
      "Các hãng ghi nhận mức tăng doanh thu 8–12% nhờ thị trường ô tô phục hồi và cải thiện dịch vụ bồi thường.",
  },
  {
    id: "non-2",
    title: "Bảo hiểm tài sản doanh nghiệp tăng tốc cùng làn sóng mở rộng nhà máy",
    summary:
      "Khối doanh nghiệp sản xuất, đặc biệt ngành công nghiệp nặng, tăng nhu cầu bảo vệ tài sản, hàng hóa và gián đoạn kinh doanh.",
  },
  {
    id: "non-3",
    title:
      "Các hãng phi nhân thọ đẩy mạnh hợp tác ngân hàng – doanh nghiệp (bancassurance)",
    summary:
      "Kênh phân phối qua ngân hàng giúp tiếp cận tốt hơn nhóm khách hàng doanh nghiệp vừa và nhỏ với nhu cầu bảo hiểm tổng thể.",
  },
];

// Nhóm Bảo hiểm Sức khỏe (Health)
const HEALTH_NEWS: Article[] = [
  {
    id: "health-1",
    title:
      "Nhu cầu bảo hiểm sức khỏe tăng mạnh trước áp lực chi phí y tế",
    summary:
      "Khách hàng quan tâm nhiều hơn đến quyền lợi nội trú, ngoại trú và chi trả cho bệnh lý nghiêm trọng.",
  },
  {
    id: "health-2",
    title:
      "Sản phẩm bảo hiểm sức khỏe cao cấp được ưa chuộng tại các đô thị lớn",
    summary:
      "Các gói cao cấp cho phép khám chữa bệnh tại bệnh viện quốc tế, linh hoạt lựa chọn cơ sở y tế và hạn mức chi trả cao.",
  },
  {
    id: "health-3",
    title:
      "Bảo hiểm sức khỏe nhóm cho doanh nghiệp duy trì tăng trưởng hai con số",
    summary:
      "Doanh nghiệp coi bảo hiểm sức khỏe là một phần quan trọng trong chính sách phúc lợi và giữ chân nhân sự.",
  },
];

export default function ThuongMaiPage() {
  // Tabs menu con phía trên (hiển thị danh mục, chưa filter)
  const tabs = [
    { id: "life", label: "Nhân thọ (Life)" },
    { id: "non-life", label: "Phi nhân thọ (Non-life)" },
    { id: "health", label: "Bảo hiểm Sức khỏe (Health)" },
  ];

  return (
    <div className="bg-softGray-50 min-h-screen">
      {/* Thu hẹp chiều rộng vùng nội dung giống Vĩ mô */}
      <div className="mx-auto max-w-[1100px] px-4 py-8 lg:py-10">
        {/* TIÊU ĐỀ + MENU CON */}
        <header className="mb-4">
          <h1 className="font-serif text-3xl font-bold text-trustBlue-600 mb-1">
            Thương mại
          </h1>

          <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className="text-gray-700 hover:text-trustBlue-600 font-medium pb-1 border-b-2 border-transparent hover:border-trustBlue-600 transition"
              >
                {tab.label}
                <span className="ml-1">›</span>
              </button>
            ))}
          </div>
        </header>

        {/* KHỐI 4 BÀI: 1 LỚN + 3 NHỎ */}
        <section className="mt-6 space-y-8 mb-10">
          {/* Bài lớn phía trên */}
          <article className="bg-white border border-softGray-200 rounded-xl overflow-hidden flex flex-col lg:flex-row">
            {/* Khung ảnh xám (sau này truyền ảnh thật) */}
            <div className="bg-softGray-200 w-full lg:w-1/2 aspect-[16/9]" />

            <div className="flex-1 p-4 lg:p-6 flex flex-col">
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                {FEATURED_ARTICLE.tag && (
                  <span className="inline-flex items-center rounded-full bg-alertRed-50 px-2 py-0.5 text-[11px] font-semibold text-alertRed-600">
                    {FEATURED_ARTICLE.tag}
                  </span>
                )}
                {FEATURED_ARTICLE.time && <span>{FEATURED_ARTICLE.time}</span>}
              </div>

              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-slate-900 mb-3 leading-snug">
                <Link href="#" className="hover:text-alertRed-600">
                  {FEATURED_ARTICLE.title}
                </Link>
              </h2>

              {FEATURED_ARTICLE.summary && (
                <p className="text-sm lg:text-base text-slate-700 mb-4">
                  {FEATURED_ARTICLE.summary}
                </p>
              )}

              <div className="mt-auto text-xs text-slate-500">
                Chuyên mục: Bảo hiểm Thương mại – Sản phẩm &amp; Hãng
              </div>
            </div>
          </article>

          {/* 3 bài nhỏ phía dưới */}
          <div className="grid gap-6 md:grid-cols-3">
            {SECONDARY_ARTICLES.map((article) => (
              <article
                key={article.id}
                className="bg-white border border-softGray-200 rounded-xl overflow-hidden flex flex-col"
              >
                {/* Khung ảnh xám */}
                <div className="bg-softGray-200 w-full aspect-[16/9]" />

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-serif text-lg font-bold text-slate-900 mb-2 leading-snug">
                    <Link href="#" className="hover:text-alertRed-600">
                      {article.title}
                    </Link>
                  </h3>

                  {article.summary && (
                    <p className="text-sm text-slate-700">{article.summary}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* KHU VỰC 1: Nhân thọ (Life) */}
        <section className="mb-10 border-t border-softGray-200 pt-6">
          <h2 className="font-serif text-xl font-bold text-slate-900 mb-4 border-b border-softGray-200 pb-2">
            Nhân thọ (Life)
          </h2>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Bài nổi bật bên trái (có ảnh) */}
            <article className="lg:col-span-2 flex flex-col gap-4 md:flex-row bg-white border border-softGray-200 rounded-xl overflow-hidden">
              <div className="md:w-1/2">
                <div className="bg-softGray-200 w-full h-full aspect-[4/3]" />
              </div>

              <div className="md:w-1/2 p-4 lg:p-5 flex flex-col">
                <h3 className="font-serif text-lg lg:text-xl font-bold text-slate-900 mb-2 leading-snug">
                  <Link href="#" className="hover:text-alertRed-600">
                    {LIFE_NEWS[0].title}
                  </Link>
                </h3>
                {LIFE_NEWS[0].summary && (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {LIFE_NEWS[0].summary}
                  </p>
                )}
              </div>
            </article>

            {/* List bài còn lại bên phải */}
            <div className="border-t border-softGray-200 pt-4 lg:border-t-0 lg:border-l lg:pl-6">
              <ul className="space-y-3">
                {LIFE_NEWS.slice(1).map((item) => (
                  <li
                    key={item.id}
                    className="border-b border-softGray-200 pb-2 last:border-b-0"
                  >
                    <Link
                      href="#"
                      className="text-sm font-medium leading-snug text-slate-900 hover:text-alertRed-600"
                    >
                      {item.title}
                    </Link>

                    {item.summary && (
                      <p className="mt-1 text-xs text-slate-600 leading-snug">
                        {item.summary}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* KHU VỰC 2: Phi nhân thọ (Non-life) */}
        <section className="mb-10 border-t border-softGray-200 pt-6">
          <h2 className="font-serif text-xl font-bold text-slate-900 mb-4 border-b border-softGray-200 pb-2">
            Phi nhân thọ (Non-life)
          </h2>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Bài nổi bật bên trái */}
            <article className="lg:col-span-2 flex flex-col gap-4 md:flex-row bg-white border border-softGray-200 rounded-xl overflow-hidden">
              <div className="md:w-1/2">
                <div className="bg-softGray-200 w-full h-full aspect-[4/3]" />
              </div>

              <div className="md:w-1/2 p-4 lg:p-5 flex flex-col">
                <h3 className="font-serif text-lg lg:text-xl font-bold text-slate-900 mb-2 leading-snug">
                  <Link href="#" className="hover:text-alertRed-600">
                    {NONLIFE_NEWS[0].title}
                  </Link>
                </h3>
                {NONLIFE_NEWS[0].summary && (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {NONLIFE_NEWS[0].summary}
                  </p>
                )}
              </div>
            </article>

            {/* List bên phải */}
            <div className="border-t border-softGray-200 pt-4 lg:border-t-0 lg:border-l lg:pl-6">
              <ul className="space-y-3">
                {NONLIFE_NEWS.slice(1).map((item) => (
                  <li
                    key={item.id}
                    className="border-b border-softGray-200 pb-2 last:border-b-0"
                  >
                    <Link
                      href="#"
                      className="text-sm font-medium leading-snug text-slate-900 hover:text-alertRed-600"
                    >
                      {item.title}
                    </Link>

                    {item.summary && (
                      <p className="mt-1 text-xs text-slate-600 leading-snug">
                        {item.summary}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* KHU VỰC 3: Bảo hiểm Sức khỏe (Health) */}
        <section className="mb-12 border-t border-softGray-200 pt-6">
          <h2 className="font-serif text-xl font-bold text-slate-900 mb-4 border-b border-softGray-200 pb-2">
            Bảo hiểm Sức khỏe (Health)
          </h2>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Bài nổi bật bên trái */}
            <article className="lg:col-span-2 flex flex-col gap-4 md:flex-row bg-white border border-softGray-200 rounded-xl overflow-hidden">
              <div className="md:w-1/2">
                <div className="bg-softGray-200 w-full h-full aspect-[4/3]" />
              </div>

              <div className="md:w-1/2 p-4 lg:p-5 flex flex-col">
                <h3 className="font-serif text-lg lg:text-xl font-bold text-slate-900 mb-2 leading-snug">
                  <Link href="#" className="hover:text-alertRed-600">
                    {HEALTH_NEWS[0].title}
                  </Link>
                </h3>
                {HEALTH_NEWS[0].summary && (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {HEALTH_NEWS[0].summary}
                  </p>
                )}
              </div>
            </article>

            {/* List bên phải */}
            <div className="border-t border-softGray-200 pt-4 lg:border-t-0 lg:border-l lg:pl-6">
              <ul className="space-y-3">
                {HEALTH_NEWS.slice(1).map((item) => (
                  <li
                    key={item.id}
                    className="border-b border-softGray-200 pb-2 last:border-b-0"
                  >
                    <Link
                      href="#"
                      className="text-sm font-medium leading-snug text-slate-900 hover:text-alertRed-600"
                    >
                      {item.title}
                    </Link>

                    {item.summary && (
                      <p className="mt-1 text-xs text-slate-600 leading-snug">
                        {item.summary}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
