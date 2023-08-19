import { Application } from 'express';
import authRouter from './api/routes/auth.router';
import passport from 'passport';
import userRouter from './api/routes/users.router';
import { productRouter } from './api/routes/product.router';
require("../server/api/middlewares/passport")

export default function routes(app: Application): void {
  app.use('/api/v1/auth', authRouter);
  app.use(passport.authenticate("jwt", { session: false }))
  app.use('/api/v1/users', userRouter)
  app.use('/api/v1/products', productRouter)
}
