using OrderTracking.API.DTOs;
using OrderTracking.API.Models;

namespace OrderTracking.API.Services
{
    public interface IOrderService
    {
        Task<Order> CreateAsync(CreateOrderDTO dto);

        Task<List<Order>> GetByDateAsync(DateTime date);

        Task<List<Order>> GetAllAsync();
        Task<List<Order>> GetByCustomerIdAsync(int customerId);

        Task<decimal> GetDailyTotalAsync(DateTime date);
    }
}
