using Microsoft.AspNetCore.Mvc;
using OrderTracking.API.DTOs;
using OrderTracking.API.Services;

namespace OrderTracking.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _service;

        public OrderController(IOrderService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOrderDTO dto)
        {
            var order = await _service.CreateAsync(dto);

            if (order == null)
                return NotFound("Customer not found");

            return Ok(order);
        }

        [HttpGet("by-date")]
        public async Task<IActionResult> GetByDate(DateTime date)
        {
            var orders = await _service.GetByDateAsync(date);
            return Ok(orders);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _service.GetAllAsync();
            return Ok(orders);
        }
        [HttpGet("daily-total")]
        public async Task<IActionResult> GetDailyTotal(DateTime date)
        {
            var total = await _service.GetDailyTotalAsync(date);

            return Ok(new
            {
                date = date.Date,
                totalRevenue = total
            });
        }
        [HttpGet("by-customer/{customerId}")]
        public async Task<IActionResult> GetByCustomer(int customerId)
        {
            var orders = await _service.GetByCustomerIdAsync(customerId);

            if (orders == null || !orders.Any())
                return NotFound("Bu müşteriye ait sipariş bulunamadı.");

            return Ok(orders);
        }

    }
}
