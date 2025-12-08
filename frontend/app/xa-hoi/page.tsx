import Link from "next/link";

type Article = {
  id: string;
  title: string;
  summary?: string;
  tag?: string;
  time?: string;
  imageUrl?: string;
};

/* ========= HERO + 3 BÀI NHỎ ========= */

const FEATURED_ARTICLE: Article = {
  id: "feat-1",
  title:
    "Đề xuất cải cách chính sách BHXH để mở rộng diện bao phủ người lao động",
  summary:
    "Cơ quan chức năng đề xuất nhiều giải pháp đơn giản hóa thủ tục, giảm thời gian đóng và linh hoạt chế độ hưởng nhằm thu hút người lao động tham gia BHXH bắt buộc.",
  tag: "An sinh xã hội",
  time: "Cập nhật 1 giờ trước",
};

const SECONDARY_ARTICLES: Article[] = [
  {
    id: "sec-1",
    title: "Mở rộng thanh toán BHYT không dùng tiền mặt tại bệnh viện công",
    summary:
      "Nhiều cơ sở y tế triển khai quét mã QR, ví điện tử và thẻ ngân hàng trong thanh toán viện phí, giúp người bệnh BHYT thuận tiện hơn.",
  },
  {
    id: "sec-2",
    title: "Doanh nghiệp tăng phúc lợi để giữ chân lao động sau Tết",
    summary:
      "Các gói hỗ trợ nhà ở, bảo hiểm sức khỏe bổ sung và thưởng hiệu quả công việc được nhiều doanh nghiệp áp dụng.",
  },
  {
    id: "sec-3",
    title: "Tăng cường kết nối dữ liệu an sinh giữa các bộ, ngành",
    summary:
      "Kết nối dữ liệu BHXH, BHYT và trợ giúp xã hội giúp quản lý minh bạch hơn và hạn chế trục lợi chính sách.",
  },
];

/* ========= NHÓM 1: BHXH BẮT BUỘC ========= */

const BHXH_NEWS: Article[] = [
  {
    id: "bhxh-1",
    title:
      "Đề xuất giảm thời gian đóng BHXH để hưởng lương hưu tối thiểu còn 15 năm",
    summary:
      "Chính sách mới kỳ vọng tạo điều kiện cho người lao động lớn tuổi, có thời gian tham gia ngắn vẫn có cơ hội hưởng lương hưu hàng tháng.",
  },
  {
    id: "bhxh-2",
    title: "Tăng cường thanh tra, xử phạt doanh nghiệp nợ đóng BHXH",
    summary:
      "Cơ quan BHXH phối hợp với thanh tra lao động để xử lý nghiêm tình trạng chậm đóng, trốn đóng, bảo vệ quyền lợi người lao động.",
  },
  {
    id: "bhxh-3",
    title: "Hỗ trợ người lao động bảo lưu và tiếp tục tham gia BHXH",
    summary:
      "Người lao động nghỉ việc được tư vấn bảo lưu sổ, lựa chọn tham gia BHXH tự nguyện để không bị gián đoạn quá trình đóng.",
  },
];

/* ========= NHÓM 2: BHYT ========= */

const BHYT_NEWS: Article[] = [
  {
    id: "bhyt-1",
    title:
      "Mở rộng danh mục thuốc và kỹ thuật được quỹ BHYT chi trả trong năm 2025",
    summary:
      "Nhiều loại thuốc điều trị bệnh mãn tính, ung thư và kỹ thuật can thiệp hiện đại được cân nhắc đưa vào danh mục thanh toán.",
  },
  {
    id: "bhyt-2",
    title: "Người dân có thể dùng CCCD gắn chip thay thế thẻ BHYT khi khám chữa bệnh",
    summary:
      "Việc đồng bộ dữ liệu giúp người bệnh không cần mang theo nhiều loại giấy tờ, giảm thời gian làm thủ tục tại quầy tiếp đón.",
  },
  {
    id: "bhyt-3",
    title:
      "Tỷ lệ bao phủ BHYT trên toàn quốc đạt trên 93% dân số",
    summary:
      "Nhiều địa phương vùng sâu, vùng xa đã đạt mục tiêu bao phủ toàn dân nhờ chính sách hỗ trợ mức đóng từ ngân sách.",
  },
];

/* ========= NHÓM 3: AN SINH & PHÚC LỢI ========= */

const WELFARE_NEWS: Article[] = [
  {
    id: "welfare-1",
    title:
      "Chương trình hỗ trợ tiền thuê nhà cho công nhân khu công nghiệp",
    summary:
      "Gói hỗ trợ nhằm giảm bớt gánh nặng chi phí sinh hoạt, giúp người lao động yên tâm gắn bó lâu dài với doanh nghiệp.",
  },
  {
    id: "welfare-2",
    title:
      "Nhiều địa phương triển khai trợ cấp điện, nước cho hộ nghèo và cận nghèo",
    summary:
      "Chính sách trợ giá giúp các hộ gia đình khó khăn duy trì mức sống tối thiểu, đặc biệt trong mùa nắng nóng cao điểm.",
  },
  {
    id: "welfare-3",
    title:
      "Doanh nghiệp tăng phúc lợi tinh thần: ngày nghỉ linh hoạt, hỗ trợ sức khỏe tâm lý",
    summary:
      "Các hoạt động tư vấn tâm lý, ngày nghỉ cho gia đình và chương trình gắn kết nội bộ được áp dụng ngày càng phổ biến.",
  },
];

