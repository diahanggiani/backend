const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const db = require("../firebase");

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  // Memeriksa kelengkapan input
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  // Memeriksa format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }

  try {
    // Memeriksa apakah email sudah terdaftar sebelumnya
    const userRef = db.collection("users").where("email", "==", email);
    const snapshot = await userRef.get();

    if (!snapshot.empty) {
      return res.status(400).json({
        message: "Email is already registered",
      });
    }

    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection("users").doc(id).set(user);
    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user: " + error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Memeriksa kelengkapan input
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    // Memeriksa apakah email sudah terdaftar
    const userRef = db.collection("users").where("email", "==", email);
    const snapshot = await userRef.get();

    if (snapshot.empty) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = snapshot.docs[0].data();

    // Memeriksa kecocokan password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Membuat dan mengirimkan token JWT
    const token = jwt.sign(
      { userId: snapshot.docs[0].id },
      process.env.JWT_SECRET
    );
    res.status(200).json({
      message: "Welcome back " + user.username,
      token,
    });
  } catch (error) {
    res.status(500).json("Error logging in: " + error.message);
  }
};

const logout = (req, res) => {
  return res.status(200).json({
    message: "Logout successful",
  });
};

module.exports = {
  signup,
  login,
  logout,
};
