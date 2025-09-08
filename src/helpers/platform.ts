import { UAParser } from 'ua-parser-js';

export type PlatformType = 'android' | 'ios' | 'macos' | 'linux' | 'windows';

/**
 * Detects the current platform using ua-parser-js library
 * @returns The detected platform type
 */
export const detectPlatform = (): PlatformType => {
  const parser = new UAParser();
  const result = parser.getResult();

  const osName = result.os.name?.toLowerCase();
  const deviceType = result.device.type;

  // Check mobile devices first
  if (deviceType === 'mobile' || deviceType === 'tablet') {
    if (osName?.includes('android')) {
      return 'android';
    }
    if (osName?.includes('ios') || osName?.includes('iphone') || osName?.includes('ipad')) {
      return 'ios';
    }
  }

  // Check desktop operating systems
  if (osName?.includes('mac') || osName?.includes('darwin')) {
    return 'macos';
  }

  if (osName?.includes('linux') || osName?.includes('ubuntu') || osName?.includes('debian')) {
    return 'linux';
  }

  if (osName?.includes('windows')) {
    return 'windows';
  }

  // Default fallback to windows
  return 'windows';
};

/**
 * Gets detailed platform information
 * @returns Detailed platform information from ua-parser-js
 */
export const getPlatformInfo = () => {
  const parser = new UAParser();
  return parser.getResult();
};
