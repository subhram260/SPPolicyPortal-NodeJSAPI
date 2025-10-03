import * as financerModel from "../models/financersModel.js";

const handleResponse = (res,status,message,data = null) => {

     res.status(status).json({
          status,
          message,
          data,
     });

};


const createFinancer = async (req, res, next) => {
    const { name } = req.body;
    try {
        const newFinancer = await financerModel.createFinancer({ name });
        handleResponse(res, 201, "Financer added successfully", newFinancer);
    } catch (error) {
        console.log("Error creating financer:", error);
        next(error);
    }
};

const getAllFinancers = async (req, res, next) => {
    try {
        const financers = await financerModel.getAllFinancers();
        handleResponse(res, 200, "Financers retrieved successfully", financers);
    } catch (error) {
        console.log("Error retrieving financers:", error);
        next(error);
    }
};

const getFinancerById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const financer = await financerModel.getFinancerById(id);
        handleResponse(res, 200, "Financer retrieved successfully", financer);
    } catch (error) {
        next(error);
    }
};




export { createFinancer, getAllFinancers, getFinancerById };
