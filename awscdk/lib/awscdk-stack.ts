import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwscdkStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// ローカルの lambda/Dockerfile からイメージ Lambda を作る
		const api = docker_image_function(this, "api", path.join(__dirname, '../../lambda'), {
		})

		// URL を CloudFormation の Output に出しておくと便利
		new cdk.CfnOutput(this, 'SarodFunctionUrl', {value: api.lambda_url.url});
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
	return {lambda, lambda_url}
}