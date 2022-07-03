import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const error = validationResult(req);

  try {
    if (!error.isEmpty()) {
      return res.status(400).json(error.array())
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = UserModel({
      email: req.body.email,
      passwordHash: hash,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl
    });

    const user = await doc.save();

    const token = jwt.sign({
        id: user._id,
      },
      'secret 123',
      {
        expiresIn: '1d',
      });

    const { passwordHash, ...userData } = user._doc

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    res.status(403).json({
      message: `Registration failed ${err}`,
    })
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      res.status(404).json({
        message: 'User not found',
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      res.status(404).json({
        message: 'Wrong email or password',
      });
    }

    const token = jwt.sign({
        id: user._id,
      },
      'secret 123',
      {
        expiresIn: '1d',
      });

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });

  } catch (err) {
    res.status(403).json({
      message: `Login failed ${err}`,
    });
  }
};

export const session = async (req, res) => {
  try {
    const user = await UserModel.findOne({id: req.userId});
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
    });

  } catch (err) {
    res.status(403).json({
      message: `Access denied ${err}`,
    });
  }
};
