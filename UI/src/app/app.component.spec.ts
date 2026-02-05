import { TestBed, ComponentFixture } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AppComponent } from "./app.component";
import { ProductService } from "./service/product-service.service";
import { of } from "rxjs";

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let productService: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj("ProductService", [
      "getAllProducts",
    ]);

    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
      providers: [{ provide: ProductService, useValue: productServiceSpy }],
    }).compileComponents();

    productService = TestBed.inject(
      ProductService,
    ) as jasmine.SpyObj<ProductService>;
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  describe("Component Initialization", () => {
    it("should create the app", () => {
      expect(component).toBeTruthy();
    });

    it("should have the correct title", () => {
      expect(component.title).toEqual("product-catelogue");
    });

    it("should initialize with showList as false", () => {
      expect(component.showList).toBeFalse();
    });

    it("should initialize with empty products array", () => {
      expect(component.products).toEqual([]);
    });
  });

  describe("Template Rendering", () => {
    it("should render the Price List Application header", () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector("h1")?.textContent).toContain(
        "Price List Application",
      );
    });

    it("should render the Refresh button", () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled.querySelector(".refresh-btn");
      expect(button?.textContent).toContain("Refresh");
    });

    it("should not display table when showList is false", () => {
      component.showList = false;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const table = compiled.querySelector(".price-table");
      expect(table).toBeNull();
    });

    it("should display table when showList is true", () => {
      component.showList = true;
      component.products = [{ itemName: "Tomato", price: 2.5 }];
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const table = compiled.querySelector(".price-table");
      expect(table).toBeTruthy();
    });

    it("should display product data in table", () => {
      component.showList = true;
      component.products = [
        { itemName: "Tomato", price: 2.5 },
        { itemName: "Carrot", price: 1.75 },
      ];
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll(".price-table tbody tr");
      expect(rows.length).toBe(2);
      expect(rows[0].textContent).toContain("Tomato");
      expect(rows[1].textContent).toContain("Carrot");
    });
  });

  describe("fetchProducts Method", () => {
    it("should call ProductService.getAllProducts", () => {
      const mockProducts = [
        { itemName: "Tomato", price: 2.5 },
        { itemName: "Carrot", price: 1.75 },
      ];
      productService.getAllProducts.and.returnValue(of(mockProducts));
      spyOn(window, "alert");

      component.fetchProducts();

      expect(productService.getAllProducts).toHaveBeenCalled();
    });

    it("should populate products array with data from service", () => {
      const mockProducts = [
        { itemName: "Tomato", price: 2.5 },
        { itemName: "Carrot", price: 1.75 },
        { itemName: "Broccoli", price: 3 },
      ];
      productService.getAllProducts.and.returnValue(of(mockProducts));
      spyOn(window, "alert");

      component.fetchProducts();

      expect(component.products).toEqual(mockProducts);
    });

    it("should set showList to true after fetching products", () => {
      const mockProducts = [{ itemName: "Tomato", price: 2.5 }];
      productService.getAllProducts.and.returnValue(of(mockProducts));
      spyOn(window, "alert");
      expect(component.showList).toBeFalse();

      component.fetchProducts();

      expect(component.showList).toBeTrue();
    });

    it("should handle empty product list", () => {
      productService.getAllProducts.and.returnValue(of([]));
      spyOn(window, "alert");

      component.fetchProducts();

      expect(component.products).toEqual([]);
      expect(component.showList).toBeTrue();
    });
  });

  describe("Button Click Event", () => {
    it("should call fetchProducts when Refresh button is clicked", () => {
      spyOn(component, "fetchProducts");
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled.querySelector(".refresh-btn") as HTMLElement;

      button.click();

      expect(component.fetchProducts).toHaveBeenCalled();
    });
  });
});
