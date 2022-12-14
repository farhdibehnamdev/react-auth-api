import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { getDbConnection } from "../db";
import { sendEmail } from "../util/sendEmail";

export const signUpRoute = {
  path: "/api/signup",
  method: "post",
  handler: async (req, res) => {
    const { email, password } = req.body;
    const db = getDbConnection("react-auth-db");
    const user = await db.collection("users").findOne({ email });

    if (user) {
      res.sendStatus(409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const verificationString = uuid();

    const startingInfo = {
      firstName: "",
      lastName: "",
      bio: "",
    };

    const result = await db.collection("users").insertOne({
      email,
      passwordHash,
      info: startingInfo,
      isVerified: false,
      verificationString,
    });
    const { insertedId } = result;

    try {
      await sendEmail({
        to: email,
        from: process.env.SENDER_EMAIL,
        subject: "Please verify your email",
        text: `
                    Thanks for signing up! To verify your email, click here:
                    https://reactauth.onrender.com/verify-email/${verificationString}
                `,
      });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
    jwt.sign(
      {
        id: insertedId,
        email,
        info: startingInfo,
        isVerified: false,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      },
      (err, token) => {
        if (err) {
          return res.status(500).send(err.message);
        }
        res.status(200).json({ token });
      }
    );
  },
};
