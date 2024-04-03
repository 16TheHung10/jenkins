import React from 'react';
import CustomAuthorizePage from 'pages/CustomAuthorizePage';

import ContentJsonListComp from 'components/mainContent/content';
import ContentEditorComp from 'components/mainContent/content/ContentdEdit';
import ContentPosScreen2Comp from 'components/mainContent/content/PosScreen2';
import Action from 'components/mainContent/Action';
import PageNotFound from 'pages/common/PageNotFound';
import ContentModel from 'models/ContentModel';

class ContentPage extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.contentRef = React.createRef();
    // this.template = props.template || "";

    this.name = '';
    this.template = '';
    this.content = '';
    this.type = this.props.type || '';

    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.fetchData(this.type);
    // console.log('Gọi lại nè mount', this.type);
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.template !== this.template) {
      this.template = newProps.template;
    }
    if (newProps.type !== this.type) {
      this.type = newProps.type;
      // console.log('Gọi lại nè', this.type, newProps.type);
      this.fetchData(this.type);
    }
  };

  handleSave() {
    if (!!this.contentRef.current) {
      this.contentRef.current.handleSave();
    }
  }

  fetchData = async (type) => {
    let model = new ContentModel();
    await model.getList(type).then((res) => {
      if (res.status && res.data.content) {
        this.name = res.data.content.name;
        this.template = res.data.content.template;
        this.content = res.data.content;
      }
      //   document.querySelector('#header.header-page').innerHTML = res.data.content.name;
      this.refresh();
    });
  };

  renderAction() {
    let actionLeftInfo = [
      {
        name: 'Save',
        actionType: 'info',
        action: this.handleSave,
      },
    ];
    let actionRightInfo = [];
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  }

  showPage = (key) => {
    switch (key) {
      case 'jsonlist':
        return <ContentJsonListComp {...this.props} type={this.props.type} ref={this.contentRef} />;
      case 'editor':
        return <ContentEditorComp {...this.props} type={this.props.type} ref={this.contentRef} />;
      case 'jsonkey':
        return <ContentPosScreen2Comp {...this.props} ref={this.contentRef} content={this.content} type={this.type} />;
      case undefined:
        return <ContentJsonListComp {...this.props} type={this.props.type} ref={this.contentRef} />;

      default:
        return <div>Loading...</div>;
    }
  };

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        {this.renderAction()}
        <div className="container-table">
          {this.template !== '' && this.template !== undefined && this.showPage(this.template)}
        </div>
      </>
    );
  }
}

export default ContentPage;
