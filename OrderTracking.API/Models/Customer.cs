using System;

namespace OrderTracking.API.Models
{
    public class Customer
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public decimal PricePerUnit { get; set; }

        public decimal CurrentBalance { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
