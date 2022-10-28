import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import { Construct } from "constructs";

export class EmojiAppContainer extends Construct {
  emojiApiContainer: DockerImageAsset;
  voteApiContainer: DockerImageAsset;
  voteBotContainer: DockerImageAsset;
  webAppContainer: DockerImageAsset;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.emojiApiContainer = new DockerImageAsset(this, "emojiApiContainer", {
      directory: 'emojivote-app/emoji-api-reborn'
    })
    this.voteApiContainer = new DockerImageAsset(this, "voteApiContainer", {
      directory: 'emojivote-app/vote-api-reborn'
    })
    this.voteBotContainer = new DockerImageAsset(this, "voteBotContainer", {
      directory: 'emojivote-app/vote-bot-reborn'
    })
    this.webAppContainer = new DockerImageAsset(this, "webAppContainer", {
      directory: 'emojivote-app/webapp-emojivote-reborn'
    })

  }
}
