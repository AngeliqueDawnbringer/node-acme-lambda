const certificateDefinitions = {
  'cert-name1': [{ name: 'some1.subdomain.somedomain.tld', zoneLevels: 3 }],
  'cert-name2': [{ name: 'some2.subdomain.somedomain.tld', zoneLevels: 3 }],
};

module.exports = {
  'renew-before-expiry': process.env.RENEW_BEFORE_EXPIRY || 45,
  's3-account-bucket': process.env.S3_ACCOUNT_BUCKET || 'hard-coded-account-bucket',
  's3-cert-bucket': process.env.S3_CERTIFICATE_BUCKET || 'hard-coded-cert-bucket',
  's3-folder': process.env.S3_CERTIFICATE_FOLDER || 'store',
  'certificate-definitions': process.env.S3_CERTIFICATE_INFO ? JSON.parse(process.env.S3_CERTIFICATE_INFO) : certificateDefinitions,
  'acme-dns-retry': 30,
  'acme-dns-retry-delay-ms': 2000,
  'acme-account-file': process.env.ACME_ACCOUNT_FILE || 'registration.json',
  'acme-account-email': process.env.ACME_ACCOUNT_EMAIL || 'hardcoded@email.org',
  'acme-account-key-bits': 4096,
  'acme-directory-url': process.env.USE_PRODUCTION ? 'https://acme-v01.api.letsencrypt.org' : 'https://acme-staging.api.letsencrypt.org',
  region: process.env.AWS_REGION || 'eu-west-1',
};
