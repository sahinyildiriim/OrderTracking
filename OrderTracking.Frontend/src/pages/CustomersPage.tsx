import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCustomers, getCustomerOrders, type CustomerData } from '../utils/dataManager';

function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [currentBalance, setCurrentBalance] = useState(0);
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);

  useEffect(() => {
    // Load customers from data manager
    const customersData = getCustomers();
    setCustomers(customersData);
  }, []);

  const handlePrintPDF = () => {
    window.print();
  };

  const handlePayment = () => {
    const payment = parseFloat(paymentAmount);
    if (!isNaN(payment) && payment > 0) {
      const newBalance = currentBalance - payment;
      setCurrentBalance(newBalance);
      setPaymentAmount('');
      alert(`Ödeme başarılı! Yeni bakiye: ₺${newBalance.toFixed(2)}`);
    }
  };

  const openCustomerDetails = (customer: CustomerData) => {
    setSelectedCustomer(customer);
    // Parse the balance string to number
    const balanceStr = customer.balance.replace(/[₺,.]/g, '').replace(/,/g, '.');
    setCurrentBalance(parseFloat(balanceStr));
    
    // Load customer orders
    const orders = getCustomerOrders(customer.name);
    setCustomerOrders(orders);
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
              className="flex items-center gap-3 p-3 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-icons">insights</span>
              <span className="hidden lg:block font-medium">Müşteri Analizi</span>
            </Link>
            <Link
              to="/customers"
              className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary transition-colors"
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
          {/* Header Section */}
          <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Müşteriler</h1>
              <p className="text-slate-500 text-sm">
                Müşteri hesaplarını, bakiyeleri ve son hareketleri yönetin.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-medium">
                <span className="material-icons text-lg">upload_file</span>
                Müşteri İçe Aktar
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium shadow-sm shadow-primary/20">
                <span className="material-icons text-lg">person_add</span>
                Yeni Müşteri
              </button>
            </div>
          </header>

          {/* Top Stats */}
          <section className="px-8 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
                Toplam Müşteri
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">128</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <span className="material-icons text-xs">arrow_upward</span>
                Bu ay +8
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
                Toplam Bekleyen Bakiye
              </p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">$482,900.00</p>
              <p className="text-xs text-slate-500 mt-1">54 aktif hesap genelinde</p>
            </div>
            <div className="bg-primary px-6 py-4 rounded-xl shadow-lg shadow-primary/20">
              <p className="text-xs text-blue-100 uppercase font-bold tracking-wider mb-1">
                En Güçlü Segment
              </p>
              <p className="text-2xl font-bold text-white">Logistics &amp; Retail</p>
              <p className="text-xs text-blue-50 mt-1">Toplam cironun %68&apos;i</p>
            </div>
          </section>

          {/* Filter Bar */}
          <section className="p-6 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 mx-8 mt-6 rounded-xl shadow-sm">
            <div className="flex flex-col lg:flex-row items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm transition-all"
                  placeholder="Müşteri adı, kodu veya iletişim bilgisine göre ara..."
                  type="text"
                />
              </div>
              {/* Status Filter */}
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <select className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none">
                  <option>Tüm durumlar</option>
                  <option>Sağlıklı hesap</option>
                  <option>Gecikmiş</option>
                  <option>Beklemede</option>
                </select>
                <select className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none">
                  <option>Sırala</option>
                  <option>Bakiye (yüksek → düşük)</option>
                  <option>Son aktivite</option>
                  <option>İsim (A → Z)</option>
                </select>
              </div>
              <button className="px-6 py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-all text-sm">
                Uygula
              </button>
            </div>
          </section>

          {/* Content */}
          <section className="flex-1 overflow-hidden p-8 flex flex-col">
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
              {/* Grid Header */}
              <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <div className="px-6 py-4 border-r border-slate-200 dark:border-slate-700 col-span-2">
                  Müşteri
                </div>
                <div className="px-6 py-4 border-r border-slate-200 dark:border-slate-700">
                  Müşteri Kodu
                </div>
                <div className="px-6 py-4 border-r border-slate-200 dark:border-slate-700 text-right">
                  Güncel Bakiye
                </div>
                <div className="px-6 py-4 border-r border-slate-200 dark:border-slate-700 text-right">
                  Toplam Sipariş
                </div>
                <div className="px-6 py-4 border-r border-slate-200 dark:border-slate-700">
                  Son Aktivite
                </div>
                <div className="px-6 py-4 text-right">Durum</div>
              </div>

              {/* Grid Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar text-sm">
                {customers.map((customer, idx) => (
                <div 
                  key={idx}
                  onClick={() => openCustomerDetails(customer)}
                  className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="px-6 py-3 border-r border-slate-100 dark:border-slate-800 col-span-2 flex flex-col">
                    <span className="font-medium">{customer.name}</span>
                    <span className="text-xs text-slate-500">{customer.description}</span>
                  </div>
                  <div className="px-6 py-3 border-r border-slate-100 dark:border-slate-800 text-slate-500">
                    {customer.code}
                  </div>
                  <div className={`px-6 py-3 border-r border-slate-100 dark:border-slate-800 text-right font-mono font-semibold ${
                    customer.status === 'healthy' ? 'text-emerald-600 dark:text-emerald-400' :
                    customer.status === 'overdue' ? 'text-amber-600 dark:text-amber-400' :
                    'text-slate-700 dark:text-slate-200'
                  }`}>
                    {customer.balance}
                  </div>
                  <div className="px-6 py-3 border-r border-slate-100 dark:border-slate-800 text-right font-mono">
                    {customer.orders}
                  </div>
                  <div className="px-6 py-3 border-r border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">{customer.lastActivity}</span>
                  </div>
                  <div className="px-6 py-3 text-right">
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      customer.status === 'healthy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      customer.status === 'overdue' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      <span className="material-icons text-xs">
                        {customer.status === 'healthy' ? 'check_circle' :
                         customer.status === 'overdue' ? 'warning' : 'pause_circle'}
                      </span>
                      {customer.status === 'healthy' ? 'Sağlıklı' :
                       customer.status === 'overdue' ? 'Gecikmiş' : 'İzleme listesinde'}
                    </span>
                  </div>
                </div>
                ))}
              </div>

              {/* Footer */}
              <div className="bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-500">
                  Gösterilen:{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">1 - 25</span> /{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">128</span> müşteri
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    Sayfa başına satır:
                    <select className="bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
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
                      6
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                      <span className="material-icons text-lg">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* A4 Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 print:p-0 print:bg-white">
          <div className="bg-white rounded-lg shadow-2xl max-w-[210mm] w-full max-h-screen overflow-y-auto print:shadow-none print:max-w-full print:rounded-none print:max-h-full">
            {/* Modal Header - Hidden in Print */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 print:hidden">
              <h2 className="text-lg font-bold text-slate-900">Müşteri Detayları</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium shadow-sm"
                >
                  <span className="material-icons text-lg">picture_as_pdf</span>
                  PDF Kaydet
                </button>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <span className="material-icons text-slate-600">close</span>
                </button>
              </div>
            </div>

            {/* A4 Page Content */}
            <div className="p-12 print:p-8" style={{ minHeight: '297mm' }}>
              {/* Header Section */}
              <div className="border-b-2 border-slate-900 pb-6 mb-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{selectedCustomer.name}</h1>
                    <p className="text-sm text-slate-600 mb-1">{selectedCustomer.description}</p>
                    <p className="text-xs text-slate-500">Müşteri Kodu: {selectedCustomer.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Rapor Tarihi</p>
                    <p className="text-lg font-bold text-slate-900">{new Date().toLocaleDateString('tr-TR')}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">İletişim Bilgileri</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <p className="text-xs text-slate-600 uppercase font-semibold mb-2">E-posta</p>
                    <p className="text-sm text-slate-900">{selectedCustomer.email}</p>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4">
                    <p className="text-xs text-slate-600 uppercase font-semibold mb-2">Telefon</p>
                    <p className="text-sm text-slate-900">{selectedCustomer.phone}</p>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4 col-span-3">
                    <p className="text-xs text-slate-600 uppercase font-semibold mb-2">Adres</p>
                    <p className="text-sm text-slate-900">{selectedCustomer.address}</p>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Finansal Özet</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border border-slate-200 rounded-lg p-4 bg-emerald-50">
                    <p className="text-xs text-slate-600 uppercase font-semibold mb-1">Toplam Sipariş</p>
                    <p className="text-3xl font-bold text-slate-900">{selectedCustomer.orders}</p>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4 bg-blue-50">
                    <p className="text-xs text-slate-600 uppercase font-semibold mb-1">Güncel Bakiye</p>
                    <p className="text-3xl font-bold text-primary">{currentBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}₺</p>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4 bg-amber-50">
                    <p className="text-xs text-slate-600 uppercase font-semibold mb-1">Son Aktivite</p>
                    <p className="text-xl font-bold text-slate-900">{selectedCustomer.lastActivity}</p>
                  </div>
                </div>
              </div>

              {/* Payment Section - Hidden in Print */}
              <div className="mb-8 print:hidden">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Ödeme İşlemleri</h2>
                <div className="border border-slate-300 rounded-lg p-6 bg-slate-50">
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Ödeme Tutarı (₺)
                      </label>
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-lg font-mono"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <button
                      onClick={handlePayment}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-semibold shadow-sm flex items-center gap-2"
                    >
                      <span className="material-icons">payment</span>
                      Ödeme Yap
                    </button>
                  </div>
                  <div className="mt-4 p-4 bg-white rounded border border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Ödeme Sonrası Yeni Bakiye:</span>
                      <span className="text-xl font-bold text-primary">
                        {(currentBalance - (parseFloat(paymentAmount) || 0)).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}₺
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Son Siparişler</h2>
                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  {customerOrders.length > 0 ? (
                    <table className="w-full">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-300">
                            Tarih
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
                        {customerOrders.map((order: any, idx: number) => (
                          <tr key={idx} className="border-b border-slate-200 last:border-b-0">
                            <td className="px-4 py-3 text-sm text-slate-700">{order.date}</td>
                            <td className="px-4 py-3 text-sm text-slate-900 text-right font-mono">{order.qty}</td>
                            <td className="px-4 py-3 text-sm text-slate-600 text-right font-mono">{order.unit}</td>
                            <td className="px-4 py-3 text-sm text-emerald-600 font-bold text-right">{order.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-slate-500">
                      <span className="material-icons text-4xl mb-2 opacity-50">inbox</span>
                      <p>Henüz sipariş bulunmuyor</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-12 pt-6 border-t border-slate-300">
                <div className="flex justify-between text-xs text-slate-600">
                  <p>© 2026 LogiTrack - Sipariş Takip Sistemi</p>
                  <p>Yazdırma Tarihi: {new Date().toLocaleDateString('tr-TR')}</p>
                </div>
              </div>
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

export default CustomersPage;

