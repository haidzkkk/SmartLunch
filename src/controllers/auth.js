var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')

var Auth = require('../models/auth')
var authSchema = require('../schemas/auth')
var nodemailer = require('nodemailer')
var UserOTPVerification = require('./../models/UserOTPVerification')
const { json } = require('body-parser')
var notificationController = require('../controllers/notification');
var { uploadImage, updateImage } = require('../controllers/upload');
const { log } = require('handlebars')
let refreshTokens = [];
const fetch = require('node-fetch');
const { default: addWeeks } = require('date-fns/addWeeks/index')


exports.getShipperCreateUI = async (req, res) => {
    const response = await fetch('http://localhost:3000/api/shipper');
    const data = await response.json();
    res.render("user/shipper", { data, layout: "Layouts/home" });
};

exports.getShipperDataUI = async (req, res) => {
    const response = await fetch('http://localhost:3000/api/shipper');
    const data = await response.json();
    res.render("user/shipper_data", { data, layout: "Layouts/home" });
};
exports.getShipperTop = async (req, res) => {

    res.render("user/topshipper", {  layout: "Layouts/home" });
};

exports.getUserUI = async (req, res) => {

    const response = await fetch('http://localhost:3000/api/users');
    const data = await response.json();
    res.render('user/user', { data, layout: "layouts/home" });
}
exports.getUserByIdUI = async (req, res) => {
    const response = await fetch('http://localhost:3000/api/userbyadmin/' + req.params.id);
    const data = await response.json();
    res.render('user/detail', { data, layout: "layouts/home" });
};

exports.getUserByAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Auth.findById(id);

        return res.status(200).json(
            user
        );
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        const userData = await Auth.findById(req.user.id);

        if (!userData) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng"
            });
        }

        return res.status(200).json(userData);
    } catch (error) {
        return res.status(500).json({
            message: "Máy chủ không phản hồi"
        });
    }
}

