const axios = require('axios');
const cheerio = require('cheerio');
const url = 'https://www.ulabox.com/categoria/champu-y-cuidado-del-cabello/1016';
const fs = require('fs');
let arrProductos = [];

// Función anónima que se define y se ejecuta al mismo tiempo
(async () => {
    for (let i = 1; i <= await getPages(url); i++) {
        await getProductsPage(url, i);
    }
    for (let producto of arrProductos) {
        fs.appendFileSync('./productos.csv', `${producto.nombre}\n${producto.precio}\n${producto.marca}\n${producto.imagen}\n\n`);
    }
})();

// Funciones de soporte
async function getProductsPage(url, page) {
    const response = await axios.get(`${url}?p=${page}`);
    const $ = cheerio.load(response.data);
    const productos = $('.product-item');

    for (let i = 0; i < productos.length; i++) {
        let p = {};
        p.nombre = productos[i].attribs['data-product-name'];
        p.precio = productos[i].attribs['data-price'];
        p.marca = productos[i].attribs['data-product-brand'];

        const aTag = ($(productos[i]).children().first().children()[3]);
        p.imagen = $(aTag).children().first()[0].attribs['data-src'];

        arrProductos.push(p);
    }
};

async function getPages(url) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const numPages = parseInt($('.pagination li:last-child').first().prev().text());
    return numPages;
};