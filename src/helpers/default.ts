import { base64Decode, isValidBase64 } from './encoding';
import { PROJECT_CONFIG } from '@/config/project';

const settings = window.settings;

export const title = settings?.title ?? PROJECT_CONFIG.name;

export const description = settings?.description
  ? isValidBase64(settings.description)
    ? base64Decode(settings.description)
    : settings.description
  : PROJECT_CONFIG.description;
