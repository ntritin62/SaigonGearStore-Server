import { User } from '../models/user.mjs';

export const editUser = async (req, res, next) => {
  const userId = req.userId;
  const userData = req.body.userData;

  const user = await User.findById(userId);
  user.name = userData.name;
  user.email = userData.email;
  user.phoneNumber = userData.phoneNumber;

  await user.save();
  res.status(200).json({
    message: 'edited user info  successfully',
  });
};
