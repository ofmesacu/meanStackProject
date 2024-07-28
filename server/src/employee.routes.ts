import * as express from 'express';
import * as mongodb from 'mongodb';
import { collections } from './database';

export const employeeRouter = express.Router();

employeeRouter.use(express.json());

employeeRouter.get('/', async(_req, rsp) => {
    try {
        const employees = await collections.employees.find({}).toArray();
        rsp.status(200).send(employees);
    }
    catch(error){
        rsp.status(500).send(error.message);
    }
})

employeeRouter.get('/id/:id', async(req, rsp) => {

    try {
        const id = req?.params?.id;
        const query = {_id: new mongodb.ObjectId(id)};
        const employee = await collections.employees.findOne(query);

        if(employee){
            rsp.status(200).send(employee);
        }
        else{
            rsp.status(404).send(`Employee not found by ID ${req?.params?.id}`);
        }
    }
    catch(error){
        rsp.status(404).send(`Employee not found by ID ${req?.params?.id}`);
    }
})

employeeRouter.get('/name/:name', async(req, rsp) => {
    try {
        const name = req?.params?.name;
        const employee = await collections.employees.find({"name": new RegExp(name, 'i')}).toArray();

        if(employee.length > 0){
            rsp.status(200).send(employee);
        }
        else {
            rsp.status(404).send(`Employee not found by Name ${req.params.name}`);
        }
    }
    catch(error){
        rsp.status(404).send(`Employee not found by Name ${req.params.name}`);
    }
})

employeeRouter.post('/', async(req, rsp) => {
    try {
        const employee = req.body;
        const result = await collections.employees.insertOne(employee);

        if(result.acknowledged){
            rsp.status(200).send(`Created a new employee: ID ${result.insertedId}`)
        } else {
            rsp.status(500).send("Failed to create new employee")
        }
    }
    catch(error){
        console.error(error);
        rsp.status(400).send(error.message)
    }
})

employeeRouter.put('/id/:id', async(req, rsp) => {
    try {
        const id = req?.params?.id;
        const employee = req.body;
        const query = {_id: new mongodb.ObjectId(id)};
        const result = await collections.employees.updateOne(query, {$set: employee});

        if(result && result.matchedCount){
            rsp.status(200).send(`Update employee data`);
        }
        else if(!result.matchedCount){
            rsp.status(404).send(`Employee not found`);
        }
        else{
            rsp.status(304).send(`Failed to update an employee`);
        }
    }
    catch(error){
        console.error(error.message);
        rsp.status(400).send(error.message);
    }
})

employeeRouter.delete('/id/:id', async(req, rsp) => {
    try{
        const id = req?.params?.id;
        const query = {_id: new mongodb.ObjectId(id)}
        const result = await collections.employees.deleteOne(query);

        if(result.deletedCount){
            rsp.status(200).send(`Deleted employee`);
        }
        else if(!result.deletedCount){
            rsp.status(404).send(`Employee not found`)
        }
        else{
            rsp.status(404).send(`Employee not found`)
        }
    }
    catch(error){
        console.error(error.message);
        rsp.status(400).send(error.message);
    }
})