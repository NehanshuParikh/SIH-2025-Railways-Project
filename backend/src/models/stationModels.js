import mongoose from "mongoose";

const stationSchema = new mongoose.Schema(
    {
        stationId: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        code: {
            type: String,
            required: true,
            unique: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // assuming admin is stored in userModel with role: 'Admin'
            required: true
        },
    },
    { timestamps: true }
);

const stationModel = mongoose.model("Station", stationSchema);
export default stationModel;
