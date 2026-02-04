import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { ProductService } from "./service/product-service.service";

interface Product {
  itemName: string;
  price: number;
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "product-catelogue";
  showList: boolean = false;
  products: Product[] = [];

  constructor(private productService: ProductService) {}
  fetchProducts() {
    this.productService.getAllProducts().subscribe((data: any) => {
      this.products = data;
      this.showList = true;
    });
  }
}
