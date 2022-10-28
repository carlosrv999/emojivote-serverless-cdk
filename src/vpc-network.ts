import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export interface IVpcNetworkProps {
  readonly vpcName: string,
}

export class VpcNetwork extends Construct {
  vpc: Vpc;

  constructor(scope: Construct, id: string, props: IVpcNetworkProps) {
    super(scope, id);

    this.vpc = new Vpc(this, props.vpcName, {
      enableDnsHostnames: true,
      enableDnsSupport: true,
      subnetConfiguration: [{
        name: "SubnetPublic-1",
        subnetType: SubnetType.PUBLIC,
        cidrMask: 25
      }]
    })
  }
}
