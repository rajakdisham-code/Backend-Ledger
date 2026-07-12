const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


// Registering part code start 
const userSchema = new mongoose.Schema( // schema(blueprint) is needed ot define the structure + rules for your data 
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true, // automaticaaly removes whitespace (space , tabe , newline)
      lowercase: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"], // email format checker using regex(regular expression)
      unique: [true, "Email already exists"],
    },
    name: {
      type: String,
      required: [true, "Name is required for creating an account"],
    },
    password: {
      type: String,
      required: [true, "Password is required for creating an account"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // why - security  => prevents sending password in API responses
    },
    systemUser: {
      type: Boolean , 
      default: false,
      immutable: true,
      select: false
    }
    },
  {
    timestamps: true, // automatically adds time fields to each document (createdAt , updatedAt)
  }
);

// this is important for security purpose 
userSchema.pre("save", async function (next) { // a middleware(hook) in Mongoose that runs before a specific operation
  if (!this.isModified("password")) return ; // logic before saving , hashing the password 
  this.password = await bcrypt.hash(this.password, 10);
  
}); // end registering part

// login part code  start 
//This method is used only during login, not registration. this is function with logic in controller we have called this function 
userSchema.methods.comparePassword = async function (candidatePassword) { // .method => attach functions to each document(instance) -> Direct access of this.password(already saved password in hash form)
  return bcrypt.compare(candidatePassword, this.password);
};
// login part end

const UserModel = mongoose.model("User", userSchema); // User - we are creating a model using userSchema , userModel = object(class) to interact with DB

module.exports = UserModel;