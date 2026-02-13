import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCustomers, getAllOrders, type CustomerData } from '../utils/dataManager';

interface Customer {
  id: number;
  name: string;
  pricePerUnit: number;
}

interface OrderAnalysis {
  date: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

function CustomerOrderAnalysisPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('2026-02-01');
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [analysisData, setAnalysisData] = useState<OrderAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Load customers from data manager
    const customersData = getCustomers();
    const customersList = customersData
      .filter(c => c.orders > 0) // Only show customers with orders
      .map((c, index) => ({
        id: index + 1,
        name: c.name,
        pricePerUnit: c.productType === 'Küçük' ? 5.00 : c.productType === 'Orta' ? 12.50 : 45.00
      }));
    
    setCustomers(customersList);
    if (customersList.length > 0) {
      setSelectedCustomerId(customersList[0].id.toString());
    }
  }, []);

  const handleAnalyze = () => {
    if (!selectedCustomerId || !startDate || !endDate) {
      alert('Lütfen müşteri ve tarih aralığını seçin');
      return;
    }

    setIsLoading(true);
    
    // Get real data from orders
    const selectedCustomer = customers.find(c => c.id === parseInt(selectedCustomerId));
    
    if (selectedCustomer) {
      const allOrders = getAllOrders();
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const customerAnalysis: OrderAnalysis[] = [];
      
      allOrders.forEach(dayOrder => {
        const orderDate = new Date(dayOrder.date);
        if (orderDate >= start && orderDate <= end) {
          dayOrder.orders.forEach(order => {
            if (order.customer === selectedCustomer.name) {
              const quantity = parseInt(order.qty.replace(/\./g, '').replace(/,/g, '')) || 0;
              const unitPrice = parseFloat(order.unit.replace(/₺/g, '').replace(/\./g, '').replace(/,/g, '.')) || 0;
              const totalPrice = parseFloat(order.total.replace(/₺/g, '').replace(/\./g, '').replace(/,/g, '.')) || 0;
              
              customerAnalysis.push({
                date: new Date(dayOrder.date).toLocaleDateString('tr-TR'),
                quantity: quantity,
                unitPrice: unitPrice,
                totalPrice: totalPrice
              });
            }
          });
        }
      });
      
      setAnalysisData(customerAnalysis);
      setShowResults(true);
    }
    
    setIsLoading(false);
  };
        
        setAnalysisData(sampleData);
        setShowResults(true);
      }
      
      setIsLoading(false);
    }, 800);

    /* Uncomment this to use real API data
    try {
      const response = await fetch(
        `http://localhost:5088/api/order/customer/${selectedCustomerId}`
      );
      
      if (response.ok) {
        const orders = await response.json();
        const selectedCustomer = customers.find(c => c.id === parseInt(selectedCustomerId));
        
        // Filter orders by date range
        const filteredOrders = orders.filter((order: any) => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
        });

        // Group by date and calculate daily totals
        const groupedByDate: { [key: string]: OrderAnalysis } = {};
        
        filteredOrders.forEach((order: any) => {
          const dateKey = new Date(order.orderDate).toLocaleDateString('tr-TR');
          
          if (!groupedByDate[dateKey]) {
            groupedByDate[dateKey] = {
              date: dateKey,
              quantity: 0,
              unitPrice: selectedCustomer?.pricePerUnit || 0,
              totalPrice: 0
            };
          }
          
          groupedByDate[dateKey].quantity += order.quantity;
          groupedByDate[dateKey].totalPrice += order.totalPrice;
        });

        const analysisArray = Object.values(groupedByDate).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        setAnalysisData(analysisArray);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error fetching order analysis:', error);
      alert('Veri alınırken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
    */
  };

  const totalQuantity = analysisData.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = analysisData.reduce((sum, item) => sum + item.totalPrice, 0);

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
              className="flex items-center gap-3 p-3 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-icons">history</span>
              <span className="hidden lg:block font-medium">Sipariş Geçmişi</span>
            </Link>
            <Link
              to="/customer-analysis"
              className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary transition-colors"
            >
              <span className="material-icons">analytics</span>
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
              <span className="material-icons">assessment</span>
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
          {/* Header Section */}
          <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Müşteri Sipariş Analizi</h1>
              <p className="text-slate-500 text-sm mt-1">
                Müşteri bazında tarih aralığına göre ürün sipariş detaylarını inceleyin.
              </p>
            </div>
            {showResults && (
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-medium">
                  <span className="material-icons text-lg">file_download</span>
                  Excel'e Aktar
                </button>
                <button
                  onClick={handlePrintPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium shadow-sm shadow-primary/20"
                >
                  <span className="material-icons text-lg">picture_as_pdf</span>
                  PDF Kaydet
                </button>
              </div>
            )}
          </header>

          {/* Filter Section */}
          <section className="p-8 print:hidden">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Analiz Kriterleri</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Customer Select */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Müşteri Seçin
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  >
                    <option value="">Müşteri seçin...</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Başlangıç Tarihi
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  />
                </div>

                {/* Analyze Button */}
                <div className="flex items-end">
                  <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium shadow-sm shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-icons text-lg">
                      {isLoading ? 'hourglass_empty' : 'search'}
                    </span>
                    {isLoading ? 'Yükleniyor...' : 'Analiz Et'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Results Section */}
          {showResults && (
            <section className="flex-1 overflow-hidden px-8 pb-8 flex flex-col print:px-4">
              {/* Print-only Header */}
              <div className="hidden print:block mb-6">
                <div className="border-b-2 border-slate-900 pb-4 mb-4">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">LogiTrack - Müşteri Sipariş Analiz Raporu</h1>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-slate-700"><strong>Müşteri:</strong> {customers.find(c => c.id === parseInt(selectedCustomerId))?.name}</p>
                      <p className="text-slate-700"><strong>Tarih Aralığı:</strong> {new Date(startDate).toLocaleDateString('tr-TR')} - {new Date(endDate).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-700"><strong>Rapor Tarihi:</strong></p>
                      <p className="text-slate-900 font-semibold">{new Date().toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden print:shadow-none print:border-2">
                {/* Table Header */}
                <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 print:bg-slate-100">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white print:text-slate-900">
                    Günlük Sipariş Detayları
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 print:hidden">
                    {customers.find(c => c.id === parseInt(selectedCustomerId))?.name} - 
                    {' '}{new Date(startDate).toLocaleDateString('tr-TR')} / {new Date(endDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>

                {/* Table Content */}
                {analysisData.length > 0 ? (
                  <>
                    <div className="flex-1 overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 print:bg-slate-100">
                          <tr className="border-b border-slate-200 dark:border-slate-700 print:border-slate-900">
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider print:text-slate-900">
                              Tarih
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider print:text-slate-900">
                              Miktar
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider print:text-slate-900">
                              Birim Fiyat
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider print:text-slate-900">
                              Toplam Tutar
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 print:divide-slate-200">
                          {analysisData.map((item, index) => (
                            <tr
                              key={index}
                              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors print:hover:bg-transparent"
                            >
                              <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100 print:text-slate-900 print:py-2">
                                {item.date}
                              </td>
                              <td className="px-6 py-4 text-sm text-right font-mono text-slate-700 dark:text-slate-300 print:text-slate-900 print:py-2">
                                {item.quantity.toLocaleString('tr-TR')}
                              </td>
                              <td className="px-6 py-4 text-sm text-right font-mono text-slate-700 dark:text-slate-300 print:text-slate-900 print:py-2">
                                ₺{item.unitPrice.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 text-sm text-right font-mono font-semibold text-primary print:text-slate-900 print:py-2">
                                ₺{item.totalPrice.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals Footer */}
                    <div className="bg-slate-50 dark:bg-slate-800 border-t-2 border-primary px-6 py-4 print:bg-slate-100 print:border-slate-900">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1 print:text-slate-700">
                            Toplam Özet
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">
                            {analysisData.length} gün içinde
                          </p>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-xs text-slate-500 uppercase font-semibold mb-1 print:text-slate-700">
                              Toplam Miktar
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white print:text-slate-900">
                              {totalQuantity.toLocaleString('tr-TR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500 uppercase font-semibold mb-1 print:text-slate-700">
                              Toplam Tutar
                            </p>
                            <p className="text-2xl font-bold text-primary print:text-slate-900">
                              ₺{totalPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Print-only Footer */}
                    <div className="hidden print:block mt-6 pt-4 border-t border-slate-300">
                      <div className="flex justify-between text-xs text-slate-600 px-6">
                        <p>© 2026 LogiTrack - Sipariş Takip Sistemi</p>
                        <p>Yazdırma Tarihi: {new Date().toLocaleString('tr-TR')}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-12">
                    <span className="material-icons text-6xl text-slate-300 dark:text-slate-700 mb-4">
                      bar_chart
                    </span>
                    <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                      Seçilen tarih aralığında sipariş bulunamadı
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                      Farklı bir tarih aralığı deneyin
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Empty State */}
          {!showResults && (
            <section className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-icons text-5xl text-primary">insights</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Müşteri Sipariş Analizine Başlayın
                </h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  Yukarıdaki filtrelerden müşteri seçin ve tarih aralığını belirleyerek
                  detaylı sipariş analizini görüntüleyin.
                </p>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 15mm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          aside {
            display: none !important;
          }
          main {
            margin: 0 !important;
            padding: 20px !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }
          section {
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            height: auto !important;
          }
          table {
            page-break-inside: auto;
            border-collapse: collapse;
            width: 100%;
          }
          thead {
            display: table-header-group;
          }
          tbody {
            display: table-row-group;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          th, td {
            border: 1px solid #ddd !important;
          }
          .bg-slate-50,
          .bg-slate-100 {
            background-color: #f8f9fa !important;
          }
          .text-primary {
            color: #000 !important;
          }
          .rounded-xl {
            border-radius: 0 !important;
          }
          .shadow-sm {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default CustomerOrderAnalysisPage;
