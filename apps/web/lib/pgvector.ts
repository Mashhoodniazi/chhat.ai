import prisma from "./prisma";
import { generateEmbedding } from "./embeddings";

export async function searchSimilarChunks(
  botId: string,
  query: string,
  limit: number = 5
): Promise<{ content: string }[]> {
  const queryEmbedding = await generateEmbedding(query);
  const vectorString = `[${queryEmbedding.join(",")}]`;

  const results = await prisma.$queryRaw<{ content: string }[]>`
    SELECT content
    FROM "DocumentChunk"
    WHERE "botId" = ${botId}
      AND embedding IS NOT NULL
    ORDER BY embedding <=> ${vectorString}::vector
    LIMIT ${limit}
  `;

  return results;
}
