const Address = require('../models/shopaddress'); 
const Address2 = require('../models/address'); 
const Auth = require('../models/auth'); 


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
exports.getAddressAdmin = async (req, res) => {
    try {
        var admin = await Auth.findOne({ role: 'admin' })
        const adminAddress = await Address2.findOne({userId: admin._id}).populate("userId");
        console.log(adminAddress);
        return res.status(200).json(
            adminAddress
        )
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            message: error.message
        })
    }
}