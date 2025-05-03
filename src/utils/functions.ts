import path from "path";
import fs from "fs";
import moment from "moment";

export function getFilePath(url: string) {
  const fileNames = fs.readdirSync(path.join(__dirname, `../articles`));
  const article = fileNames.find((fileName) => {
    const articleInfo = fileName.split("-");
    const articleName = articleInfo[1]?.split(".")[0];
    return articleName === url;
  });
  if (article) {
    return path.join(__dirname, `../articles/${article}`);
  }
}

export const formatDate = (date: Date | string) => {
  return moment(date).format("MMMM D, YYYY, h:mm:ss a"); // Example format: "October 13, 2024"
};

export function generateRandomString(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}
