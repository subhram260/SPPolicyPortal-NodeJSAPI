import * as dealerModel from '../models/dealerModel.js';

const getAllDealers = async (req, res, next) => {
    try {
        const dealers = await dealerModel.getAllDealers();
        res.json(dealers);
    } catch (err) {
          next(err);
    }
}

const getDealerById = async(req,res,next) => {
     try{
          const dealer = await dealerModel.getDealerById(req.params.id);
          if(!dealer)
          {
               return res.status(404).json({message:"Dealer not found"});
          }
          res.json(dealer);
     }catch(err)
     {
          next(err);
     }
}

const createDealer = async (req, res, next) => {
    try {
        const dealer = await dealerModel.createDealer(req.body);
        res.status(201).json(dealer);
    } catch (err) {
        next(err);
    }
}



export {
    getAllDealers,
    getDealerById
//     createDealer
};