import { Link } from 'react-router-dom';
import { useState } from 'react';

function DailyEntryPage() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [quantities, setQuantities] = useState({
    row1: 12,
    row2: 85,
    row3: 3,
    row4: 250,
    row5: 1,
    row6: 40,
    row7: 0
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const handleQuantityChange = (row: string, value: string) => {
    setQuantities({ ...quantities, [row]: parseInt(value) || 0 });
  };

  const handleSaveClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    console.log('Saving orders...', quantities);
    
    // Prepare customer data with their product types
    const customers = [
      { name: 'Global Logistics Corp', productType: 'Orta', quantity: quantities.row1, unitPrice: 12.50 },
      { name: 'Metro Market Retail', productType: 'Küçük', quantity: quantities.row2, unitPrice: 5.00 },
      { name: 'Apex Tech Solutions', productType: 'Büyük', quantity: quantities.row3, unitPrice: 45.00 },
      { name: 'Horizon Ventures', productType: 'Küçük', quantity: quantities.row4, unitPrice: 5.00 },
      { name: 'Summit Health Group', productType: 'Orta', quantity: quantities.row5, unitPrice: 12.50 },
      { name: 'Blue Water Marina', productType: 'Büyük', quantity: quantities.row6, unitPrice: 45.00 }
    ];
    
    // Filter orders with quantity > 0
    const ordersWithQuantity = customers.filter(c => c.quantity > 0);
    
    if (ordersWithQuantity.length > 0) {
      // Calculate totals
      const totalQuantity = ordersWithQuantity.reduce((sum, c) => sum + c.quantity, 0);
      const totalAmount = ordersWithQuantity.reduce((sum, c) => sum + (c.quantity * c.unitPrice), 0);
      
      // Format date as YYYY-MM-DD
      const formattedDate = currentDate.toISOString().split('T')[0];
      
      // Create order data
      const orderData = {
        date: formattedDate,
        totalOrders: ordersWithQuantity.length,
        totalAmount: `₺${totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        totalQuantity: totalQuantity.toLocaleString('tr-TR'),
        status: 'completed',
        orders: ordersWithQuantity.map(c => ({
          customer: c.name,
          qty: c.quantity.toLocaleString('tr-TR'),
          unit: `₺${c.unitPrice.toFixed(2)}`,
          total: `₺${(c.quantity * c.unitPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        }))
      };
      
      // Get existing orders from localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      
      // Check if order for this date already exists and remove it
      const filteredOrders = existingOrders.filter((order: any) => order.date !== formattedDate);
      
      // Add new order at the beginning
      filteredOrders.unshift(orderData);
      
      // Save to localStorage
      localStorage.setItem('orderHistory', JSON.stringify(filteredOrders));
    }
    
    // Reset all quantities to 0
    setQuantities({
      row1: 0,
      row2: 0,
      row3: 0,
      row4: 0,
      row5: 0,
      row6: 0,
      row7: 0
    });
    
    // Move to next day
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setCurrentDate(nextDay);
    
    setShowConfirmModal(false);
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-200 antialiased overflow-hidden">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-20 lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="material-icons text-white text-sm">grid_on</span>
            </div>
            <span className="font-bold text-xl hidden lg:block text-slate-900 dark:text-slate-100">
              LogiTrack
            </span>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <Link
              to="/"
              className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary transition-colors"
            >
              <span className="material-icons">edit_note</span>
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
              className="flex items-center gap-3 p-3 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-icons">analytics</span>
              <span className="hidden lg:block font-medium">Raporlar</span>
            </Link>
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfvE0XGo78WQo3c5k071qRNOKxThVgNZ8fM6nWIRKVIiVIMun0nPrEV6JvO6oai7OeGH43behtk15vBw6Q9NTv4X-SdwIR6YTM-sSavoX1bjojy2bKEO-etLAJSsLcuAjOTL2KtrfqHhKnQVVvlTMtFXdD7Gg78YJLHQ2RXV8cqJnJlDAahAyLIlTsgmIXwnNcFvZ1O0mmuzM8dNKhJQo1TzdSYN7NBmQXk-MKMd_-4v8KX3hW0v_vTAFd7A_50wCrdvfWcSl-RZA"
                  alt="User avatar profile"
                />
              </div>
              <div className="hidden lg:block overflow-hidden">
                <p className="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">
                  Alex Henderson
                </p>
                <p className="text-xs text-slate-500 truncate">Yönetici Hesabı</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Günlük Sipariş Girişi
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bugünkü müşteri siparişlerini hızlıca kaydedin.
                </p>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                <span className="material-icons text-sm">calendar_today</span>
                <span>{formatDate(currentDate)}</span>
              </div>
            </div>
            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-transparent focus:border-primary focus:ring-0 rounded-lg text-sm"
                  placeholder="Müşteri veya ürün ara..."
                  type="text"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-xs md:text-sm hover:bg-primary/90 shadow-sm shadow-primary/30">
                <span className="material-icons text-sm">add</span>
                Satır Ekle
              </button>
            </div>
          </header>

          {/* Spreadsheet Grid */}
          <div className="flex-1 overflow-auto custom-scrollbar bg-background-light dark:bg-background-dark px-4 pb-4">
            <div className="max-w-[1400px] mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse table-fixed">
                <thead className="sticky top-0 z-20 shadow-sm">
                  <tr className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    <th className="w-64 px-6 py-3 sticky-col bg-slate-50 dark:bg-slate-800">
                      Müşteri Adı
                    </th>
                    <th className="w-48 px-6 py-3">Ürün Tipi</th>
                    <th className="w-32 px-6 py-3 text-right">Miktar</th>
                    <th className="w-16 px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 group">
                    <td className="px-6 py-2 sticky-col font-medium text-slate-900 dark:text-slate-200">
                      Global Logistics Corp
                    </td>
                    <td className="px-6 py-2 text-slate-600 dark:text-slate-400">
                      Orta
                    </td>
                    <td className="px-2 py-1">
                      <input
                        className="w-full text-right px-4 py-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-primary focus:ring-0 rounded tabular-nums outline-none"
                        type="number"
                        value={quantities.row1}
                        onChange={(e) => handleQuantityChange('row1', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-2 text-right">
                      <button className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-icons text-sm">close</span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 group">
                    <td className="px-6 py-2 sticky-col font-medium text-slate-900 dark:text-slate-200">
                      Metro Market Retail
                    </td>
                    <td className="px-6 py-2 text-slate-600 dark:text-slate-400">
                      Küçük
                    </td>
                    <td className="px-2 py-1">
                      <input
                        className="w-full text-right px-4 py-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-primary focus:ring-0 rounded tabular-nums outline-none"
                        type="number"
                        value={quantities.row2}
                        onChange={(e) => handleQuantityChange('row2', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-2 text-right">
                      <button className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-icons text-sm">close</span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 group">
                    <td className="px-6 py-2 sticky-col font-medium text-slate-900 dark:text-slate-200">
                      Apex Tech Solutions
                    </td>
                    <td className="px-6 py-2 text-slate-600 dark:text-slate-400">
                      Büyük
                    </td>
                    <td className="px-2 py-1">
                      <input
                        className="w-full text-right px-4 py-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-primary focus:ring-0 rounded tabular-nums outline-none"
                        type="number"
                        value={quantities.row3}
                        onChange={(e) => handleQuantityChange('row3', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-2 text-right">
                      <button className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-icons text-sm">close</span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 group">
                    <td className="px-6 py-2 sticky-col font-medium text-slate-900 dark:text-slate-200">
                      Horizon Ventures
                    </td>
                    <td className="px-6 py-2 text-slate-600 dark:text-slate-400">
                      Küçük
                    </td>
                    <td className="px-2 py-1">
                      <input
                        className="w-full text-right px-4 py-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-primary focus:ring-0 rounded tabular-nums outline-none"
                        type="number"
                        value={quantities.row4}
                        onChange={(e) => handleQuantityChange('row4', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-2 text-right">
                      <button className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-icons text-sm">close</span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 group">
                    <td className="px-6 py-2 sticky-col font-medium text-slate-900 dark:text-slate-200">
                      Summit Health Group
                    </td>
                    <td className="px-6 py-2 text-slate-600 dark:text-slate-400">
                      Orta
                    </td>
                    <td className="px-2 py-1">
                      <input
                        className="w-full text-right px-4 py-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-primary focus:ring-0 rounded tabular-nums outline-none"
                        type="number"
                        value={quantities.row5}
                        onChange={(e) => handleQuantityChange('row5', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-2 text-right">
                      <button className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-icons text-sm">close</span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 group">
                    <td className="px-6 py-2 sticky-col font-medium text-slate-900 dark:text-slate-200">
                      Blue Water Marina
                    </td>
                    <td className="px-6 py-2 text-slate-600 dark:text-slate-400">
                      Büyük
                    </td>
                    <td className="px-2 py-1">
                      <input
                        className="w-full text-right px-4 py-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-primary focus:ring-0 rounded tabular-nums outline-none"
                        type="number"
                        value={quantities.row6}
                        onChange={(e) => handleQuantityChange('row6', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-2 text-right">
                      <button className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-icons text-sm">close</span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 group">
                    <td className="px-6 py-2 sticky-col font-medium text-slate-400 italic">
                      Müşteri seçin...
                    </td>
                    <td className="px-6 py-2 text-slate-400">
                      —
                    </td>
                    <td className="px-2 py-1">
                      <input
                        className="w-full text-right px-4 py-1 bg-transparent border border-dashed border-slate-200 dark:border-slate-700 hover:border-primary focus:border-primary focus:ring-0 rounded tabular-nums outline-none"
                        placeholder="0"
                        type="number"
                        value={quantities.row7 || ''}
                        onChange={(e) => handleQuantityChange('row7', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-2 text-right">
                      <button className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-icons text-sm">close</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer with Save Button */}
          <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-end shadow-lg">
            <button 
              onClick={handleSaveClick}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-emerald-200 dark:shadow-none transition-all active:scale-95"
            >
              <span className="material-icons">save</span>
              Siparişleri Kaydet
            </button>
          </footer>
        </main>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
                  <span className="material-icons text-amber-600 dark:text-amber-400 text-4xl">warning</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Emin misiniz?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Kaydetmek istediğinize emin misiniz?
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleConfirmSave}
                    className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                  <span className="material-icons text-emerald-600 dark:text-emerald-400 text-4xl">check_circle</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Başarılı!
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Sipariş başarıyla kaydedilmiştir
                </p>
                <button
                  onClick={handleSuccessClose}
                  className="w-full px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  Tamam
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyEntryPage;

