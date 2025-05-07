import cors from "cors";
import express from "express";
import fs from "fs-extra";
import path from "node:path";
import { mergerChunk } from "./lib/merge-chunk.function";
import { upload } from "./lib/upload-config.function";
import { generateChunkName } from "./lib/generate-chunk-name";

const app = express();
app.use(cors());
const port = 3001;

app.post("/upload", upload.single("file"), (req, res) => {
  const { file, body } = req;

  const chunkName = path.join(
    "uploads/",
    generateChunkName(file?.originalname, body?.index)
  );
  fs.renameSync(file?.path, chunkName);

  if (+body?.index + 1 === +body?.total) {
    mergerChunk(file);
  }

  res.json({ file });
});

app.get("/watch/:video", (req, res) => {
  const { video } = req.params;

  const range = req.headers.range;
  if (!range) res.status(400).send("error");

  const fileName = path.join("uploads/", video);
  const fileInfo = fs.statSync(fileName);
  if (!fileInfo) res.status(400).send("error");

  const videoSize = fileInfo.size;

  const chunkSize = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + chunkSize, videoSize - 1);
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(fileName, { start, end });
  videoStream.pipe(res);
});

app.get("/videos", (req, res) => {
  const videos = fs.readdirSync("./uploads/").map((item) => {
    return item;
  });

  res.json(videos);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
