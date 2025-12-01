import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Building2, FileText, CheckCircle2, XCircle, Clock, ArrowLeft, ExternalLink, Download } from 'lucide-react';
import { notFound } from 'next/navigation';

import { generateLegalDocMetadata, generateBreadcrumbs } from '@/lib/seo/metadata';
import { generateGovernmentPermitSchema, generateBreadcrumbSchema, renderSchema } from '@/lib/seo/schema';
import { DisclaimerBadge } from '@/components/shared/disclaimer-footer';

// Legal document type definition
interface LegalDocument {
  id: string;
  documentNumber: string;
  documentType: string;
  title: string;
  summary: string;
  content: string;
  issuingBody: string;
  issueDate: string;
  effectiveDate: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'amended' | 'draft';
  tags: string[];
  sourceUrl: string;
  attachments?: Array<{
    name: string;
    url: string;
    size: string;
  }>;
  relatedDocuments?: string[];
  viewCount: number;
}

// Fetch legal document data from API
async function getLegalDocument(docNumber: string): Promise<LegalDocument | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const res = await fetch(`${API_URL}/api/legal-docs/${docNumber}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching legal document:', error);
    return null;
  }
}

// Fetch related documents
async function getRelatedDocuments(docNumber: string): Promise<LegalDocument[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const res = await fetch(
      `${API_URL}/api/legal-docs?related=${docNumber}&limit=5`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching related documents:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { docNumber: string };
}): Promise<Metadata> {
  const legalDoc = await getLegalDocument(params.docNumber);

  if (!legalDoc) {
    return {
      title: 'Văn bản không tìm thấy | Insurance Vietnam',
    };
  }

  return generateLegalDocMetadata(legalDoc);
}

// Status badge component
function StatusBadge({ status }: { status: LegalDocument['status'] }) {
  const config = {
    active: {
      text: 'Đang hiệu lực',
      icon: CheckCircle2,
      className: 'bg-green-100 text-green-800 border-green-300',
    },
    expired: {
      text: 'Hết hiệu lực',
      icon: XCircle,
      className: 'bg-red-100 text-red-800 border-red-300',
    },
    amended: {
      text: 'Đã sửa đổi',
      icon: FileText,
      className: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    draft: {
      text: 'Dự thảo',
      icon: Clock,
      className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
  };

  const { text, icon: Icon, className } = config[status];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${className}`}>
      <Icon className="h-4 w-4" />
      {text}
    </div>
  );
}

