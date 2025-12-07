"use client";

import { useState } from "react";
import {
  Search,
  Download,
  ExternalLink,
  Building2,
  Car,
  FileText,
  BarChart2,
  ScrollText,
  Scale,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ========= TYPES & SAMPLE DATA ========= */

interface Resource {
  id: string;
  name: string;
  category: "hospital" | "garage" | "form";
  location?: string;
  phone?: string;
  website?: string;
  downloadUrl?: string;
  description: string;
}

type LegalDoc = {
  id: string;
  code: string;
  title: string;
  type: "Luật" | "Nghị định" | "Thông tư" | "Quyết định";
  year: number;
  summary: string;
};

type Report = {
  id: string;
  title: string;
  period: string;
  tag: "Báo cáo năm" | "Báo cáo quý" | "Thống kê";
  summary: string;
};

type PolicyTerm = {
  id: string;
  name: string;
  productType: string;
  downloadUrl?: string;
  description: string;
};

const LEGAL_DOCS: LegalDoc[] = [
  {
    id: "doc-1",
    code: "Luật KDBH 2022",
    title: "Luật Kinh doanh bảo hiểm (sửa đổi) năm 2022",
    type: "Luật",
    year: 2022,
    summary:
      "Khung pháp lý nền tảng điều chỉnh hoạt động kinh doanh bảo hiểm, tái bảo hiểm và phân phối bảo hiểm tại Việt Nam.",
  },
  {
    id: "doc-2",
    code: "NĐ 46/2023/NĐ-CP",
    title:
      "Nghị định quy định chi tiết một số điều của Luật Kinh doanh bảo hiểm",
    type: "Nghị định",
    year: 2023,
    summary:
      "Hướng dẫn cấp phép, quản trị rủi ro, biên khả năng thanh toán và kênh phân phối bảo hiểm.",
  },
  {
    id: "doc-3",
    code: "TT 12/2024/TT-BTC",
    title:
      "Thông tư hướng dẫn triển khai bán bảo hiểm qua tổ chức tín dụng (bancassurance)",
    type: "Thông tư",
    year: 2024,
    summary:
      "Quy định trách nhiệm của doanh nghiệp bảo hiểm và ngân hàng trong tư vấn, bán hàng và chăm sóc khách hàng.",
  },
];

const REPORTS: Report[] = [
  {
    id: "rep-1",
    title: "Báo cáo thị trường bảo hiểm Việt Nam năm 2024",
    period: "Năm 2024",
    tag: "Báo cáo năm",
    summary:
      "Toàn cảnh quy mô thị trường, thị phần doanh nghiệp, tốc độ tăng trưởng phí và các xu hướng sản phẩm chính.",
  },
  {
    id: "rep-2",
    title: "Thống kê bồi thường bảo hiểm sức khỏe quý I/2025",
    period: "Quý I/2025",
    tag: "Thống kê",
    summary:
      "Tỷ lệ chi trả, nhóm bệnh chiếm tỷ trọng cao và các thay đổi trong hành vi sử dụng quyền lợi bảo hiểm.",
  },
  {
    id: "rep-3",
    title: "Báo cáo quản lý, giám sát bảo hiểm năm 2023",
    period: "Năm 2023",
    tag: "Báo cáo năm",
    summary:
      "Tổng hợp hoạt động thanh tra, xử phạt, các vi phạm điển hình và khuyến nghị hoàn thiện khung pháp lý.",
  },
];

const SAMPLE_HOSPITALS: Resource[] = [
  {
    id: "h1",
    name: "Bệnh viện Chợ Rẫy",
    category: "hospital",
    location: "TP.HCM",
    phone: "028-3855-4137",
    website: "http://choray.vn",
    description: "Bảo lãnh viện phí tất cả các công ty bảo hiểm",
  },
  {
    id: "h2",
    name: "Bệnh viện Bạch Mai",
    category: "hospital",
    location: "Hà Nội",
    phone: "024-3869-3731",
    website: "http://benhvienbachmai.vn",
    description: "Hỗ trợ bảo lãnh cho Prudential, Bảo Việt, Manulife",
  },
];

const SAMPLE_GARAGES: Resource[] = [
  {
    id: "g1",
    name: "Garage Honda Ô tô Sài Gòn",
    category: "garage",
    location: "TP.HCM - Quận 1",
    phone: "028-3825-6789",
    website: "http://honda-saigon.com",
    description: "Liên kết với PVI, Liberty, VNI",
  },
  {
    id: "g2",
    name: "Trung tâm sửa chữa Toyota Hà Nội",
    category: "garage",
    location: "Hà Nội - Hai Bà Trưng",
    phone: "024-3974-1234",
    website: "http://toyota-hanoi.vn",
    description: "Bảo lãnh cho PJICO, Bảo Minh, PTI",
  },
];

const SAMPLE_FORMS: Resource[] = [
  {
    id: "f1",
    name: "Mẫu đơn yêu cầu bồi thường bảo hiểm nhân thọ",
    category: "form",
    downloadUrl: "/forms/claim-life-insurance.pdf",
    description: "Biểu mẫu chuẩn theo thông tư 39/2019/TT-BTC",
  },
  {
    id: "f2",
    name: "Hợp đồng bảo hiểm xe ô tô mẫu",
    category: "form",
    downloadUrl: "/forms/car-insurance-contract.pdf",
    description: "Hợp đồng bảo hiểm TNDS & vật chất xe ô tô",
  },
];

const SAMPLE_POLICY_TERMS: PolicyTerm[] = [
  {
    id: "t1",
    name: "Quy tắc điều khoản bảo hiểm nhân thọ truyền thống",
    productType: "Nhân thọ – Truyền thống",
    downloadUrl: "/terms/life-traditional.pdf",
    description:
      "Quy định quyền lợi tử vong, thương tật toàn bộ vĩnh viễn, thời hạn hợp đồng và loại trừ bảo hiểm.",
  },
  {
    id: "t2",
    name: "Quy tắc điều khoản bảo hiểm sức khỏe toàn diện",
    productType: "Sức khỏe",
    downloadUrl: "/terms/health-comprehensive.pdf",
    description:
      "Điều khoản chi trả viện phí, phẫu thuật, điều trị ngoại trú và giới hạn trách nhiệm theo năm.",
  },
  {
    id: "t3",
    name: "Quy tắc điều khoản bảo hiểm vật chất xe ô tô",
    productType: "Xe cơ giới",
    downloadUrl: "/terms/motor-vehicle.pdf",
    description:
      "Phạm vi bảo hiểm, mức khấu trừ, quy định bồi thường tổn thất bộ phận và tổn thất toàn bộ.",
  },
];

/* ========= COMPONENT ========= */

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");

  const filterResources = (resources: Resource[]) => {
    const q = searchQuery.toLowerCase().trim();
    return resources.filter((resource) => {
      const matchesSearch =
        q === "" ||
        resource.name.toLowerCase().includes(q) ||
        resource.description.toLowerCase().includes(q);

      const matchesLocation =
        locationFilter === "all" ||
        !resource.location ||
        resource.location.includes(locationFilter);

      return matchesSearch && matchesLocation;
    });
  };

  const matchesSearchText = (text: string) =>
    searchQuery === "" || text.toLowerCase().includes(searchQuery.toLowerCase());

  return (
    <div className="min-h-screen bg-softGray-100">
      {/* HERO */}
      <div className="bg-gradient-to-r from-trustBlue-600 to-trustBlue-400 text-white py-12">
        <div className="container mx-auto px-4 max-w-[1100px]">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            📚 Thư viện Bảo hiểm
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            Văn bản pháp luật, báo cáo thị trường & bộ công cụ tra cứu bệnh
            viện, garage, biểu mẫu, điều khoản bảo hiểm.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Tìm văn bản, báo cáo, bệnh viện, garage, biểu mẫu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base bg-white"
                />
              </div>
              <Button
                size="lg"
                className="bg-alertRed-500 hover:bg-alertRed-600"
              >
                <Search className="h-5 w-5 mr-2" />
                Tìm kiếm
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT – 3 BLOCKS LIÊN TIẾP */}
      <div className="container mx-auto px-4 py-8 max-w-[1100px] space-y-12">
        {/* 1. VĂN BẢN PHÁP LUẬT */}
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-trustBlue-600" />
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">
                  Văn bản pháp luật
                </h2>
                <p className="text-xs md:text-sm text-slate-600 mt-1">
                  Luật, nghị định, thông tư, quyết định điều chỉnh hoạt động
                  kinh doanh bảo hiểm.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              Xem tất cả
            </Button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-softGray-200 bg-white">
            <div className="hidden md:grid grid-cols-12 gap-2 border-b border-softGray-200 bg-softGray-50 px-4 py-2 text-[11px] font-semibold text-slate-500">
              <div className="col-span-2">Loại / Năm</div>
              <div className="col-span-4">Số / Ký hiệu</div>
              <div className="col-span-6">Nội dung chính</div>
            </div>

            <ul className="divide-y divide-softGray-200">
              {LEGAL_DOCS.filter((doc) =>
                matchesSearchText(`${doc.code} ${doc.title} ${doc.summary}`)
              ).map((doc) => (
                <li
                  key={doc.id}
                  className="px-4 py-3 hover:bg-softGray-50 transition"
                >
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-12 md:items-start">
                    <div className="md:col-span-2 flex items-center gap-2 text-xs">
                      <span className="inline-flex items-center rounded-full border border-softGray-300 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                        {doc.type}
                      </span>
                      <span className="text-slate-500">{doc.year}</span>
                    </div>

                    <div className="md:col-span-4">
                      <p className="text-sm font-semibold text-trustBlue-700 leading-snug">
                        <button className="hover:underline text-left">
                          {doc.code}
                        </button>
                      </p>
                      <p className="text-xs text-slate-800 mt-0.5">
                        {doc.title}
                      </p>
                    </div>

                    <div className="md:col-span-6 mt-1 md:mt-0 flex items-start justify-between gap-3">
                      <p className="text-xs text-slate-700 leading-snug">
                        {doc.summary}
                      </p>
                      <span className="mt-0.5 inline-flex h-6 items-center rounded-full bg-softGray-100 px-2 text-[11px] text-slate-600">
                        PDF
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 2. BÁO CÁO & THỐNG KÊ */}
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-trustBlue-600" />
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">
                  Báo cáo & thống kê
                </h2>
                <p className="text-xs md:text-sm text-slate-600 mt-1">
                  Báo cáo thị trường, số liệu bồi thường, thống kê doanh thu và
                  hoạt động giám sát theo năm, quý.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              Xem kho báo cáo
            </Button>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {/* Card lớn bên trái */}
            {REPORTS.length > 0 && (
              <article className="lg:col-span-2 rounded-2xl border border-softGray-200 bg-white p-5 flex flex-col md:flex-row gap-4">
                <div className="md:w-1/3">
                  <div className="flex h-full items-center justify-center rounded-xl bg-softGray-100 text-[11px] text-slate-500">
                    Biểu đồ / Infographic
                  </div>
                </div>
                <div className="md:w-2/3 flex flex-col">
                  <span className="inline-flex items-center rounded-full bg-trustBlue-50 px-2 py-0.5 text-[11px] font-semibold text-trustBlue-700 mb-2 w-fit">
                    {REPORTS[0].tag}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-slate-900 leading-snug mb-1">
                    <button className="hover:text-alertRed-600 text-left">
                      {REPORTS[0].title}
                    </button>
                  </h3>
                  <p className="text-xs text-slate-500 mb-2">
                    Kỳ báo cáo: {REPORTS[0].period}
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {REPORTS[0].summary}
                  </p>
                </div>
              </article>
            )}

            {/* Cột list bên phải */}
            <div className="rounded-2xl border border-softGray-200 bg-white p-4">
              <h4 className="text-xs font-semibold text-slate-600 mb-3">
                Báo cáo & thống kê mới nhất
              </h4>
              <ul className="space-y-3">
                {REPORTS.slice(1)
                  .filter((r) =>
                    matchesSearchText(
                      `${r.title} ${r.summary} ${r.period} ${r.tag}`
                    )
                  )
                  .map((rep) => (
                    <li
                      key={rep.id}
                      className="border-b border-softGray-100 pb-2 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center rounded-full bg-softGray-100 px-2 py-0.5 text-[11px] text-slate-600">
                          {rep.tag}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {rep.period}
                        </span>
                      </div>
                      <button className="text-sm font-medium leading-snug text-slate-900 hover:text-alertRed-600 text-left">
                        {rep.title}
                      </button>
                      <p className="mt-1 text-xs text-slate-700 leading-snug">
                        {rep.summary}
                      </p>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 3. THƯ VIỆN TRA CỨU (SHOW LUÔN 4 PHẦN) */}
        <section>
          {/* Tiện ích tra cứu */}
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">
            Tiện ích tra cứu
          </h2>
          <p className="text-xs md:text-sm text-slate-600 mb-4">
            Bộ công cụ tra cứu nhanh dành cho nhà quản lý, doanh nghiệp và khách
            hàng: bệnh viện bảo lãnh, garage, biểu mẫu và điều khoản sản phẩm.
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <article className="rounded-2xl border border-softGray-200 bg-white p-4">
              <div className="mb-2 text-2xl">🏥</div>
              <h3 className="font-serif text-base font-bold text-slate-900 mb-1">
                Bệnh viện bảo lãnh
              </h3>
              <p className="text-xs text-slate-700 leading-snug">
                Danh sách bệnh viện chấp nhận bảo lãnh viện phí.
              </p>
            </article>

            <article className="rounded-2xl border border-softGray-200 bg-white p-4">
              <div className="mb-2 text-2xl">🚗</div>
              <h3 className="font-serif text-base font-bold text-slate-900 mb-1">
                Garage liên kết
              </h3>
              <p className="text-xs text-slate-700 leading-snug">
                Tra cứu garage sửa chữa ô tô liên kết với các hãng bảo hiểm.
              </p>
            </article>

            <article className="rounded-2xl border border-softGray-200 bg-white p-4">
              <div className="mb-2 text-2xl">📄</div>
              <h3 className="font-serif text-base font-bold text-slate-900 mb-1">
                Biểu mẫu & đơn từ
              </h3>
              <p className="text-xs text-slate-700 leading-snug">
                Tải mẫu đơn bồi thường, đổi hợp đồng, tái tục, hủy hợp đồng.
              </p>
            </article>

            <article className="rounded-2xl border border-softGray-200 bg-white p-4">
              <div className="mb-2 text-2xl">⚖️</div>
              <h3 className="font-serif text-base font-bold text-slate-900 mb-1">
                Quy tắc điều khoản
              </h3>
              <p className="text-xs text-slate-700 leading-snug">
                Tra cứu điều khoản chi tiết của từng nhóm sản phẩm bảo hiểm.
              </p>
            </article>
          </div>

          {/* 3.1 Bệnh viện bảo lãnh */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold text-trustBlue-500">
                Bệnh viện bảo lãnh viện phí
              </h3>
              <Select
                value={locationFilter}
                onValueChange={setLocationFilter}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Chọn khu vực" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả khu vực</SelectItem>
                  <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                  <SelectItem value="TP.HCM">TP. Hồ Chí Minh</SelectItem>
                  <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                  <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-softGray-100 border-b border-gray-200">
                    <tr>
                      <th className="p-4 text-left font-semibold">
                        Tên bệnh viện
                      </th>
                      <th className="p-4 text-left font-semibold">Địa chỉ</th>
                      <th className="p-4 text-left font-semibold">Liên hệ</th>
                      <th className="p-4 text-left font-semibold">Bảo lãnh</th>
                      <th className="p-4 text-center font-semibold">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filterResources(SAMPLE_HOSPITALS).map((hospital) => (
                      <tr key={hospital.id} className="hover:bg-softGray-50">
                        <td className="p-4">
                          <div className="font-semibold text-trustBlue-500">
                            {hospital.name}
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {hospital.location}
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div>📞 {hospital.phone}</div>
                            {hospital.website && (
                              <a
                                href={hospital.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-trustBlue-600 hover:underline inline-flex items-center gap-1"
                              >
                                🌐 Website
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {hospital.description}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <Button size="sm" variant="outline">
                            Chi tiết
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 3.2 Garage liên kết */}
          <section className="mb-10">
            <h3 className="font-serif text-2xl font-bold text-trustBlue-500 mb-4">
              Garage liên kết bảo hiểm
            </h3>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterResources(SAMPLE_GARAGES).map((garage) => (
                  <div key={garage.id} className="magazine-card">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                          <Car className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-serif text-lg font-bold text-trustBlue-500 mb-2">
                            {garage.name}
                          </h4>
                          <div className="space-y-1 text-sm text-muted-foreground mb-3">
                            <div>📍 {garage.location}</div>
                            <div>📞 {garage.phone}</div>
                          </div>
                          <div className="text-sm mb-3">
                            {garage.description}
                          </div>
                          <div className="flex gap-2">
                            {garage.website && (
                              <Button size="sm" variant="outline" asChild>
                                <a
                                  href={garage.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  Website
                                </a>
                              </Button>
                            )}
                            <Button size="sm">Liên hệ</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3.3 Biểu mẫu & đơn từ */}
          <section className="mb-10">
            <h3 className="font-serif text-2xl font-bold text-trustBlue-500 mb-4">
              Biểu mẫu & đơn từ
            </h3>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterResources(SAMPLE_FORMS).map((form) => (
                  <div
                    key={form.id}
                    className="magazine-card border-2 border-transparent hover:border-trustBlue-300"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-semibold">
                            PDF
                          </span>
                        </div>
                      </div>

                      <h4 className="font-serif text-base font-bold text-trustBlue-500 mb-2 line-clamp-2">
                        {form.name}
                      </h4>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {form.description}
                      </p>

                      <Button className="w-full" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Tải xuống
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3.4 Quy tắc điều khoản */}
          <section className="mb-4">
            <h3 className="font-serif text-2xl font-bold text-trustBlue-500 mb-4">
              Quy tắc điều khoản sản phẩm
            </h3>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SAMPLE_POLICY_TERMS.filter((term) =>
                  matchesSearchText(
                    `${term.name} ${term.productType} ${term.description}`
                  )
                ).map((term) => (
                  <article
                    key={term.id}
                    className="rounded-2xl border border-softGray-200 p-4 flex flex-col"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                        <Scale className="h-4 w-4 text-amber-700" />
                      </div>
                      <span className="text-[11px] bg-softGray-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {term.productType}
                      </span>
                    </div>
                    <h4 className="font-serif text-sm font-bold text-slate-900 mb-2 leading-snug">
                      {term.name}
                    </h4>
                    <p className="text-xs text-slate-700 leading-snug mb-3 flex-1">
                      {term.description}
                    </p>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Tải quy tắc
                    </Button>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}
