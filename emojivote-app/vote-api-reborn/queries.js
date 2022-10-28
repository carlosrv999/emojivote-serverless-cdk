import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { ddbDocClient } from "./libs/ddbDocClient.js";

export const getVotes = async () => {
  try {
    const data = await ddbDocClient.send(new ScanCommand({
      TableName: 'emoji'
    }));
    return data;
  } catch (error) {
    return error;
  }
}

export const voteForEmoji = async (emoji_id) => {
  const command = new UpdateItemCommand({
    TableName: 'emoji',
    Key: {
      'emoji_id': {
        'S': emoji_id
      }
    },
    UpdateExpression: "SET vote_count = vote_count + :inc",
    ExpressionAttributeValues: {
      ":inc": { "N": "1" }
    }
  });
  try {
    const response = await ddbDocClient.send(command);
    console.log("votaste correctamente por el emoji ", emoji_id)
    return response;
  } catch (error) {
    return error;
  }
}
