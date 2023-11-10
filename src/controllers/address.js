const Address = require('../models/address'); 

exports.createAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { recipientName, phoneNumber, addressLine, latitude, longitude } = req.body;
        const address = new Address({
            recipientName,
            phoneNumber,
            addressLine,
            latitude,
            longitude,
            userId,
            isSelected: true
        });
    
        const newAddress = await address.save();
    
        if (newAddress === null) {
            return res.status(400).json({ error: 'Không thể tạo địa chỉ.' });
        }
    
        await Address.updateMany(
            { userId, _id: { $ne: newAddress._id } },
            { $set: { isSelected: false } }
        );
    
        await newAddress.populate("userId")

        res.status(200).json(newAddress);
    } catch (error) {
        console.error('Lỗi khi tạo địa chỉ:', error);
        res.status(500).json({ error: 'Không thể tạo địa chỉ.' });
    }
    
};

exports.getAddressesByUserId = async (req, res) => {
    try {
        const userId = req.user.id
        const addresses = await Address.find({ userId, isRemove: false }).populate("userId");

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
        await address.populate("userId")
        return res.status(200).json(address);
    } catch (error) {
        return res.status(500).json({ error: 'Không thể lấy địa chỉ.' });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const address = await Address.findByIdAndUpdate(req.params.id);
        if (!address) {
            return res.status(404).json({ error: 'Địa chỉ không tồn tại.' });
        }     
        await Address.updateMany(
            { userId: req.user, _id: { $ne: address._id } },
            { $set: { isSelected: false } }
        );

        address.isSelected = true;
        await address.save();
        await address.populate("userId")

        return res.status(200).json(address);
    } catch (error) {
        return res.status(500).json({ error: 'Không thể cập nhật địa chỉ.' });
    }
};

exports.removeAddress = async (req, res) => {
    try {
        const address = await Address.findByIdAndUpdate(req.params.id);
        if (!address) {
            return res.status(404).json({ error: 'Địa chỉ không tồn tại.' });
        }     

        address.isRemove = true;
        await address.save();
        await address.populate("userId")

        return res.status(200).json(address);
    } catch (error) {
        return res.status(500).json({ error: 'Không thể xóa địa chỉ.' });
    }
};

