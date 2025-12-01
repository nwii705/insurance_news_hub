import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

/**
 * Complete Footer Component for Insurance Vietnam
 * Includes navigation, contact info, social links, and legal pages
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  // 5 Pillars navigation
  const pillars = [
    {
      name: 'Vĩ mô',
      slug: '/vi-mo',
      description: 'Chính sách, Quy định',
    },
    {
      name: 'Thương mại',
      slug: '/thuong-mai',
      description: 'Doanh nghiệp, Sản phẩm',
    },
    {
      name: 'Xã hội',
      slug: '/xa-hoi',
      description: 'BHXH, BHYT',
    },
    {
      name: 'Tranh luận',
      slug: '/tranh-luan',
      description: 'Phân tích, Bình luận',
    },
    {
      name: 'Thư viện',
      slug: '/thu-vien',
      description: 'Tài liệu, Tra cứu',
    },
  ];

  // Quick links
  const quickLinks = [
    { name: 'Giới thiệu', href: '/about' },
    { name: 'Liên hệ', href: '/contact' },
    { name: 'Quảng cáo', href: '/advertising' },
    { name: 'RSS Feed', href: '/rss.xml' },
  ];

  // Library links
  const libraryLinks = [
    { name: 'Bệnh viện bảo lãnh', href: '/thu-vien?tab=hospital' },
    { name: 'Garage liên kết', href: '/thu-vien?tab=garage' },
    { name: 'Biểu mẫu bảo hiểm', href: '/thu-vien?tab=forms' },
    { name: 'Danh bạ doanh nghiệp', href: '/companies' },
  ];

  // Resources
  const resources = [
    { name: 'Hướng dẫn sử dụng', href: '/guides' },
    { name: 'Câu hỏi thường gặp', href: '/faq' },
    { name: 'API Documentation', href: '/api-docs' },
    { name: 'Sitemap', href: '/sitemap.xml' },
  ];

  return (
    <footer className="bg-gradient-to-br from-trustBlue-900 via-trustBlue-800 to-blue-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white text-trustBlue-500 px-3 py-2 rounded-lg font-bold text-xl">
                BH
              </div>
              <div className="font-serif text-2xl font-bold">
                Insurance Vietnam
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed mb-4">
              Nền tảng tin tức và phân tích chuyên sâu về ngành bảo hiểm Việt Nam.
              Cập nhật pháp luật, sản phẩm, và xu hướng thị trường.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-blue-200">
                <Mail className="h-4 w-4" />
                <a href="mailto:contact@insurancevn.com" className="hover:text-white">
                  contact@insurancevn.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-blue-200">
                <Phone className="h-4 w-4" />
                <a href="tel:+842812345678" className="hover:text-white">
                  +84 28 1234 5678
                </a>
              </div>
              <div className="flex items-center gap-2 text-blue-200">
                <MapPin className="h-4 w-4" />
                <span>Hà Nội & TP. Hồ Chí Minh</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* 5 Pillars Navigation */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">5 Trụ Cột</h3>
            <ul className="space-y-2">
              {pillars.map((pillar) => (
                <li key={pillar.slug}>
                  <Link
                    href={pillar.slug}
                    className="text-blue-200 hover:text-white transition-colors text-sm flex flex-col gap-0.5"
                  >
                    <span className="font-semibold">{pillar.name}</span>
                    <span className="text-xs text-blue-300">{pillar.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Thư viện & Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Thư viện & Tra cứu</h3>
            <ul className="space-y-2 mb-6">
              {libraryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-200 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-serif text-lg font-bold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-200 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & External Links */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Tài nguyên</h3>
            <ul className="space-y-2 mb-6">
              {resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-200 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-serif text-lg font-bold mb-4">Liên kết chính thức</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://mic.gov.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors text-sm inline-flex items-center gap-1"
                >
                  Bộ Tài chính
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://thuvienphapluat.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors text-sm inline-flex items-center gap-1"
                >
                  Thư Viện Pháp Luật
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://baohiemxahoi.gov.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors text-sm inline-flex items-center gap-1"
                >
                  BHXH Việt Nam
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://iav.com.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors text-sm inline-flex items-center gap-1"
                >
                  Hiệp hội BH Việt Nam
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-700 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-blue-200">
          <div>
            © {currentYear} Insurance Vietnam. All rights reserved.
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/about/legal" className="hover:text-white transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link href="/about/privacy" className="hover:text-white transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/about/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
            <Link href="/about/sources" className="hover:text-white transition-colors">
              Nguồn tham khảo
            </Link>
          </div>
        </div>

        {/* License Notice */}
        <div className="mt-6 text-center text-xs text-blue-300">
          Website này tuân thủ Luật Báo chí 2016 và Nghị định 72/2013/NĐ-CP về quản lý, cung cấp, sử dụng dịch vụ Internet
        </div>
      </div>
    </footer>
  );
}

export default Footer;
