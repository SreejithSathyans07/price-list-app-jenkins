import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { ProductService } from "./product-service.service";

describe("ProductServiceService", () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should fetch all products", () => {
    const mockProducts = [
      { itemName: "Tomato", price: 2.5 },
      { itemName: "Carrot", price: 1.75 },
    ];

    service.getAllProducts().subscribe((data) => {
      expect(data).toEqual(mockProducts);
    });

    const req = httpMock.expectOne("http://localhost:5033/api/Product");
    expect(req.request.method).toBe("GET");
    req.flush(mockProducts);
  });
});
