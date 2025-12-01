import { AlertTriangle, Scale, ExternalLink } from 'lucide-react';

/**
 * Global Disclaimer Footer Component
 * Legal safety notice displayed on all pages
 * Required for liability protection
 */
export function DisclaimerFooter() {
  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-t-4 border-amber-400">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-400 p-2 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-amber-900" />
            </div>
            <h3 className="font-serif text-xl font-bold text-amber-900">
              Tuyên bố miễn trừ trách nhiệm
            </h3>
          </div>

          {/* Main Disclaimer Text */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-amber-200">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Thông tin trên website chỉ mang tính chất tham khảo và tổng hợp.</strong>{' '}
                Chúng tôi không phải là đơn vị tư vấn luật chính thức hay đại diện của bất kỳ
                tổ chức bảo hiểm nào.
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-4">
                {/* Legal Documents */}
                <div className="flex gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Scale className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Văn bản pháp luật</h4>
                    <p className="text-sm text-blue-800">
                      Vui lòng tham khảo văn bản gốc tại{' '}
                      <a
                        href="https://thuvienphapluat.vn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-600 inline-flex items-center gap-1"
                      >
                        Thư Viện Pháp Luật
                        <ExternalLink className="h-3 w-3" />
                      </a>{' '}
                      hoặc trang web chính thức của cơ quan ban hành.
                    </p>
                  </div>
                </div>

                {/* Insurance Information */}
                <div className="flex gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Scale className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Thông tin sản phẩm</h4>
                    <p className="text-sm text-green-800">
                      Vui lòng tham khảo website chính thức của doanh nghiệp bảo hiểm hoặc liên hệ
                      trực tiếp với đại lý bảo hiểm được ủy quyền.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm italic border-t border-amber-200 pt-4">
                <strong>Lưu ý:</strong> Mọi quyết định mua bảo hiểm hay tranh chấp pháp lý cần được
                tư vấn bởi luật sư hoặc chuyên gia có chứng chỉ hành nghề. Website này không chịu
                trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng thông tin trên trang.
              </p>
            </div>
          </div>

          {/* Additional Legal Links */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <a
              href="/about/legal"
              className="hover:text-trustBlue-600 hover:underline"
            >
              Điều khoản sử dụng
            </a>
            <span className="text-gray-400">•</span>
            <a
              href="/about/privacy"
              className="hover:text-trustBlue-600 hover:underline"
            >
              Chính sách bảo mật
            </a>
            <span className="text-gray-400">•</span>
            <a
              href="/about/contact"
              className="hover:text-trustBlue-600 hover:underline"
            >
              Liên hệ biên tập
            </a>
            <span className="text-gray-400">•</span>
            <a
              href="/about/sources"
              className="hover:text-trustBlue-600 hover:underline"
            >
              Nguồn tham khảo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline Disclaimer Badge (for article pages)
 */
export function DisclaimerBadge({ type = 'legal' }: { type?: 'legal' | 'product' | 'opinion' }) {
  const config = {
    legal: {
      text: 'Tham khảo văn bản gốc tại TVPL',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: Scale,
    },
    product: {
      text: 'Thông tin chỉ mang tính chất tham khảo',
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: AlertTriangle,
    },
    opinion: {
      text: 'Bài viết thể hiện quan điểm cá nhân',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: AlertTriangle,
    },
  };

  const { text, color, icon: Icon } = config[type];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${color}`}>
      <Icon className="h-3.5 w-3.5" />
      {text}
    </div>
  );
}

/**
 * Dispute Disclaimer (for controversial articles)
 * As required by AI Editor system prompt
 */
export function DisputeDisclaimer() {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6 rounded-r-lg">
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-red-900 mb-1">
            ⚠️ Thông tin có yếu tố tranh cãi
          </h4>
          <p className="text-sm text-red-800 leading-relaxed">
            Bài viết này đề cập đến thông tin hoặc sự kiện đang trong quá trình xác minh hoặc có
            nhiều quan điểm trái chiều. Chúng tôi khuyến nghị độc giả tham khảo thêm các nguồn tin
            chính thống và không đưa ra kết luận vội vàng. Mọi tranh chấp pháp lý cần được giải
            quyết thông qua cơ quan có thẩm quyền.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * AI Generated Content Disclaimer
 */
export function AIContentDisclaimer() {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 my-4 text-sm">
      <div className="flex items-start gap-2">
        <div className="bg-purple-500 text-white px-2 py-0.5 rounded text-xs font-bold">
          AI
        </div>
        <p className="text-purple-900">
          <strong>Nội dung được xử lý bởi AI:</strong> Bài viết này đã được viết lại hoặc tóm tắt
          bằng công nghệ trí tuệ nhân tạo dưới sự giám sát của biên tập viên con người. Vui lòng
          tham khảo nguồn gốc để có thông tin chính xác nhất.
        </p>
      </div>
    </div>
  );
}

/**
 * Source Attribution Component
 */
export function SourceAttribution({
  originalUrl,
  originalSource,
  publishDate,
}: {
  originalUrl: string;
  originalSource: string;
  publishDate: string;
}) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4 text-sm">
      <h4 className="font-semibold text-gray-900 mb-2">Nguồn tham khảo:</h4>
      <div className="flex flex-col gap-1 text-gray-700">
        <div>
          <strong>Nguồn:</strong> {originalSource}
        </div>
        <div>
          <strong>Ngày đăng gốc:</strong>{' '}
          {new Date(publishDate).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <a
          href={originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-trustBlue-600 hover:text-trustBlue-700 underline inline-flex items-center gap-1 mt-1"
        >
          Xem bài viết gốc
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

export default DisclaimerFooter;
