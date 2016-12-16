#!/bin/bash

SHA1=$1
APP_NAME=pioluk-final-project-api
ENV_NAME=api-testing

# Create new Elastic Beanstalk version
EB_BUCKET=pioluk-docker-test
DOCKERRUN_FILE=$SHA1-Dockerrun.aws.json
sed "s/<TAG>/$SHA1/" < Dockerrun.aws.json.template > $DOCKERRUN_FILE
aws --region eu-central-1 s3 cp $DOCKERRUN_FILE s3://$EB_BUCKET/$DOCKERRUN_FILE
aws --region eu-central-1 elasticbeanstalk create-application-version \
  --application-name $APP_NAME \
  --version-label $SHA1 \
  --source-bundle S3Bucket=$EB_BUCKET,S3Key=$DOCKERRUN_FILE

# Update Elastic Beanstalk environment to new version
aws --region eu-central-1 elasticbeanstalk update-environment \
  --environment-name $ENV_NAME \
  --version-label $SHA1
