// components/home/newsletter-section.tsx
export function NewsletterSection() {
  return (
    <div className="bg-gradient-to-r from-trustBlue-600 to-trustBlue-500 rounded-2xl px-6 py-8 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-md">
      <div className="space-y-2 max-w-xl">
        <h2 className="font-serif text-2xl md:text-3xl font-bold">
          Nhận bản tin Bảo hiểm mỗi tuần
        </h2>
        <p className="text-sm text-blue-100">
          Tổng hợp tin quan trọng, thay đổi pháp luật và phân tích nổi bật
          được gửi gọn trong một email. Hoàn toàn miễn phí.
        </p>
      </div>
      <form
        className="w-full md:w-auto flex flex-col sm:flex-row gap-3"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="email"
          required
          placeholder="Nhập email công việc của bạn"
          className="w-full sm:w-72 px-3 py-2 rounded-lg text-slate-900 text-sm border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-white text-trustBlue-700 font-semibold text-sm hover:bg-blue-50 transition-colors"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
}
