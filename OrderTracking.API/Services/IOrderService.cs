using OrderTracking.API.DTOs;
using OrderTracking.API.Models;

namespace OrderTracking.API.Services
{
    public interface IOrderService
    {
        Task<Order> Create(CreateOrderDTO dto);

        Task<List<Order>> GetByDate(DateTime date);
    }
}
