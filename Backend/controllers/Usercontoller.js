const BCRYPT = require('bcryptjs')

const User_Model = require('../models/User')

const jwt = require("jsonwebtoken");

const SignUp = async (req, res) => {
  const { User_Name, User_Email, User_Phone, User_Password, User_Confirm_Password } = req.body;

  console.log(req.body)

  try {
    // Validate input fields
    if (!User_Name || !User_Email || !User_Phone || !User_Password || !User_Confirm_Password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if passwords match
    if (User_Password !== User_Confirm_Password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if the user already exists in the database
    const isExistedUser = await User_Model.findOne({ UT_Email: User_Email });

    if (!isExistedUser) {
      // User does not exist, create a new user and store in the database

      // Hash the password
      const HashedPassword = await BCRYPT.hash(User_Password, 12);

      // Create user details
      const User_details = new User_Model({
        UT_Email: User_Email,
        UT_Name: User_Name,
        UT_Phone: User_Phone,
        UT_Password: HashedPassword,
      });

      // Save the user to the database
      await User_details.save();

      // Respond with a success message and redirect URL
      return res.status(201).json({ 
        message: "Registered successfully", 
        redirect_url: '/' 
      });
    } else {
      // User already exists, redirect to the login page
      return res.status(409).json({ 
        message: "User already exists, please login to continue", 
        redirect_url: '/' 
      });
    }
  } catch (error) {
    // Handle any internal server error
    console.error(error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};




const Login = async (req, res) => {
    const { User_Email, User_Password } = req.body;
  
    try {
      // Check if all fields are provided
      if (!User_Email || !User_Password) {
        return res.status(400).json({ message: "Email and Password are required." });
      }
  
      // Check if user exists in the database
      const Result = await User_Model.findOne({ UT_Email: User_Email });
  
      if (Result) {
        // Extract entered and actual passwords
        const EnteredPassword = User_Password;
        const ActualPassword = Result.UT_Password;
  
        // Compare the passwords
        const confirmation = await BCRYPT.compare(EnteredPassword, ActualPassword);
  
        if (confirmation === true) {


          const token = jwt.sign({User_Email}, process.env.JWT_SECRET, { expiresIn: "1h" });
          
          return res.status(200).json({
            message: "Login successful. Redirecting to home page.",
            redirect_url: "/components/Home",
            User_OID : Result._id,
            Auth_Token : token
          });
        } else {
          // Password mismatch
          return res.status(401).json({ message: "Incorrect password. Please try again." });
        }
      } else {
        // User does not exist
        return res.status(404).json({
          message: "User not found. Please register to continue.",
          redirect_url: "/register",
        });
      }
    } catch (error) {
      console.error(error);
      // Internal server error
      return res.status(500).json({ message: "Internal server error. Please try again later." });
    }
  };
  

module.exports = {SignUp , Login}
