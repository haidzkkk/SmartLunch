const Address = require('../models/shopaddress'); 


exports.getAddressUI = async (req, res) => {
    res.render('shopaddress/address', { layout :"Layouts/home"});
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
        if (!address) {
            return res.status(404).json({
                message: "Lấy tất cả phiếu giảm giá thất bại"
            })
        }

        return res.status(200).json(
       coupon
           
        )
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}