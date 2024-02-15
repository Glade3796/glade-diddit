import { db } from "@/db";
import auth from "../app/middleware";
import { revalidatePath } from "next/cache";
import { VoteButton } from "./VoteButton";

export async function Vote({ postId, voteTotal }) {
  const session = await auth(); //auth for user.id for the votevalidation filter. can't pass session to form ACTION async functions
  async function upvote() {
    "use server";
    const session = await auth();
    if (!session) {
      throw new Error("You must be logged in to vote");
      //new Error("You must be logged in to vote");
    }
    console.log("Upvote", postId, "by user", session.user.id);
    await db.query(
      "INSERT INTO votes (user_id, post_id, vote, vote_type) VALUES ($1, $2, $3, $4)",
      [session.user.id, postId, 1, "post"]
    );

    revalidatePath("/");
    revalidatePath(`/post/${postId}`);
  }

  async function downvote() {
    "use server";
    const session = await auth();
    if (!session) {
      throw new Error("You must be logged in to vote");
      //new Error("You must be logged in to vote");
    }
    console.log("Downvote", postId, "by user", session.user.id);
    await db.query(
      "INSERT INTO votes (user_id, post_id, vote, vote_type) VALUES ($1, $2, $3, $4)",
      [session.user.id, postId, -1, "post"]
    );

    revalidatePath("/");
    revalidatePath(`/post/${postId}`);
  }
  //### Validating the users vote
  const { rows: votes } = await db.query(
    `SELECT *, users.name from votes
     JOIN users on votes.user_id = users.id`
  ); //fetch all the votes to be looked at - same as in post-page to utilise memoisation
  const userVotes = votes
    .filter((vote) => vote.user_id === session?.user.id)
    .filter((vote) => vote.post_id == postId); //filter the votes to only the user's votes for the relevant post
  const voteSum = userVotes.reduce((acc, vote) => acc + vote.vote, 0); //sum the votes to get the user's vote
  //passed to VoteButton as prop 'voted', basic comparison to check if the user has voted -- positive number means they've UPVOTED, 0 means they havent voted, negative number means they've DOWNVOTED

  console.log("voteSum",voteSum, "|| users total votes for postId:", postId, "|| total post votes:", voteTotal);
  return (
    <>
      {voteTotal} votes
      <div className="flex space-x-3">
        <form action={upvote}>
          <VoteButton label="Upvote" voted={voteSum >= 1} postId={postId} />
        </form>
        <form action={downvote}>
          <VoteButton label="Downvote" voted={voteSum <= -1} />
        </form>
      </div>
    </>
  );
}
