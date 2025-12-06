// components/home/opinion-section.tsx
const mockOpinions = [
  {
    id: 1,
    tag: "Case Study",
    title:
      "Vì sao hồ sơ bồi thường bảo hiểm sức khỏe dễ bị từ chối?",
    summary:
      "Phân tích 5 nhóm lý do phổ biến khiến hồ sơ bị trả lại và cách chuẩn bị để hạn chế rủi ro.",
  },
  {
    id: 2,
    tag: "Góc đại lý",
    title:
      "Chuyện nghề tư vấn bảo hiểm: ranh giới giữa tư vấn và chốt sales",
    summary:
      "Nhìn từ trải nghiệm thực tế của một MDRT sau 10 năm làm nghề.",
  },
  {
    id: 3,
    tag: "InsurTech",
    title:
      "Ứng dụng AI trong khâu thẩm định bảo hiểm nhân thọ: cơ hội hay rủi ro?",
    summary:
      "Các hãng bảo hiểm đang tận dụng dữ liệu và mô hình AI như thế nào trong quy trình underwriting.",
  },
];

export function OpinionSection() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-3xl font-bold text-slate-900">
            Góc nhìn &amp; Tranh luận
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            Các bài phân tích, case study và quan điểm đa chiều về thị
            trường bảo hiểm Việt Nam.
          </p>
        </div>
        <button className="text-sm text-primary hover:underline">
          Xem tất cả bài phân tích →
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {mockOpinions.map((op) => (
          <article
            key={op.id}
            className="bg-softGray-50 border border-softGray-200 rounded-xl p-4 flex flex-col gap-2 hover:shadow-sm transition-shadow"
          >
            <span className="inline-flex text-xs font-semibold uppercase tracking-wide text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full w-fit">
              {op.tag}
            </span>
            <h3 className="font-semibold text-slate-900 line-clamp-2">
              {op.title}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-3">
              {op.summary}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
