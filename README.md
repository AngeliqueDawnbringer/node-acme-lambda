# node-acme-lambda
Use AWS Lambda to manage certificates for Let's Encrypt. This fork supports lambda 6.10 only and relies on babel to leverage ES6 features. I use this code outside AWS and some other cloud providers as well, which do not support all CommonJS syntax or full EcmaScript 2015 for that matter. It was adapted to support my particular use-cases. The code is AS-IS.

# More information on how to create Certificates and use ACME / Let's Encrypt to do so (from CLI)
https://www.dawnbringer.net/blog/890/Ubiquitous%20Encryption:%20Lets%20Encrypt

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
- You can also add an event that does this for you. Normally I have a similar function on the s3 bucket which takes event handling.

# F.A.Q.
- Why store the certificate on s3. Isn't that super dangerous?

No in fact it is one of the most safe storing solutions out there, when used correctly! AWS S3 is secure by design and by default. It is mis configuration and explicitely opening up buckets to public which is the cause for all the data leaks out there. We use S3 for durable, highly available storage, to hold the certificate and keys in place and use AWS IAM to manage access using IAM InstanceRoles (not S3API or bucket policies). 

When using AWS IAM roles an policies correctly, you can give access to resources and files - applying least-privilege - on an extremely granular level. You can even enable payload-encryption without giving out credentials using AWS KMS to protect access to the private key even further. All you need is access defined in the policy to the relevant AWS KMS key, and the rest is taken care of. You do not need any information regarding the key when trying to decrypt it. You or the role, simply needs rights to decrypt the contents of the encrypted payload.

# Current version
This version only supports ACMEv1 not ACMEv2. Larry Anderson has implemented a NodeJS 8.10 version that supports ACMEv2. 

# But how does it work?
Well, it creates an account at the api (note: account PERRRR api! muy importante!), creates request handshake pattern following DNS-01 specification and posts all of this in a nice little json and stores it to your bucket. And then you have some options. Unfortunately the current nodejs SDK does not support IAM-server-certificate upload... And ACM-certificates, does not allow you to upload multiple certificates at a time, so you are limited with a couple of things.

- 1: Upload it yourself, by downloading the four files and run:

```
aws iam upload-server-certificate \
 --server-certificate-name <LABEL> \
 --certificate-body file:///etc/letsencrypt/live/<DOMAIN>/cert.pem \
 --private-key file:///etc/letsencrypt/live/<DOMAIN>/privkey.pem \
 --certificate-chain file:///etc/letsencrypt/live/<DOMAIN>/chain.pem \
```

(or wherever you might have it)

Or add larrys Scala S3 trigger to your bucket and make it listen to .json

- 2: Upload it to ACM, one certificate at a time in a for loop instead of using a promise.all (guess what v1.1 contains...) Or just create a ACM certificate using DNS01 for the hostname in question, when you want to have it integrated with Amazon Resources or what not.

# Security concerns
- The private key is not KMS protected in this version
- The key is only 2048 bit. (This we could increase doing creating of 4096 keys, but the default for v1 was 2048 and since v1 was ACM only, and ACM only supports 2048...)
- The current config is an inline policy to the lambda
- The current IAM-role-statements allows for ANY domain within the account to manipulate ANY record.

But, since this lambda is only executed on a 2 hour timer, and the accounts should be either dev or using network load-balancers instead of ALB's etc etc etc, this is not of concern as much and has been left outside the scope of the "v1" project and since the focus is on creating a v2 which supports ACMEv2 (and hence wildcards, which I don't like from a security point of view, but makes adaptability higher...) well you get the point. If you want ACMEv2 and not deal with nifty ECMAscript features in the rest of your project and actually do modular applications etc, please use the orginal version instead of this slightly adapted for MY use-case version.
