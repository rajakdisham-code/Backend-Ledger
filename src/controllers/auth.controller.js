const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");  // used for authentication(entry pass)

/*After login → server gives a token
Client stores it (localStorage / cookie) but not visible to user 
Sends token in every request
Server verifies token → allows access  */

const emailService = require("../services/email.service");

const tokenBlackListModel = require("../models/blacklist.model")








/** 
* - user register controller
* - Post /api/auth/register
*/

async function userRegisterController(req, res) {
  try {
    const { email, name, password } = req.body;

    // Validate input
    if (!email || !name || !password) {
      return res.status(400).json({
        message: "Email, name, and password are required",
        status: "fail"
      });
    }

    const isExists = await userModel.findOne({ email });

    if (isExists) {
      return res.status(422).json({
        message: "User already exists",
        status: "fail"
      });
    }

    const user = await userModel.create({
      email,
      name,
      password
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true });

    // Send registration email after successful registration (before responding)
    await emailService.sendRegistrationEmail(user.email, user.name);

    res.status(201).json({
      user: {
        email: user.email,
        name: user.name,
        _id: user._id
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "fail"
    });
  }
}


/**
 * - User Login Controller
 * - Post /api/auth/login 
 */

async function userLoginController(req , res) {
  try {
    const { email , password} = req.body ;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        status: "fail"
      });
    }

    const user = await userModel.findOne({email}).select("+password") // select(+password) , bydefault password is hidden , so here it finds email with that password even that is hidden
    
    if(!user) { 
      return res.status(404).json({
      message: "User not found" ,
      status : "fail"
      })
    }

    const isMatch = await user.comparePassword(password)   

    if(!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials" ,
        status : "fail" })
   }

   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
      res.cookie("token", token, { httpOnly: true });  // httpOnly : true - makes the cookie inaccessibel to Javasript(document.cookie)
      //Behavior :
      //browser sends cookies automatically in requests , frontends JS cannot access it 


      // Send login email after successful login (before responding)
      await emailService.sendLoginEmail(user.email, user.name);

      res.status(200).json({
        user: {
          email: user.email,
          name: user.name,
          _id: user._id
        },
        token
      });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "fail"
    });
  }
}

/**
 * - User logout Controller
 * - Post/api/auth/logout
 */

async function userLogoutController(req , res){
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

  if(!token){
    return res.status(400).json({
      message: "User logged out successfully"
    })
  }

  await tokenBlackListModel.create({
    token : token
  })

  res.clearCookie("token")

  res.status(200).json({
    message: "User logged out successfully "
  })
}

module.exports = {
  userRegisterController,
  userLoginController,
  userLogoutController
}