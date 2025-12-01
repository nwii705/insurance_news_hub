"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, PieChart as PieChartIcon } from "lucide-react";

// Market Share Data
const MARKET_SHARE_DATA = [
  { company: "Bảo Việt", share: 18.5, premium: 45000 },
  { company: "Prudential", share: 15.2, premium: 37000 },
  { company: "Manulife", share: 12.8, premium: 31200 },
  { company: "AIA", share: 10.5, premium: 25600 },
  { company: "Generali", share: 8.3, premium: 20200 },
  { company: "MB Ageas", share: 6.7, premium: 16300 },
  { company: "Dai-ichi Life", share: 5.9, premium: 14400 },
  { company: "FWD", share: 5.1, premium: 12400 },
  { company: "Sun Life", share: 4.2, premium: 10200 },
  { company: "Khác", share: 12.8, premium: 31200 },
];

// Interest Rate Comparison Data
const INTEREST_RATE_DATA = [
  { product: "BH Liên kết ĐT", rate: 8.5, company: "Manulife" },
  { product: "BH Hưu trí", rate: 7.2, company: "Prudential" },
  { product: "BH Học vấn", rate: 6.8, company: "Bảo Việt" },
  { product: "BH Truyền thống", rate: 5.5, company: "AIA" },
  { product: "BH Hỗn hợp", rate: 6.2, company: "Generali" },
];

const COLORS = [
  "#003366", // Trust Blue
  "#0066cc",
  "#3399ff",
  "#66b3ff",
  "#99ccff",
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#d1d5db", // Gray for "Other"
];

export function MarketDataWidget() {
  const [activeChart, setActiveChart] = useState<"marketshare" | "interest">("marketshare");

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <Tabs defaultValue="marketshare" className="w-full" onValueChange={(v) => setActiveChart(v as any)}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-2xl font-bold text-trustBlue-500">
            Dữ liệu thị trường
          </h3>
          <TabsList>
            <TabsTrigger value="marketshare" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Thị phần
            </TabsTrigger>
            <TabsTrigger value="interest" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Lãi suất
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Market Share Chart */}
        <TabsContent value="marketshare">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-1">Top 10 Công ty Bảo hiểm</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Thị phần theo doanh thu phí (%) - Năm 2024
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={MARKET_SHARE_DATA}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="share"
                    >
                      {MARKET_SHARE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, "Thị phần"]}
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={MARKET_SHARE_DATA.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="company" angle={-45} textAnchor="end" height={100} />
                    <YAxis label={{ value: "Thị phần (%)", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, "Thị phần"]}
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                    />
                    <Bar dataKey="share" fill="#003366" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-softGray-100 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-trustBlue-500">243.5 nghìn tỷ</div>
                <div className="text-sm text-muted-foreground">Tổng doanh thu phí</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">+18.5%</div>
                <div className="text-sm text-muted-foreground">Tăng trưởng YoY</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">65 công ty</div>
                <div className="text-sm text-muted-foreground">Hoạt động tại VN</div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Interest Rate Comparison */}
        <TabsContent value="interest">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-1">So sánh Lãi suất Bảo hiểm</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Lãi suất cam kết/kỳ vọng theo sản phẩm (%/năm)
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={INTEREST_RATE_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" label={{ value: "Lãi suất (%/năm)", position: "insideBottom", offset: -5 }} />
                <YAxis dataKey="product" type="category" width={150} />
                <Tooltip
                  formatter={(value: number) => [`${value}%/năm`, "Lãi suất"]}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                />
                <Legend />
                <Bar dataKey="rate" fill="#10b981" name="Lãi suất" />
              </BarChart>
            </ResponsiveContainer>

            {/* Interest Rate Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-softGray-100">
                  <tr>
                    <th className="p-3 text-left font-semibold">Sản phẩm</th>
                    <th className="p-3 text-left font-semibold">Công ty</th>
                    <th className="p-3 text-right font-semibold">Lãi suất</th>
                    <th className="p-3 text-center font-semibold">Đánh giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {INTEREST_RATE_DATA.map((item, index) => (
                    <tr key={index} className="hover:bg-softGray-50">
                      <td className="p-3 font-medium">{item.product}</td>
                      <td className="p-3 text-muted-foreground">{item.company}</td>
                      <td className="p-3 text-right font-bold text-emerald-600">
                        {item.rate}%/năm
                      </td>
                      <td className="p-3 text-center">
                        {item.rate >= 8 ? "⭐⭐⭐" : item.rate >= 7 ? "⭐⭐" : "⭐"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm">
              <p className="text-muted-foreground">
                <strong>Lưu ý:</strong> Lãi suất bảo hiểm liên kết đầu tư là lãi suất kỳ vọng, không được đảm bảo. 
                Lãi suất thực tế phụ thuộc vào hiệu quả đầu tư của quỹ.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Data Source */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-muted-foreground">
        <p>
          📊 Nguồn dữ liệu: Hiệp hội Bảo hiểm Việt Nam (IAV), Cục Quản lý, giám sát bảo hiểm - Bộ Tài chính
          <br />
          🔄 Cập nhật: Quý 3/2024
        </p>
      </div>
    </div>
  );
}
