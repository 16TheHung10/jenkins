import { Button } from 'antd';
import React, { useMemo } from 'react';
import './style.scss';
import Icons from 'images/icons';

const BaseButton = ({ children, iconName, icon, className, color = 'primary', htmlType = 'button', ...props }, ref) => {
  const Icon = useMemo(() => {
    switch (iconName) {
      case 'check':
        return <Icons.CheckApp />;
      case 'note':
        return <Icons.Note />;
      case 'update':
        return <Icons.Update />;
      case 'search':
        return <Icons.Search />;
      case 'sync':
        return <Icons.Sync />;
      case 'gear':
        return <Icons.Gear />;
      case 'reload':
        return <Icons.Reload />;
      case 'tick':
        return <Icons.Tick />;
      case 'edit':
        return <Icons.Edit />;
      case 'export':
        return <Icons.Export style={{ rotate: '180deg' }} />;
      case 'delete':
        return <Icons.Delete />;
      case 'clear':
        return <Icons.Clear />;
      case 'send':
        return <Icons.Send />;
      case 'plus':
        return <Icons.Plus />;
      case 'minus':
        return <Icons.Minus />;
      case 'filter':
        return <Icons.Filter />;
      case 'arrowLeft':
        return <Icons.ArrowLeft />;
      case 'save':
        return <Icons.Save />;
      case 'detail':
        return <Icons.Details />;
      case 'cancel':
        return <Icons.Cancel />;
      case 'qr':
        return <Icons.QRCode />;
      case 'map':
        return <Icons.Map />;
      case 'upload':
        return <Icons.Upload />;
      case 'copy':
        return <Icons.Copy />;
      default:
        return null;
    }
  }, [iconName]);
  return (
    <div id="button_wrapper" ref={ref}>
      <Button
        id="base_button"
        htmlType={htmlType}
        icon={<div className="icon_wrapper">{Icon ? Icon : icon ? icon : null}</div>}
        style={{ padding: Icon ? '6px 16px 6px 16px' : '0 16px' }}
        className={`${color} ${className} `}
        {...props}
      >
        {children}
      </Button>
    </div>
  );
};

export default React.forwardRef(BaseButton);
