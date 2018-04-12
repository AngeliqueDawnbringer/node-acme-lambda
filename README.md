# node-acme-lambda
Use AWS Lambda to manage certificates for Let's Encrypt. This fork supports lambda 6.10 only and relies on babel to leverage ES6 features. I use this code outside AWS and some other cloud providers as well, which do not support all CommonJS syntax or full EcmaScript 2015 for that matter. It was adapted to support my particular use-cases. The code is AS-IS.

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
- No such account: Did you switch from USE_PRODUCTION false to true? Rename registration.json

# Need to run manually?
- Go to the lambda console, create an empty test and run it. 

# Need PEM ?
- Go to the lambda console, go to pem add-on, create an empty test and run it.
- You can also add an event that doest his for you. Normally I have a similar function on the s3 bucket which takes event handling.


# Current version
This version only supports ACMEv1 not ACMEv2. Larry Anderson has implemented a NodeJS 8.10 version that supports ACMEv2. 
