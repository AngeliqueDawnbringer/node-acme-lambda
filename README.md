# node-acme-lambda
Use AWS Lambda to manage certificates for Let's Encrypt. This fork supports lambda 6.10 only and relies on babel to leverage ES6 features.

# Serverless deployment

To make it easy, I rewrote some parts of the code plus added the serverless framework around Larry Anderson's node-acme-lambda.
All credit goes to Larry Anderson.

# Deploy solution
- clone repo
- change serverless.yml to reflect correct buckets and environments
- change config.js to reflect correct domains
- npm init
- serverless deploy

# Common errors
- Error denied: S3 bucket permissions are wrong
- Too many requests: You have hit the rate limiter, just wait for it. It will auto-recover in time
- Too many requests: Too many domains? Let's encrypt has a rate limit of a specific amount of requests per minute. This lambda has no concurrency check build in (yet?).

# Need to run manually?
- Go to the lambda console, create an empty test and run it. 

# Current version
This version only supports ACMEv1 not ACMEv2. 
