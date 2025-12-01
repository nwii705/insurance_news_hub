import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Tag, Clock, Share2, Bookmark, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

import { generateArticleMetadata, generateBreadcrumbs } from '@/lib/seo/metadata';
import { generateNewsArticleSchema, generateBreadcrumbSchema, renderSchema } from '@/lib/seo/schema';
import {
  DisclaimerBadge,
  DisputeDisclaimer,
  AIContentDisclaimer,
  SourceAttribution,
} from '@/components/shared/disclaimer-footer';

// Article type definition
interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  slug: string;
  author?: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  categoryName: string;
  tags: string[];
  featuredImageUrl?: string;
  readingTime: number;
  isAiRewritten: boolean;
  isDisputable: boolean;
  originalUrl?: string;
  originalSource?: string;
  viewCount: number;
}

// Fetch article data from API
async function getArticle(slug: string): Promise<Article | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const res = await fetch(`${API_URL}/api/articles/${slug}`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Fetch related articles
async function getRelatedArticles(slug: string, category: string): Promise<Article[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const res = await fetch(
      `${API_URL}/api/articles?category=${category}&limit=3&exclude=${slug}`,
      {
        next: { revalidate: 600 },
      }
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.slug);

  if (!article) {
    return {
      title: 'Bài viết không tìm thấy | Insurance Vietnam',
    };
  }

  return generateArticleMetadata(article);
}

// Article page component
export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(params.slug, article.category);

  // Generate structured data
  const articleSchema = generateNewsArticleSchema(article);
  const breadcrumbs = generateBreadcrumbs([
    { name: article.categoryName, url: `/${article.category}` },
    { name: article.title, url: `/articles/${article.slug}` },
  ]);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderSchema(articleSchema)}
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
              <Link href={`/${article.category}`} className="hover:text-trustBlue-600">
                {article.categoryName}
              </Link>
              <span>/</span>
              <span className="text-gray-900 truncate">{article.title}</span>
            </nav>
          </div>
        </div>

        {/* Article Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Back Button */}
            <Link
              href={`/${article.category}`}
              className="inline-flex items-center gap-2 text-trustBlue-600 hover:text-trustBlue-700 mb-6 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại {article.categoryName}
            </Link>

            {/* Category Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-trustBlue-500 text-white text-xs font-bold uppercase rounded">
                {article.categoryName}
              </span>
              {article.isAiRewritten && (
                <DisclaimerBadge type="product" />
              )}
            </div>

            {/* Title */}
            <h1 className="article-title mb-4">
              {article.title}
            </h1>

            {/* Summary */}
            <p className="article-lead mb-6">
              {article.summary}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author || 'Ban biên tập'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={article.publishedAt}>
                  {new Date(article.publishedAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{article.readingTime} phút đọc</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{article.viewCount.toLocaleString('vi-VN')} lượt xem</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button className="flex items-center gap-2 px-4 py-2 bg-trustBlue-50 text-trustBlue-700 rounded-lg hover:bg-trustBlue-100 transition-colors">
                <Share2 className="h-4 w-4" />
                Chia sẻ
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Bookmark className="h-4 w-4" />
                Lưu bài
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.featuredImageUrl && (
          <div className="relative w-full h-[400px] md:h-[500px] bg-gray-200">
            <Image
              src={article.featuredImageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            {/* AI Disclaimer */}
            {article.isAiRewritten && <AIContentDisclaimer />}

            {/* Dispute Warning */}
            {article.isDisputable && <DisputeDisclaimer />}

            {/* Main Content */}
            <div
              className="article-body prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-700">Tags:</span>
                  {article.tags.map((tag) => (
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

            {/* Source Attribution */}
            {article.originalUrl && article.originalSource && (
              <SourceAttribution
                originalUrl={article.originalUrl}
                originalSource={article.originalSource}
                publishDate={article.publishedAt}
              />
            )}
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-12">
              <h2 className="font-serif text-2xl font-bold text-trustBlue-500 mb-6">
                Bài viết liên quan
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    href={`/articles/${related.slug}`}
                    className="magazine-card group"
                  >
                    {related.featuredImageUrl && (
                      <div className="relative w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                        <Image
                          src={related.featuredImageUrl}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-serif text-lg font-bold text-trustBlue-500 group-hover:text-trustBlue-600 mb-2 line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {related.summary}
                      </p>
                      <div className="mt-3 text-xs text-gray-500">
                        {new Date(related.publishedAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
