import openai from "./openai";
import prisma from "./prisma";

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;

export function chunkText(text: string): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];

  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + CHUNK_SIZE).join(" ");
    if (chunk.trim()) {
      chunks.push(chunk.trim());
    }
    i += CHUNK_SIZE - CHUNK_OVERLAP;
  }

  return chunks;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.replace(/\n/g, " "),
  });

  return response.data[0].embedding;
}

export async function processDocument(
  documentId: string,
  botId: string,
  text: string
): Promise<void> {
  const chunks = chunkText(text);

  for (let i = 0; i < chunks.length; i += 10) {
    const batch = chunks.slice(i, i + 10);

    const embeddings = await Promise.all(
      batch.map((chunk) => generateEmbedding(chunk))
    );

    for (let j = 0; j < batch.length; j++) {
      const vectorString = `[${embeddings[j].join(",")}]`;

      await prisma.$executeRaw`
        INSERT INTO "DocumentChunk" (id, "botId", "documentId", content, embedding, "createdAt")
        VALUES (
          ${generateId()},
          ${botId},
          ${documentId},
          ${batch[j]},
          ${vectorString}::vector,
          NOW()
        )
      `;
    }
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  return result.text;
}
