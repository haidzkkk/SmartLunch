var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var Auth = require('../models/auth')
var authSchema = require('../schemas/auth')
var nodemailer = require('nodemailer')
var UserOTPVerification = require('./../models/UserOTPVerification')
const { json } = require('body-parser')
var sendNotificationToUser = require('../controllers/notification').sendNotificationToUser;
let refreshTokens = [];



// Lấy tất cả người dùng
exports.getAll = async (req, res) => {
    try {
        const data = await Auth.find();
        return res.status(200).json({
            message: "Lấy tất cả người dùng thành công",
            data
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message || "Lỗi xảy ra"
        });
    }
};

// Lấy một người dùng theo ID
exports.getOneById = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Auth.findById(id);
        if (!data) {
            return res.status(404).json({
                message: "Không có người dùng với ID này"
            });
        }
        return res.status(200).json({
            data
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

// Xóa người dùng bởi Admin
exports.removeByAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Auth.findByIdAndDelete(id);
        return res.status(200).json({
            user
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
    try {
        const id = req.user;
        const body = req.body;
        const { error } = authSchema.updateUserSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            });
        }
        const user = await Auth.findByIdAndUpdate(id, body, { new: true }).select('-password -role -refreshToken -passwordChangeAt -__v');
        if (!user) {
            return res.status(400).json({
                message: "Cập nhật thông tin người dùng thất bại"
            });
        }
        return res.status(200).json({
            user
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

// Đăng ký người dùng
exports.signup = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, address, avatar, password } = req.body;

        // Kiểm tra tính hợp lệ của dữ liệu đầu vào
        const { error } = authSchema.signupSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            });
        }

        // Kiểm tra xem email đã được sử dụng chưa
        const userExist = await Auth.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                message: "Email đã được sử dụng!"
            });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo tài khoản
        const user = await Auth.create({
            first_name,
            last_name,
            phone,
            address,
            avatar,
            email,
            password: hashedPassword
        });

        // Loại bỏ mật khẩu trước khi gửi phản hồi
        user.password = undefined;

        // Gửi mã OTP qua email và xử lý phản hồi từ hàm này
        const otpResponse = await sendOTPVerificationEmail(user);

        // Gửi thông báo thành công
        return res.status(201).json({
            message: "Đăng ký thành công tài khoản",
            user,
            otpResponse // Thêm thông tin về OTP vào phản hồi
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

// Gửi OTP
const sendOTPVerificationEmail = async ({ _id, email }) => {
    try {
        const otp = `${Math.floor(100000 + Math.random() * 900000)}`.slice(0, 6);

        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        })
        // Mail options
        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: 'Smart Lunch OTP Verification Code',
            html: `<p>${otp}</p>`
        };
        // Hash mã OTP
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        // Lưu OTP vào cơ sở dữ liệu
        const newOTPVerification = new UserOTPVerification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000
        });

        await newOTPVerification.save();

        // Gửi email chứa mã OTP
        await mailTransporter.sendMail(mailOptions);

        // Trả về phản hồi thành công
        return {
            status: "PENDING",
            message: "Verification otp email sent",
            data: {
                userId: _id,
                email
            }
        };
    } catch (error) {
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm này
    }
};

