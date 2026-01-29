import AdminModel from "../model/adminmodel.js";
import bcrypt from "bcrypt";

const getinfo = async (req, res) => {
  try {
    const admins = await AdminModel.find();
    return res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

const postinfo = async (req, res) => {
  try {
    const { name, email, phone, location, password } = req.body;

    if (
      !name || !email || !phone || !location || !password ||
      name.trim() === "" ||
      email.trim() === "" ||
      phone.trim() === "" ||
      location.trim() === "" ||
      password.trim() === ""
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const exists = await AdminModel.findOne({ email });
    if (exists) {
      return res.status(409).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new AdminModel({
      name,
      email,
      phone,
      location,
      password: hashedPassword
    });

    await admin.save();

    return res.status(201).json({
      message: "Admin added successfully",
      admin
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already exists"
      });
    }

    console.error(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export { getinfo, postinfo };
