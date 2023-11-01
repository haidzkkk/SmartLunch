const Address = require('../models/address'); 

exports.createAddress = async (req, res) => {
    try {
        const userId = req.user.id
        const { recipientName, phoneNumber, addressLine, latitude, longitude } = req.body;
        const address = new Address({
            recipientName,
            phoneNumber,
            addressLine,
            latitude,
            longitude,
            userId
        });
        const newAddress = await address.save();
        res.status(201).json(newAddress);
    } catch (error) {
        res.status(500).json({ error: 'Không thể tạo địa chỉ.' });
    }
};

exports.getAddressesByUserId = async (req, res) => {
    try {
        const userId = req.user.id
        const addresses = await Address.find({ userId: userId });
        return res.status(200).json(addresses);
    } catch (error) {
        return res.status(500).json({ error: 'Không thể lấy danh sách địa chỉ.' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const addresses = await Address.find();
        return res.status(200).json(addresses);
    } catch (error) {
        return res.status(500).json({ error: 'Không thể lấy danh sách địa chỉ.' });
    }
};

exports.getOneById = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) {
            return res.status(404).json({ error: 'Địa chỉ không tồn tại.' });
        }
        return res.status(200).json(address);
    } catch (error) {
        return res.status(500).json({ error: 'Không thể lấy địa chỉ.' });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const address = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!address) {
            return res.status(404).json({ error: 'Địa chỉ không tồn tại.' });
        }
        return res.status(200).json(address);
    } catch (error) {
        return res.status(500).json({ error: 'Không thể cập nhật địa chỉ.' });
    }
};

exports.removeAddress = async (req, res) => {
    try {
        const address = await Address.findOneAndRemove({ _id: req.params.id });
        if (!address) {
            return res.status(404).json({ error: 'Địa chỉ không tồn tại.' });
        }
        return res.status(200).json(address);
    } catch (error) {
        return res.status(500).json({ error: 'Không thể xóa địa chỉ.' });
    }
};

