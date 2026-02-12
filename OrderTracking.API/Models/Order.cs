using System;
using System.Text.Json.Serialization;

namespace OrderTracking.API.Models
{
    public class Order
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }
        
        
        [JsonIgnore]
        public Customer Customer { get; set; }

        public int Quantity { get; set; }

        public decimal TotalPrice { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;
    }
}
