// 协议相关的工具函数

// 获取协议颜色
export const getProtocolColor = (protocol: string | undefined): string => {
  if (!protocol) {
    return 'protocol-shadowsocks'; // 默认颜色
  }

  const protocolColors: Record<string, string> = {
    trojan: 'protocol-trojan',
    hysteria2: 'protocol-hysteria2',
    vmess: 'protocol-vmess',
    shadowsocks: 'protocol-shadowsocks',
    vless: 'protocol-vless',
    wireguard: 'protocol-wireguard',
    hysteria: 'protocol-hysteria',
    tuic: 'protocol-tuic',
    reality: 'protocol-reality',
    naiveproxy: 'protocol-naive',
  };

  return protocolColors[protocol.toLowerCase()] || 'protocol-shadowsocks';
};
