import React from 'react';
import ServerNodeCard from './ServerNodeCard';

// 定义组件Props接口
interface ServerStatusProps {
  serverData: API_V1.User.ServerItem[]; // 直接使用API类型
}

const ServerStatus: React.FC<ServerStatusProps> = ({ serverData }) => {
  return (
    <div className="row">
      {serverData.map((server, index) => (
        <ServerNodeCard key={server.id} server={server} index={index} />
      ))}
    </div>
  );
};

export default ServerStatus;
