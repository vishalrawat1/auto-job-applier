  import mongoose from "mongoose";

  const adminmodel = mongoose.Schema({
    name: String,
    email: {
      type: String,
      unique: true,
      required: true
    },
    phone: String,
    location: String
  });

  const AdminModel = mongoose.model("adminmodel", adminmodel);
  export default AdminModel;

  // everything ok
