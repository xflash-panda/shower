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
