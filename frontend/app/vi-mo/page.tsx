import Link from "next/link";

type Article = {
  id: string;
  title: string;
  summary?: string;
  tag?: string;
  time?: string;
  imageUrl?: string;
};

// Bài hero (lớn nhất)
const FEATURED_ARTICLE: Article = {
  id: "feat-1",
  title:
    "Bộ Tài chính lấy ý kiến sửa đổi Luật Kinh doanh bảo hiểm giai đoạn 2025–2030",
  summary:
    "Dự thảo luật mới tập trung siết chặt quản lý hoa hồng, minh bạch thông tin sản phẩm và tăng trách nhiệm của doanh nghiệp bảo hiểm với khách hàng.",
  tag: "Chính sách",
  time: "Cập nhật 2 giờ trước",
};

// 3 bài nhỏ phía dưới hero
const SECONDARY_ARTICLES: Article[] = [
  {
    id: "sec-1",
    title: "Kế hoạch thanh tra thị trường bảo hiểm giai đoạn 2026–2030",
    summary:
      "Cục QLGSBH dự kiến tập trung vào minh bạch hoa hồng, chất lượng tư vấn và xử lý khiếu nại.",
  },
  {
    id: "sec-2",
    title: "Dòng tiền kinh doanh bảo hiểm chuyển dịch sang sản phẩm sức khỏe",
    summary:
      "Các doanh nghiệp đẩy mạnh bảo hiểm sức khỏe dài hạn thay cho sản phẩm đầu tư ngắn hạn.",
  },
  {
    id: "sec-3",
    title: "Hiệp hội Bảo hiểm đề xuất chuẩn đạo đức nghề nghiệp tư vấn viên",
    summary:
      "Bộ quy tắc mới hướng đến bảo vệ khách hàng và giảm rủi ro tranh chấp hợp đồng.",
  },
];

// Nhóm Thị trường & Pháp luật (Bộ Tài chính & Cục QLGSBH)
const MOF_NEWS: Article[] = [
  {
    id: "mof-1",
    title: "Cục QLGSBH công bố kế hoạch thanh tra thị trường bảo hiểm 2026",
    summary:
      "Thanh tra tập trung vào kênh phân phối, minh bạch hoa hồng và kiểm soát hoạt động tư vấn.",
  },
  {
    id: "mof-2",
    title:
      "Bộ Tài chính yêu cầu doanh nghiệp chuẩn hóa quy trình tư vấn hợp đồng",
    summary:
      "Doanh nghiệp phải công khai đầy đủ quyền lợi, loại trừ và trách nhiệm để giảm tranh chấp trong quá trình bồi thường.",
  },
  {
    id: "mof-3",
    title:
      "Hoàn thiện cổng thông tin tra cứu hợp đồng bảo hiểm cho người dân",
    summary:
      "Cổng thông tin giúp người dân tra cứu nhanh hợp đồng, lịch sử đóng phí và các quyền lợi bảo hiểm đang được hưởng.",
  },
];

// Nhóm Tài chính bảo hiểm
const FINANCE_NEWS: Article[] = [
  {
    id: "fin-1",
    title:
      "Lợi nhuận khối bảo hiểm phi nhân thọ phục hồi sau giai đoạn trích lập",
    summary:
      "Các doanh nghiệp ghi nhận tăng trưởng lợi nhuận nhờ giảm tỷ lệ bồi thường và cải thiện doanh thu phí.",
  },
  {
    id: "fin-2",
    title: "Xu hướng chuyển dịch doanh thu sang bảo hiểm sức khỏe dài hạn",
    summary:
      "Sản phẩm bảo hiểm sức khỏe dài hạn đang chiếm tỷ trọng ngày càng lớn khi nhu cầu chăm sóc y tế tăng mạnh.",
  },
  {
    id: "fin-3",
    title:
      "Các chỉ số an toàn vốn của doanh nghiệp bảo hiểm dưới góc nhìn chuyên gia",
    summary:
      "Chuyên gia nhận định năng lực thanh khoản và biên khả năng thanh toán của nhiều doanh nghiệp đã cải thiện đáng kể.",
  },
];

