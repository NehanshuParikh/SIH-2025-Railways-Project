import mongoose from 'mongoose'

const connectDb = async () => {
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log('Database connected successfully')
    }).catch((err)=>{
        console.log('Database failed to connect')
        console.log(err)
    })
    
}
export default connectDb;