import fs from "node:fs";
import path from "node:path";

export const mergerChunk = async (file: Express.Multer.File) => {
  const fileName = path.join("uploads/", file.originalname);
  const writeStream = fs.createWriteStream(fileName);

  fs.readdirSync("uploads/")
    .filter((item) => item.startsWith(file.originalname))
    .sort()
    .map((item) => {
      const chunk = fs.readFileSync(path.join("uploads/", item));
      writeStream.write(chunk);
      fs.unlinkSync(path.join("uploads/", item));
    });
};
