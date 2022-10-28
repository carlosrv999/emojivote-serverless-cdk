import { AttributeType, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
import items from './dynamodb-data.json';

export class Database extends Construct {
  table: ITable;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = new Table(this, 'Table', {
      partitionKey: { name: 'emoji_id', type: AttributeType.STRING },
      tableName: "emoji",
    });

    new AwsCustomResource(this, 'initDbResource', {
      onCreate: {
        service: 'DynamoDB',
        action: 'batchWriteItem',
        parameters: {
          RequestItems: {
            [this.table.tableName]: items.emoji,
          },
        },
        physicalResourceId: PhysicalResourceId.of('initDBData'),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE
      })
    })

  }
}
