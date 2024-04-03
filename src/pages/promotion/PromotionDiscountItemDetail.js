import React from 'react';
import CustomAuthorizePage from 'pages/CustomAuthorizePage';
import Action from 'components/mainContent/Action';

import SearchDetail from 'components/mainContent/promotion/searchDetailDiscountItem';
import { Button, Form, Input, Modal, Switch, message } from 'antd';
import PromotionModel from 'models/PromotionModel';
import { withRouter } from 'react-router-dom';

class PromotionDetailDiscountItem extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.orderCode = this.props.orderCode || '';
    this.searchDetailRef = React.createRef();

    this.handleSave = this.handleSave.bind(this);
    this.handleLoadDefault = this.handleLoadDefault.bind(this);
    this.active = false;
    this.isRunning = false;
    this.isPopupNoteOpen = false;
  }

  handleSave() {
    this.searchDetailRef.current.handleSave();
  }

  handleLoadDefault() {
    this.searchDetailRef.current.handleLoadDefault();
  }

  // handleUpdateStatus = () => {
  //     this.searchDetailRef.current.handleUpdateStatus();
  // }
  handleUpdateStatus = (note) => {
    let model = new PromotionModel();
    let type = this.active === 1 ? '/inactive' : '/active';
    let page = 'discountitem' + type;
    model.putPromotion(page, this.props.match.params.orderCode, { note }).then((res) => {
      if (res.status && res.data) {
        this.active = this.active === 1 ? 2 : 1;
        this.refresh();
        message.success('Save successfully!', 3);
      } else {
        message.error(res.message);
      }
    });
  };
  handlUpdateStatusLocal = (status) => {
    this.active = status;
    this.refresh();
  };
  handleUpdateIsRunning = (value) => {
    this.isRunning = value;
    this.refresh();
  };
  handleToDetailCopy = () => {
    this.searchDetailRef.current.handleToDetailCopy();
    // this.targetLink('/promotion-mix-and-match/' + codeId + '/copy');
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
    if (this.props.type !== 'copy') {
      actionRightInfo.push({
        name: 'Copy',
        actionType: 'save',
        action: this.handleToDetailCopy,
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
            onUpDateState={this.handlUpdateStatusLocal}
            onUpdateIsRunning={this.handleUpdateIsRunning}
            type={this.props.type}
            orderCode={this.orderCode}
            ref={this.searchDetailRef}
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

export default withRouter(PromotionDetailDiscountItem);
