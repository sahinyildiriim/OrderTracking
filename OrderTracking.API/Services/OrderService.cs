using Microsoft.EntityFrameworkCore;
using OrderTracking.API.Data;
using OrderTracking.API.DTOs;
using OrderTracking.API.Models;

namespace OrderTracking.API.Services
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;

        public OrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Order> CreateAsync(CreateOrderDTO dto)
        {
            var customer = await _context.Customers.FindAsync(dto.CustomerId);

            if (customer == null)
                return null;

            var totalPrice = dto.Quantity * customer.PricePerUnit;

            var order = new Order
            {
                CustomerId = dto.CustomerId,
                Quantity = dto.Quantity,
                TotalPrice = dto.Quantity * customer.PricePerUnit
            };

            _context.Orders.Add(order);

            // 🔥 BAKİYE ARTIRMA
            customer.CurrentBalance += totalPrice;

            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<List<Order>> GetAllAsync()
        {
            return await _context.Orders
                .Include(o => o.Customer)
                .ToListAsync();
        }

        public async Task<List<Order>> GetByDateAsync(DateTime date)
        {
            return await _context.Orders
                .Where(o => o.OrderDate.Date == date.Date)
                .Include(o => o.Customer)
                .ToListAsync();
        }
        public async Task<decimal> GetDailyTotalAsync(DateTime date)
        {
            return await _context.Orders
                .Where(o => o.OrderDate.Date == date.Date)
                .SumAsync(o => o.TotalPrice);
        }
        public async Task<List<Order>> GetByCustomerIdAsync(int customerId)
        {
            return await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .Include(o => o.Customer)
                .ToListAsync();
        }

    }
}
