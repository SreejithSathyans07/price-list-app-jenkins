using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PriceList.Models;

namespace PriceList.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly List<Product> vegetables = new()
            {
                new() { ItemName = "Tomato", Price = 120 },
                new() { ItemName = "Carrot", Price = 40 },
                new() { ItemName = "Broccoli", Price = 180 },
                new() { ItemName = "Spinach", Price = 200 },
                new() { ItemName = "Cucumber", Price = 60 },
                new() { ItemName = "Bell Pepper", Price = 120 },
                new() { ItemName = "Onion", Price = 30 },
                new() { ItemName = "Potato", Price = 40 },
                new() { ItemName = "Lettuce", Price = 100 },
                new() { ItemName = "Garlic", Price = 80 }
            };
        [HttpGet]
        public IActionResult GetProduct()
        {
            // Placeholder logic to retrieve a product by ID
            return Ok(vegetables);
        }
    }
}
