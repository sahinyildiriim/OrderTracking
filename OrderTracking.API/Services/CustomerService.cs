using Microsoft.EntityFrameworkCore;
using OrderTracking.API.Data;
using OrderTracking.API.DTOs;
using OrderTracking.API.Models;

namespace OrderTracking.API.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly AppDbContext _context;

        public CustomerService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Customer>> GetAll()
        {
            return await _context.Customers.ToListAsync();
        }

        public async Task<Customer> GetById(int id)
        {
            return await _context.Customers.FindAsync(id);
        }

        public async Task<Customer> Create(CustomerDTO dto)
        {
            var customer = new Customer
            {
                Name = dto.Name,
                PricePerUnit = dto.PricePerUnit,
                CurrentBalance = 0
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return customer;
        }

        public async Task<Customer> Update(int id, CustomerDTO dto)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
                return null;

            customer.Name = dto.Name;
            customer.PricePerUnit = dto.PricePerUnit;

            await _context.SaveChangesAsync();

            return customer;
        }

        public async Task<bool> Delete(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
                return false;

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
