/**
 * 客户端下载数据配置示例
 *
 * 使用说明：
 * 1. 复制此文件为 client.ts
 * 2. 根据你的项目需求修改配置
 * 3. 支持的平台：Windows, macOS, Android, iOS, Linux
 * 4. docs 类型说明：
 *    - id: 文档编号（数字）
 *    - slug: 文档别名（字符串）
 *    - url: 直接URL链接
 */

import { PROJECT_CONFIG } from '@/config/project';
import type { ClientDownloadDataType } from '@/types/client';

export const ClientDownloadData: ClientDownloadDataType = {
  platforms: [
    {
      id: 'windows',
      name: 'Windows',
      icon: 'fa-brands fa-windows',
      clients: [
        {
          id: 'example-client',
          subFlag: 'exampleclient',
          name: 'Example Client',
          icon: 'example-icon',
          version: 'v1.0.0',
          updateDate: '2024-12-20',
          downloadUrls: [
            {
              platform: 'Windows',
              architecture: 'x64',
              fileType: 'exe',
              url: 'https://github.com/example/client/releases/download/v1.0.0/client-windows-x64.exe',
              fileName: 'client-windows-x64.exe',
            },
            {
              platform: 'Windows',
              architecture: 'arm64',
              fileType: 'exe',
              url: 'https://github.com/example/client/releases/download/v1.0.0/client-windows-arm64.exe',
              fileName: 'client-windows-arm64.exe',
            },
          ],
          docs: {
            type: 'url',
            value: 'https://github.com/example/client/wiki',
          },
          description: {
            'zh-CN': '示例客户端描述',
            'en-US': 'Example client description',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            return `example://install-config?url=${encodeURIComponent(subscribeUrl)}&name=${encodeURIComponent(PROJECT_CONFIG.name)}`;
          },
        },
      ],
    },
    {
      id: 'macos',
      name: 'macOS',
      icon: 'fa-brands fa-apple',
      clients: [
        {
          id: 'example-client-macos',
          subFlag: 'exampleclient',
          name: 'Example Client',
          icon: 'example-icon',
          version: 'v1.0.0',
          updateDate: '2024-12-20',
          downloadUrls: [
            {
              platform: 'macOS',
              architecture: 'universal',
              fileType: 'dmg',
              url: 'https://github.com/example/client/releases/download/v1.0.0/client-macos-universal.dmg',
              fileName: 'client-macos-universal.dmg',
            },
          ],
          docs: {
            type: 'slug',
            value: 'example-client-macos',
          },
          description: {
            'zh-CN': 'macOS 系统专用客户端',
            'en-US': 'Client specifically for macOS',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            return `example://install-config?url=${encodeURIComponent(subscribeUrl)}&name=${encodeURIComponent(PROJECT_CONFIG.name)}`;
          },
        },
      ],
    },
    {
      id: 'android',
      name: 'Android',
      icon: 'fa-brands fa-android',
      clients: [
        {
          id: 'example-client-android',
          subFlag: 'exampleclient',
          name: 'Example Client',
          icon: 'example-icon',
          version: 'v1.0.0',
          updateDate: '2024-12-20',
          downloadUrls: [
            {
              platform: 'Android',
              architecture: 'universal',
              fileType: 'apk',
              url: 'https://github.com/example/client/releases/download/v1.0.0/client-android.apk',
              fileName: 'client-android.apk',
            },
          ],
          docs: {
            type: 'id',
            value: 1001,
          },
          description: {
            'zh-CN': 'Android 系统专用客户端',
            'en-US': 'Client specifically for Android',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            return `example://install-config?url=${encodeURIComponent(subscribeUrl)}&name=${encodeURIComponent(PROJECT_CONFIG.name)}`;
          },
        },
      ],
    },
    {
      id: 'ios',
      name: 'iOS',
      icon: 'fa-brands fa-apple',
      clients: [
        {
          id: 'example-client-ios',
          subFlag: 'exampleclient',
          name: 'Example Client',
          icon: 'example-icon',
          version: 'v1.0.0',
          updateDate: '2024-12-20',
          downloadUrls: [
            {
              platform: 'iOS',
              architecture: 'universal',
              fileType: 'app',
              url: 'https://apps.apple.com/us/app/example-client/id123456789',
              fileName: 'Example Client',
            },
          ],
          docs: {
            type: 'url',
            value: 'https://example.com/docs/ios',
          },
          description: {
            'zh-CN': 'iOS 系统专用客户端',
            'en-US': 'Client specifically for iOS',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            const content = Buffer.from(`${subscribeUrl}?flag=example`).toString('base64');
            return `example://add/sub://${content}?remark=${encodeURIComponent(PROJECT_CONFIG.name)}`;
          },
        },
      ],
    },
    {
      id: 'linux',
      name: 'Linux',
      icon: 'fa-brands fa-linux',
      clients: [
        {
          id: 'example-client-linux',
          subFlag: 'exampleclient',
          name: 'Example Client',
          icon: 'example-icon',
          version: 'v1.0.0',
          updateDate: '2024-12-20',
          downloadUrls: [
            {
              platform: 'Linux',
              architecture: 'x64',
              fileType: 'AppImage',
              url: 'https://github.com/example/client/releases/download/v1.0.0/client-linux-x64.AppImage',
              fileName: 'client-linux-x64.AppImage',
            },
            {
              platform: 'Linux',
              architecture: 'x64',
              fileType: 'tar.gz',
              url: 'https://github.com/example/client/releases/download/v1.0.0/client-linux-x64.tar.gz',
              fileName: 'client-linux-x64.tar.gz',
            },
          ],
          docs: {
            type: 'slug',
            value: 'example-client-linux',
          },
          description: {
            'zh-CN': 'Linux 系统客户端',
            'en-US': 'Client for Linux systems',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            return `example://install-config?url=${encodeURIComponent(subscribeUrl)}&name=${encodeURIComponent(PROJECT_CONFIG.name)}`;
          },
        },
      ],
    },
  ],
};
