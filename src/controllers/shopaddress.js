const Address = require('../models/shopaddress'); 


exports.getAddressUI = async (req, res) => {
    const response = await fetch('http://localhost:3000/api/shopaddress');
    const data = await response.json();
    if(data.length == 0){
        res.render('shopaddress/address', { layout :"Layouts/home"});
    }
    if(data.length != 0){
        res.render('shopaddress/updateaddress', { layout :"Layouts/home"});
    }
};


exports.updateAddress = async (req, res) => {
    try {
        const body = req.body;
        const address = await Address.create(body)
        res.status(303).set('Location', '/api/admin/shopaddress').send();
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
exports.getAddress = async (req, res) => {
    try {
        const address = await Address.find();

        return res.status(200).json(
            address
           
        )
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}