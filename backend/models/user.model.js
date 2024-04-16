const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const BOARDS = require("../utils/BOARDS_ENUMS");

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    attachement: String,
    tag: String,
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: "username is required",
        unique: true,
    },
    password: {
        type: String,
        required: "Password is required",
    },
    boards: {
        type: String,
        enum: [BOARDS.DONE, BOARDS.INPROGRESS, BOARDS.TODO],
        default: BOARDS.TODO,
    },
    tasks: {
        type: [taskSchema],
        default: [],
    },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User =mongoose.model("User", userSchema);
module.exports = User;