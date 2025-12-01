/**
 * Schema.org structured data generators for SEO
 * Implements NewsArticle and GovernmentPermit schemas
 * @fileoverview UTF-8 encoded file for Vietnamese content
 */

import { normalizeVietnameseText } from "@/lib/utils/encoding";

/**import { Article, LegalDocument } from '@/types';*/

/**
 * Generate Schema.org NewsArticle structured data
 * https://schema.org/NewsArticle
 */
export function generateNewsArticleSchema(
  article: {
    id: string;
    title: string;
    summary: string;
    content: string;
    slug: string;
    author?: string;
    publishedAt: string;
    updatedAt?: string;
    category: string;
    tags?: string[];
    featuredImageUrl?: string;
  },
  siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL ||
    "https://insurancenews.vn"
) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: normalizeVietnameseText(article.title),
    description: normalizeVietnameseText(article.summary),
    articleBody: normalizeVietnameseText(article.content),
    url: `${siteUrl}/articles/${article.slug}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author || "Insurance Vietnam Editorial Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Insurance Vietnam",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
        width: 600,
        height: 60,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/articles/${article.slug}`,
    },
    ...(article.featuredImageUrl && {
      image: {
        "@type": "ImageObject",
        url: article.featuredImageUrl,
        width: 1200,
        height: 630,
      },
    }),
    ...(article.tags &&
      article.tags.length > 0 && {
        keywords: article.tags.join(", "),
      }),
    articleSection: article.category,
    inLanguage: "vi-VN",
    copyrightYear: new Date(article.publishedAt).getFullYear(),
    copyrightHolder: {
      "@type": "Organization",
      name: "Insurance Vietnam",
    },
  };

  return schema;
}

/**
 * Generate Schema.org GovernmentPermit structured data for legal documents
 * https://schema.org/GovernmentPermit (closest match for legal regulations)
 * Using GovernmentRegulation for better semantic fit
 */
export function generateGovernmentPermitSchema(
  legalDoc: {
    documentNumber: string;
    documentType: string;
    title: string;
    summary: string;
    issuingBody: string;
    issueDate: string;
    effectiveDate: string;
    expiryDate?: string;
    status: "active" | "expired" | "amended" | "draft";
    tags?: string[];
    sourceUrl: string;
  },
  siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL ||
    "https://insurancenews.vn"
) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Legislation",
    legislationType: normalizeVietnameseText(legalDoc.documentType),
    name: normalizeVietnameseText(legalDoc.title),
    description: normalizeVietnameseText(legalDoc.summary),
    identifier: legalDoc.documentNumber,
    legislationDate: legalDoc.issueDate,
    datePublished: legalDoc.issueDate,
    legislationDateVersion: legalDoc.effectiveDate,
    ...(legalDoc.expiryDate && {
      legislationPassedBy: {
        "@type": "Organization",
        name: legalDoc.issuingBody,
      },
    }),
    legislationJurisdiction: {
      "@type": "AdministrativeArea",
      name: "Vietnam",
    },
    inLanguage: "vi-VN",
    url: `${siteUrl}/legal-docs/${legalDoc.documentNumber}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/legal-docs/${legalDoc.documentNumber}`,
    },
    ...(legalDoc.tags &&
      legalDoc.tags.length > 0 && {
        keywords: legalDoc.tags.join(", "),
      }),
    legislationLegalForce:
      legalDoc.status === "active" ? "InForce" : "NotInForce",
    publisher: {
      "@type": "GovernmentOrganization",
      name: legalDoc.issuingBody,
      url: legalDoc.sourceUrl,
    },
    about: {
      "@type": "Thing",
      name: "Bảo hiểm Việt Nam",
      description: "Vietnamese Insurance Regulations",
    },
  };

  return schema;
}

/**
 * Generate Schema.org BreadcrumbList for navigation
 */
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>,
  siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL ||
    "https://insurancenews.vn"
) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: `${siteUrl}${breadcrumb.url}`,
    })),
  };

  return schema;
}

/**
 * Generate Schema.org Organization for company profiles
 */
