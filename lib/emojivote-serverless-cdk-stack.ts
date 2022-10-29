import * as cdk from 'aws-cdk-lib';
import { ManagedPolicy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { DnsRecordType } from 'aws-cdk-lib/aws-servicediscovery';
import { Construct } from 'constructs';
import { CloudMapService } from '../src/cloud-map';
import { Database } from '../src/dynamo-db';
import { FargateContainers } from '../src/ecs-service';
import { EmojiAppContainer } from '../src/images';
import { LoadBalancers } from '../src/load-balancer';
import { VpcNetwork } from '../src/vpc-network';

export class EmojivoteServerlessCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpcNetwork = new VpcNetwork(this, "Vpc", {
      vpcName: "vpc-emojivote"
    });

    const containerImages = new EmojiAppContainer(this, "ContainerImages");
    const database = new Database(this, "Database");
    const albs = new LoadBalancers(this, "LoadBalancers", {
      vpc: vpcNetwork.vpc
    });

    const fargateContainers = new FargateContainers(this, "FargateContainers", {
      albs,
      containerImages,
      vpc: vpcNetwork.vpc
    })

    const listTablesPolicy = new PolicyStatement({
      actions: ['dynamodb:ListTables', 'dynamodb:DescribeTable'],
      resources: ['*']
    })

    fargateContainers.emojiApiService.taskDefinition.taskRole.addToPrincipalPolicy(listTablesPolicy)
    fargateContainers.voteApiService.taskDefinition.taskRole.addToPrincipalPolicy(listTablesPolicy)
    database.table.grantReadWriteData(fargateContainers.emojiApiService.taskDefinition.taskRole)
    database.table.grantReadWriteData(fargateContainers.voteApiService.taskDefinition.taskRole)
  }
}
