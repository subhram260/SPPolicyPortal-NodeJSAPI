import * as AuthModel from '../models/authModel.js';

const register = async (req, res,next) => {
     try {
          const { Name, Email, Password, Role, Location, Phone, Status } = req.body;
          await AuthModel.register(Name, Email, Password, Role, Location, Phone, Status);
     } catch (error) {
          next(error);
     }
};

const login = async (req, res, next) => {
     try {
          console.log("Login attempt:", req.body);
          const { email, password } = req.body;
          const token = await AuthModel.login(email, password);
          res.json({ message: 'Login successful', token: token });
     } catch (error) {
          next(error);
     }
};


export {
     register,
     login,
};