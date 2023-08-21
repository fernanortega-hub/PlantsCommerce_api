import mongoose from "mongoose";
import l from '../../common/logger';

export const dbConnection = async () => {
    try {
        mongoose
            .set('strictQuery', true)
            .connect(process.env.MONGO_URI!!)
        l.info('Database connected')
    } catch (error) {
        l.error(`Connection rejected: ${error}`)
    }
}