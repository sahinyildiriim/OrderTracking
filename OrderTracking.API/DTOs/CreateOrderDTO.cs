namespace OrderTracking.API.DTOs
{
    public class CreateOrderDTO
    {
        public int CustomerId { get; set; }

        public int Quantity { get; set; }
    }
}
