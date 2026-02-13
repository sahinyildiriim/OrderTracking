// Central data management utility for all pages

export interface OrderItem {
  customer: string;
  qty: string;
  unit: string;
  total: string;
}

export interface DailyOrder {
  date: string;
  totalOrders: number;
  totalAmount: string;
  totalQuantity: string;
  status: string;
  orders: OrderItem[];
}

export interface CustomerData {
  name: string;
  description: string;
  code: string;
  balance: string;
  orders: number;
  lastActivity: string;
  status: string;
  email: string;
  phone: string;
  address: string;
  productType?: string;
  totalSpent?: string;
  totalQuantity?: number;
}

// Get all orders from localStorage
export const getAllOrders = (): DailyOrder[] => {
  try {
    const orders = localStorage.getItem('orderHistory');
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
};

// Save orders to localStorage
export const saveOrders = (orders: DailyOrder[]) => {
  try {
    localStorage.setItem('orderHistory', JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders:', error);
  }
};

// Get customer list with aggregated data
export const getCustomers = (): CustomerData[] => {
  const orders = getAllOrders();
  
  // Base customers with their product types and contact info
  const baseCustomers: CustomerData[] = [
    {
      name: 'Global Logistics Corp',
      description: 'Global freight & logistics',
      code: 'CUST-0001',
      balance: '₺0.00',
      orders: 0,
      lastActivity: '-',
      status: 'healthy',
      email: 'contact@globallogistics.com',
      phone: '+90 (555) 123-4567',
      address: 'İstanbul, Türkiye',
      productType: 'Orta',
      totalSpent: '₺0.00',
      totalQuantity: 0
    },
    {
      name: 'Metro Market Retail',
      description: 'National retail chain',
      code: 'CUST-0002',
      balance: '₺0.00',
      orders: 0,
      lastActivity: '-',
      status: 'healthy',
      email: 'orders@metromarket.com',
      phone: '+90 (555) 234-5678',
      address: 'Ankara, Türkiye',
      productType: 'Küçük',
      totalSpent: '₺0.00',
      totalQuantity: 0
    },
    {
      name: 'Apex Tech Solutions',
      description: 'IT services & consulting',
      code: 'CUST-0003',
      balance: '₺0.00',
      orders: 0,
      lastActivity: '-',
      status: 'healthy',
      email: 'info@apextech.com',
      phone: '+90 (555) 345-6789',
      address: 'İzmir, Türkiye',
      productType: 'Büyük',
      totalSpent: '₺0.00',
      totalQuantity: 0
    },
    {
      name: 'Horizon Ventures',
      description: 'Investment & trading',
      code: 'CUST-0004',
      balance: '₺0.00',
      orders: 0,
      lastActivity: '-',
      status: 'healthy',
      email: 'contact@horizon.com',
      phone: '+90 (555) 456-7890',
      address: 'Bursa, Türkiye',
      productType: 'Küçük',
      totalSpent: '₺0.00',
      totalQuantity: 0
    },
    {
      name: 'Summit Health Group',
      description: 'Healthcare services',
      code: 'CUST-0005',
      balance: '₺0.00',
      orders: 0,
      lastActivity: '-',
      status: 'healthy',
      email: 'orders@summithealth.com',
      phone: '+90 (555) 567-8901',
      address: 'Antalya, Türkiye',
      productType: 'Orta',
      totalSpent: '₺0.00',
      totalQuantity: 0
    },
    {
      name: 'Blue Water Marina',
      description: 'Maritime & shipping',
      code: 'CUST-0006',
      balance: '₺0.00',
      orders: 0,
      lastActivity: '-',
      status: 'healthy',
      email: 'info@bluewater.com',
      phone: '+90 (555) 678-9012',
      address: 'Bodrum, Türkiye',
      productType: 'Büyük',
      totalSpent: '₺0.00',
      totalQuantity: 0
    }
  ];

  // Aggregate order data for each customer
  const customerMap = new Map<string, CustomerData>();
  
  baseCustomers.forEach(customer => {
    customerMap.set(customer.name, { ...customer });
  });

  orders.forEach(dayOrder => {
    dayOrder.orders.forEach(order => {
      const customer = customerMap.get(order.customer);
      if (customer) {
        // Parse quantity and amount
        const qty = parseInt(order.qty.replace(/\./g, '').replace(/,/g, '')) || 0;
        const amount = parseFloat(order.total.replace(/₺/g, '').replace(/\./g, '').replace(/,/g, '.')) || 0;
        
        customer.orders++;
        customer.totalQuantity = (customer.totalQuantity || 0) + qty;
        
        const currentSpent = parseFloat(customer.totalSpent?.replace(/₺/g, '').replace(/\./g, '').replace(/,/g, '.') || '0');
        const newSpent = currentSpent + amount;
        customer.totalSpent = `₺${newSpent.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        customer.balance = customer.totalSpent; // For now, balance = total spent
        customer.lastActivity = dayOrder.date;
        
        // Update status based on activity
        const lastDate = new Date(dayOrder.date);
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff > 30) {
          customer.status = 'watch';
        } else if (daysDiff > 60) {
          customer.status = 'overdue';
        } else {
          customer.status = 'healthy';
        }
      }
    });
  });

  return Array.from(customerMap.values());
};

// Get orders for a specific customer
export const getCustomerOrders = (customerName: string): OrderItem[] => {
  const orders = getAllOrders();
  const customerOrders: OrderItem[] = [];
  
  orders.forEach(dayOrder => {
    dayOrder.orders.forEach(order => {
      if (order.customer === customerName) {
        customerOrders.push({
          ...order,
          date: dayOrder.date
        } as any);
      }
    });
  });
  
  return customerOrders;
};

// Calculate total statistics
export const getTotalStatistics = () => {
  const orders = getAllOrders();
  let totalQuantity = 0;
  let totalRevenue = 0;
  let totalOrders = 0;

  orders.forEach(dayOrder => {
    totalOrders += dayOrder.totalOrders;
    
    // Parse quantity
    const qty = parseInt(dayOrder.totalQuantity.replace(/\./g, '').replace(/,/g, '')) || 0;
    totalQuantity += qty;
    
    // Parse amount
    const amount = parseFloat(dayOrder.totalAmount.replace(/₺/g, '').replace(/\./g, '').replace(/,/g, '.')) || 0;
    totalRevenue += amount;
  });

  return {
    totalQuantity,
    totalRevenue,
    totalOrders
  };
};

// Get customer analytics data
export const getCustomerAnalytics = () => {
  const customers = getCustomers();
  
  return customers
    .filter(c => c.orders > 0)
    .sort((a, b) => b.orders - a.orders)
    .map(customer => ({
      name: customer.name,
      orders: customer.orders,
      totalSpent: customer.totalSpent || '₺0.00',
      totalQuantity: customer.totalQuantity || 0,
      lastActivity: customer.lastActivity,
      productType: customer.productType
    }));
};
