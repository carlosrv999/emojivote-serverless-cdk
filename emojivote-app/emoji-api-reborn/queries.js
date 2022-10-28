import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./libs/ddbDocClient.js";

export const scanEmojiTable = async (successHandler, errorHandler) => {
  try {
    const data = await ddbDocClient.send(new ScanCommand({
      TableName: 'emoji'
    }));
    successHandler(data.Items)
  } catch (error) {
    errorHandler(error)
  }
}