// Lấy tất cả người dùng
exports.getAll = async (req, res) => {
    try {
        const data = await Auth.find();
        const memberUsers = data.filter(user => user.role === 'member');
        return res.status(200).json(
            memberUsers
        );
    } catch (error) {
        return res.status(400).json({
            message: error.message || "Lỗi xảy ra"
        });
    }
};
// Lấy tất cả người dùng
exports.getAllShipper = async (req, res) => {
    try {
        const data = await Auth.find();
        const shipperUsers = data.filter(user => user.role === 'shipper');
        return res.status(200).json(
            shipperUsers
        );
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
        return res.status(200).json(
            data
        );
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
        res.status(303).set('Location', '/api/admin/users').send();
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

// upload avatar
exports.uploadAvatarUser = async (req, res) => {
    try {
        const id = req.user;
        var files = req.files

        var images = await uploadImage(files)

        const user = await Auth.findByIdAndUpdate(id, { avatar: images[0] }, { new: true }).select('-password -role -refreshToken -passwordChangeAt -__v');
        if (!user) {
            return res.status(400).json({
                message: "tải lên avatar người dùng thất bại"
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

// update avatar
exports.updateAvatarUser = async (req, res) => {
    try {
        const id = req.user;
        const publicId = req.params.publicId;
        var files = req.files

        var images = await updateImage(files, publicId)

        const user = await Auth.findByIdAndUpdate(id, { avatar: images }, { new: true }).select('-password -role -refreshToken -passwordChangeAt -__v');
        if (!user) {
            return res.status(400).json({
                message: "tải lên avatar người dùng thất bại"
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
        const { first_name, last_name, email, phone, password } = req.body;

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
            return res.status(500).json({
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
            email,
            password: hashedPassword
        });

        // Loại bỏ mật khẩu trước khi gửi phản hồi
        user.password = undefined;

        // Gửi mã OTP qua email và xử lý phản hồi từ hàm này
        const otpResponse = await sendOTPVerificationEmail(user);

        // Gửi thông báo thành công
        return res.status(200).json(
            otpResponse // Thêm thông tin về OTP vào phản hồi
        );
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

// Đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
    try {
        const { userId, newPassword, confirmPassword } = req.body;

        // Kiểm tra tính hợp lệ của dữ liệu đầu vào
        const { error } = authSchema.resetPassSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Mật khẩu và xác nhận mật khẩu không khớp." });
        }

        const user = await Auth.findById(userId);

        // Kiểm tra xem người dùng tồn tại và có được phép đặt lại mật khẩu hay không
        if (!user) {
            return res.status(400).json({ message: "Người dùng không tồn tại." });
        }

        if (!user.passwordChanged) {
            return res.status(400).json({ message: "Người dùng chưa được phép đặt lại mật khẩu." });
        }

        // Hash mật khẩu mới và cập nhật vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await Auth.updateOne({ _id: userId }, { password: hashedPassword, passwordChanged: false });

        return res.status(200).json(user);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};


//quên mật khẩu
exports.forgotPassword = async function (req, res) {
    try {
        const email = req.query.email;
        // Kiểm tra tính hợp lệ của dữ liệu đầu vào
        const { error } = authSchema.forgotPassSchema.validate(email, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            });
        }

        // Kiểm tra người dùng có tồn tại hay không?
        const existingUser = await Auth.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({
                message: 'Không có tài khoản nào được đăng ký với email này'
            });
        }
        //
        const otpResponse = await sendOTPVerificationEmail(existingUser);
        return res.status(200).json(
            otpResponse // Thêm thông tin về OTP vào phản hồi
        );
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

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
            expiresAt: Date.now() + 180000
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
            return res.status(400).json('Không được để trống thông tin người dùng');
        } else {
            await UserOTPVerification.deleteMany({ userId });
            const otpResponse = await sendOTPVerificationEmail({ _id: userId, email });
            return res.status(200).json(
                otpResponse
            );
        }
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


exports.updateAuth = async (req, res) => {
    try {
        var id = req.params.id
        var auth = req.body
        await Auth.findByIdAndUpdate(id, auth)
        res.status(200).json("Cập nhật thông tin thành công");
    } catch (err) {
        res.status(400).json("Cập nhật thông tin thất bại");
    }
}


exports.verifyOTPChangePassword = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        if (!userId || !otp) {
            return res.status(400).json({ message: "Không được để trống mã OTP" });
        } else {
            const UserOTPVerificationRecords = await UserOTPVerification.find({ userId });
            if (UserOTPVerificationRecords.length <= 0) {
                return res.status(400).json({ message: "Không tìm thấy bản ghi tài khoản hoặc tài khoản đã được xác minh. Vui lòng đăng ký" });
            } else {
                const { expiresAt } = UserOTPVerificationRecords[0];
                const hashedOTP = UserOTPVerificationRecords[0].otp;

                if (expiresAt < Date.now()) {
                    await UserOTPVerification.deleteMany({ userId });
                    return res.status(502).json("Mã đã hết hạn. Vui lòng yêu cầu lại.");
                } else {
                    const validOTP = await bcrypt.compare(otp, hashedOTP);

                    if (!validOTP) {
                        return res.status(500).json("Mã không hợp lệ. Kiểm tra hộp thư của bạn.");
                    } else {
                        // Thành công
                        await Auth.updateOne({ _id: userId }, { passwordChanged: true });
                        await UserOTPVerification.deleteMany({ userId });
                        const user = await Auth.findById(userId);

                        res.status(200).json(
                            user
                        );
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

exports.verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        if (!userId || !otp) {
            return res.status(400).json("Không được để trống mã OTP");
        } else {
            const UserOTPVerificationRecords = await UserOTPVerification.find({ userId });
            if (UserOTPVerificationRecords.length <= 0) {
                throw new Error("Không tìm thấy bản ghi tài khoản hoặc tài khoản đã được xác minh. Vui lòng đăng ký");
            } else {
                const { expiresAt } = UserOTPVerificationRecords[0];
                const hashedOTP = UserOTPVerificationRecords[0].otp;

                if (expiresAt < Date.now()) {
                    await UserOTPVerification.deleteMany({ userId });
                    return res.status(502).json("Mã đã hết hạn. Vui lòng yêu cầu lại.");
                } else {
                    const validOTP = await bcrypt.compare(otp, hashedOTP);

                    if (!validOTP) {
                        return res.status(500).json("Mã không hợp lệ. Kiểm tra hộp thư của bạn.");
                    } else {
                        // Thành công
                        await sendVerificationEmail(userId)
                        await Auth.updateOne({ _id: userId }, { verified: true });
                        await UserOTPVerification.deleteMany({ userId });
                        const user = await Auth.findById(userId);

                        res.status(200).json(
                            user
                        );
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
            <img src="https://res.cloudinary.com/dkp3zshrt/image/upload/v1702825746/p6di1bxoxht40bl9j88z.png" alt="Smart Lunch Logo" style="width: 66.6667%;">
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
             // Gửi mã OTP qua email và xử lý phản hồi từ hàm này
            const otpResponse = await sendOTPVerificationEmail(user);           
            return res.status(500).json(
                otpResponse
            )
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

            return res.status(200).json({
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

// Đăng nhập với Google
exports.signinWithGG = async (req, res) => {
    try {
        const body = req.body;

        const existingUser = await Auth.findOne({ email: body.email });

        if (existingUser) {
            const accessToken = jwt.sign({ id: existingUser._id }, process.env.JWT_ACCESS_KEY, { expiresIn: "1d" });
            const refreshToken = generateRefreshToken(existingUser);

            if (!existingUser.googleId) {
                existingUser.googleId = body.googleId;
                existingUser.authType = "google";
                await existingUser.save();
            }

            return res.status(200).json({
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        }

        const hashedPassword = await bcrypt.hash(body.googleId, 10);

        const newUser = new Auth({
            authType: 'google',
            googleId: body.googleId,
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: hashedPassword,
            verified:true,
            address: ""
        });

        await newUser.save();

        const accessToken = jwt.sign({ id: newUser._id }, process.env.JWT_ACCESS_KEY, { expiresIn: "1d" });
        const refreshToken = generateRefreshToken(newUser);

        return res.status(200).json({
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message
        });
    }
};

// Đăng nhập với Fb
exports.signinWithFb = async (req, res) => {
    try {
        const body = req.body;

        const existingUser = await Auth.findOne({ email: body.email });

        if (existingUser) {
            const accessToken = jwt.sign({ id: existingUser._id }, process.env.JWT_ACCESS_KEY, { expiresIn: "1d" });
            const refreshToken = generateRefreshToken(existingUser);

            if (!existingUser.facebookId) {
                existingUser.facebookId = body.googleId;
                existingUser.authType = "facebook";
                await existingUser.save();
            }

            return res.status(200).json({
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        }

        const newUser = new Auth({
            authType: 'facebook',
            facebookId: body.googleId,
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: "",
            address: ""
        });

        await newUser.save();

        const accessToken = jwt.sign({ id: newUser._id }, process.env.JWT_ACCESS_KEY, { expiresIn: "1d" });
        const refreshToken = generateRefreshToken(newUser);

        return res.status(200).json({
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

//dang nhap app delivery
exports.signinShipper = async (req, res) => {
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

        if (user.role!=="shipper") {
            return res.status(404).json({
                messages: 'Tài Khoản không được cấp quyền'
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

            return res.status(200).json({
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

exports.changePassword = async (req, res) => {
    try {
        const { error } = authSchema.changePasswordUserSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }

        const user = req.user
        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password)
        if (!isMatch) {
            return res.status(400).json({
                message: "Mật khẩu hiện tại không đúng"
            })
        }
        const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 10);
        const userNew = await Auth.findByIdAndUpdate(req.user._id, { password: hashedNewPassword }, { new: true });
        if (!userNew) {
            return res.status(400).json({
                message: "Không tìm thấy người dùng"
            })
        }
        userNew.passwordChangeAt = Date.now()
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
        return res.status(200).json({
            accessToken: accessToken,
            refreshToken: refreshToken
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


exports.loginAdmin = async (req, res) => {
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
            return res.status(200).json({
                accessToken: accessToken,
                refreshToken: refreshToken,
                role: user.role
            })

        }




    } catch (error) {
        return res.status(400).json({
            messages: error
        })
    }

}

// fun Lấy một người dùng theo ID
exports.getOneById = async (id) => {
    try {
        const data = await Auth.findById(id);
        if (!data) return null
        return data
    } catch (error) {
        return null
    }
};

exports.searchAuth = async (req, res) => {
    try {
        const curentUser = req.user

        const textSearch = req.params.text
        const users = await Auth.find({
            $and: [
                {
                    $or: [
                        { first_name: { $regex: new RegExp(textSearch, "i") } },
                        { last_name: { $regex: new RegExp(textSearch, "i") } },
                    ],
                },
                { _id: { $ne: curentUser._id } },
            ],
        });
        res.status(200).json(users)
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

exports.updateToken = async (req, res) => {
    try {
        const tokenDevice = req.body.tokenFcm;

        // xóa token
        await Auth.findOneAndUpdate(
            { tokenFcm: tokenDevice },
            { $unset: { tokenFcm: 1 } },
            { new: true }
          );

        const user = await Auth.findByIdAndUpdate(req.user._id, {tokenFcm: tokenDevice});
        res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

exports.logoutMobile = async (req, res) => {
    try{
        const user = await Auth.findByIdAndUpdate(req.user._id, {tokenFcm: ""});
        res.status(200).json(user);
    }catch(err){
        console.log(err);
        return res.status(400).json()  
    }
}




exports.signupShipper = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, password } = req.body;
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
            email,
            password: hashedPassword,
            role: "shipper"
        });
        res.status(303).set('Location', '/api/admin/shipper').send();

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};




