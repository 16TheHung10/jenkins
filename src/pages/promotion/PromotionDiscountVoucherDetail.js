import React from 'react';
import CustomAuthorizePage from 'pages/CustomAuthorizePage';
import Action from 'components/mainContent/Action';
import PromotionModel from 'models/PromotionModel';
import { withRouter } from 'react-router-dom';

import SearchDetail from 'components/mainContent/promotion/searchPromotionDiscountVoucherDetail';
import { Button, Form, Input, Modal, Switch, message } from 'antd';

class PromotionDiscountVoucherDetail extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.orderCode = this.props.orderCode || '';
    this.searchDetailRef = React.createRef();
    this.isPopupNoteOpen = false;
  }

  handleSave = () => {
    this.searchDetailRef.current.handleSave();
  };
  handleUpdateStatusProps = (note) => {
    this.searchDetailRef.current.handleUpdateStatus();
  };
  handleUpdateStatus = (note) => {
    let model = new PromotionModel();
    let type = this.active === 1 ? '/inactive' : '/active';
    let page = 'bill' + type;
    model.putPromotion(page, this.props.match.params.orderCode, { note }).then((res) => {
      if (res.status && res.data) {
        this.active = this.active === 1 ? 2 : 1;
        this.refresh();
        message.success('Update status successfully!', 3);
      } else {
        message.error(res.message);
      }
    });
  };
  handleUpdateIsRunning = (value) => {
    this.isRunning = value;
    this.refresh();
  };

  handleUpdateStatusLocal = (status) => {
    this.active = status;
    this.refresh();
  };

  renderAction() {
    let actionLeftInfo = [
      {
        name: <Switch checkedChildren="Active" unCheckedChildren="Active" checked={this.active === 1} />,
        actionType: 'save',
        action: () => {
          if (this.active !== 1) {
            message.info('Can not active promotion');
            return;
          }
          this.isPopupNoteOpen = true;
          this.refresh();
        },
        hide: true,
        actionName: 'updatestatus',
      },
    ];
    let actionRightInfo = [];

    //isAllowSave
    if (!this.isRunning || this.props.type === 'copy') {
      actionLeftInfo.unshift({
        name: 'Save',
        actionType: 'save',
        action: this.handleSave,
        hide: true,
        actionName: 'save',
      });
    }

    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} ref={this.actionRef} />;
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        {this.renderAction()}
        <div className="container-table">
          <SearchDetail
            type={this.props.type}
            orderCode={this.orderCode}
            ref={this.searchDetailRef}
            onUpDateState={this.handleUpdateStatusLocal}
            onUpdateIsRunning={this.handleUpdateIsRunning}
          />
          <Modal
            footer={false}
            open={this.isPopupNoteOpen}
            onCancel={() => {
              this.isPopupNoteOpen = false;
              this.refresh();
            }}
          >
            <Form
              onFinish={(value) => {
                this.handleUpdateStatus(value.note);
                this.isPopupNoteOpen = false;
                this.refresh();
              }}
              layout="vertical"
            >
              <Form.Item
                name="note"
                label="Reason"
                rules={[{ type: 'string', required: true, message: 'Missing reason' }]}
              >
                <Input.TextArea rows={10} placeholder="Input reason" maxLength={1000} showCount />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Inactive promotion
              </Button>
            </Form>
          </Modal>
        </div>
      </>
    );
  }
}

export default withRouter(PromotionDiscountVoucherDetail);
