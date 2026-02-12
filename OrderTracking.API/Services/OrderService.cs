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

        public async Task<Order> Create(CreateOrderDTO dto)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(x => x.Id == dto.CustomerId);

            if (customer == null)
                return null;

            var totalPrice = dto.Quantity * customer.PricePerUnit;

            var order = new Order
            {
                CustomerId = dto.CustomerId,
                Quantity = dto.Quantity,
                TotalPrice = totalPrice,
                OrderDate = DateTime.Now
            };

            _context.Orders.Add(order);

            // 🔥 BAKİYE ARTIRMA
            customer.CurrentBalance += totalPrice;

            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<List<Order>> GetByDate(DateTime date)
        {
            return await _context.Orders
                .Include(x => x.Customer)
                .Where(x => x.OrderDate.Date == date.Date)
                .ToListAsync();
        }
    }
}