// Legal document page component
export default async function LegalDocumentPage({
  params,
}: {
  params: { docNumber: string };
}) {
  const legalDoc = await getLegalDocument(params.docNumber);

  if (!legalDoc) {
    notFound();
  }

  const relatedDocuments = await getRelatedDocuments(params.docNumber);

  // Generate structured data
  const legalSchema = generateGovernmentPermitSchema(legalDoc);
  const breadcrumbs = generateBreadcrumbs([
    { name: 'Thư viện pháp luật', url: '/thu-vien' },
    { name: legalDoc.documentNumber, url: `/legal-docs/${legalDoc.documentNumber}` },
  ]);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderSchema(legalSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderSchema(breadcrumbSchema)}
      />

      <article className="min-h-screen bg-softGray-100">
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-trustBlue-600">
                Trang chủ
              </Link>
              <span>/</span>
              <Link href="/thu-vien" className="hover:text-trustBlue-600">
                Thư viện pháp luật
              </Link>
              <span>/</span>
              <span className="text-gray-900">{legalDoc.documentNumber}</span>
            </nav>
          </div>
        </div>

        {/* Document Header */}
        <header className="bg-gradient-to-br from-trustBlue-500 via-trustBlue-600 to-blue-700 text-white">
          <div className="container mx-auto px-4 py-12 max-w-5xl">
            {/* Back Button */}
            <Link
              href="/thu-vien"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại thư viện
            </Link>

            {/* Document Type Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase rounded">
                {legalDoc.documentType}
              </span>
              <StatusBadge status={legalDoc.status} />
            </div>

            {/* Document Number */}
            <div className="text-xl font-bold mb-4 text-white/90">
              {legalDoc.documentNumber}
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              {legalDoc.title}
            </h1>

            {/* Meta Grid */}
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-white/70" />
                <div>
                  <div className="text-white/70 text-xs">Cơ quan ban hành</div>
                  <div className="font-semibold">{legalDoc.issuingBody}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-white/70" />
                <div>
                  <div className="text-white/70 text-xs">Ngày ban hành</div>
                  <div className="font-semibold">
                    {new Date(legalDoc.issueDate).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-white/70" />
                <div>
                  <div className="text-white/70 text-xs">Hiệu lực từ</div>
                  <div className="font-semibold">
                    {new Date(legalDoc.effectiveDate).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Expiry Date (if applicable) */}
            {legalDoc.expiryDate && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-400/50 rounded-lg text-sm">
                <strong>Hết hiệu lực:</strong>{' '}
                {new Date(legalDoc.expiryDate).toLocaleDateString('vi-VN')}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <a
                href={legalDoc.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white text-trustBlue-600 rounded-lg hover:bg-white/90 transition-colors font-semibold"
              >
                <ExternalLink className="h-4 w-4" />
                Xem văn bản gốc
              </a>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors">
                <Download className="h-4 w-4" />
                Tải về PDF
              </button>
            </div>

            {/* View Count */}
            <div className="mt-4 text-white/70 text-sm">
              {legalDoc.viewCount.toLocaleString('vi-VN')} lượt xem
            </div>
          </div>
        </header>

        {/* Document Content */}
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
                {/* Legal Disclaimer */}
                <div className="mb-8">
                  <DisclaimerBadge type="legal" />
                </div>

                {/* Summary */}
                <div className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                  <h2 className="font-serif text-xl font-bold text-trustBlue-500 mb-3">
                    Tóm tắt nội dung
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {legalDoc.summary}
                  </p>
                </div>

                {/* Full Content */}
                <div
                  className="prose prose-lg max-w-none legal-document-content"
                  dangerouslySetInnerHTML={{ __html: legalDoc.content }}
                />

                {/* Attachments */}
                {legalDoc.attachments && legalDoc.attachments.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-serif text-lg font-bold text-trustBlue-500 mb-4">
                      Tài liệu đính kèm
                    </h3>
                    <div className="space-y-2">
                      {legalDoc.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-trustBlue-500" />
                            <div>
                              <div className="font-medium text-gray-900">{attachment.name}</div>
                              <div className="text-xs text-gray-500">{attachment.size}</div>
                            </div>
                          </div>
                          <Download className="h-4 w-4 text-gray-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {legalDoc.tags && legalDoc.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-700">Tags:</span>
                      {legalDoc.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/tags/${tag}`}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-trustBlue-50 hover:text-trustBlue-700 transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Related Documents */}
              {relatedDocuments.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                  <h3 className="font-serif text-lg font-bold text-trustBlue-500 mb-4">
                    Văn bản liên quan
                  </h3>
                  <div className="space-y-4">
                    {relatedDocuments.map((related) => (
                      <Link
                        key={related.id}
                        href={`/legal-docs/${related.documentNumber}`}
                        className="block p-3 bg-gray-50 hover:bg-trustBlue-50 rounded-lg border border-gray-200 hover:border-trustBlue-300 transition-all"
                      >
                        <div className="text-xs text-gray-500 mb-1">
                          {related.documentType}
                        </div>
                        <div className="font-semibold text-trustBlue-600 text-sm mb-1">
                          {related.documentNumber}
                        </div>
                        <div className="text-sm text-gray-700 line-clamp-2">
                          {related.title}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <StatusBadge status={related.status} />
                        </div>
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/thu-vien"
                    className="block mt-4 text-center text-trustBlue-600 hover:text-trustBlue-700 font-semibold text-sm"
                  >
                    Xem tất cả văn bản →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
