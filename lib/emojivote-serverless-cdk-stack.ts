import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Database } from '../src/dynamo-db';
import { EmojiAppContainer } from '../src/images';
import { LoadBalancers } from '../src/load-balancer';
import { VpcNetwork } from '../src/vpc-network';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class EmojivoteServerlessCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpcNetwork = new VpcNetwork(this, "Vpc", {
      vpcName: "vpc-emojivote"
    });
    new EmojiAppContainer(this, "ContainerImages");
    new Database(this, "Database");
    new LoadBalancers(this, "LoadBalancers", {
      vpc: vpcNetwork.vpc
    });

  }
}
