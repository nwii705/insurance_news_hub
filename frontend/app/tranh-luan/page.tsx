import Link from "next/link";

type Article = {
  id: string;
  title: string;
  summary?: string;
  tag?: string;
  time?: string;
  imageUrl?: string;
};

/* ========== HERO + 3 BÀI NHỎ ========== */

const FEATURED_ARTICLE: Article = {
  id: "feat-1",
  title:
    "Sau khủng hoảng Bancassurance: Thị trường bảo hiểm Việt Nam đang học được gì từ \"cơn bão\" niềm tin?",
  summary:
    "Từ những khiếu nại ồn ào về sản phẩm liên kết đầu tư, các bên tham gia thị trường đang điều chỉnh cách bán, cách tư duy và cách đối thoại với khách hàng như thế nào.",
  tag: "Tranh luận",
  time: "Cập nhật 45 phút trước",
};

const SECONDARY_ARTICLES: Article[] = [
  {
    id: "sec-1",
    title:
      "Có nên trả lại hoa hồng cho khách hàng? Góc nhìn đa chiều về \"chiết khấu dưới bàn\"",
    summary:
      "Một bên xem đó là ưu đãi cạnh tranh, bên khác coi là hành vi bóp méo phí bảo hiểm và rủi ro pháp lý dài hạn.",
  },
  {
    id: "sec-2",
    title:
      "Chatbot bán bảo hiểm: Đối thủ hay trợ lý của tư vấn viên truyền thống?",
    summary:
      "Khi khách hàng có thể mua bảo hiểm chỉ với vài cú chạm, vai trò của con người trong hành trình tư vấn có còn là trung tâm?",
  },
  {
    id: "sec-3",
    title:
      "Hủy hợp đồng giữa chừng: Khách hàng sai, tư vấn viên sai hay sản phẩm sai?",
    summary:
      "Một case điển hình cho thấy ranh giới mong manh giữa hiểu nhầm, kỳ vọng quá mức và thiết kế sản phẩm thiếu minh bạch.",
  },
];

/* ========== NHÓM 1: PHÂN TÍCH CASE STUDY ========== */

const CASE_STUDIES: Article[] = [
  {
    id: "case-1",
    title:
      "Case: Hợp đồng bảo hiểm 15 năm bị hủy ở năm thứ 3 – ai thực sự chịu trách nhiệm?",
    summary:
      "Chúng ta bóc tách từng bước hành trình ký hợp đồng, từ kịch bản tư vấn, bản minh họa đến quy trình chăm sóc sau bán.",
  },
  {
    id: "case-2",
    title:
      "Case: Doanh nghiệp mua bảo hiểm cháy nổ nhưng không được bồi thường đầy đủ",
    summary:
      "Điều khoản loại trừ, giá trị bảo hiểm dưới giá trị thật và việc không cập nhật tài sản đã khiến doanh nghiệp nhận bồi thường thấp hơn kỳ vọng.",
  },
  {
    id: "case-3",
    title:
      "Case: Gói bảo hiểm sức khỏe \"siêu rẻ\" và bài học về chữ nhỏ trong hợp đồng",
    summary:
      "Khách hàng chỉ đọc quyền lợi nổi bật trên brochure mà bỏ qua giới hạn chi trả, dẫn đến thất vọng khi nhập viện.",
  },
];

/* ========== NHÓM 2: GÓC ĐẠI LÝ (AGENT) ========== */

const AGENT_CORNER: Article[] = [
  {
    id: "agent-1",
    title:
      "Nhật ký một tuần của tư vấn viên: Tư vấn chuẩn mực hay chạy chỉ tiêu?",
    summary:
      "Từ những cuộc gọi lạnh đến buổi gặp thứ ba với cùng một khách, đại lý phải liên tục cân bằng giữa KPI và đạo đức nghề nghiệp.",
  },
  {
    id: "agent-2",
    title:
      "Khi khách hàng chỉ hỏi: \"Lãi bao nhiêu một năm?\" – nỗi khổ không nói thành lời của đại lý",
    summary:
      "Tư duy đầu tư ngắn hạn khiến cuộc trò chuyện về bảo vệ tài chính dài hạn thường rẽ sang hướng sai ngay từ câu hỏi đầu tiên.",
  },
  {
    id: "agent-3",
    title:
      "Đào tạo đại lý: Nên dạy kỹ năng chốt sale hay kỹ năng nói lời từ chối?",
    summary:
      "Không phải khách hàng nào cũng phù hợp, nhưng rất ít chương trình đào tạo dạy đại lý cách nói \"không\" đúng lúc.",
  },
];

/* ========== NHÓM 3: GÓC CHUYÊN GIA ========== */

const EXPERT_VOICES: Article[] = [
  {
    id: "exp-1",
    title:
      "Ý kiến chuyên gia: Cải tổ thị trường bảo hiểm bắt đầu từ việc viết lại brochure sản phẩm",
    summary:
      "Một chuyên gia cho rằng cứ mỗi trang quảng cáo dễ hiểu hơn là bớt đi một lá đơn khiếu nại trong tương lai.",
  },
  {
    id: "exp-2",
    title:
      "Chuẩn mực tư vấn mới: Từ \"bán cho được\" sang \"dám khuyên khách không nên mua\"",
    summary:
      "Đặt lợi ích dài hạn của khách hàng lên trước có thể làm giảm doanh số ngắn hạn, nhưng tạo ra giá trị thương hiệu bền vững.",
  },
  {
    id: "exp-3",
    title:
      "Làm sao để đo lường \"niềm tin\" trong bảo hiểm? Góc nhìn từ dữ liệu hành vi",
    summary:
      "Tỷ lệ duy trì hợp đồng, tần suất khiếu nại và hành vi giới thiệu người quen có thể là những chỉ báo tốt hơn doanh thu thuần.",
  },
];

