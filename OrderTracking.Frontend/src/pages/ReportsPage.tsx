import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getTotalStatistics } from '../utils/dataManager';

interface Expense {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
}

function ReportsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, date: '2026-02-13', description: 'Ofis Kira Ödemesi', category: 'Kira', amount: 15000 },
    { id: 2, date: '2026-02-13', description: 'Elektrik Faturası', category: 'Faturalar', amount: 2500 },
    { id: 3, date: '2026-02-12', description: 'Personel Maaş Ödemesi', category: 'Maaşlar', amount: 45000 },
    { id: 4, date: '2026-02-12', description: 'Yakıt Gideri', category: 'Ulaşım', amount: 3200 },
    { id: 5, date: '2026-02-11', description: 'Ofis Malzemeleri', category: 'Malzemeler', amount: 1800 },
    { id: 6, date: '2026-02-11', description: 'İnternet ve Telefon', category: 'Faturalar', amount: 1200 },
    { id: 7, date: '2026-02-10', description: 'Su Faturası', category: 'Faturalar', amount: 850 },
    { id: 8, date: '2026-02-10', description: 'Temizlik Malzemeleri', category: 'Malzemeler', amount: 650 },
    { id: 9, date: '2026-02-09', description: 'Araç Bakım', category: 'Ulaşım', amount: 4500 },
    { id: 10, date: '2026-02-09', description: 'Kargo Giderleri', category: 'Ulaşım', amount: 1200 },
  ]);
  
  const [totalProductQuantity, setTotalProductQuantity] = useState(0);
  const [totalTurnover, setTotalTurnover] = useState(0);
  
  useEffect(() => {
    // Load statistics from data manager
    const stats = getTotalStatistics();
    setTotalProductQuantity(stats.totalQuantity);
    setTotalTurnover(stats.totalRevenue);
  }, []);
  
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: '',
    amount: ''
  });

  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [selectedDateForPrint, setSelectedDateForPrint] = useState<string | null>(null);

  const handlePrintPDF = () => {
    window.print();
  };

  // Date range filter - input values
  const [dateRange, setDateRange] = useState({
    startDate: '2026-02-01',
    endDate: new Date().toISOString().split('T')[0]
  });

  // Applied date range - used for actual filtering
  const [appliedDateRange, setAppliedDateRange] = useState({
    startDate: '2026-02-01',
    endDate: new Date().toISOString().split('T')[0]
  });

  // Apply date range filter
  const handleApplyDateRange = () => {
    setAppliedDateRange({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    });
  };

  // Filter expenses by applied date range
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const start = new Date(appliedDateRange.startDate);
    const end = new Date(appliedDateRange.endDate);
    return expenseDate >= start && expenseDate <= end;
  });

  // Sample stats - replace with real data from API
  const totalProductQuantity = 6440;
  const totalTurnover = 80500;
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Group filtered expenses by date
  const expensesByDate = filteredExpenses.reduce((acc, expense) => {
    const date = expense.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  // Sort dates in descending order
  const sortedDates = Object.keys(expensesByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const toggleDate = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newExpense.description || !newExpense.category || !newExpense.amount) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    const expense: Expense = {
      id: expenses.length + 1,
      date: newExpense.date,
      description: newExpense.description,
      category: newExpense.category,
      amount: parseFloat(newExpense.amount)
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: '',
      amount: ''
    });
  };

  const handleDeleteExpense = (id: number) => {
    if (confirm('Bu gideri silmek istediğinizden emin misiniz?')) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
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
              className="flex items-center gap-3 p-3 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-icons">people</span>
              <span className="hidden lg:block font-medium">Müşteriler</span>
            </Link>
            <Link
              to="/reports"
              className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary transition-colors"
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

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark overflow-hidden">
          {/* Header Section */}
          <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-2">
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                Gider Yönetimi
              </h1>
            </div>
          </header>

          {/* Date Range Filter */}
          <section className="px-8 pt-2">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-2">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-slate-500">date_range</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tarih Aralığı:</span>
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    <label htmlFor="startDate" className="text-sm text-slate-600 dark:text-slate-400">Başlangıç:</label>
                    <input
                      id="startDate"
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                      className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                  <span className="text-slate-400">—</span>
                  <div className="flex items-center gap-2">
                    <label htmlFor="endDate" className="text-sm text-slate-600 dark:text-slate-400">Bitiş:</label>
                    <input
                      id="endDate"
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                      className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={handleApplyDateRange}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium shadow-sm shadow-primary/20"
                >
                  <span className="material-icons text-lg">check</span>
                  Uygula
                </button>
                <div className="text-sm text-slate-500">
                  {filteredExpenses.length} kayıt
                </div>
              </div>
            </div>
          </section>

          {/* Top Stats */}
          <section className="px-8 pt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-0.5">
                Toplam Ürün Miktarı
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{totalProductQuantity.toLocaleString('tr-TR')}</p>
              <p className="text-xs text-slate-500 mt-0.5">Satılan toplam</p>
            </div>
            <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-0.5">
                Toplam Ciro
              </p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">₺{totalTurnover.toLocaleString('tr-TR')}</p>
              <p className="text-xs text-slate-500 mt-0.5">Toplam gelir</p>
            </div>
            <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-0.5">
                Toplam Gider
              </p>
              <p className="text-xl font-bold text-rose-600 dark:text-rose-400">₺{totalExpenses.toLocaleString('tr-TR')}</p>
              <p className="text-xs text-slate-500 mt-0.5">Net kar: ₺{(totalTurnover - totalExpenses).toLocaleString('tr-TR')}</p>
            </div>
          </section>

          {/* Add Expense Section */}
          <section className="px-8 py-1.5">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-2">
              <h2 className="text-xs font-semibold text-slate-900 dark:text-white mb-1.5">Yeni Gider Ekle</h2>
              <form onSubmit={handleAddExpense}>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  {/* Date */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Tarih
                    </label>
                    <input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Kategori
                    </label>
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                    >
                      <option value="">Kategori seçin...</option>
                      <option value="Kira">Kira</option>
                      <option value="Maaşlar">Maaşlar</option>
                      <option value="Faturalar">Faturalar</option>
                      <option value="Ulaşım">Ulaşım</option>
                      <option value="Malzemeler">Malzemeler</option>
                      <option value="Pazarlama">Pazarlama</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Açıklama
                    </label>
                    <input
                      type="text"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      placeholder="Gider açıklaması..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Tutar (₺)
                    </label>
                    <input
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm font-mono"
                    />
                  </div>

                  {/* Submit Button - Full width on mobile */}
                  <div className="md:col-span-5">
                    <button
                      type="submit"
                    className="w-full md:w-auto flex items-center justify-center gap-1 px-4 py-1.5 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all text-xs font-medium shadow-sm shadow-primary/20"
                    >
                      <span className="material-icons text-lg">add</span>
                      Gider Ekle
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>

          {/* Expense History */}
          <section className="flex-1 px-8 pb-3 flex flex-col overflow-hidden">
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
              {/* Grid Header */}
              <div className="grid grid-cols-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider sticky top-0 z-10">
                <div className="px-6 py-4 border-r border-slate-200 dark:border-slate-700">Tarih</div>
                <div className="px-6 py-4 border-r border-slate-200 dark:border-slate-700 text-center">
                  Gider Sayısı
                </div>
                <div className="px-6 py-4 border-r border-slate-200 dark:border-slate-700 text-right">
                  Günlük Gider
                </div>
                <div className="px-6 py-4 text-center">Detay</div>
              </div>

              {/* Scrollable Grid Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredExpenses.length > 0 ? (
                  <>
                    {sortedDates.map((date) => {
                      const dayExpenses = expensesByDate[date];
                      const dayTotal = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                      const isExpanded = expandedDates.has(date);

                      return (
                        <div key={date}>
                          {/* Daily Summary Row - Clickable */}
                          <div
                            onClick={() => setSelectedDateForPrint(date)}
                            className="grid grid-cols-4 border-b border-slate-100 dark:border-slate-800 text-sm items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <div className="px-6 py-4 border-r border-slate-100 dark:border-slate-800 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                              <span className="material-icons text-lg text-slate-400">
                                receipt
                              </span>
                              {new Date(date).toLocaleDateString('tr-TR', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                            <div className="px-6 py-4 border-r border-slate-100 dark:border-slate-800 text-center font-bold text-primary">
                              {dayExpenses.length}
                            </div>
                            <div className="px-6 py-4 border-r border-slate-100 dark:border-slate-800 text-right font-bold text-rose-600 dark:text-rose-400 text-base">
                              ₺{dayTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                            </div>
                            <div className="px-6 py-4 text-center">
                              <span className="material-icons text-slate-400">
                                description
                              </span>
                            </div>
                          </div>

                          {/* Expanded Details - Removed, using modal instead */}
                          {false && isExpanded && (
                            <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                              <table className="w-full">
                                <thead className="bg-slate-100 dark:bg-slate-800">
                                  <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                      Kategori
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                      Açıklama
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                      Tutar
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                      İşlem
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                  {dayExpenses.map((expense) => (
                                    <tr
                                      key={expense.id}
                                      className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                      <td className="px-6 py-3 text-sm">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                          {expense.category}
                                        </span>
                                      </td>
                                      <td className="px-6 py-3 text-sm text-slate-700 dark:text-slate-300">
                                        {expense.description}
                                      </td>
                                      <td className="px-6 py-3 text-sm text-right font-mono font-semibold text-rose-600 dark:text-rose-400">
                                        ₺{expense.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                      </td>
                                      <td className="px-6 py-3 text-center">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteExpense(expense.id);
                                          }}
                                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                                        >
                                          <span className="material-icons text-lg">delete</span>
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <span className="material-icons text-5xl text-slate-300 dark:text-slate-700 mb-2">
                      receipt_long
                    </span>
                    <p className="text-slate-500">Henüz gider kaydı bulunmuyor</p>
                  </div>
                )}
              </div>

              {/* Grid Footer */}
              <div className="bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Toplam: <span className="font-semibold text-slate-700 dark:text-slate-300">{filteredExpenses.length}</span> gider kaydı
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                    Genel Toplam
                  </p>
                  <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                    ₺{totalExpenses.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
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
              <h2 className="text-lg font-bold text-slate-900">Günlük Gider Listesi</h2>
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
              {sortedDates
                .filter((date) => date === selectedDateForPrint)
                .map((date) => {
                  const dayExpenses = expensesByDate[date];
                  const dayTotal = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                  
                  return (
                    <div key={date}>
                      {/* Header Section */}
                      <div className="border-b-2 border-slate-900 pb-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-1">LogiTrack</h1>
                            <p className="text-sm text-slate-600">Günlük Gider Raporu</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-600">Rapor Tarihi</p>
                            <p className="text-xl font-bold text-slate-900">
                              {new Date(date).toLocaleDateString('tr-TR', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Summary Cards */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="border border-slate-200 rounded-lg p-4">
                          <p className="text-xs text-slate-600 uppercase font-semibold mb-1">Gider Sayısı</p>
                          <p className="text-2xl font-bold text-primary">{dayExpenses.length}</p>
                        </div>
                        <div className="border border-slate-200 rounded-lg p-4">
                          <p className="text-xs text-slate-600 uppercase font-semibold mb-1">Günlük Toplam</p>
                          <p className="text-2xl font-bold text-rose-600">₺{dayTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>

                      {/* Expense Table */}
                      <div className="border border-slate-300 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-slate-100">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Kategori
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Açıklama
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Tutar
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {dayExpenses.map((expense, idx) => (
                              <tr key={expense.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                <td className="px-4 py-3 text-sm">
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                    {expense.category}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-900">{expense.description}</td>
                                <td className="px-4 py-3 text-sm text-right font-mono font-semibold text-slate-900">
                                  ₺{expense.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-slate-50">
                            <tr>
                              <td colSpan={2} className="px-4 py-3 text-sm font-bold text-slate-900">
                                TOPLAM
                              </td>
                              <td className="px-4 py-3 text-right text-lg font-bold text-rose-600">
                                ₺{dayTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {/* Footer */}
                      <div className="mt-12 pt-6 border-t border-slate-300">
                        <div className="flex justify-between text-xs text-slate-600">
                          <p>© 2026 LogiTrack - Gider Takip Sistemi</p>
                          <p>Yazdırma Tarihi: {new Date().toLocaleDateString('tr-TR')}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
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

export default ReportsPage;

