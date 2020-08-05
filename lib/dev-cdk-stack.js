const cdk = require('@aws-cdk/core');
const ec2 = require('@aws-cdk/aws-ec2');
const ecs = require('@aws-cdk/aws-ecs');

class DevCdkStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const vpc = new ec2.Vpc(this, 'DevVPC', {
      cidr: "10.229.0.0/24",
      subnetConfiguration: [
        {
          cidrMask: 28,
          name: 'PublicSubnet',
          subnetType: ec2.SubnetType.PUBLIC
        }
      ],
      gatewayEndpoints: {
        S3: {
          service: ec2.GatewayVpcEndpointAwsService.S3
        }
      }
    });

    const cluster = new ecs.Cluster(this, 'DevCluster', {
      vpc: vpc
    });

    // Add an AutoScalingGroup with spot instances to the existing cluster
    cluster.addCapacity('AsgSpot', {
      maxCapacity: 1,
      minCapacity: 1,
      desiredCapacity: 1,
      instanceType: new ec2.InstanceType('c5.xlarge'),
      spotPrice: '0.1',
      // Enable the Automated Spot Draining support for Amazon ECS
      spotInstanceDraining: true,
    });
  }
}

module.exports = { DevCdkStack }
