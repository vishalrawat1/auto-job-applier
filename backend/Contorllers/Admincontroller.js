import AdminModel from "../model/Adminmodel.js";

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
    const { name, email, phone, location } = req.body;

    if (
      !name || !email || !phone || !location ||
      name.trim() === "" ||
      email.trim() === "" ||
      phone.trim() === "" ||
      location.trim() === ""
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

    const admin = new AdminModel({
      name,
      email,
      phone,
      location
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
