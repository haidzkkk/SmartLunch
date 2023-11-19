const fetch = require('node-fetch');

exports.getSum= async (req, res) => {
    const responseUser = await fetch('http://localhost:3000/api/users');
    const dataUser = await responseUser.json();
    const sumUser = dataUser.length
    const responseProduct = await fetch('http://localhost:3000/api/productbyadmin/products');
    const dataProduct = await responseProduct.json();
    const sumProduct = dataProduct.length
    const responseOrder = await fetch('http://localhost:3000/api/getAllorder');
    const dataOrder = await responseOrder.json();
    const sumOrder = dataOrder.length
    res.render('dashboard/sum', { sumUser, sumProduct,sumOrder});
}