export function generateOrganizationSchema(
  company: {
    name: string;
    description: string;
    logo?: string;
    website?: string;
    foundingDate?: string;
    address?: string;
    phone?: string;
    email?: string;
  },
  siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL ||
    "https://insurancenews.vn"
) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: company.name,
    description: company.description,
    ...(company.logo && {
      logo: company.logo,
      image: company.logo,
    }),
    ...(company.website && { url: company.website }),
    ...(company.foundingDate && { foundingDate: company.foundingDate }),
    ...(company.address && {
      address: {
        "@type": "PostalAddress",
        addressCountry: "VN",
        streetAddress: company.address,
      },
    }),
    ...(company.phone && { telephone: company.phone }),
    ...(company.email && { email: company.email }),
    areaServed: {
      "@type": "Country",
      name: "Vietnam",
    },
  };

  return schema;
}

/**
 * Generate Schema.org FAQPage for guides
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return schema;
}

/**
 * Generate Schema.org WebSite for homepage
 */
export function generateWebSiteSchema(
  siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL ||
    "https://insurancenews.vn"
) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Insurance Vietnam",
    alternateName: "Tin tức Bảo hiểm Việt Nam",
    url: siteUrl,
    description:
      "Tin tức, phân tích và thông tin pháp luật về ngành bảo hiểm Việt Nam",
    inLanguage: "vi-VN",
    publisher: {
      "@type": "Organization",
      name: "Insurance Vietnam",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return schema;
}

/**
 * Helper to inject Schema.org JSON-LD into page head
 */
export function renderSchema(schema: object) {
  return {
    __html: JSON.stringify(schema),
  };
}

/**
 * Extract keywords from content for H2/H3 injection
 * Based on Vietnamese insurance industry terms
 * All strings are UTF-8 encoded for proper Vietnamese character display
 */
export const TRENDING_KEYWORDS = {
  fraud: ["bảo hiểm lừa đảo", "chiêu trò bảo hiểm", "lừa đảo bảo hiểm"],
  interestRate: [
    "lãi suất manulife",
    "lãi suất prudential",
    "lãi suất bảo việt",
    "lãi suất bảo hiểm nhân thọ",
  ],
  claims: [
    "quy trình bồi thường",
    "thủ tục yêu cầu bồi thường",
    "bồi thường bảo hiểm",
  ],
  socialInsurance: [
    "rút bhxh 1 lần",
    "tra cứu bhyt",
    "tính phí bhxh",
    "đóng bhxh tự nguyện",
  ],
  products: [
    "bảo hiểm nhân thọ",
    "bảo hiểm phi nhân thọ",
    "bảo hiểm y tế",
    "bảo hiểm ô tô",
  ],
  companies: [
    "bảo việt",
    "prudential",
    "manulife",
    "aia",
    "generali",
    "mb ageas life",
  ],
  regulations: [
    "luật kinh doanh bảo hiểm",
    "thông tư 50",
    "nghị định 73",
    "quy định mới bảo hiểm",
  ],
} as const;

/**
 * Generate keyword-rich headings for SEO
 */
export function generateSEOHeading(baseText: string, category: string): string {
  const keywordMap: Record<string, readonly string[]> = {
    macro: TRENDING_KEYWORDS.regulations,
    commercial: [
      ...TRENDING_KEYWORDS.companies,
      ...TRENDING_KEYWORDS.products,
    ] as const,
    social: TRENDING_KEYWORDS.socialInsurance,
    debate: [...TRENDING_KEYWORDS.fraud, ...TRENDING_KEYWORDS.claims] as const,
  };

  const keywords = keywordMap[category] || [];
  if (keywords.length === 0) return baseText;

  // Pick a relevant keyword if base text doesn't already contain it
  const relevantKeyword = keywords.find(
    (kw) => !baseText.toLowerCase().includes(kw)
  );

  if (relevantKeyword) {
    return `${baseText} - ${relevantKeyword}`;
  }

  return baseText;
}

/**
 * Extract meta keywords from content
 */
export function extractKeywords(
  title: string,
  summary: string,
  tags?: string[]
): string {
  const allText = `${title} ${summary}`.toLowerCase();
  const foundKeywords: string[] = [];

  // Check all trending keyword categories
  Object.values(TRENDING_KEYWORDS)
    .flat()
    .forEach((keyword) => {
      if (allText.includes(keyword)) {
        foundKeywords.push(keyword);
      }
    });

  // Add tags
  if (tags && tags.length > 0) {
    foundKeywords.push(...tags);
  }

  // Remove duplicates and return
  return Array.from(new Set(foundKeywords)).join(", ");
}