// Nhóm Hiệp hội bảo hiểm IAV
const IAV_NEWS: Article[] = [
  {
    id: "iav-1",
    title:
      "Hiệp hội Bảo hiểm kiến nghị rút ngắn thời gian giải quyết bồi thường",
    summary:
      "IAV đề xuất xây dựng bộ tiêu chuẩn dịch vụ nhằm rút ngắn thời gian chi trả và tăng tính minh bạch trong quy trình giải quyết bồi thường.",
  },
  {
    id: "iav-2",
    title:
      "Khuyến nghị chuẩn hóa bộ quy tắc đạo đức nghề nghiệp cho tư vấn viên",
    summary:
      "Bộ quy tắc mới hướng tới giảm tình trạng tư vấn sai lệch và nâng cao tính chuyên nghiệp cho đội ngũ đại lý bảo hiểm.",
  },
  {
    id: "iav-3",
    title: "Báo cáo thường niên thị trường bảo hiểm Việt Nam 2024",
    summary:
      "Báo cáo cho thấy thị trường tiếp tục tăng trưởng nhưng cũng đối mặt áp lực bồi thường ngày càng lớn ở một số nghiệp vụ.",
  },
];

export default function ViMoPage() {
  // Tabs menu con phía trên (hiện chỉ hiển thị, chưa filter)
  const tabs = [
    { id: "mof-qlgsbh", label: "Thị trường & Pháp luật" },
    { id: "finance", label: "Tài chính Bảo hiểm" },
    { id: "iav", label: "Hiệp hội Bảo hiểm (IAV)" },
  ];

  return (
    <div className="bg-softGray-50 min-h-screen">
      {/* Thu hẹp chiều rộng vùng nội dung */}
      <div className="mx-auto max-w-[1100px] px-4 py-8 lg:py-10">
        {/* TIÊU ĐỀ + MENU CON */}
        <header className="mb-4">
          <h1 className="font-serif text-3xl font-bold text-trustBlue-600 mb-2">
            Vĩ mô
          </h1>

          <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className="text-gray-700 hover:text-trustBlue-600 font-medium pb-1 border-b-2 border-transparent hover:border-trustBlue-600 transition"
              >
                {tab.label}
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
                Chuyên mục: Vĩ mô – Thị trường &amp; Pháp luật
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

        {/* KHU VỰC 1: Thị trường & Pháp luật */}
        <section className="mb-10 border-t border-softGray-200 pt-6">
          <h2 className="font-serif text-xl font-bold text-slate-900 mb-4 border-b border-softGray-200 pb-2">
            Thị trường &amp; Pháp luật
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
                    {MOF_NEWS[0].title}
                  </Link>
                </h3>
                {MOF_NEWS[0].summary && (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {MOF_NEWS[0].summary}
                  </p>
                )}
              </div>
            </article>

            {/* List bài còn lại bên phải */}
            <div className="border-t border-softGray-200 pt-4 lg:border-t-0 lg:border-l lg:pl-6">
              <ul className="space-y-3">
                {MOF_NEWS.slice(1).map((item) => (
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

        {/* KHU VỰC 2: Tài chính Bảo hiểm */}
        <section className="mb-10 border-t border-softGray-200 pt-6">
          <h2 className="font-serif text-xl font-bold text-slate-900 mb-4 border-b border-softGray-200 pb-2">
            Tài chính Bảo hiểm
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
                    {FINANCE_NEWS[0].title}
                  </Link>
                </h3>
                {FINANCE_NEWS[0].summary && (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {FINANCE_NEWS[0].summary}
                  </p>
                )}
              </div>
            </article>

            {/* List bên phải */}
            <div className="border-t border-softGray-200 pt-4 lg:border-t-0 lg:border-l lg:pl-6">
              <ul className="space-y-3">
                {FINANCE_NEWS.slice(1).map((item) => (
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

        {/* KHU VỰC 3: Hiệp hội Bảo hiểm (IAV) */}
        <section className="mb-12 border-t border-softGray-200 pt-6">
          <h2 className="font-serif text-xl font-bold text-slate-900 mb-4 border-b border-softGray-200 pb-2">
            Hiệp hội Bảo hiểm (IAV)
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
                    {IAV_NEWS[0].title}
                  </Link>
                </h3>
                {IAV_NEWS[0].summary && (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {IAV_NEWS[0].summary}
                  </p>
                )}
              </div>
            </article>

            {/* List bên phải */}
            <div className="border-t border-softGray-200 pt-4 lg:border-t-0 lg:border-l lg:pl-6">
              <ul className="space-y-3">
                {IAV_NEWS.slice(1).map((item) => (
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
