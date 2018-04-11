import getRoute53 from '../sdk/getRoute53';

const getDomainZone = (domain, zones) =>
  zones.HostedZones.find(zone => zone.Name === `${domain}.`);

export const getHostedZoneId = (domain) => {
  const domainName = (typeof domain === 'string') ? domain : domain.name;
  const zoneLevels = (typeof domain === 'object' && domain.zoneLevels)
    ? domain.zoneLevels
    : 2;
  return getRoute53().listHostedZones().promise()
    .then(zones => getDomainZone(domainName.split('.').slice(-1 * zoneLevels).join('.'), zones).Id)
    .catch((e) => {
      console.error('[ ERROR ] Couldn\'t retrieve hosted zones from Route53', e);
      throw e;
    });
};

module.exports = getHostedZoneId;
