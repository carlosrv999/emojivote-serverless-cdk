import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { ApplicationLoadBalancer, IApplicationLoadBalancer } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { Construct } from "constructs";

export interface ILoadBalancersProps {
  readonly vpc: Vpc
}

export class LoadBalancers extends Construct {
  emojiApiLoadBalancer: IApplicationLoadBalancer;
  voteApiLoadBalancer: IApplicationLoadBalancer;
  webAppLoadBalancer: IApplicationLoadBalancer;

  constructor(scope: Construct, id: string, props: ILoadBalancersProps) {
    super(scope, id);

    this.emojiApiLoadBalancer = new ApplicationLoadBalancer(this, "emojiApiLoadBalancer", {
      loadBalancerName: "emoji-api-loadbalancer",
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
      internetFacing: true,
    })

    this.voteApiLoadBalancer = new ApplicationLoadBalancer(this, "voteApiLoadBalancer", {
      loadBalancerName: "vote-api-loadbalancer",
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
      internetFacing: true,
    })

    this.webAppLoadBalancer = new ApplicationLoadBalancer(this, "webAppLoadBalancer", {
      loadBalancerName: "web-app-loadbalancer",
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
      internetFacing: true,
    })

  }
}