export default function TranhLuanPage() {
  const tabs = [
    { id: "case-study", label: "Phân tích Case Study" },
    { id: "agent", label: "Góc Đại lý (Agent)" },
    { id: "expert", label: "Góc chuyên gia" },
  ];

  return (
    <div className="bg-softGray-50 min-h-screen">
      {/* Thu hẹp chiều rộng nội dung giống các trang khác */}
      <div className="mx-auto max-w-[1100px] px-4 py-8 lg:py-10">
        {/* TIÊU ĐỀ + MENU CON */}
        <header className="mb-4">
          <h1 className="font-serif text-3xl font-bold text-trustBlue-600 mb-1">
            Tranh luận
          </h1>

          <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 pb-2 text-sm">
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
                Chuyên mục: Tranh luận – Góc nhìn &amp; phản biện
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

        {/* KHU 1: PHÂN TÍCH CASE STUDY */}
        <section className="mb-10 border-t border-softGray-200 pt-6">
          <h2 className="font-serif text-xl font-bold text-slate-900 mb-4 border-b border-softGray-200 pb-2">
            Phân tích Case Study
          </h2>

          <div className="grid gap-6 lg:grid-cols-3">
            <article className="lg:col-span-2 flex flex-col gap-4 md:flex-row bg-white border border-softGray-200 rounded-xl overflow-hidden">
              <div className="md:w-1/2">
                <div className="bg-softGray-200 w-full h-full aspect-[4/3]" />
              </div>
              <div className="md:w-1/2 p-4 lg:p-5 flex flex-col">
                <h3 className="font-serif text-lg lg:text-xl font-bold text-slate-900 mb-2 leading-snug">
                  <Link href="#" className="hover:text-alertRed-600">
                    {CASE_STUDIES[0].title}
                  </Link>
                </h3>
                {CASE_STUDIES[0].summary && (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {CASE_STUDIES[0].summary}
                  </p>
                )}
              </div>
            </article>

            <div className="border-t border-softGray-200 pt-4 lg:border-t-0 lg:border-l lg:pl-6">
              <ul className="space-y-3">
                {CASE_STUDIES.slice(1).map((item) => (
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

        {/* KHU 2: GÓC ĐẠI LÝ (AGENT) */}
        <section className="mb-10 border-t border-softGray-200 pt-6">
          <h2 className="font-serif text-xl font-bold text-slate-900 mb-4 border-b border-softGray-200 pb-2">
            Góc Đại lý (Agent)
          </h2>

          <div className="grid gap-6 lg:grid-cols-3">
            <article className="lg:col-span-2 flex flex-col gap-4 md:flex-row bg-white border border-softGray-200 rounded-xl overflow-hidden">
              <div className="md:w-1/2">
                <div className="bg-softGray-200 w-full h-full aspect-[4/3]" />
              </div>
              <div className="md:w-1/2 p-4 lg:p-5 flex flex-col">
                <h3 className="font-serif text-lg lg:text-xl font-bold text-slate-900 mb-2 leading-snug">
                  <Link href="#" className="hover:text-alertRed-600">
                    {AGENT_CORNER[0].title}
                  </Link>
                </h3>
                {AGENT_CORNER[0].summary && (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {AGENT_CORNER[0].summary}
                  </p>
                )}
              </div>
            </article>

            <div className="border-t border-softGray-200 pt-4 lg:border-t-0 lg:border-l lg:pl-6">
              <ul className="space-y-3">
                {AGENT_CORNER.slice(1).map((item) => (
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

        {/* KHU 3: GÓC CHUYÊN GIA */}
        <section className="mb-12 border-t border-softGray-200 pt-6">
          <h2 className="font-serif text-xl font-bold text-slate-900 mb-4 border-b border-softGray-200 pb-2">
            Góc chuyên gia
          </h2>

          <div className="grid gap-6 lg:grid-cols-3">
            <article className="lg:col-span-2 flex flex-col gap-4 md:flex-row bg-white border border-softGray-200 rounded-xl overflow-hidden">
              <div className="md:w-1/2">
                <div className="bg-softGray-200 w-full h-full aspect-[4/3]" />
              </div>
              <div className="md:w-1/2 p-4 lg:p-5 flex flex-col">
                <h3 className="font-serif text-lg lg:text-xl font-bold text-slate-900 mb-2 leading-snug">
                  <Link href="#" className="hover:text-alertRed-600">
                    {EXPERT_VOICES[0].title}
                  </Link>
                </h3>
                {EXPERT_VOICES[0].summary && (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {EXPERT_VOICES[0].summary}
                  </p>
                )}
              </div>
            </article>

            <div className="border-t border-softGray-200 pt-4 lg:border-t-0 lg:border-l lg:pl-6">
              <ul className="space-y-3">
                {EXPERT_VOICES.slice(1).map((item) => (
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
