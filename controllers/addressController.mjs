import { Address, User } from '../models/user.mjs';

export const addAddress = async (req, res, next) => {
  const userId = req.userId;
  const addressData = req.body.address;
  let address;

  if (addressData._id) {
    address = await Address.findById(addressData._id);

    address.name = addressData.name;
    address.address = addressData.address;
    address.phoneNumber = addressData.phoneNumber;

    await address.save();
  } else {
    address = new Address(addressData);

    await address.save();

    const user = await User.findById(userId);

    user.address.push(address._id);

    await user.save();
  }

  res.status(200).json({
    message: 'Added or edited address successfully',
    address: address,
  });
};
