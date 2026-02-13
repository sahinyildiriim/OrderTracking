import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function OrderHistoryPage() {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [selectedDateForPrint, setSelectedDateForPrint] = useState<string | null>(null);
  const [dailyOrders, setDailyOrders] = useState<any[]>([]);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    
    // Sample daily order data (fallback)
    const sampleOrders = [
      {
        date: '2023-10-24',
        totalOrders: 12,
        totalAmount: '$45,750.00',
        totalQuantity: '3,420',
        status: 'completed',
        orders: [
          { customer: 'Acme Global Logistics', qty: '1,240', unit: '$12.50', total: '$15,500.00' },
          { customer: 'Northstar Retail Group', qty: '450', unit: '$45.00', total: '$20,250.00' },
          { customer: 'Silver Creek Foods', qty: '340', unit: '$18.25', total: '$6,205.00' },
        ]
      },
      {
        date: '2023-10-23',
        totalOrders: 8,
        totalAmount: '$28,965.00',
        totalQuantity: '2,185',
        status: 'completed',
        orders: [
          { customer: 'Zenith Manufacturing', qty: '85', unit: '$112.00', total: '$9,520.00' },
          { customer: 'Bright Horizons Inc.', qty: '2,100', unit: '$3.45', total: '$7,245.00' },
        ]
      },
      {
        date: '2023-10-22',
        totalOrders: 6,
        totalAmount: '$18,515.00',
        totalQuantity: '1,240',
        status: 'completed',
        orders: [
          { customer: 'Silver Creek Foods', qty: '340', unit: '$18.25', total: '$6,205.00' },
          { customer: 'Atlas Warehousing', qty: '900', unit: '$5.90', total: '$5,310.00' },
        ]
      },
      {
        date: '2023-10-21',
        totalOrders: 10,
        totalAmount: '$32,150.00',
        totalQuantity: '1,815',
        status: 'completed',
        orders: [
          { customer: 'Quantum Dynamics', qty: '15', unit: '$450.00', total: '$6,750.00' },
          { customer: 'Harbor Shipping Co.', qty: '600', unit: '$14.00', total: '$8,400.00' },
        ]
      },
      {
        date: '2023-10-20',
        totalOrders: 5,
        totalAmount: '$15,998.00',
        totalQuantity: '890',
        status: 'pending',
        orders: [
          { customer: 'Velocity Tech Hub', qty: '200', unit: '$29.99', total: '$5,998.00' },
        ]
      }
    ];
    
    // Combine saved orders with sample orders
    setDailyOrders([...savedOrders, ...sampleOrders]);
  }, []);

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-20 lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="material-icons text-white text-sm">dashboard</span>
            </div>
            <span className="font-bold text-xl hidden lg:block">LogiTrack</span>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <Link
              to="/"
              className="flex items-center gap-3 p-3 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-icons">add_box</span>
              <span className="hidden lg:block font-medium">Günlük Giriş</span>
            </Link>
            <Link
              to="/history"
              className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary transition-colors"
            >
              <span className="material-icons">history</span>
              <span className="hidden lg:block font-medium">Sipariş Geçmişi</span>
            </Link>
            <Link
              to="/customer-analysis"
              className="flex items-center gap-3 p-3 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-icons">insights</span>
              <span className="hidden lg:block font-medium">Müşteri Analizi</span>
            </Link>
            <Link
              to="/customers"
              className="flex items-center gap-3 p-3 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-icons">people</span>
              <span className="hidden lg:block font-medium">Müşteriler</span>
            </Link>
            <Link
              to="/reports"
              className="flex items-center gap-3 p-3 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-icons">analytics</span>
              <span className="hidden lg:block font-medium">Raporlar</span>
            </Link>
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                <img
                  alt="User Profile"
                  className="w-full h-full rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeR6wB_1H4-iy7OTdJYgaVjwUSCbXMGj6lkdMlBCJnly_Fa1cU8SieyawsyggOsqh1TkVVvVJXKgRfSLpI1C0O5kN8jZ0srCSRaSPBYU26adh2s9wh9CaGPEfe6Oz78ODjOMsb7TncuOd7bXyAT6b-zGRe6d0QPK97CgnR3sjgow9tGxbE-Mm5ePqto59_FpmzV3clAXrJplj1Q_-UwO0S3KX4ta5SbCIy3KF5T8ee3MqKnGEhB5CFx1-bcDHi7mVmVVhR9FjXEv8"
                />
              </div>
              <div className="hidden lg:block overflow-hidden">
                <p className="text-sm font-semibold truncate">Alex Henderson</p>
                <p className="text-xs text-slate-500 truncate">Yönetici Hesabı</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark overflow-hidden">
          {/* Header */}
          <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Günlük Sipariş Özeti</h1>
              <p className="text-slate-500">
                Günlere göre toplu sipariş verilerini görüntüleyin ve detaylarına erişin.
              </p>
            </div>
          </header>

          {/* Data Grid Content */}
          <section className="flex-1 overflow-hidden p-8 flex flex-col">
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
              {/* Grid Header */}
              <div className="grid grid-cols-5 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider sticky top-0 z-10">
                <div className="px-6 py-4 border-r border-slate-200 dark:border-slate-700">Tarih</div>
                <div className="px-6 py-4 border-r border-slate-200 dark:border-slate-700 text-center">
                  Toplam Sipariş
                </div>
                <div className="px-6 py-4 border-r border-slate-200 dark:border-slate-700 text-right">
                  Toplam Miktar
                </div>
                <div className="px-6 py-4 border-r border-slate-200 dark:border-slate-700 text-right">
                  Günlük Ciro
                </div>
                <div className="px-6 py-4 text-center">Durum</div>
              </div>

              {/* Scrollable Grid Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {dailyOrders.map((dayData) => (
                  <div key={dayData.date}>
                    {/* Daily Summary Row - Clickable */}
                    <div
                      onClick={() => setSelectedDateForPrint(dayData.date)}
                      className="grid grid-cols-5 excel-grid-row border-b border-slate-100 dark:border-slate-800 text-sm items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="px-6 py-4 border-r border-slate-100 dark:border-slate-800 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-icons text-lg text-slate-400">
                          description
                        </span>
                        {dayData.date}
                      </div>
                      <div className="px-6 py-4 border-r border-slate-100 dark:border-slate-800 text-center font-bold text-primary">
                        {dayData.totalOrders}
                      </div>
                      <div className="px-6 py-4 border-r border-slate-100 dark:border-slate-800 text-right font-mono text-slate-700 dark:text-slate-300">
                        {dayData.totalQuantity}
                      </div>
                      <div className="px-6 py-4 border-r border-slate-100 dark:border-slate-800 text-right font-bold text-emerald-600 dark:text-emerald-400 text-base">
                        {dayData.totalAmount}
                      </div>
                      <div className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          dayData.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            dayData.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`} />
                          {dayData.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid Footer / Pagination */}
              <div className="bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-500">
                  Gösterilen:{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">1 - 5</span> /{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">45</span> gün
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    Sayfa başına satır:
                    <select className="bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                      <option>100</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                      <span className="material-icons text-lg">chevron_left</span>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-medium shadow-sm shadow-primary/20">
                      1
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      2
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      3
                    </button>
                    <span className="px-1 text-slate-400">...</span>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      43
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                      <span className="material-icons text-lg">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Stats Summary */}
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 flex-1 min-w-[200px]">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
                  Toplam Gün Sayısı
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">5</p>
              </div>
              <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 flex-1 min-w-[200px]">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
                  Ortalama Günlük Ciro
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">$28,275.60</p>
              </div>
              <div className="bg-primary px-6 py-4 rounded-xl flex-1 min-w-[200px] shadow-lg shadow-primary/20">
                <p className="text-xs text-blue-100 uppercase font-bold tracking-wider mb-1">
                  Toplam Ciro
                </p>
                <p className="text-2xl font-bold text-white">$141,378.00</p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* A4 Print Modal */}
      {selectedDateForPrint && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 print:p-0 print:bg-white">
          <div className="bg-white rounded-lg shadow-2xl max-w-[210mm] w-full max-h-screen overflow-y-auto print:shadow-none print:max-w-full print:rounded-none print:max-h-full">
            {/* Modal Header - Hidden in Print */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 print:hidden">
              <h2 className="text-lg font-bold text-slate-900">Günlük Sipariş Listesi</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium shadow-sm"
                >
                  <span className="material-icons text-lg">picture_as_pdf</span>
                  PDF Kaydet
                </button>
                <button
                  onClick={() => setSelectedDateForPrint(null)}
                  className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <span className="material-icons text-slate-600">close</span>
                </button>
              </div>
            </div>

            {/* A4 Page Content */}
            <div className="p-12 print:p-8" style={{ minHeight: '297mm' }}>
              {dailyOrders
                .filter((dayData) => dayData.date === selectedDateForPrint)
                .map((dayData) => (
                  <div key={dayData.date}>
                    {/* Header Section */}
                    <div className="border-b-2 border-slate-900 pb-6 mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h1 className="text-3xl font-bold text-slate-900 mb-1">LogiTrack</h1>
                          <p className="text-sm text-slate-600">Günlük Sipariş Raporu</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600">Rapor Tarihi</p>
                          <p className="text-xl font-bold text-slate-900">{dayData.date}</p>
                        </div>
                      </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="border border-slate-200 rounded-lg p-4">
                        <p className="text-xs text-slate-600 uppercase font-semibold mb-1">Toplam Sipariş</p>
                        <p className="text-2xl font-bold text-primary">{dayData.totalOrders}</p>
                      </div>
                      <div className="border border-slate-200 rounded-lg p-4">
                        <p className="text-xs text-slate-600 uppercase font-semibold mb-1">Toplam Miktar</p>
                        <p className="text-2xl font-bold text-slate-900">{dayData.totalQuantity}</p>
                      </div>
                      <div className="border border-slate-200 rounded-lg p-4">
                        <p className="text-xs text-slate-600 uppercase font-semibold mb-1">Günlük Ciro</p>
                        <p className="text-2xl font-bold text-emerald-600">{dayData.totalAmount}</p>
                      </div>
                    </div>

                    {/* Order Table */}
                    <div className="border border-slate-300 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-300">
                              #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-300">
                              Müşteri Adı
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-300">
                              Miktar
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-300">
                              Birim Fiyat
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-300">
                              Toplam Tutar
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {dayData.orders.map((order, idx) => (
                            <tr key={idx} className="border-b border-slate-200 last:border-b-0">
                              <td className="px-4 py-3 text-sm text-slate-600">{idx + 1}</td>
                              <td className="px-4 py-3 text-sm font-medium text-slate-900">{order.customer}</td>
                              <td className="px-4 py-3 text-sm text-right font-mono text-slate-700">{order.qty}</td>
                              <td className="px-4 py-3 text-sm text-right font-mono text-slate-700">{order.unit}</td>
                              <td className="px-4 py-3 text-sm text-right font-bold text-primary">{order.total}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-slate-50">
                          <tr>
                            <td colSpan={4} className="px-4 py-4 text-right text-sm font-bold text-slate-900 border-t-2 border-slate-300">
                              Genel Toplam:
                            </td>
                            <td className="px-4 py-4 text-right text-lg font-bold text-emerald-600 border-t-2 border-slate-300">
                              {dayData.totalAmount}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-6 border-t border-slate-300">
                      <div className="flex justify-between text-xs text-slate-600">
                        <p>© 2026 LogiTrack - Sipariş Takip Sistemi</p>
                        <p>Yazdırma Tarihi: {new Date().toLocaleDateString('tr-TR')}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}

export default OrderHistoryPage;
