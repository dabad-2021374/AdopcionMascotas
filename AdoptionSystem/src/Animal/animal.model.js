import mongoose, { mongo } from "mongoose"

const userSchema = mongoose.Schema({
    typeAnimal: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: false
    },
    keeper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true
    }
})

export default mongoose.model('animal', userSchema)