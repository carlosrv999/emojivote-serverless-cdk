import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { Cluster, ContainerImage, FargateService } from "aws-cdk-lib/aws-ecs";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { Construct } from "constructs";
import { EmojiAppContainer } from "./images";
import { LoadBalancers } from "./load-balancer";

export interface IFargateContainers {
  readonly vpc: Vpc
  albs: LoadBalancers
  containerImages: EmojiAppContainer
}

export class FargateContainers extends Construct {
  emojiApiService: ApplicationLoadBalancedFargateService;
  voteApiService: ApplicationLoadBalancedFargateService;
  webAppService: ApplicationLoadBalancedFargateService;
  //voteBotService: FargateService;

  constructor(scope: Construct, id: string, props: IFargateContainers) {
    super(scope, id);

    const cluster = new Cluster(this, "EmojiCluster", {
      vpc: props.vpc
    })

    this.emojiApiService = new ApplicationLoadBalancedFargateService(this, "emojiApiService", {
      cluster,
      taskImageOptions: {
        image: ContainerImage.fromDockerImageAsset(props.containerImages.emojiApiContainer),
        containerPort: 3000
      },
      taskSubnets: {
        subnetType: SubnetType.PUBLIC
      },
      loadBalancer: props.albs.emojiApiLoadBalancer,
      assignPublicIp: true
    })

    this.voteApiService = new ApplicationLoadBalancedFargateService(this, "voteApiService", {
      cluster,
      taskImageOptions: {
        image: ContainerImage.fromDockerImageAsset(props.containerImages.voteApiContainer),
        containerPort: 3001
      },
      taskSubnets: {
        subnetType: SubnetType.PUBLIC
      },
      loadBalancer: props.albs.voteApiLoadBalancer,
      assignPublicIp: true
    })

    this.webAppService = new ApplicationLoadBalancedFargateService(this, "webAppService", {
      cluster,
      taskImageOptions: {
        image: ContainerImage.fromDockerImageAsset(props.containerImages.webAppContainer),
        containerPort: 80
      },
      taskSubnets: {
        subnetType: SubnetType.PUBLIC
      },
      loadBalancer: props.albs.webAppLoadBalancer,
      assignPublicIp: true
    })

  }
}
