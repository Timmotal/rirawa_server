import bcrypt from "bcrypt"; // allows for password encryption
import jwt from "jsonwebtoken"; // sends a user a web token they will use for authorization
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => { // making a call to the database -> so async

  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body; 

    const salt = await bcrypt.genSalt(); // generate salt we then use to encrypt the password
    const passwordHash = await bcrypt.hash(password, salt); // hash them together
    // <<<<<<<<<I AM NOT FOCUSED ON THE PROCESS BUT IN A RUSH TO THEM END GOAL>>>>>>>>>>>


    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash, // we don't even store the real password there
      picturePath,
      friends,
      location, 
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),// 1 through 10K
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save(); 
    res.status(201).json(savedUser); // use res provided by express
    // if you have the same naming convention, you can use the exact data from the backend
    // otherwise you find ways to write code that will convert it
  } catch (err) {
    res.status(500).json({ error: err.message }); // with the error message that MongoDB has returned
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //  use mongoose to find that specified email
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    // use bcrypt to compare password entered, with one in the database
    // using the same salt to compare they match 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

  
    // sign the jwt with the ID
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password; // delete the password -> so it doesn't get sent to frontend
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
