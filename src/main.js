import { ProductManager } from "./ProductManager.js";

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
/*
 */
pm.deleteProduct(1);
