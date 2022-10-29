import { Duration } from "aws-cdk-lib";
import { Port, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { Cluster, ContainerImage, FargateService, FargateTaskDefinition, TaskDefinition } from "aws-cdk-lib/aws-ecs";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { DnsRecordType, NamespaceType } from "aws-cdk-lib/aws-servicediscovery";
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
  voteBotService: FargateService;

  constructor(scope: Construct, id: string, props: IFargateContainers) {
    super(scope, id);

    const cluster = new Cluster(this, "EmojiCluster", {
      vpc: props.vpc,
      defaultCloudMapNamespace: {
        name: "local",
        vpc: props.vpc,
        type: NamespaceType.DNS_PRIVATE
      }
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
      assignPublicIp: true,
      cloudMapOptions: {
        dnsTtl: Duration.seconds(60),
        name: "emojiapi",
        dnsRecordType: DnsRecordType.A,
      }
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
      assignPublicIp: true,
      cloudMapOptions: {
        dnsTtl: Duration.seconds(60),
        name: "voteapi",
        dnsRecordType: DnsRecordType.A,
      }
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
    
    const taskDefinition = new FargateTaskDefinition(this, "taskDefinition", {});
    taskDefinition.addContainer("voteBotContainer", {
      image: ContainerImage.fromDockerImageAsset(props.containerImages.voteBotContainer),
      environment: {
        ["GET_EMOJI_URL"]: "emojiapi.local:50050",
        ["POST_VOTE_URL"]: "voteapi.local:50051",
      }
    })
    
    this.voteBotService = new FargateService(this, "voteBotService", {
      cluster,
      taskDefinition,
      assignPublicIp: true
    })

    this.emojiApiService.service.connections.allowFrom(this.voteBotService, Port.tcp(50050))
    this.voteApiService.service.connections.allowFrom(this.voteBotService, Port.tcp(50051))

  }
}
