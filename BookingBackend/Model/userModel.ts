import mongoose, { Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
interface SchemaType {
  name: string;
  email: string;
  password: string;
  resetPasswordToken?: string;
  role: string;
  theme: string;
  passwordConfirm: string | undefined;
  refreshToken: string | undefined;
}
export interface IUserMethods {
  checkPassword(password: string): Promise<boolean>;
}
type UserModel = Model<SchemaType, {}, IUserMethods>;

const userSchema = new mongoose.Schema<SchemaType, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: true,
      minLength: [2, "please write valid name"],
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => {
          return validator.isEmail(value);
        },
        message: "Email is Not valid",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
      minLength: [8, "please write valid password"],
      validate: {
        validator: (value: string) => {
          return validator.isStrongPassword(value);
        },
        message: "Please Write Strong Password",
      },
    },
    role: { type: String, required: true, default: "user" },
    theme: { type: String, required: true, default: "light" },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (this: any, value: string) {
          return value === this.password;
        },
        message: "Passwords is not same",
      },
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    resetPasswordToken: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(_, ret) {
        delete (ret as Partial<typeof ret>).refreshToken;
        delete (ret as Partial<typeof ret>).password;
        return ret;
      },
    },
    timestamps: true,
  },
);

/////////////////////////////////////////////////////////
userSchema.index({ email: 1 }, { unique: true });
/////////////////////////////////////////////////////////

userSchema.pre("save", async function (next: any) {
  if (!this) return next();
  if (this && !this.isModified("password")) return next();
  this.passwordConfirm = undefined;
  this.password = await bcrypt.hash(this.password, 12);
});

/////////////////////////////////////////////////////
userSchema.methods.checkPassword = async function (passwordValue: string) {
  const isSamePassword = await bcrypt.compare(passwordValue, this.password);
  return isSamePassword;
};

export const User = mongoose.model<SchemaType, UserModel>("User", userSchema);
