import fs from "fs/promises";
import { Product } from "./Product.js";

export class ProductManager {
  constructor(path) {
    this.path = path;
    this.ultimoID = 0;
  }

  //crea un id auto incrementable
  newID() {
    this.ultimoID++;
    return this.ultimoID;
  }

  //agrega un producto
  async addProduct({ title, description, price, thumbnail, code, stock }) {
    const products = await this.getProducts();
    const productToAdd = await products.find(
      (product) => product.code === code
    );
    const id = this.newID();
    const newProduct = new Product({
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });
    // Verificar si ya existe un producto con el mismo código
    if (!productToAdd) {
      products.push(newProduct);
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
      return;
    }
    throw new Error(
      `El producto con el codigo ${code} ya existe, no puede volver a agregarse`
    );
  }

  //consultar por todos los productos
  async getProducts() {
    const data = await fs.readFile(this.path, "utf-8");
    return JSON.parse(data) || [];
  }

  //consultar por un producto especificado por id
  async getProductById(id) {
    const products = await this.getProducts();
    const productToFind = products.find((p) => p.id === id);
    if (!productToFind) {
      throw new Error(`El producto con id ${id} no se encuentra o no existe`);
    }
    return productToFind;
  }

  async updateProduct(id, newData) {
    const products = await this.getProducts();
    const productIndex = products.findIndex((i) => i.id === id);
    if (productIndex !== -1) {
      const product = products[productIndex];
      products[productIndex] = { ...product, ...newData };
      await fs.writeFile(this.path, JSON.stringify(products), null, 2);
      return;
    }
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const productIndex = products.findIndex((i) => i.id === id);
    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      await fs.writeFile(this.path, JSON.stringify(products, null, 2), "utf8");
      return products;
    }
    throw new Error(`El producto con id ${id} no se encuentra o no existe`);
  }
}
