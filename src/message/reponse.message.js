import { message } from 'antd';

const AppMessage = {
  error: (content) => message.error({ content: content || 'Error', key: content }),
  info: (content) => message.info({ content: content, key: content }),
  success: (content) => message.success({ content: content, key: content }),
};
export default AppMessage;
