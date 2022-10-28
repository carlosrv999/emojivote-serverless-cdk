import { ListTablesCommand, DescribeTableCommand } from "@aws-sdk/client-dynamodb"
import { ddbClient } from "./libs/ddbClient.js"

export const verifyDdb = async () => {
  const listTables = new ListTablesCommand({})
  const response = await ddbClient.send(listTables)

  if (response.TableNames.length == 0) {
    throw new Error("No table created in DynamoDB")
  } else {
    console.log("DynamoDB Tables retrieved");
    const describeTable = new DescribeTableCommand({
      TableName: 'emoji'
    })
    try {
      const response = await ddbClient.send(describeTable);
      console.log("Table has this schema: ", response.Table.KeySchema)
      if (response.Table.KeySchema.length == 1) {
        if (response.Table.KeySchema[0].AttributeName == 'emoji_id' && response.Table.KeySchema[0].KeyType == 'HASH') {
          console.log("Successfully connected to emoji table in DynamoDB")
          return true
        } else {
          throw new Error("AttributeName == 'emoji_id' or KeyType == 'HASH' does not comply")
        }
      } else {
        throw new Error("KeySchema for emoji table should only have AttributeName == 'emoji_id', but got more than one.")
      }
    } catch (error) {
      if (error['$metadata']?.httpStatusCode >= 400) {
        console.log("Table 'emoji' has not been found, please create the table...")
        throw new Error(error)
      } else {
        throw new Error(error)
      }
    }
  }
}
