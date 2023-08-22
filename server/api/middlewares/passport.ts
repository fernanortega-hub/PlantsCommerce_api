import passport from "passport";
import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import userService from "../services/user.service";

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_TOKEN_SECRET
};

const passportMiddleware = passport.use(
    new Strategy(options, async (payload: any, done: any) => {   
        try {
            const user = await userService.getById(payload.id)
            
            return done(null, user)
        } catch (error) {
            done(error)
        }
    })
)

export default passportMiddleware