export default function XaHoiPage() {
  const tabs = [
    { id: "bhxh", label: "BHXH bắt buộc" },
    { id: "bhyt", label: "BHYT" },
    { id: "welfare", label: "An sinh & phúc lợi" },
  ];

  return (
    <div className="bg-softGray-50 min-h-screen">
      {/* Thu hẹp chiều rộng nội dung */}
      <div className="mx-auto max-w-[1100px] px-4 py-8 lg:py-10">
        {/* TIÊU ĐỀ + MENU CON */}
        <header className="mb-4">
          <h1 className="font-serif text-3xl font-bold text-trustBlue-600 mb-1">
            Xã hội
          </h1>

          <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className="text-gray-700 hover:text-trustBlue-600 font-medium pb-1 border-b-2 border-transparent hover:border-trustBlue-600 transition"
              >
                {tab.label} <span className="ml-0.5">›</span>
              </button>
            ))}
          </div>
        </header>

        {/* HERO + 3 BÀI NHỎ */}
        <section className="mt-6 space-y-8 mb-10">
          {/* Bài lớn phía trên */}
          <article className="bg-white border border-softGray-200 rounded-xl overflow-hidden flex flex-col lg:flex-row">
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
                Chuyên mục: Xã hội – An sinh &amp; phúc lợi
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
                <div className="bg-softGray-200 w-full aspect-[16/9]" />
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-serif text-lg font-bold text-slate-900 mb-2 leading-snug">
                    <Link href="#" className="hover:text-alertRed-600">
                      {article.title}
                    </Link>
                  </h3>
                  {article.summary && (
                    <p className="text-sm text-slate-700">
                      {article.summary}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* KHU 1: BHXH bắt buộc */}
        <section className="mb-10 border-t border-softGray-200 pt-6">
          <h2 className="font-serif text-xl font-bold text-slate-900 mb-4 border-b border-softGray-200 pb-2">
            BHXH bắt buộc
          </h2>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Bài nổi bật */}
            <article className="lg:col-span-2 flex flex-col gap-4 md:flex-row bg-white border border-softGray-200 rounded-xl overflow-hidden">
              <div className="md:w-1/2">
                <div className="bg-softGray-200 w-full h-full aspect-[4/3]" />
              </div>
              <div className="md:w-1/2 p-4 lg:p-5 flex flex-col">
                <h3 className="font-serif text-lg lg:text-xl font-bold text-slate-900 mb-2 leading-snug">
                  <Link href="#" className="hover:text-alertRed-600">
                    {BHXH_NEWS[0].title}
                  </Link>
                </h3>
                {BHXH_NEWS[0].summary && (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {BHXH_NEWS[0].summary}
                  </p>
                )}
              </div>
            </article>

            {/* List bên phải */}
            <div className="border-t border-softGray-200 pt-4 lg:border-t-0 lg:border-l lg:pl-6">
              <ul className="space-y-3">
                {BHXH_NEWS.slice(1).map((item) => (
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

        {/* KHU 2: BHYT */}
        <section className="mb-10 border-t border-softGray-200 pt-6">
          <h2 className="font-serif text-xl font-bold text-slate-900 mb-4 border-b border-softGray-200 pb-2">
            BHYT
          </h2>

          <div className="grid gap-6 lg:grid-cols-3">
            <article className="lg:col-span-2 flex flex-col gap-4 md:flex-row bg-white border border-softGray-200 rounded-xl overflow-hidden">
              <div className="md:w-1/2">
                <div className="bg-softGray-200 w-full h-full aspect-[4/3]" />
              </div>
              <div className="md:w-1/2 p-4 lg:p-5 flex flex-col">
                <h3 className="font-serif text-lg lg:text-xl font-bold text-slate-900 mb-2 leading-snug">
                  <Link href="#" className="hover:text-alertRed-600">
                    {BHYT_NEWS[0].title}
                  </Link>
                </h3>
                {BHYT_NEWS[0].summary && (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {BHYT_NEWS[0].summary}
                  </p>
                )}
              </div>
            </article>

            <div className="border-t border-softGray-200 pt-4 lg:border-t-0 lg:border-l lg:pl-6">
              <ul className="space-y-3">
                {BHYT_NEWS.slice(1).map((item) => (
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

        {/* KHU 3: An sinh & phúc lợi */}
        <section className="mb-12 border-t border-softGray-200 pt-6">
          <h2 className="font-serif text-xl font-bold text-slate-900 mb-4 border-b border-softGray-200 pb-2">
            An sinh &amp; phúc lợi
          </h2>

          <div className="grid gap-6 lg:grid-cols-3">
            <article className="lg:col-span-2 flex flex-col gap-4 md:flex-row bg-white border border-softGray-200 rounded-xl overflow-hidden">
              <div className="md:w-1/2">
                <div className="bg-softGray-200 w-full h-full aspect-[4/3]" />
              </div>
              <div className="md:w-1/2 p-4 lg:p-5 flex flex-col">
                <h3 className="font-serif text-lg lg:text-xl font-bold text-slate-900 mb-2 leading-snug">
                  <Link href="#" className="hover:text-alertRed-600">
                    {WELFARE_NEWS[0].title}
                  </Link>
                </h3>
                {WELFARE_NEWS[0].summary && (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {WELFARE_NEWS[0].summary}
                  </p>
                )}
              </div>
            </article>

            <div className="border-t border-softGray-200 pt-4 lg:border-t-0 lg:border-l lg:pl-6">
              <ul className="space-y-3">
                {WELFARE_NEWS.slice(1).map((item) => (
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
