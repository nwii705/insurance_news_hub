"use client";

import { useState } from "react";
import { Search, Download, ExternalLink, Building2, Car, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Resource {
  id: string;
  name: string;
  category: "hospital" | "garage" | "form" | "company";
  location?: string;
  phone?: string;
  website?: string;
  downloadUrl?: string;
  description: string;
}

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
  // Add more hospitals...
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
  // Add more garages...
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
  // Add more forms...
];

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"hospital" | "garage" | "form">("hospital");

  const filterResources = (resources: Resource[]) => {
    return resources.filter((resource) => {
      const matchesSearch =
        searchQuery === "" ||
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation =
        locationFilter === "all" ||
        !resource.location ||
        resource.location.includes(locationFilter);

      return matchesSearch && matchesLocation;
    });
  };

  return (
    <div className="min-h-screen bg-softGray-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-trustBlue-600 to-trustBlue-400 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            📚 Thư viện Bảo hiểm
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Tra cứu bệnh viện, garage liên kết & tải biểu mẫu bảo hiểm
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm bệnh viện, garage, biểu mẫu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base bg-white"
                />
              </div>
              <Button size="lg" className="bg-alertRed-500 hover:bg-alertRed-600">
                <Search className="h-5 w-5 mr-2" />
                Tìm kiếm
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="hospital" className="w-full" onValueChange={(v) => setActiveTab(v as any)}>
          {/* Tab Navigation */}
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8 h-auto p-2">
            <TabsTrigger value="hospital" className="flex flex-col items-center gap-2 py-4">
              <Building2 className="h-6 w-6" />
              <span className="font-serif font-bold">Bệnh viện</span>
              <span className="text-xs text-muted-foreground">1,200+ bệnh viện</span>
            </TabsTrigger>
            <TabsTrigger value="garage" className="flex flex-col items-center gap-2 py-4">
              <Car className="h-6 w-6" />
              <span className="font-serif font-bold">Garage</span>
              <span className="text-xs text-muted-foreground">850+ garage</span>
            </TabsTrigger>
            <TabsTrigger value="form" className="flex flex-col items-center gap-2 py-4">
              <FileText className="h-6 w-6" />
              <span className="font-serif font-bold">Biểu mẫu</span>
              <span className="text-xs text-muted-foreground">45+ mẫu</span>
            </TabsTrigger>
          </TabsList>

          {/* Hospital List */}
          <TabsContent value="hospital">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold text-trustBlue-500">
                  Bệnh viện bảo lãnh viện phí
                </h2>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
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

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-softGray-100 border-b border-gray-200">
                    <tr>
                      <th className="p-4 text-left font-semibold">Tên bệnh viện</th>
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
          </TabsContent>

          {/* Garage List */}
          <TabsContent value="garage">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold text-trustBlue-500">
                  Garage liên kết bảo hiểm
                </h2>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Chọn khu vực" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả khu vực</SelectItem>
                    <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                    <SelectItem value="TP.HCM">TP. Hồ Chí Minh</SelectItem>
                    <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterResources(SAMPLE_GARAGES).map((garage) => (
                  <div key={garage.id} className="magazine-card">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                          <Car className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif text-lg font-bold text-trustBlue-500 mb-2">
                            {garage.name}
                          </h3>
                          <div className="space-y-1 text-sm text-muted-foreground mb-3">
                            <div>📍 {garage.location}</div>
                            <div>📞 {garage.phone}</div>
                          </div>
                          <div className="text-sm mb-3">{garage.description}</div>
                          <div className="flex gap-2">
                            {garage.website && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={garage.website} target="_blank" rel="noopener noreferrer">
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
          </TabsContent>

          {/* Forms List */}
          <TabsContent value="form">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-serif text-2xl font-bold text-trustBlue-500 mb-6">
                Biểu mẫu bảo hiểm
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterResources(SAMPLE_FORMS).map((form) => (
                  <div key={form.id} className="magazine-card border-2 border-transparent hover:border-trustBlue-300">
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

                      <h3 className="font-serif text-base font-bold text-trustBlue-500 mb-2 line-clamp-2">
                        {form.name}
                      </h3>

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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
