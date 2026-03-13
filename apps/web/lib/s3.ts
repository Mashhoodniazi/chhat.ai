import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const s3Client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT!,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
  forcePathStyle: false,
});

export async function uploadToSpaces(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const key = `uploads/${Date.now()}-${fileName}`;

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.DO_SPACES_BUCKET!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: "private",
    },
  });

  await upload.done();

  return `${process.env.DO_SPACES_CDN_URL}/${key}`;
}

export async function deleteFromSpaces(fileUrl: string): Promise<void> {
  const key = fileUrl.replace(`${process.env.DO_SPACES_CDN_URL}/`, "");

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET!,
      Key: key,
    })
  );
}

export default s3Client;
