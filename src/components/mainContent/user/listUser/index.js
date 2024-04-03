import React, { Fragment } from 'react';
import Select from 'react-select';

//Custom
import BaseComponent from 'components/BaseComponent';
import Paging from 'external/control/pagination';
import { PageHelper } from 'helpers';
import UserModel from 'models/UserModel';
import { Switch, Tag, message } from 'antd';
import OnlineOfflineStatus from 'components/common/status/OnlineOfflineStatus';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';

//import TableUser from "components/mainContent/user/tableUser";
export default class ListUser extends BaseComponent {
  constructor(props) {
    super(props);
    this.data.groupUser = [];
    this.data.users = [];
    this.onlineUsrs = [];
    this.fieldSelected = this.assignFieldSelected({
      userName: '',
      email: '',
      userStatus: '',
      groupCode: '',
      pageNumber: 1,
      pageSize: 30,
    });
    this.isAutoload = PageHelper.updateFilters(this.fieldSelected, function (filters) {
      return true;
    });
    this.isRender = true;
  }

  componentWillReceiveProps(newProps) {
    if (this.data.groupUser !== newProps.groupUser) {
      this.data.groupUser = newProps.groupUser;
    }
    this.refresh();
  }

  handleSearch = () => {
    let fields = this.fieldSelected;
    fields.pageNumber = 1;
    PageHelper.pushHistoryState(this.fieldSelected);
    this.handleGetUsers();
    this.handleGetAllUserOnline();
  };
  handleGetUsers = async () => {
    let userModel = new UserModel();
    let params = {
      userName: this.fieldSelected.userName,
      email: this.fieldSelected.email,
      userStatus: this.fieldSelected.userStatus,
      groupCode: this.fieldSelected.groupCode,
      pageNumber: this.fieldSelected.pageNumber,
      pageSize: this.fieldSelected.pageSize,
    };
    await userModel.getListUser(params).then((response) => {
      if (response.status) {
        this.data.users = response.data.users;
        this.itemCount = response.data.total;
        this.refresh();
      }
    });
  };
  handleGetAllUserOnline = async () => {
    let userModel = new UserModel();

    await userModel.getUserOnline().then((response) => {
      if (response.status) {
        if (response.data.online_usrs) {
          this.onlineUsrs = response.data.online_usrs;
        }
        this.refresh();
      } else {
        this.showAlert(response.message);
      }
    });
  };
  handleToDetail = (userID) => {
    this.targetLink('/user/' + userID);
  };
  handleClickPaging = (page) => {
    let fields = this.fieldSelected;
    fields.pageNumber = page;
    this.refresh();
  };
  componentDidMount() {
    this.handleSearch();
  }

  async updateStatusUser(userID) {
    if (!userID) {
      message.error('Invalid user id');
      return;
    }
    const model = new UserModel();
    const res = await model.toggleStatus(userID);
    if (res.status) {
      message.success('Update successfully');
      const selectedUserIndex = this.data.users.findIndex((el) => el.userID === userID);
      if (selectedUserIndex !== -1) {
        this.data.users.splice(selectedUserIndex, 1, {
          ...this.data.users[selectedUserIndex],
          status: this.data.users[selectedUserIndex].status === '01' ? '02' : '01',
        });
        this.refresh();
      }
    } else {
      message.error(res.message);
    }
  }
  renderComp = () => {
    const fields = this.fieldSelected;
    let statusOption = [
      { value: '0', label: 'Inactive' },
      { value: '1', label: 'Active' },
    ];
    let groupCodeOptions = this.data.groupUser?.map((el) => ({
      value: el.groupUserCode,
      label: el.groupUserName,
    }));
    let users = this.data.users == null ? [] : this.data.users;
    return (
      <div className="form-filter">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div className="section-block" style={{ width: '900px', maxWidth: '100%' }}>
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="userName">Name: </label>
                    <input
                      style={{ minHeight: 38 }}
                      type="text"
                      autoComplete="off"
                      name="userName"
                      value={fields.userName || ''}
                      onChange={this.handleChangeField}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="email">Email: </label>
                    <input
                      style={{ minHeight: 38 }}
                      type="text"
                      autoComplete="off"
                      name="email"
                      value={fields.email || ''}
                      onChange={this.handleChangeField}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="storeStatus" className="w100pc">
                      {' '}
                      Status:
                    </label>
                    <Select
                      style={{ minHeight: 32 }}
                      isClearable
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={statusOption?.filter((option) => option.value == fields.userStatus)}
                      options={statusOption}
                      onChange={(e) => this.handleChangeFieldCustom('userStatus', e ? e.value : '')}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="groupCode" className="w100pc">
                      {' '}
                      Group:
                    </label>
                    <Select
                      isClearable
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={groupCodeOptions?.filter((option) => option.value === fields.groupCode)}
                      options={groupCodeOptions}
                      onChange={(e) => this.handleChangeFieldCustom('groupCode', e ? e.value : '')}
                    />
                  </div>
                </div>
                <div className="col-md-12 text-right flex justify-start">
                  <BaseButton iconName="search" onClick={this.handleSearch}>
                    Search
                  </BaseButton>
                </div>
              </div>
              <div className="row" style={{ paddingTop: '10px' }}>
                <div className="col-md-12">
                  <div className="wrap-table htable " style={{ maxHeight: 'calc(100vh - 300px)' }}>
                    <table className="table table-hover detail-search-rcv w-full" style={{ fontSize: 11 }}>
                      <thead>
                        <tr>
                          <th>User ID</th>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Group</th>
                          <th>Store</th>
                          <th>Email</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {users?.map((user, i) => (
                          <tr key={i} onDoubleClick={() => this.handleToDetail(user.userID)}>
                            <td>{user.userID}</td>
                            <td>
                              <div className="flex items-center gap-10">
                                {this.onlineUsrs.some((el) => el.userId == user.displayName) ? (
                                  <OnlineOfflineStatus type="online" />
                                ) : (
                                  <OnlineOfflineStatus type="offline" />
                                )}
                                <span>{user.displayName}</span>
                              </div>
                            </td>
                            <td>
                              <Switch
                                checkedChildren="Active"
                                unCheckedChildren="Active"
                                checked={user.status === '01'}
                                onChange={(checked) => this.updateStatusUser(user.userID)}
                              />
                              {/* {user.status === '01' ? (
                                <Tag color="green">Active</Tag>
                              ) : (
                                <Tag color="warning">Inactive</Tag>
                              )} */}
                            </td>
                            <td>
                              {this.data.groupUser?.find((el) => {
                                return el.groupUserCode == user.groupCode;
                              }) != null
                                ? this.data.groupUser?.find((el) => {
                                    return el.groupUserCode == user.groupCode;
                                  }).groupUserName
                                : ''}
                            </td>
                            <td>{user.storeCode}</td>
                            <td>{user.email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {users.length === 0 ? <div className="table-message">Empty</div> : ''}
                  </div>

                  {users.length !== 0 ? (
                    <div style={{ textAlign: 'center' }}>
                      <Paging
                        page={this.fieldSelected.pageNumber}
                        onClickPaging={this.handleClickPaging}
                        onClickSearch={this.handleGetUsers}
                        itemCount={this.itemCount}
                        // pageSize={30}
                        listItemLength={users.length}
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}
