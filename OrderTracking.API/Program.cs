using Microsoft.EntityFrameworkCore;
using OrderTracking.API.Data;
using OrderTracking.API.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();

app.MapControllers();

app.Run();


