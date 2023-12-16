const Address = require('../models/address'); 
const Auth = require('../models/auth');
const fetch = require('node-fetch');

exports.createAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { recipientName, phoneNumber, addressLine, latitude, longitude } = req.body;
        const { distance, deliveryFee, duration } = await calculateDeliveryInfo(latitude, longitude);
        const address = new Address({
            recipientName,
            phoneNumber,
            addressLine,
            latitude,
            longitude,
            userId,
            deliveryTime:duration,
            deliveryFee: deliveryFee,
            distance: distance,
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

const calculateDeliveryInfo = async (latitude, longitude) => {
    try {
        const adminAddress = await Address.findOne({ userId: { $in: await Auth.findOne({ role: 'admin' }) } });
        if(adminAddress){
            const x2 = latitude;
            const y2 = longitude
            const x1 = adminAddress.latitude;
            const y1 = adminAddress.longitude;
    
            const response = await fetch(`http://router.project-osrm.org/route/v1/driving/${y1},${x1};${y2},${x2}?overview=false`);
            const data = await response.json();
    
            // Lấy thông tin từ response
            const distance = data.routes[0].distance / 1000;
            const deliveryFee = calculateDeliveryFee(distance);
            const duration = data.routes[0].duration/60;
    
            return { distance, deliveryFee, duration }; 
        }
        return new Error('Chưa có địa chỉ cửa hàng.');
    } catch (error) {
        console.error('Lỗi khi tính phí giao hàng:', error);
        throw new Error('Không thể tính phí giao hàng.');
    }
};

// Hàm tính phí giao hàng dựa trên khoảng cách
const calculateDeliveryFee = (distance) => {
    let deliveryFee = 0;

    if (distance <= 1) {
        deliveryFee = 0;
    } else if (distance > 1 && distance <= 3) {
        deliveryFee = 15000;
    } else if (distance > 3 && distance <= 5) {
        deliveryFee = 20000;
    } else if (distance > 5 && distance <= 7) {
        deliveryFee = 30000;
    } else {
        deliveryFee = 50000;
    }

    return deliveryFee;
}

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

