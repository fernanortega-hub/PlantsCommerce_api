import { Application } from 'express';
import authRouter from './api/routes/auth.router';
import passport from 'passport';
import userRouter from './api/routes/users.router';
require("../server/api/middlewares/passport")

export default function routes(app: Application): void {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', passport.authenticate("jwt", { session: false }), userRouter)
}
