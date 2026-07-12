const express = require("express") ;
const authController = require("../controllers/auth.controller") ;
const router = express.Router() ;



//  POST/api/auth/register

router.post("/register" , authController.userRegisterController) ; // (api , fucntion that handle request)

/* Post/api/auth/login */

router.post("/login" , authController.userLoginController) ;

/**
 * - Post/api/auth/logout
 */
router.post("/logout" , authController.userLogoutController)


module.exports = router ; // export the router 

