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
  addProduct({ title, description, price, thumbnail, code, stock }) {
    const products = this.getProducts();

    // Verificar si ya existe un producto con el mismo código
    if (products.some((product) => product.code === code)) {
      throw new Error("El producto con el código especificado ya existe.");
    }

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
    this.saveProducts(products);
    return newProduct;
  }

  //consultar por todos los productos
  async getProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.log(`no se pudieron traer los datos, error ${error}`);
      return [];
    }
  }

  //consultar por un producto especificado por id
  getProductById(id) {
    const products = this.getProducts();
    const productToFind = products.find((p) => p.id === id);
    if (!productToFind) {
      throw new Error(`El producto con id ${id} no se encuentra o no existe`);
    }
    return productToFind;
  }

  updateProduct(id, newProduct) {
    const products = this.getProducts();
    const productIndex = products.findIndex((i) => i.id === id);
    if (productIndex !== -1) {
      newProduct.id = id;
      this.saveProducts(products);
      return newProduct;
    }
    throw new Error(`El producto con id ${id} no se encuentra o no existe`);
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const productIndex = products.findIndex((i) => i.id === id);
    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      this.saveProducts(products);
      return;
    }
    throw new Error(`El producto con id ${id} no se encuentra o no existe`);
  }

  async saveProducts(products) {
    await fs.writeFile(this.path, JSON.stringify(products, null, 2), "utf8");
  }
}

async function leerDatos() {
  try {
    const data = await pm.getProducts();
    console.log(data);
  } catch (error) {
    throw new Error(
      `No se pudo leer la data por el siguiente error -> ${error}`
    );
  }
}

const pm = new ProductManager("./db/products.json");

const productos = await pm.getProducts();
console.log(productos);
pm.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});

/*
leerDatos();

*/
