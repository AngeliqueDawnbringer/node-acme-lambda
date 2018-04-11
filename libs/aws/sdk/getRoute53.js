import { Route53 } from 'aws-sdk';

const getRoute53 = () => new Route53();

module.exports = getRoute53;
