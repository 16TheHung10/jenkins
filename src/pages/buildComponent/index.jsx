import React, { Component, useState } from "react";
import JSZip from "jszip";
import { Button, Col, Form, Input, Row } from "antd";
import {
  CreateComponent,
  DetailsComponent,
  FieldSearchAndCreate,
  NavComp,
  SearchComponent,
  UpdateComponent,
} from "./data";

const BuildComponent = () => {
  const [folders, setFolders] = useState([]);

  const getFilesForFolder = (folderName, content) => {
    const {
      searchComp,
      detailsComp,
      createComp,
      updateComp,
      fieldSearchAndCreateComp,
      tableDataComp,
      navComp,
    } = content;
    switch (folderName) {
      case "search":
        return [
          {
            name: "index.jsx",
            content: searchComp,
          },
        ];
      case "create":
        return [{ name: "index.jsx", content: createComp }];
      case "update":
        return [{ name: "index.jsx", content: updateComp }];
      case "data":
        return [
          { name: "fieldsData.jsx", content: fieldSearchAndCreateComp },
          { name: "tableDataComp.jsx", content: tableDataComp },
        ];
      case "details":
        return [{ name: "index.jsx", content: detailsComp }];
      case "route":
        return [
          {
            name: "route.jsx",
            content: `
        <Route
        exact
        path="/new-component"
        render={(props) => this.renderRoute('New component', <MainContent header="" page="NewComponent" {...props} />)}
      />
      <Route
      exact
      path="/new-component/create"
      render={(props) => this.renderRoute('New component', <MainContent header="" page="NewComponentCreate" {...props} />)}
    />
    <Route
    exact
    path="/new-component/details/:id"
    render={(props) => this.renderRoute('New component', <MainContent header="" page="NewComponentUpdate" {...props} />)}
  />
const NewComponent = lazy(() => import('pages/componentTest/search'));
const NewComponentCreate = lazy(() => import('pages/componentTest/create'));
const NewComponentUpdate = lazy(() => import('pages/componentTest/update'));
case 'NewComponent':
  return <NewComponent />;
  case 'NewComponentCreate':
  return <NewComponentCreate />;
  case 'NewComponentUpdate':
  return <NewComponentUpdate />;
        `,
          },
        ];
      case "nav":
        return [{ name: "index.jsx", content: navComp }];

      default:
        return [];
    }
  };

  const handleDownloadZip = (content) => {
    const zip = new JSZip();
    const folders = [
      "search",
      "create",
      "update",
      "data",
      "details",
      "route",
      "nav",
    ];
    folders.forEach((folderName) => {
      const folder = zip.folder(folderName);
      const files = getFilesForFolder(folderName, content);
      files.forEach((file) => {
        folder.file(file.name, file.content);
      });
    });

    // Tạo tệp zip
    zip.generateAsync({ type: "blob" }).then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "componentTest.zip";
      a.click();
      URL.revokeObjectURL(url);
    });
  };
  const clean = (string) => {
    const cleanedString = string.replace(/\s*=\s*/g, ":");
    return cleanedString;
  };
  const convertKeyToTitle = (inputString) => {
    return inputString.replace(/(?:^|[\s])[A-Z]/g, (match) => match.trim());
  };
  const convertKeyFromDBToLocal = (inputString) => {
    return inputString.charAt(0).toLowerCase() + inputString.slice(1);
  };
  return (
    <div>
      <a
        href="https://www.convertsimple.com/convert-javascript-to-json/"
        target="_blank"
      >
        Link convert
      </a>
      <Form
        layout="vertical"
        className="w-full"
        onFinish={(value) => {
          const getAllObject = clean(value?.getAll);
          const createObject = clean(value.create);
          const searchALlObject = clean(value.searchAll);

          const tableColumns = Object.keys(JSON.parse(getAllObject) || {}).map(
            (item, index) => {
              return {
                title: convertKeyToTitle(item),
                dataIndex: convertKeyFromDBToLocal(item),
                key: convertKeyFromDBToLocal(item),
                render: "(text) => text || ' - '",
              };
            },
          );
          const fieldsCreateData = Object.keys(
            JSON.parse(createObject) || {},
          ).map((item, index) => {
            const title = convertKeyToTitle(item);
            return {
              name: convertKeyFromDBToLocal(item),
              label: convertKeyToTitle(item),
              type: "text",
              labelClass: "required",
              rules: "yup.string().required(" + title + " is required)",
              placeholder: "Enter " + title + " value",
              span: 6,
            };
          });
          const fieldsSearchData = Object.keys(
            JSON.parse(searchALlObject) || {},
          ).map((item, index) => {
            const title = convertKeyToTitle(item);
            return {
              name: convertKeyFromDBToLocal(item),
              label: convertKeyToTitle(item),
              type: "text",
              placeholder: "Enter " + title + " value",
              span: 6,
            };
          });

          const searchComp = SearchComponent;
          const detailsComp = DetailsComponent;
          const createComp = CreateComponent;
          const updateComp = UpdateComponent;
          const tableDataComp = `import moment from 'moment';
          import { StringHelper } from 'helpers';
          import { Link } from 'react-router-dom';
          import Icons from 'images/icons';
          import React from 'react';
          const TableFcMasterManagementData = {
            columns: () => 
              ${JSON.stringify(tableColumns)}
            ,
          };
          export default TableFcMasterManagementData;
          
          `;
          const navComp = NavComp;
          const fieldSearchAndCreateComp = FieldSearchAndCreate(
            fieldsSearchData,
            fieldsCreateData,
          );
          handleDownloadZip({
            searchComp,
            detailsComp,
            createComp,
            updateComp,
            fieldSearchAndCreateComp,
            tableDataComp,
            navComp,
          });
        }}
      >
        <Row>
          <Col span={8}>
            <Form.Item name="getAll" label="Table column">
              <Input.TextArea rows={30} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="searchAll" label="Search all api body">
              <Input.TextArea rows={30} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="create" label="Create api body">
              <Input.TextArea rows={30} />
            </Form.Item>
          </Col>
          <Button htmlType="submit">submit</Button>
        </Row>
      </Form>
    </div>
  );
};

export default BuildComponent;
