import express from 'express';
import { login, register } from '../controller/authController.js';
import { getAllDealers,getDealerById } from '../controller/dealerController.js';
import { createFinancer, getAllFinancers, getFinancerById} from '../controller/financerController.js';

const Router = express.Router();

// Authentication routes
Router.post('/auth/register', register);
Router.post('/auth/login', login);

// Dealer Routes
Router.get('/dealers/alldealers', getAllDealers);
Router.get('/dealers/:id', getDealerById);
// dealerRoutes.post('/dealer', createDealer);

// Financer Routes
Router.post('/financers/addfinancer', createFinancer);
Router.get('/financers/getAllfinancer', getAllFinancers);
Router.get('/financers/:id', getFinancerById);


export default Router;
