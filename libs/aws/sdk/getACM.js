import { ACM } from 'aws-sdk';
import config from '../../../config';

const getACM = () => new ACM({ region: config.region });

module.exports = getACM;
