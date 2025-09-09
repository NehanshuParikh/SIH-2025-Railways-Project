import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['Operator', 'Admin','SectionController'],
        required: true
    },
    password: {
        type: String,
        // not keeping password required true as it might be sso from the railways in future if included in this system.
    }
},{ timestamps: true })

const userModel = mongoose.model('User', userSchema);
export default userModel;
