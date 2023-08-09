const UserModel = require("../modals/User");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

cloudinary.config({
    cloud_name: "dvjhysic5",
    api_key: "293319949388243",
    api_secret: "G6Sz-9bHGUV7Xf-ts5ZOs5YiutU",
});

class UserController {

    static userinsert = async (req, res) => {

        //console.log(req.files.image)
        const file = req.files.image
        const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {

            folder: 'studentimage'
        })
        // console.log(imageUpload)
        const { name, email, password, cpassword } = req.body
        const user = await UserModel.findOne({ email: email })
        //console.log(user)
        if (user) {
            res.status(401)
                .json({ status: "failed", message: "ᴛʜɪꜱ ᴇᴍᴀɪʟ ɪꜱ ᴀʟʀᴇᴀᴅʏ ᴇxɪᴛꜱ😓" });
        } else {
            if (name && email && password && cpassword) {
                if (password == cpassword) {

                    try {
                        const hashpassword = await bcrypt.hash(password, 10)
                        const result = new UserModel({

                            name: name,
                            email: email,
                            password: hashpassword,
                            image: {
                                public_id: imageUpload.public_id,
                                url: imageUpload.secure_url
                            }
                        })

                        await result.save()

                        res.status(201)
                            .json({ status: "Success", message: "Ragistration Successfully" });

                    } catch (error) {
                        console.log(error)
                    }

                } else {
                    res.status(401)
                        .json({ status: "failed", message: "Password and confirm password does not match" });
                }
            } else {
                res.status(201)
                    .json({ status: "failed", message: "All field are required" });
            }
        }

    }

    static verify_login = async (req, res) => {


        try {

            //console.log(req.body)

            const { email, password } = req.body
            if (email && password) {
                const user = await UserModel.findOne({ email: email })
                // console.log(user)
                if (user != null) {
                    const ismatch = await bcrypt.compare(password, user.password)
                    if (ismatch) {
                        const token = jwt.sign({ ID: user._id }, 'shivanibansal@123#8962');
                        res.cookie('token', token)
                        res.status(200)
                        .json({ status: "Success", message: "Login Successfully", token });
                    }
                    else {
                        res.status(401)
                   .json({ status: "failed", message: "Email password is not valid" });
                    }
                }
                else {
                    res.status(401)
                .json({ status: "failed", message: "You are not register user" });
                }
            }
            else {
                res.status(401)
                .json({ status: "failed", message: "All field are required" });
            }

        } catch (error) {
            console.log('error');
        }

    }

    static logout = async (req, res) => {
        try {
            res.clearCookie("token");
            res.send('logout successfully');
        } catch (error) {
            console.log("error");
        }
    };

    static getuserdetail = async (req, res) => {
        try {
            //console.log(req.user);
            const user = await userModel.findById(req.user.id);

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            console.log(error);
        }
    }

    static getalluser = async (req, res) => {
        try {
            const getalluser = await UserModel.find();
            res.status(200).json({
                success: true,
                getalluser,
            })
        } catch (error) {
            console.log(error)
        }
    }
     
    static change_password = async (req, res) => {
        try {
            const { name, email, id, image } = req.user
            // console.log(req.body)
            const { oldpassword, newpassword, cpassword } = req.body
            if (oldpassword && newpassword && cpassword) {
                const user = await UserModel.findById(id)
                const ismatch = await bcrypt.compare(oldpassword, user.password)
                if (!ismatch) {
                    
                    res.status(400)
                .json({ status: "Failed", message: "Old Password is incorrect" });
                }
                else {
                    if (newpassword !== cpassword) {
                        
                        res.status(400)
                        .json({ status: "Failed", message: "Password and confirm password is not matched" });
                    }
                    else {
                        const newHashpassword = await bcrypt.hash(newpassword, 10)
                        await UserModel.findByIdAndUpdate(id, {
                            $set: { password: newHashpassword }

                        })
                       
                        res.status(201)
                        .json({ status: "Success", message: "Password Change successfully" });
                    }
                }

            }
            else {
                res.status(400)
                .json({ status: "Failed", message: "All field are required" });

            }


        } catch (error) {
            console.log('error')
        }
    }

    static profile_update = async (req, res) => {
        try {
            //console.log(req.files.image)
            if (req.files) {
                const user = await UserModel.findById(req.user.id);
                const image_id = user.image.public_id;
                await cloudinary.uploader.destroy(image_id);

                const file = req.files.image;
                const myimage = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: "studentimage",

                });
                var data = {
                    name: req.body.name,
                    email: req.body.email,
                    image: {
                        public_id: myimage.public_id,
                        url: myimage.secure_url,
                    },
                };
            } else {
                var data = {
                    name: req.body.name,
                    email: req.body.email,

                }
            }
            const update_profile = await UserModel.findByIdAndUpdate(req.user.id, data)
            res.status(201)
            .json({ status: "Success", message: "Profile Update successfully" });
        } catch (error) {
            console.log(error)
        }
    }

    static sendEmail = async (name, email) => {
        // console.log("email sending")
        //consollog("propertyName")
        // console.log(email)

        //connenct with the smtp server

        let transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,

            auth: {
                user: "sujaljha007@gmail.com",
                pass: "uqltlwovtuaovloc",
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: "Create course Registration Succesfully", // Subject line
            text: "hello", // plain text body
            html: `<b>${name}</b> Registration is successful! please login.. `, // html body
        });
        //console.log("Messge sent: %s", info.messageId);
    };

}

module.exports = UserController;
