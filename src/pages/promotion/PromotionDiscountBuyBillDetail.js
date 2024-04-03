import React from 'react';
import CustomAuthorizePage from 'pages/CustomAuthorizePage';
import Action from 'components/mainContent/Action';

import SearchDetail from 'components/mainContent/promotion/searchPromotionDiscountBuyBillDetail';
import { Button, Form, Input, Modal, Switch, message } from 'antd';
import PromotionModel from 'models/PromotionModel';
import { withRouter } from 'react-router-dom';

class PromotionDiscountBuyBillDetail extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.orderCode = this.props.orderCode || '';
    this.searchDetailRef = React.createRef();

    this.handleSave = this.handleSave.bind(this);
    this.handleApprove = this.handleApprove.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleLoadDefault = this.handleLoadDefault.bind(this);
    this.active = false;
    this.isRunning = false;
    this.isPopupNoteOpen = false;
  }

  handleSave() {
    this.searchDetailRef.current.handleSave();
  }

  handleApprove() {
    this.searchDetailRef.current.handleApprove();
  }

  handleDelete() {
    this.searchDetailRef.current.handleDelete();
  }

  handleLoadDefault() {
    this.searchDetailRef.current.handleLoadDefault();
  }

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

    //isAllowUpdateStatus
    actionRightInfo.push(
      {
        name: 'Approve',
        actionType: 'approve',
        action: this.handleApprove,
        hide: true,
        actionName: 'approve',
      },
      {
        name: 'Delete',
        actionType: 'delete',
        action: this.handleDelete,
        hide: true,
        actionName: 'delete',
      }
    );
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} ref={this.actionRef} />;
  }
  handleUpdateStatusLocal = (status) => {
    this.active = status;
    this.refresh();
  };
  handleUpdateIsRunning = (value) => {
    this.isRunning = value;
    this.refresh();
  };
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

export default withRouter(PromotionDiscountBuyBillDetail);
