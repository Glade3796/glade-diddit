import { db } from "@/db";

export default async function DBCleanup(duplicateLimit) {
  //fetch a list of all the votes
  const { rows } = await db.query(
    "SELECT id, user_id, post_id, vote FROM votes"
  );
  // console.log(rows, "data from DBCleanup");
  //check unique votes
  const uniqueVotes = rows.filter(
    (vote, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.user_id === vote.user_id &&
          t.post_id === vote.post_id &&
          t.vote === vote.vote
      )
  );
  const totaledVotes = uniqueVotes
    .map((vote) => {
      const total = rows.reduce((acc, curr) => {
        if (curr.post_id === vote.post_id) {
          return acc + curr.vote;
        }
        return acc;
      }, 0);
      return { post_id: vote.post_id, total };
    })
    .filter(
      (post, index, self) =>
        self.findIndex((p) => p.post_id === post.post_id) === index
    )
    .sort((a, b) => a.post_id - b.post_id);

  // console.log(totaledVotes, "savedVoted");
  //filter out unique votes, so only duplicated votes remain
  const duplicatedVotes = rows.filter(
    (vote, index, self) =>
      index !==
      self.findIndex(
        (t) => t.user_id === vote.user_id && t.post_id === vote.post_id
        //&& t.vote === vote.vote
      )
  );
  if (duplicatedVotes.length >= duplicateLimit) {
    await db.query("DELETE from votes WHERE id = ANY($1)", [
      duplicatedVotes.map((vote) => vote.id),
    ]);
    return console.log(
      "Database cleaned up! Duplicated votes removed.",
      duplicatedVotes.length,
      "duplicated votes removed."
    );
  }

  return console.log(
    duplicatedVotes.length,
    `duplicates exist in database. No action taken. (dbCleanup occurs after ${duplicateLimit} duplicates are found)`
  );
}
