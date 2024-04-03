import React, { memo, useEffect } from 'react';
import useAppContext from '../../../contexts/AppContext';
import { Col, Drawer, Empty, Input, Row, Tooltip, message } from 'antd';
import SubmitBottomButton from 'components/common/buttons/submitBottomButton/SubmitBottomButton';
import FieldList from 'components/common/fieldList/FieldList';
import * as yup from 'yup';
import { useFormFields } from 'hooks';
import WikiApi from '../../../api/WikiApi';
import { useQuery, useQueryClient } from 'react-query';
import SuspenLoading from 'components/common/loading/SuspenLoading';

const WikiMenu = ({ children, code }) => {
  const queryClient = useQueryClient();
  const {
    state: { wikiCode, isWikiMode },
    onSetWikiCode,
  } = useAppContext();
  const isDisableEdit = localStorage.getItem('profile') && JSON.parse(localStorage.getItem('profile'))?.groupName !== 'Administrator';
  const onMouseEnter = (e) => {
    if (isWikiMode) {
      const element = e.target;
      element.classList.add('wiki_hover');
      element.classList.add('cursor-pointer');
    }
  };

  const onMouseClick = (e) => {
    if (isWikiMode) onSetWikiCode(code);
  };

  const onMouseLeave = (e) => {
    const element = e.target;
    if (isWikiMode) element.classList.remove('wiki_hover');
  };

  const handleUpdateWiki = async (value) => {
    if (!wikiCode) {
      message.error('Wiki code is empty');
      return;
    }
    const res = await WikiApi.updateWiki(wikiCode, value);
    if (res.status) {
      message.success('Update wiki code successfully');
      queryClient.invalidateQueries('wiki');
    } else {
      message.error(res.message);
    }
  };

  const handleCreateWiki = async (value) => {
    if (!wikiCode) {
      message.error('Wiki code is empty');
      return;
    }
    const res = await WikiApi.createWiki({ ...value, wikiCode });
    if (res.status) {
      message.success('Create wiki code successfully');
      queryClient.invalidateQueries('wiki');
    } else {
      message.error(res.message);
    }
  };

  const {
    formInputsWithSpan: fields,
    onSubmitHandler,
    reset,
    getValues,
  } = useFormFields({
    fieldInputs: [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        disabled: isDisableEdit,
        rules: yup.string().required('Title is required...'),
        labelClass: 'required',
        placeholder: 'Enter title',
        span: 24,
      },
      {
        name: 'description',
        label: 'Description',
        disabled: isDisableEdit,
        type: 'ck-editor',
        labelClass: 'required',
        rules: yup.string().required('Description is required...').max(2000, 'Max length is 2000 characters'),
        placeholder: 'Input description',
        span: 24,
      },
    ],
    onSubmit: (value) => {
      wikiQuery.data ? handleUpdateWiki(value) : handleCreateWiki(value);
    },
    watches: ['active'],
  });
  const handleGetWikiByCode = async () => {
    if (!wikiCode) return null;
    const res = await WikiApi.getWikiByCode(wikiCode);
    if (res.status) {
      reset(res.data.wiki);
      return res.data.wiki;
    } else {
      // message.error(res.message);
    }
  };
  const wikiQuery = useQuery({
    queryKey: ['wiki', 'details', wikiCode],
    queryFn: handleGetWikiByCode,
    enabled: Boolean(wikiCode === code),
  });

  useEffect(() => {
    const elementsWithDataWikiId = document.querySelectorAll(`[data-wiki-id="${code}"]`);
    if (isWikiMode) {
      for (let element of elementsWithDataWikiId) {
        element.addEventListener('mouseenter', onMouseEnter);
        element.addEventListener('mouseleave', onMouseLeave);
      }
    }
    return () => {
      for (let element of elementsWithDataWikiId) {
        element.removeEventListener('mouseenter', onMouseEnter);
        element.removeEventListener('mouseleave', onMouseEnter);
      }
    };
  }, [code, isWikiMode]);

  return (
    <>
      <div data-wiki-id={code.toString()} onClick={onMouseClick}>
        {children}
      </div>
      <Drawer id="wiki_drawer" open={wikiCode === code} onClose={() => onSetWikiCode(null)}>
        {wikiQuery.isLoading ? (
          <SuspenLoading />
        ) : isDisableEdit ? (
          <div className="section-block" style={{ margin: '-10px', maxWidth: '900px' }}>
            {!wikiQuery.data ? (
              <Empty />
            ) : (
              <>
                <h4>{wikiQuery.data?.title}</h4>
                <div dangerouslySetInnerHTML={{ __html: wikiQuery.data?.description }} />
              </>
            )}
          </div>
        ) : (
          <form onSubmit={onSubmitHandler} style={{ minWidth: 700, maxWidth: 700 }}>
            <Row gutter={[16, 16]}>
              <FieldList fields={fields} />
              {isDisableEdit ? null : (
                <Col span={24}>
                  <SubmitBottomButton title={wikiQuery.data ? 'Update' : 'Create'} />
                </Col>
              )}
            </Row>
          </form>
        )}
      </Drawer>
    </>
  );
};

export default WikiMenu;
