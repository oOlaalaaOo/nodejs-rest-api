import mongoose, { HookNextFunction } from "mongoose";
import bcryptService from "../services/bcrypt.service";
import { validEmail, validAlpha } from "../helpers/validator.helper";

export interface IUserAddress {
  address: string;
  country: string;
  zipCode: string;
  state: string;
}

export interface IUserImages {
  url: string;
  type: string;
  mime: string;
  size: string;
}

export interface IUser extends mongoose.Document {
  name: string;
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isMobileNoVerified: boolean;
  registeredAt: Date;
  addresses: IUserAddress[];
  images: IUserImages[];
}

const userAddressSchema = new mongoose.Schema({
  address: { type: String },
  country: { type: String },
  zipCode: { type: String },
  state: { type: String },
});

const userImageSchema = new mongoose.Schema({
  url: { type: String },
  type: { type: String },
  mime: { type: String },
  size: { type: String },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, validate: validAlpha },
    username: { type: String, required: true, validate: validAlpha },
    password: { type: String, required: true },
    email: { type: String, validate: validEmail },
    addresses: [userAddressSchema],
    images: [userImageSchema],
    mobileNo: { type: String },
    birthDate: { type: Date },
    sex: { type: String, enum: ["male", "female"] },
    isActive: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isMobileNoVerified: { type: Boolean, default: false },
    registeredAt: { type: Date, required: true },
    verifiedEmailDate: { type: Date },
    verifiedPhoneNoDate: { type: Date },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", function (next: HookNextFunction) {
  if (!this.isModified("password")) return next();

  try {
    this.password = bcryptService.hashString(this.password);

    return next();
  } catch (err) {
    return next(err);
  }
});

// schema.methods.verifyPassword = function (
//   plainText: string,
//   callback: Function
// ): boolean {
//   return callback(null, bcrypt.compareSync(plainText, this.password));
// };

export default mongoose.model<IUser>("UserModel", userSchema);
