import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwscdkStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// ローカルの lambda/Dockerfile からイメージ Lambda を作る
		const api = docker_image_function(
			this,
			"api",
			path.join(__dirname, '../../lambda'),
			{},
			{
			}
		)

		const bucket = new cdk.aws_s3.Bucket(this, 'uuid');
		bucket.grantReadWrite(api.lambda)//s3読み書き権限設定

		//キャッシュを提供するコンテンツ配信ネットワーク(CDN)(Cloud Front)を用意
		const distribution = new cdk.aws_cloudfront.Distribution(this, "cloudfront", {
			defaultBehavior: {
				origin: new cdk.aws_cloudfront_origins.FunctionUrlOrigin(api.lambda_url),
				allowedMethods: cdk.aws_cloudfront.AllowedMethods.ALLOW_ALL,
				//CloudFront の Cache Policy と Origin Request Policy を理解する
				//https://qiita.com/t-kigi/items/6d7cfccdb629690b8d29
				cachePolicy: cdk.aws_cloudfront.CachePolicy.CACHING_DISABLED,
				originRequestPolicy: cdk.aws_cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER
			},
			additionalBehaviors: {
				"/s/*": {
					origin: new cdk.aws_cloudfront_origins.S3Origin(bucket),
					viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				}
			},
			//AWS Certificate Manager (ACM)から*.surfic.comへの証明書を発行してもらった
			//証明書という名前だがファイルではなくDNSのCNAMEにAWSが指定する特定の値が入っていることで証明する、
			domainNames: ["sarod.surfic.com"]
		});

		// URL を CloudFormation の Output に出しておくと便利
		new cdk.CfnOutput(this, 'FUNCTION_URL', { value: api.lambda_url.url });
		new cdk.CfnOutput(this, "DOMAIN", { value: distribution.domainName });
	}
}


const docker_image_function = (
	construct: Construct,
	id: string,
	directory: string,
	props_lambda?: Omit<cdk.aws_lambda.DockerImageFunctionProps, "code">,
	props_url?: Omit<cdk.aws_lambda.FunctionUrlOptions, "authType">
) => {
	//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.DockerImageFunction.html
	const lambda = new cdk.aws_lambda.DockerImageFunction(construct, id, {
		code: cdk.aws_lambda.DockerImageCode.fromImageAsset(directory,),
		...props_lambda
	});
	const lambda_url = lambda.addFunctionUrl({
		authType: cdk.aws_lambda.FunctionUrlAuthType.NONE,
		...props_url
	})
	return { lambda, lambda_url }
}