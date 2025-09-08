import CryptoJS from 'crypto-js';
import { PROJECT_CONFIG } from '../config/project';

/**
 * 加密字符串
 * @param text 要加密的文本
 * @returns 加密后的字符串
 */
export const encryptText = (text: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(text, PROJECT_CONFIG.crypto_secret_key).toString();
    return encrypted;
  } catch (error) {
    console.error('encryptText error:', error);
    throw new Error('Text encryption failed');
  }
};

/**
 * 解密字符串
 * @param encryptedText 加密的文本
 * @returns 解密后的字符串
 */
export const decryptText = (encryptedText: string): string => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, PROJECT_CONFIG.crypto_secret_key);
    const originalText = decrypted.toString(CryptoJS.enc.Utf8);

    if (!originalText) {
      throw new Error('Decryption result is empty');
    }

    return originalText;
  } catch (error) {
    console.error('decryptText error:', error);
    throw new Error('Text decryption failed');
  }
};

/**
 * 安全地加密密码
 * @param password 密码
 * @returns 加密后的密码，如果加密失败返回空字符串
 */
export const encryptPassword = (password: string): string => {
  if (!password) return '';

  try {
    return encryptText(password);
  } catch (error) {
    console.error('encryptPassword error:', error);
    return '';
  }
};

/**
 * 安全地解密密码
 * @param encryptedPassword 加密的密码
 * @returns 解密后的密码，如果解密失败返回空字符串
 */
export const decryptPassword = (encryptedPassword: string): string => {
  if (!encryptedPassword) return '';

  try {
    return decryptText(encryptedPassword);
  } catch (error) {
    console.error('decryptPassword error:', error);
    return '';
  }
};
