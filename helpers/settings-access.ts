import type { GetServerSideProps } from "next";
import { connectDB } from "@/helpers/helpers";
import { tokenService } from "@/services/token-service";
import UserModel from "@/models/user-model";

export const settingsAccess: GetServerSideProps = async ({ req, res }) => {
  res.setHeader("Cache-Control", "private, no-store");
  const token = req.cookies.refreshToken;
  const identity = token && tokenService.validateRefreshToken(token);
  if (!identity || typeof identity === "string") {
    return { redirect: { destination: "/", permanent: false } };
  }
  await connectDB();
  const session = await tokenService.findToken(token);
  const user = session && await UserModel.findById(identity.id);
  if (!user) return { redirect: { destination: "/", permanent: false } };
  if (user.isActivated !== true) {
    return { redirect: { destination: "/activation", permanent: false } };
  }
  return { props: {} };
};
