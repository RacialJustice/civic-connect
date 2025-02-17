import { db } from "@db";
import { posts, votes, users, forums } from "@db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export async function getPersonalizedRecommendations(userId: number) {
  // Get user's interests from their profile
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      interests: true,
    },
  });

  const userInterests = (user?.interests as string[]) || [];

  // Find forums matching user interests
  const recommendedPosts = await db.query.posts.findMany({
    with: {
      forum: true,
      votes: true,
      author: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    where: and(
      // Exclude posts the user has already voted on
      sql`NOT EXISTS (
        SELECT 1 FROM ${votes}
        WHERE ${votes.postId} = ${posts.id}
        AND ${votes.userId} = ${userId}
      )`,
      // Include posts from forums matching user interests
      sql`EXISTS (
        SELECT 1 FROM ${forums}
        WHERE ${forums.id} = ${posts.forumId}
        AND (
          ${forums.category} = ANY(array[${userInterests.map(i => `'${i}'`).join(',')}]::text[])
          OR ${forums.level} = ANY(array[${userInterests.map(i => `'${i}'`).join(',')}]::text[])
        )
      )`
    ),
    orderBy: [
      // Order by number of upvotes
      sql`(
        SELECT COUNT(*) 
        FROM ${votes} 
        WHERE ${votes.postId} = ${posts.id}
        AND ${votes.type} = 'up'
      ) DESC`,
      desc(posts.createdAt),
    ],
    limit: 5,
  });

  return recommendedPosts.map(post => ({
    id: post.id,
    title: post.title,
    forumId: post.forumId,
    forumName: post.forum.name,
    author: post.author,
    upvotes: post.votes.filter(v => v.type === 'up').length,
    createdAt: post.createdAt,
  }));
}