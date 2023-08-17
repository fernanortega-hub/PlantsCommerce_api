import express from 'express';
import controller from '../controllers/examples/controller';
export default express
  .Router()
  .post('/', controller.create)
  .get('/', controller.all)
  .get('/:id', controller.byId);
