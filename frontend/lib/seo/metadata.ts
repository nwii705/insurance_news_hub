/**
 * Next.js Metadata utilities for SEO optimization
 * Generates metadata, OpenGraph, Twitter cards, and keywords
 */

import { Metadata } from 'next';
import { extractKeywords } from './schema';

const SITE_NAME = 'Insurance Vietnam';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://insurancenews.vn';
const DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;

/**
 * Generate metadata for article pages
 */
export function generateArticleMetadata(article: {
  title: string;
  summary: string;
  slug: string;
  author?: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  tags?: string[];
  featuredImageUrl?: string;
}): Metadata {
  const url = `${SITE_URL}/articles/${article.slug}`;
  const keywords = extractKeywords(article.title, article.summary, article.tags);
  const publishDate = new Date(article.publishedAt);
  const modifiedDate = article.updatedAt ? new Date(article.updatedAt) : publishDate;

  return {
    title: `${article.title} | ${SITE_NAME}`,
    description: article.summary,
    keywords,
    authors: [{ name: article.author || 'Insurance Vietnam Editorial Team' }],
    creator: article.author || 'Insurance Vietnam',
    publisher: SITE_NAME,
    category: article.category,
    openGraph: {
      type: 'article',
      url,
      title: article.title,
      description: article.summary,
      siteName: SITE_NAME,
      publishedTime: publishDate.toISOString(),
      modifiedTime: modifiedDate.toISOString(),
      authors: [article.author || 'Insurance Vietnam Editorial Team'],
      images: [
        {
          url: article.featuredImageUrl || DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: [article.featuredImageUrl || DEFAULT_IMAGE],
      creator: '@InsuranceVN',
      site: '@InsuranceVN',
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    other: {
      'article:section': article.category,
      'article:published_time': publishDate.toISOString(),
      'article:modified_time': modifiedDate.toISOString(),
      ...(article.tags && { 'article:tag': article.tags.join(', ') }),
    },
  };
}

/**
 * Generate metadata for legal document pages
 */
export function generateLegalDocMetadata(legalDoc: {
  documentNumber: string;
  documentType: string;
  title: string;
  summary: string;
  issuingBody: string;
  issueDate: string;
  effectiveDate: string;
  status: string;
  tags?: string[];
}): Metadata {
  const url = `${SITE_URL}/legal-docs/${legalDoc.documentNumber}`;
  const keywords = extractKeywords(legalDoc.title, legalDoc.summary, legalDoc.tags);

  const fullTitle = `${legalDoc.documentType} ${legalDoc.documentNumber}: ${legalDoc.title}`;

  return {
    title: `${fullTitle} | Thư viện pháp luật | ${SITE_NAME}`,
    description: legalDoc.summary,
    keywords: `${keywords}, ${legalDoc.documentNumber}, ${legalDoc.issuingBody}, pháp luật bảo hiểm`,
    openGraph: {
      type: 'article',
      url,
      title: fullTitle,
      description: legalDoc.summary,
      siteName: SITE_NAME,
      publishedTime: legalDoc.issueDate,
      images: [
        {
          url: `${SITE_URL}/og-legal.png`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: legalDoc.summary,
      images: [`${SITE_URL}/og-legal.png`],
      creator: '@InsuranceVN',
      site: '@InsuranceVN',
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    other: {
      'document:type': legalDoc.documentType,
      'document:number': legalDoc.documentNumber,
      'document:issuing_body': legalDoc.issuingBody,
      'document:issue_date': legalDoc.issueDate,
      'document:effective_date': legalDoc.effectiveDate,
      'document:status': legalDoc.status,
    },
  };
}

/**
 * Generate metadata for category pages
 */
export function generateCategoryMetadata(
  categoryName: string,
  categorySlug: string,
  description: string
): Metadata {
  const url = `${SITE_URL}/${categorySlug}`;

  return {
    title: `${categoryName} | ${SITE_NAME}`,
    description,
    openGraph: {
      type: 'website',
      url,
      title: categoryName,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: `${SITE_URL}/og-category-${categorySlug}.png`,
          width: 1200,
          height: 630,
          alt: categoryName,
        },
      ],
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
      title: categoryName,
      description,
      images: [`${SITE_URL}/og-category-${categorySlug}.png`],
      creator: '@InsuranceVN',
      site: '@InsuranceVN',
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Generate metadata for homepage
 */
export function generateHomeMetadata(): Metadata {
  return {
    title: `${SITE_NAME} - Tin tức & Phân tích Bảo hiểm Việt Nam`,
    description:
      'Tin tức bảo hiểm nhân thọ, phi nhân thọ, BHXH, BHYT. Phân tích chính sách, đánh giá sản phẩm, và thông tin pháp luật mới nhất về ngành bảo hiểm Việt Nam.',
    keywords:
      'bảo hiểm việt nam, tin tức bảo hiểm, bảo hiểm nhân thọ, bảo hiểm phi nhân thọ, BHXH, BHYT, pháp luật bảo hiểm',
    openGraph: {
      type: 'website',
      url: SITE_URL,
      title: 'Insurance Vietnam - Tin tức Bảo hiểm Việt Nam',
      description:
        'Nền tảng tin tức và phân tích chuyên sâu về ngành bảo hiểm Việt Nam',
      siteName: SITE_NAME,
      images: [
        {
          url: DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: 'Insurance Vietnam',
        },
      ],
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Insurance Vietnam',
      description: 'Tin tức & Phân tích Bảo hiểm Việt Nam',
      images: [DEFAULT_IMAGE],
      creator: '@InsuranceVN',
      site: '@InsuranceVN',
    },
    alternates: {
      canonical: SITE_URL,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    verification: {
      google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
    },
  };
}

/**
 * Generate metadata for library page
 */
export function generateLibraryMetadata(): Metadata {
  return {
    title: 'Thư viện Bảo hiểm | Tra cứu Bệnh viện, Garage, Biểu mẫu | Insurance Vietnam',
    description:
      'Tra cứu 1,200+ bệnh viện bảo lãnh viện phí, 850+ garage liên kết bảo hiểm ô tô, và 45+ biểu mẫu bảo hiểm. Công cụ tra cứu miễn phí cho người dùng bảo hiểm.',
    keywords:
      'bệnh viện bảo lãnh, garage bảo hiểm, biểu mẫu bảo hiểm, tra cứu bảo hiểm, danh sách bệnh viện, garage liên kết',
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/thu-vien`,
      title: 'Thư viện Bảo hiểm - Tra cứu miễn phí',
      description:
        'Tra cứu bệnh viện, garage, và biểu mẫu bảo hiểm - Cơ sở dữ liệu lớn nhất Việt Nam',
      siteName: SITE_NAME,
      images: [
        {
          url: `${SITE_URL}/og-library.png`,
          width: 1200,
          height: 630,
          alt: 'Thư viện Bảo hiểm',
        },
      ],
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Thư viện Bảo hiểm',
      description: 'Tra cứu bệnh viện, garage, biểu mẫu bảo hiểm',
      images: [`${SITE_URL}/og-library.png`],
      creator: '@InsuranceVN',
      site: '@InsuranceVN',
    },
    alternates: {
      canonical: `${SITE_URL}/thu-vien`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Generate keyword-rich meta description
 */
export function generateMetaDescription(
  baseDescription: string,
  keywords: string[]
): string {
  // Limit to 155-160 characters for optimal SEO
  const maxLength = 155;
  
  if (baseDescription.length <= maxLength) {
    return baseDescription;
  }

  // Truncate and add ellipsis
  return baseDescription.substring(0, maxLength - 3).trim() + '...';
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Generate breadcrumb list for SEO
 */
export function generateBreadcrumbs(
  items: Array<{ name: string; url: string }>
): Array<{ name: string; url: string }> {
  return [
    { name: 'Trang chủ', url: '/' },
    ...items,
  ];
}
