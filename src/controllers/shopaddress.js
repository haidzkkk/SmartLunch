const Address = require('../models/address');
const Auth = require('../models/auth'); 
const NodeGeocoder = require('node-geocoder');
const fetch = require('node-fetch');
const options = {
    provider: 'openstreetmap',
};

const geocoder = NodeGeocoder(options);
exports.getAddressUI = async (req, res) => {
    const response = await fetch('http://localhost:3000/api/shopaddress');
    const data = await response.json();
    if (data.length == 0) {
        res.render('shopaddress/address', { layout: "Layouts/home" });
    }
    if (data.length != 0) {
        res.render('shopaddress/updateaddress', { layout: "Layouts/home" });
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
        const adminAddress = await Address.findOne({userId: admin._id}).populate("userId");
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

exports.add = async (req, res) => {
        try {
            const {
            shop_name,
            shop_number,
            city,
            district,
            ward,
            shop_detail
            } = req.body;

            const addressString = 'Phường An Hải Bắc, Quận Sơn Trà, Thành phố Đà Nẵng';
    //   const geocodeResult = await geocoder.geocode(addressString);
            const geocodeResult = await geocoder.geocode(addressString);
            if (!geocodeResult || geocodeResult.length === 0) {
                return res.status(400).json({ error: 'Invalid address. Geocoding failed.' });
            }
            const { latitude, longitude } = geocodeResult[0];

            const newAddress = new Address({
            recipientName: shop_name,
            phoneNumber: shop_number,
            userId :"6576d6dd93ab304284ef12ac",
            addressLine: `${ward}, ${district}, ${city}`,
            latitude,
            longitude,
        
            });
            await newAddress.save();
        
            res.status(200).json({ message: 'Address created successfully' ,latitude,longitude});
        } catch (error) {
            console.error('Error creating address:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
}