// Gửi lại mã OTP
exports.sendNewOtp = async (req, res) => {
    try {
        const { userId, email } = req.body;
        if (!email || !userId) {
            throw new Error('Không được để trống thông tin người dùng');
        } else {
            await UserOTPVerification.deleteMany({ userId });
            const otpResponse = await sendOTPVerificationEmail({ _id: userId, email });
            return res.status(201).json({
                message: "Gửi lại mã OTP thành công",
                otpResponse // Thêm thông tin về OTP vào phản hồi
            });
        }
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


//gửi lại mã otp
exports.sendNewOtp = async (req, res) => {
    try {
        let { userId, email } = req.body
        if (!email || !userId) {
            throw Error('Empty user details are not allowed')
        } else {
            await UserOTPVerification.deleteMany({ userId })
            const otpResponse = await sendOTPVerificationEmail({ _id: userId, email })
            return res.status(201).json({
                message: "Gửi lại mã opt thành công",
                otpResponse // Thêm thông tin về OTP vào phản hồi
            });
        }
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

exports.updateAuth = async (req, res, next) =>{
    try{
        var id = req.params.id
        var auth = req.body
        await Auth.findByIdAndUpdate(id, auth)
        res.status(200).json("sửa thành công2");
    }catch(err){
        res.status(400).json("sửa thất bại");
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        if (!userId || !otp) {
            throw new Error("Không được để trống mã OTP");
        } else {
            const UserOTPVerificationRecords = await UserOTPVerification.find({ userId });
            if (UserOTPVerificationRecords.length <= 0) {
                throw new Error("Không tìm thấy bản ghi tài khoản hoặc tài khoản đã được xác minh. Vui lòng đăng ký");
            } else {
                const { expiresAt } = UserOTPVerificationRecords[0];
                const hashedOTP = UserOTPVerificationRecords[0].otp;

                if (expiresAt < Date.now()) {
                    await UserOTPVerification.deleteMany({ userId });
                    throw new Error("Mã đã hết hạn. Vui lòng yêu cầu lại.");
                } else {
                    const validOTP = await bcrypt.compare(otp, hashedOTP);

                    if (!validOTP) {
                        throw new Error("Mã không hợp lệ. Kiểm tra hộp thư của bạn.");
                    } else {
                        // Thành công
                        await sendVerificationEmail(userId)
                        await Auth.updateOne({ _id: userId }, { verified: true });
                        await UserOTPVerification.deleteMany({ userId });

                        res.status(200).json({
                            message: "Xác minh email của người dùng thành công"
                        });
                    }
                }
            }
        }
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// Hàm gửi email xác minh
const sendVerificationEmail = async (userId) => {
    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });

    const currentUser = await Auth.findById(userId);

    // Soạn nội dung thư
    const details = {
        from: process.env.MAIL_USERNAME,
        to: currentUser.email,
        subject: '📲 ĐĂNG KÝ THÀNH CÔNG ỨNG DỤNG SMART LUNCH',
        html: `
            <h1>Chúc mừng bạn đã đăng ký thành công Ứng dụng Smart Lunch!</h1>
            <p>Xin chào ${currentUser.first_name} ${currentUser.last_name},</p>
            <p>Chúc mừng bạn đã đăng ký thành công vào Ứng dụng Smart Lunch. Chúng tôi rất vui mừng chào đón bạn vào cộng đồng của chúng tôi.</p>
            <img src="https://s3-alpha.figma.com/thumbnails/27c9e084-27b0-4504-a185-99d6ff07d40b?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQ4GOSFWCZDMGHAUS%2F20230924%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230924T120000Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=8e17ad0692b05ecda466f0a577b79d19143fa16a3dd462853d609743dc1766e8" alt="Smart Lunch Logo">
            <p>Chúc bạn có một trải nghiệm tuyệt vời với phiên bản hoàn toàn mới này!</p>
        `,
    };

    // Gửi email
    mailTransporter.sendMail(details, (err) => {
        if (err) {
            console.log("Lỗi khi gửi email", err);
        } else {
            console.log("Thành công");
        }
    });
};


//dang nhap
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validate
        const { error } = authSchema.signinSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                messages: errors
            })
        }

        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(404).json({
                messages: 'Tài Khoản không tồn tại'
            })
        }

        const isVerify = await user.verified;
        if (!isVerify) {
            return res.status(400).json({
                message: 'Please verify the account first'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                messages: 'Sai mật khẩu'
            })
        }
        if (user && password) {
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            refreshTokens.push(refreshToken);
            //luu vao cookies
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,//khong cho truy cap cookie nay ra duoc
                secure: false,
                path: "/",
                // Ngăn chặn tấn công CSRF -> Những cái http, request chỉ được đến từ sameSite
                sameSite: "strict"
            })
            const { password, ...users } = user._doc
            sendNotificationToUser(users._id, `${user.email} đã đăng nhập thành công`)
            return res.status(200).json({
                message: "Đăng nhập thành công",
                ...users,
                accessToken: accessToken,
                refreshToken: refreshToken
            })
        }
    } catch (error) {
        return res.status(400).json({
            messages: error
        })
    }
}

// Generate Access Token
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "1d" }
    )
}

// Generate Refresh Token
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: "365d" }
    )
}

// đăng xuất
exports.logout = async (req, res) => {
    try {
        const cookie = req.cookies;
        if (!cookie || !cookie.refreshToken) {
            return res.status(400).json({
                message: "Không thể refresh Token trong cookies"
            });// khong co token hoac ko dc login de dangxuat
        }
        //xóa refresh Token ở DB
        await Auth.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
        // xoa refresh token o cookie trinh duyet
        res.clearCookie("refreshToken", {
            httpOnly: true,//không cho phép javascript có quyền đọc giá trị của Cookie
            secure: true
        })
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken)
        return res.status(200).json({
            message: 'Đăng xuất thành công'
        })

    } catch (error) {
        return res.status(500).json({ message: error })
    }
}

//Refresh Token
exports.refreshToken = async (req, res) => {
    try {
        if (!req.cookies || !req.cookies.refreshToken) {
            return res.status(403).json({
                message: "Refresh Token không hợp lệ"
            })
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                console.log(err);
            }
            refreshTokens = refreshTokens.filter((token) => token !== this.refreshToken)
            //Nếu không lỗi thì sẽ tạo ra access Token và refresh token mới
            const newAccessToken = generateAccessToken(user)
            const newRefreshToken = generateRefreshToken(user)
            refreshTokens.push(newRefreshToken);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict"
            })
            return res.status(200).json({
                message: "Tạo Access Token mới thành công",
                accessToke: newAccessToken, refreshTokens
            })
        })
    } catch (error) {
        return res.status(400).json({ message: error });
    }
}



