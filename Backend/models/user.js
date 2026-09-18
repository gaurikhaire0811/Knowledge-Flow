
import mongoose from "mongoose";
import passportLocalMongoosePackage from "passport-local-mongoose";

const passportLocalMongoose =
    passportLocalMongoosePackage.default || passportLocalMongoosePackage;

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    }

});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

export default User;