import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import getToken from '../utils/tokenGenaratuon.js';
import dotenv from 'dotenv';

dotenv.config()
let userRegister = async (req, res) => {
  try {
    let { name, email, phone, password, role, picture, bio } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send({
        success: false,
        message: 'User already exists',
      });
    }
    let encriptade = await bcrypt.hash(password, 10);
    let myUser = new User({
      name,
      email,
      phone,
      password: encriptade,
      role,
      picture,
      bio,
    });
    await myUser.save();

    const token = getToken(email);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === "production" ? 'None' : 'Lax',
    });

    res.status(200).send({
      tokenCapture: true,
      success: true,
      data: {
        name,
        email,
        phone,
        role,
      },
    });
  } catch (e) {
    res.status(500).send({ // ৫০০ সার্ভার এরর
      success: false,
      message: e.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(404).send({
        success: false,
        message: 'Incorrect information',
      });
    }
    const token = getToken(email);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === "production" ? 'None' : 'Lax',
    });
    console.log('login token', token); // শুধুমাত্র ডিবাগের জন্য

    res.status(200).send({
      tokenCapture: true,
      success: true,
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (e) {
    res.status(500).send({ // ৫০০ সার্ভার এরর
      success: false,
      message: "User can't login",
    });
  }
};

let userRole = async (req, res) => {
  try {
    let email = req.params.email;
    console.log(email);

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'user not found',
      });
    }

    const token = getToken(email);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === "production" ? 'None' : 'Lax',
    });

    console.log('login token ', token);
    res.status(200).send({
      tokenCapture: true,
      success: true,
      data: user,
    });
  } catch (e) {
    res.status(404).send({
      success: false,
      message: "user can't login",
      error: e.message,
    });
  }
};

let logoutUser = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV ? 'None' : 'Lax'
  });
  res.status(200).send('Logged out successfully');
};

let ourAllUsers = async (req, res) => {
  try {
    let users = await User.find({});
    res.status(200).send({
      tokenCapture: true,
      success: true,
      data: users,
    });
  } catch (e) {
    console.log(e);
    res.status(404).send({
      success: false,
      message: 'users not found',
    });
  }
};

let deleteUser = async (req, res) => {
  try {
    let userEmail = req.params.email;
    console.log(userEmail, 'delete user');
    let query = { email: userEmail };
    let result = await User.deleteOne(query);
    res.status(200).send({
      success: true,
      message: 'delete successfull',
    });
  } catch (err) {
    res.status(404).send({
      success: false,
      message: err.message,
    });
  }
};

let getInstructors = async (req, res) => {
  try {
    let instructors = await User.find({ role: 'instructor' }).select('name _id picture role');
    res.status(200).send(instructors);
  } catch (error) {
    res.status(404).send({ message: "Instructors not found ", error });
  }
}


export {
  userRegister,
  loginUser,
  logoutUser,
  ourAllUsers,
  userRole,
  deleteUser,
  getInstructors
};
