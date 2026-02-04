using Microsoft.AspNetCore.Mvc;
using PriceList.Models;

namespace PriceList.Tests
{
    public class ProductControllerTests
    {
        [Fact]
        public void GetProduct_ReturnsOkResult()
        {
            // Arrange
            var controller = new PriceList.Controller.ProductController();

            // Act
            var result = controller.GetProduct();

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public void GetProduct_ReturnsNotNull()
        {
            // Arrange
            var controller = new PriceList.Controller.ProductController();

            // Act
            var result = controller.GetProduct() as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.Value);
        }

        [Fact]
        public void GetProduct_ReturnsTenItems()
        {
            // Arrange
            var controller = new PriceList.Controller.ProductController();

            // Act
            var result = controller.GetProduct() as OkObjectResult;
            var products = result?.Value as List<Product>;

            // Assert
            Assert.NotNull(products);
            Assert.Equal(10, products.Count);
        }

        [Fact]
        public void GetProduct_ReturnsCorrectProductList()
        {
            // Arrange
            var controller = new PriceList.Controller.ProductController();

            // Act
            var result = controller.GetProduct() as OkObjectResult;
            var products = result?.Value as List<Product>;

            // Assert
            Assert.NotNull(products);
            Assert.Contains(products, p => p.ItemName == "Tomato" && p.Price == 120);
            Assert.Contains(products, p => p.ItemName == "Carrot" && p.Price == 40);
            Assert.Contains(products, p => p.ItemName == "Potato" && p.Price == 40);
        }

        [Fact]
        public void GetProduct_AllProductsHaveValidData()
        {
            // Arrange
            var controller = new PriceList.Controller.ProductController();

            // Act
            var result = controller.GetProduct() as OkObjectResult;
            var products = result?.Value as List<Product>;

            // Assert
            Assert.NotNull(products);
            Assert.All(products, product =>
            {
                Assert.NotNull(product.ItemName);
                Assert.NotEmpty(product.ItemName);
                Assert.True(product.Price > 0, "Product price must be greater than 0");
            });
        }
    }
}
