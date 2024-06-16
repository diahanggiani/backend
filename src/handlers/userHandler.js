const db = require('../firebase');
const bcrypt = require('bcryptjs');

const getUserProfile = async (req, res) => {
  const userId = req.user.userId;

  try {
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const user = doc.data();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send('Error fetching user profile: ' + error.message);
  }
};

const updateUserProfile = async (req, res) => {
  const userId = req.user.userId;
  const { new_username, new_email, new_password } = req.body;

  // Memeriksa kelengkapan input
  if (!new_username && !new_email && !new_password) {
    return res.status(400).json({
      message: 'At least one field must be provided for update'
    });
  }

  try {
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Membuat objek untuk update
    const updateData = {};
    if (new_username) {
      updateData.username = new_username;
    }
    if (new_email) {
      updateData.email = new_email;
    }
    if (new_password) {
      // Hash password sebelum disimpan
      const hashedPassword = await bcrypt.hash(new_password, 10);
      updateData.password = hashedPassword;
    }

    // Update data pengguna
    await userRef.update({ ...updateData, updatedAt: new Date().toISOString() });

    res.status(200).json({
      message: 'User profile updated successfully'
    });
  } catch (error) {
    res.status(500).send('Error updating user profile: ' + error.message);
  }
};

const deleteUserAccount = async (req, res) => {
  const userId = req.user.userId;

  try {
    await db.collection('users').doc(userId).delete();
    res.status(200).send('User account deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting user account: ' + error.message);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount
};
