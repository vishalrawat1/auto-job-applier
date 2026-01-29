  import mongoose from "mongoose";

  const adminmodel = mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    }
  });

  const AdminModel = mongoose.model("adminmodel", adminmodel);
  export default AdminModel;

  // everything ok
