import { PROJECT_CONFIG } from '@/config/project';

export interface DownloadOption {
  platform: string;
  architecture: string;
  fileType: string;
  url: string;
  fileName: string;
}

export type DocsConfig =
  | { type: 'id'; value: number }
  | { type: 'slug'; value: string }
  | { type: 'url'; value: string };

export interface Client {
  id: string;
  name: string;
  subFlag: string;
  icon: string;
  version: string;
  updateDate: string;
  downloadUrls: DownloadOption[];
  docs: DocsConfig;
  description: {
    'zh-CN': string;
    'en-US': string;
  };
  generateImportUrl: (subscribeUrl: string) => string;
}

export interface Platform {
  id: string;
  name: string;
  icon: string;
  clients: Client[];
}

export interface ClientDownloadDataType {
  platforms: Platform[];
}

export const ClientDownloadData: ClientDownloadDataType = {
  platforms: [
    {
      id: 'windows',
      name: 'Windows',
      icon: 'fa-brands fa-windows',
      clients: [
        {
          id: 'clash-for-windows',
          subFlag: 'clashforwindows',
          name: 'Clash for Windows',
          icon: 'clash-for-windows-icon',
          version: 'v0.20.39',
          updateDate: '2023-11-02',
          downloadUrls: [
            {
              platform: 'Windows',
              architecture: 'x64',
              fileType: '7z',
              url: 'https://github.com/moshaoli688/clash_for_windows_pkg/releases/download/v0.20.39/Clash.for.Windows-0.20.39-win.7z',
              fileName: 'Clash.for.Windows-0.20.39-win.7z',
            },
            {
              platform: 'Windows',
              architecture: 'x64',
              fileType: 'exe',
              url: 'https://github.com/moshaoli688/clash_for_windows_pkg/releases/download/v0.20.39/Clash.for.Windows.Setup.0.20.39.exe',
              fileName: 'Clash.for.Windows.Setup.0.20.39.exe',
            },
            {
              platform: 'Windows',
              architecture: 'arm64',
              fileType: '7z',
              url: 'https://github.com/moshaoli688/clash_for_windows_pkg/releases/download/v0.20.39/Clash.for.Windows-0.20.39-arm64-win.7z',
              fileName: 'Clash.for.Windows-0.20.39-arm64-win.7z',
            },
            {
              platform: 'Windows',
              architecture: 'arm64',
              fileType: 'exe',
              url: 'https://github.com/moshaoli688/clash_for_windows_pkg/releases/download/v0.20.39/Clash.for.Windows.Setup.0.20.39.arm64.exe',
              fileName: 'Clash.for.Windows.Setup.0.20.39.arm64.exe',
            },
            {
              platform: 'Windows',
              architecture: 'ia32',
              fileType: '7z',
              url: 'https://github.com/moshaoli688/clash_for_windows_pkg/releases/download/v0.20.39/Clash.for.Windows-0.20.39-ia32-win.7z',
              fileName: 'Clash.for.Windows-0.20.39-ia32-win.7z',
            },
          ],
          docs: {
            type: 'slug',
            value: 'clash-for-windows',
          },
          description: {
            'zh-CN': '易用的图形化界面，功能完整',
            'en-US': 'Easy-to-use graphical interface with complete functionality',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            return `clash://install-config?url=${encodeURIComponent(subscribeUrl)}&name=${encodeURIComponent(PROJECT_CONFIG.name)}`;
          },
        },
        {
          id: 'clash-verge-rev-windows',
          subFlag: 'clashverge',
          name: 'Clash Verge Rev',
          icon: 'clash-verge-rev-icon',
          version: 'v1.4.13',
          updateDate: '2024-02-20',
          downloadUrls: [
            {
              platform: 'Windows',
              architecture: 'x64',
              fileType: 'msi',
              url: 'https://github.com/clash-verge-rev/clash-verge-rev/releases/download/v1.4.13/Clash.Verge_1.4.13_x64_en-US.msi',
              fileName: 'Clash.Verge_1.4.13_x64_en-US.msi',
            },
          ],
          docs: {
            type: 'id',
            value: 18,
          },
          description: {
            'zh-CN': '基于 Tauri 的现代化界面',
            'en-US': 'Modern interface based on Tauri',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            return `clash://install-config?url=${encodeURIComponent(subscribeUrl)}&name=${encodeURIComponent(PROJECT_CONFIG.name)}`;
          },
        },
        {
          id: 'v2rayn-windows',
          subFlag: 'v2rayn',
          name: 'v2rayN',
          icon: 'v2rayn-icon',
          version: 'v6.42',
          updateDate: '2024-02-10',
          downloadUrls: [
            {
              platform: 'Windows',
              architecture: 'x64',
              fileType: 'zip',
              url: 'https://github.com/2dust/v2rayN/releases/download/6.42/v2rayN-With-Core.zip',
              fileName: 'v2rayN-With-Core.zip',
            },
          ],
          docs: {
            type: 'url',
            value: 'https://github.com/2dust/v2rayN/wiki',
          },
          description: {
            'zh-CN': '轻量级代理工具',
            'en-US': 'Lightweight proxy tool',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            return `v2rayng://install-config?url=${encodeURIComponent(subscribeUrl)}&name=${encodeURIComponent(PROJECT_CONFIG.name)}`;
          },
        },
        {
          id: 'karing-windows',
          subFlag: 'karing',
          name: 'Karing',
          icon: 'karing-icon',
          version: 'v1.0.38+',
          updateDate: '2024-12-20',
          downloadUrls: [
            {
              platform: 'Windows',
              architecture: 'universal',
              fileType: 'exe',
              url: 'https://github.com/KaringX/karing/releases/latest',
              fileName: 'karing-windows.exe',
            },
          ],
          docs: {
            type: 'url',
            value: 'https://github.com/KaringX/karing/wiki/Configuration-Guide',
          },
          description: {
            'zh-CN': '功能强大的跨平台代理工具，兼容 Clash',
            'en-US': 'Powerful cross-platform proxy tool, compatible with Clash',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            return `karing://install-config?url=${encodeURIComponent(subscribeUrl)}&name=${encodeURIComponent(PROJECT_CONFIG.name)}`;
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
          id: 'clashx-pro-macos',
          subFlag: 'clash-pro',
          name: 'ClashX Pro',
          icon: 'clashx-pro-icon',
          version: 'v1.118.0',
          updateDate: '2024-01-20',
          downloadUrls: [
            {
              platform: 'macOS',
              architecture: 'universal',
              fileType: 'dmg',
              url: 'https://github.com/yichengchen/clashX/releases/download/1.118.0/ClashX.dmg',
              fileName: 'ClashX.dmg',
            },
          ],
          docs: {
            type: 'id',
            value: 2001,
          },
          description: {
            'zh-CN': 'macOS 系统专用的原生客户端',
            'en-US': 'Native client specifically for macOS',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            return `clash://install-config?url=${encodeURIComponent(subscribeUrl)}&name=${encodeURIComponent(PROJECT_CONFIG.name)}`;
          },
        },
        {
          id: 'clash-verge-rev-macos',
          subFlag: 'clash-verge',
          name: 'Clash Verge Rev',
          icon: 'clash-verge-rev-icon',
          version: 'v1.4.13',
          updateDate: '2024-02-20',
          downloadUrls: [
            {
              platform: 'macOS',
              architecture: 'arm64',
              fileType: 'dmg',
              url: 'https://github.com/clash-verge-rev/clash-verge-rev/releases/download/v1.4.13/Clash.Verge_1.4.13_aarch64.dmg',
              fileName: 'Clash.Verge_1.4.13_aarch64.dmg',
            },
            {
              platform: 'macOS',
              architecture: 'x64',
              fileType: 'dmg',
              url: 'https://github.com/clash-verge-rev/clash-verge-rev/releases/download/v1.4.13/Clash.Verge_1.4.13_x64.dmg',
              fileName: 'Clash.Verge_1.4.13_x64.dmg',
            },
          ],
          docs: {
            type: 'slug',
            value: 'clashverge-macos',
          },
          description: {
            'zh-CN': '基于 Tauri 的现代化界面',
            'en-US': 'Modern interface based on Tauri',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            return `clash://install-config?url=${encodeURIComponent(subscribeUrl)}&name=${encodeURIComponent(PROJECT_CONFIG.name)}`;
          },
        },
        {
          id: 'karing-macos',
          subFlag: 'karing',
          name: 'Karing',
          icon: 'karing-icon',
          version: 'v1.0.38+',
          updateDate: '2024-12-20',
          downloadUrls: [
            {
              platform: 'macOS',
              architecture: 'universal',
              fileType: 'dmg',
              url: 'https://github.com/KaringX/karing/releases/latest',
              fileName: 'karing-macos.dmg',
            },
          ],
          docs: {
            type: 'url',
            value: 'https://karing.app/docs/macos',
          },
          description: {
            'zh-CN': '功能强大的跨平台代理工具，兼容 Clash',
            'en-US': 'Powerful cross-platform proxy tool, compatible with Clash',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            return `karing://install-config?url=${encodeURIComponent(subscribeUrl)}&name=${encodeURIComponent(PROJECT_CONFIG.name)}`;
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
          id: 'v2rayng-android',
          subFlag: 'v2rayng',
          name: 'v2rayNG',
          icon: 'v2rayng-icon',
          version: 'v1.8.19',
          updateDate: '2024-01-30',
          downloadUrls: [
            {
              platform: 'Android',
              architecture: 'universal',
              fileType: 'apk',
              url: 'https://github.com/2dust/v2rayNG/releases/download/1.8.19/v2rayNG_1.8.19.apk',
              fileName: 'v2rayNG_1.8.19.apk',
            },
          ],
          docs: {
            type: 'url',
            value: 'https://github.com/2dust/v2rayNG/wiki',
          },
          description: {
            'zh-CN': 'Android 系统专用客户端',
            'en-US': 'Client specifically for Android',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            return `v2rayng://install-config?url=${encodeURIComponent(subscribeUrl)}&name=${encodeURIComponent(PROJECT_CONFIG.name)}`;
          },
        },
        {
          id: 'clash-for-android',
          subFlag: 'clashforandroid',
          name: 'Clash for Android',
          icon: 'clash-for-windows-icon',
          version: 'v2.5.12',
          updateDate: '2024-02-05',
          downloadUrls: [
            {
              platform: 'Android',
              architecture: 'universal',
              fileType: 'apk',
              url: 'https://github.com/Kr328/ClashForAndroid/releases/download/v2.5.12/cfa-2.5.12-premium-universal-release.apk',
              fileName: 'cfa-2.5.12-premium-universal-release.apk',
            },
          ],
          docs: {
            type: 'id',
            value: 3001,
          },
          description: {
            'zh-CN': '功能完整的 Android 客户端',
            'en-US': 'Full-featured Android client',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            return `clash://install-config?url=${encodeURIComponent(subscribeUrl)}&name=${encodeURIComponent(PROJECT_CONFIG.name)}`;
          },
        },
        {
          id: 'karing-android',
          subFlag: 'karing',
          name: 'Karing',
          icon: 'karing-icon',
          version: 'v1.0.38+',
          updateDate: '2024-12-20',
          downloadUrls: [
            {
              platform: 'Android',
              architecture: 'universal',
              fileType: 'apk',
              url: 'https://github.com/KaringX/karing/releases/latest',
              fileName: 'karing-android.apk',
            },
          ],
          docs: {
            type: 'slug',
            value: 'karing-android',
          },
          description: {
            'zh-CN': '功能强大的跨平台代理工具，兼容 Clash',
            'en-US': 'Powerful cross-platform proxy tool, compatible with Clash',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            return `karing://install-config?url=${encodeURIComponent(subscribeUrl)}&name=${encodeURIComponent(PROJECT_CONFIG.name)}`;
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
          id: 'shadowrocket-ios',
          subFlag: 'shadowrocket',
          name: 'Shadowrocket',
          icon: 'shadowrocket-icon',
          version: 'v1.0.0',
          updateDate: '2024-01-15',
          downloadUrls: [
            {
              platform: 'iOS',
              architecture: 'universal',
              fileType: 'app',
              url: 'https://apps.apple.com/us/app/shadowrocket/id932747118',
              fileName: 'Shadowrocket',
            },
          ],
          docs: {
            type: 'url',
            value: 'https://shadowrocket.gitbook.io/shadowrocket/',
          },
          description: {
            'zh-CN': 'iOS 系统专用的专业代理工具',
            'en-US': 'Professional proxy tool specifically for iOS',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            const shadowRocketContent: string = Buffer.from(
              `${subscribeUrl}?flag=shadowrocket`,
            ).toString('base64');
            return `shadowrocket://add/sub://${shadowRocketContent}?remark=${encodeURIComponent(PROJECT_CONFIG.name)}`;
          },
        },
        {
          id: 'quantumult-x-ios',
          subFlag: 'quantumultx',
          name: 'Quantumult X',
          icon: 'quantumult-icon',
          version: 'v1.4.1',
          updateDate: '2024-02-10',
          downloadUrls: [
            {
              platform: 'iOS',
              architecture: 'universal',
              fileType: 'app',
              url: 'https://apps.apple.com/us/app/quantumult-x/id1443988620',
              fileName: 'Quantumult X',
            },
          ],
          docs: {
            type: 'id',
            value: 4001,
          },
          description: {
            'zh-CN': '功能强大的网络工具',
            'en-US': 'Powerful network tool',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            const quantumultXContent = {
              server_remote: [`${subscribeUrl},tag=${PROJECT_CONFIG.name}`],
            };
            const quantumultXContentJSON = JSON.stringify(quantumultXContent);
            return `quantumult-x:///update-configuration?remote-resource=${encodeURIComponent(quantumultXContentJSON)}`;
          },
        },
        {
          id: 'surge-ios',
          subFlag: 'surge',
          name: 'Surge 5',
          icon: 'surge-icon',
          version: 'v5.9.0',
          updateDate: '2024-02-15',
          downloadUrls: [
            {
              platform: 'iOS',
              architecture: 'universal',
              fileType: 'app',
              url: 'https://apps.apple.com/us/app/surge-5/id1442620678',
              fileName: 'Surge 5',
            },
          ],
          docs: {
            type: 'slug',
            value: 'surge-ios',
          },
          description: {
            'zh-CN': '专业的网络开发工具',
            'en-US': 'Professional network development tool',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            return `surge:///install-config?url=${encodeURIComponent(subscribeUrl)}&name=${encodeURIComponent(PROJECT_CONFIG.name)}`;
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
          id: 'clash-for-windows-linux',
          subFlag: 'clashforwindows',
          name: 'Clash for Windows',
          icon: 'clash-for-windows-icon',
          version: 'v0.20.39',
          updateDate: '2023-11-02',
          downloadUrls: [
            {
              platform: 'Linux',
              architecture: 'x64',
              fileType: 'tar.gz',
              url: 'https://github.com/moshaoli688/clash_for_windows_pkg/releases/download/v0.20.39/Clash.for.Windows-0.20.39-x64-linux.tar.gz',
              fileName: 'Clash.for.Windows-0.20.39-x64-linux.tar.gz',
            },
          ],
          docs: {
            type: 'id',
            value: 5001,
          },
          description: {
            'zh-CN': 'Linux 图形化界面版本',
            'en-US': 'Linux graphical interface version',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            return `clash://install-config?url=${encodeURIComponent(subscribeUrl)}&name=${encodeURIComponent(PROJECT_CONFIG.name)}`;
          },
        },
        {
          id: 'clash-linux',
          subFlag: 'clash',
          name: 'Clash',
          icon: 'clash-for-windows-icon',
          version: 'v1.18.0',
          updateDate: '2024-01-25',
          downloadUrls: [
            {
              platform: 'Linux',
              architecture: 'x64',
              fileType: 'gz',
              url: 'https://github.com/Dreamacro/clash/releases/download/v1.18.0/clash-linux-amd64-v1.18.0.gz',
              fileName: 'clash-linux-amd64-v1.18.0.gz',
            },
          ],
          docs: {
            type: 'url',
            value: 'https://clash.gitbook.io/doc/',
          },
          description: {
            'zh-CN': 'Linux 命令行版本',
            'en-US': 'Linux command line version',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            return `clash://install-config?url=${encodeURIComponent(subscribeUrl)}&name=${encodeURIComponent(PROJECT_CONFIG.name)}`;
          },
        },
        {
          id: 'karing-linux',
          subFlag: 'karing',
          name: 'Karing',
          icon: 'karing-icon',
          version: 'v1.0.38+',
          updateDate: '2024-12-20',
          downloadUrls: [
            {
              platform: 'Linux',
              architecture: 'universal',
              fileType: 'AppImage',
              url: 'https://github.com/KaringX/karing/releases/latest',
              fileName: 'karing-linux.AppImage',
            },
          ],
          docs: {
            type: 'slug',
            value: 'karing-linux',
          },
          description: {
            'zh-CN': '功能强大的跨平台代理工具，兼容 Clash',
            'en-US': 'Powerful cross-platform proxy tool, compatible with Clash',
          },
          generateImportUrl: (subscribeUrl: string): string => {
            return `karing://install-config?url=${encodeURIComponent(subscribeUrl)}&name=${encodeURIComponent(PROJECT_CONFIG.name)}`;
          },
        },
      ],
    },
  ],
};
