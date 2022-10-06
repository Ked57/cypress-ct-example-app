import {
  loader,
  ProductsByCategoryPage,
} from "../../src/pages/ProductsByCategoryPage";

describe("<ProductsByCategoryPage />", () => {
  beforeEach(() => {
    cy.intercept("GET", "/products/categories", {
      statusCode: 200,
      body: ["electronics", "jewelery", "men's clothing", "women's clothing"],
    });
    cy.intercept("GET", "/products", {
      statusCode: 200,
      fixture: "products.json",
    });
  });
  it("mounts", () => {
    cy.mountApplication(<ProductsByCategoryPage />, {
      applicationStubProps: { loader },
    });
    cy.contains("Switch");
  });
  it("mounts with darkMode", () => {
    cy.mountApplication(<ProductsByCategoryPage />, {
      applicationStubProps: { darkMode: true, loader },
    });
    cy.get("body").should("have.class", "bg-gray-800");
  });
  it("mounts with french language", () => {
    cy.mountApplication(<ProductsByCategoryPage />, {
      applicationStubProps: { lang: "fr", loader },
    });
    cy.contains("Passer au darkmode");
  });
  it("intercepts /products/categories calls", () => {
    cy.intercept("GET", "/products/categories", {
      statusCode: 200,
      body: ["electronics", "jewelery", "men's clothing", "women's clothing"],
    });
    cy.mountApplication(<ProductsByCategoryPage />, {
      applicationStubProps: { loader },
    });
  });
  it("intercepts all the calls", () => {
    cy.mountApplication(<ProductsByCategoryPage />, {
      applicationStubProps: { loader },
    });
  });
});
