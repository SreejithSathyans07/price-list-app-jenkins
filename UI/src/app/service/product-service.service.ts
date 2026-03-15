import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environment";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(private httpClient: HttpClient) {}

  private apiUrl = environment.apiUrl;

  getAllProducts() {
    return this.httpClient.get(`${this.apiUrl}/api/product`);
  }
}
