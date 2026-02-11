using OrderTracking.API.DTOs;
using OrderTracking.API.Models;

namespace OrderTracking.API.Services
{
    public interface ICustomerService
    {
        Task<List<Customer>> GetAll();
        Task<Customer> GetById(int id);
        Task<Customer> Create(CustomerDTO dto);
        Task<Customer> Update(int id, CustomerDTO dto);
        Task<bool> Delete(int id);
    }
}
