import { Duration } from "aws-cdk-lib";
import { DnsRecordType, PrivateDnsNamespace, Service } from "aws-cdk-lib/aws-servicediscovery";
import { Construct } from "constructs";
import { LoadBalancers } from "./load-balancer";
import { VpcNetwork } from "./vpc-network";

export interface ICloudMapService {
  readonly loadBalancers: LoadBalancers
  readonly vpc: VpcNetwork
}

export class CloudMapService extends Construct {
  namespace: PrivateDnsNamespace
  emojiService: Service
  voteService: Service

  constructor(scope: Construct, id: string, props: ICloudMapService) {
    super(scope, id);

    this.namespace = new PrivateDnsNamespace(this, 'Namespace', {
      name: 'local',
      vpc: props.vpc.vpc,
    });

    const emojiService = this.namespace.createService('emojiapi', {
      dnsRecordType: DnsRecordType.A_AAAA,
      dnsTtl: Duration.seconds(60),
      loadBalancer: true,
      name: "emojiapi"
    });

    const voteService = this.namespace.createService('voteapi', {
      dnsRecordType: DnsRecordType.A_AAAA,
      dnsTtl: Duration.seconds(60),
      loadBalancer: true,
      name: "voteapi"
    })

  }
}