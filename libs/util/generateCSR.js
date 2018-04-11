import { RSA } from 'rsa-compat';

const generateCSR = (domainKeypair, domains) => {
  const domainNames = domains.map(domain => ((typeof domain === 'string') ? domain : domain.name));
  console.log(`[ INFO ] Creating CSR for ${JSON.stringify(domainNames)}`);
  return Promise.resolve(RSA.generateCsrDerWeb64(domainKeypair, domainNames));
};

module.exports = generateCSR;
