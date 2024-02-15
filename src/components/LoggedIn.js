import { auth } from "@/auth";

async function LoggedIn() {
  const session = await auth();

  if (!session) {
    throw new Error("You must be logged in to vote");
  }
  return session;
}
