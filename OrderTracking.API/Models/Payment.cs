using System;

namespace OrderTracking.API.Models
{
    public class Payment
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }

        public decimal Amount { get; set; }

        public DateTime PaymentDate { get; set; } = DateTime.Now;

        public Customer Customer { get; set; }
    }
}
