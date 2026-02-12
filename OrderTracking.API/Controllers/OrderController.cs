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
        public async Task<IActionResult> Create(CreateOrderDTO dto)
        {
            var order = await _service.Create(dto);

            if (order == null)
                return NotFound("Customer not found");

            return Ok(order);
        }

        [HttpGet("by-date")]
        public async Task<IActionResult> GetByDate(DateTime date)
        {
            var orders = await _service.GetByDate(date);
            return Ok(orders);
        }
    }
}
