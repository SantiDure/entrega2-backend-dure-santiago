import fs from "fs/promises";
function notNull(valor) {
  if (valor === null || valor === undefined) {
    throw new Error("Hay valores invalidos");
  }
  return valor;
}

class Product {
  constructor({ id, title, description, price, thumbnail, code, stock }) {
    this.id = notNull(id);
    this.title = notNull(title);
    this.description = notNull(description);
    this.price = notNull(price);
    this.thumbnail = notNull(thumbnail);
    this.code = notNull(code);
    this.stock = notNull(stock);
  }
}

class ProductManager {
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
    // Verificar si ya existe un producto con el mismo código
    if (!productToAdd) {
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
      products.push(newProduct);
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
      return;
    }
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
      await fs.writeFile(this.path, JSON.stringify(products));
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
  }
}

const pm = new ProductManager("./db/products.json");

/*
const productos = await pm.getProducts();

console.log(productos);

await pm.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});

const productoBuscado = await pm.getProductById(1);
console.log(productoBuscado);

*/

/*
pm.updateProduct(1, {
  title: "producto prueba editado con update product2",
  description: "Este es un producto prueba editado2",
  price: 2002,
  thumbnail: "Sin imagen2",
  code: "abc1234562",
  stock: 25,
});
 */

pm.deleteProduct(1);
/*
 */
