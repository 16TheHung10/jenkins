import React, { memo, useEffect, useRef, useState } from 'react';
import useAppContext from '../../../contexts/AppContext';
import { Col, Drawer, Empty, Input, Row, Tooltip, message } from 'antd';
import SubmitBottomButton from 'components/common/buttons/submitBottomButton/SubmitBottomButton';
import FieldList from 'components/common/fieldList/FieldList';
import * as yup from 'yup';
import { useFormFields } from 'hooks';
import WikiApi from '../../../api/WikiApi';
import { useQuery, useQueryClient } from 'react-query';
import SuspenLoading from 'components/common/loading/SuspenLoading';
import TextEditor from 'components/common/editor/TextEditor';
import { Controller, useForm } from 'react-hook-form';
import AppMessage from 'message/reponse.message';
import { useLocation } from 'react-router-dom';

const Wiki = ({ children }) => {
  const location = useLocation();
  const { handleSubmit, control, reset, formState, getValues } = useForm();
  const queryClient = useQueryClient();
  const {
    state: { wikiCode, isWikiMode },
    onSetWikiCode,
  } = useAppContext();

  const currentHoverWikiCodeRef = useRef(null);

  const isDisableEdit =
    localStorage.getItem('profile') && JSON.parse(localStorage.getItem('profile'))?.groupName !== 'Administrator';

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

  const handleGetWikiByCode = async () => {
    if (!wikiCode) return null;
    const res = await WikiApi.getWikiByCode(wikiCode);
    if (res.status) {
      reset(res.data.wiki);
      return res.data.wiki;
    } else {
      return null;
      // message.error(res.message);
    }
  };

  const wikiQuery = useQuery({
    queryKey: ['wiki', 'details', wikiCode],
    queryFn: handleGetWikiByCode,
    enabled: Boolean(wikiCode),
  });

  useEffect(() => {
    reset({ title: wikiQuery.data?.title || '', description: wikiQuery.data?.description || '' });
  }, [wikiQuery.data]);
  const onSubmit = (value) => {
    wikiQuery.data ? handleUpdateWiki(value) : handleCreateWiki(value);
  };
  useEffect(() => {
    if (isWikiMode && !wikiCode) {
      const handleMouseOver = (event) => {
        const target = event.target;
        let currentElement = target;
        const allWikiElements = document.querySelectorAll('.wiki_hover');
        allWikiElements.forEach((element) => {
          element.classList.remove('wiki_hover');
        });

        // Kiểm tra xem có class 'section-block' không ở currentElement hoặc các phần tử con
        while (currentElement && !currentElement.classList.contains('section-block')) {
          currentElement = currentElement.parentElement;
        }

        if (currentElement && currentElement.classList.contains('section-block')) {
          // currentElement là div con có class 'section-block'
          currentElement.classList.add('wiki_hover');
        }
        currentHoverWikiCodeRef.current = currentElement;
      };

      const handleMouseOut = (event) => {
        const target = event.target;
        if (target.classList.contains('wiki_hover')) {
        }
        target.classList.remove('wiki_hover');
        if (currentHoverWikiCodeRef) currentHoverWikiCodeRef.current = null;
      };
      const handleClick = (e) => {
        if (!e.target?.classList.contains('wiki_hover')) {
          e.preventDefault();
        }
        let target = currentHoverWikiCodeRef?.current;
        if (target) {
          if (target?.classList.contains('wiki_hover')) {
            let wikiID = target?.id
              ? target?.id
              : target.querySelector('button')?.innerText?.toLowerCase() === 'search'
              ? 'formSearch' + location.pathname
              : target.querySelector('table')
              ? 'tableSearch' + location.pathname
              : null;

            if (wikiID) {
              onSetWikiCode(`WIKI_${wikiID.toUpperCase().replaceAll('/', '_')}`);
              target.classList.remove('wiki_hover');
            } else {
              AppMessage.info('This component does not support wiki, please contact IT for support');
            }
          }
        }
      };

      document.addEventListener('mousemove', handleMouseOver);
      document.addEventListener('mouseout', handleMouseOut);
      document.addEventListener('click', handleClick);
      return () => {
        document.removeEventListener('mousemove', handleMouseOver);
        document.removeEventListener('mouseout', handleMouseOut);
        document.removeEventListener('click', handleClick);
      };
    }
  }, [wikiCode, isWikiMode]);

  return (
    <Drawer
      id="wiki_drawer"
      open={Boolean(wikiCode)}
      onClose={() => {
        reset(null);
        onSetWikiCode(null);
      }}
      width={'fit-content'}
    >
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
        <form onSubmit={handleSubmit(onSubmit)} style={{ minWidth: 700, maxWidth: 700 }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <label className={`label required`}>Title</label>
              <Controller
                control={control}
                name="title"
                render={({ field }) => {
                  return <Input {...field} />;
                }}
              />
              <p className="error-text-12">{formState.errors['title']?.message}</p>
            </Col>

            <Col span={24}>
              <label className={`label required`}>Description</label>
              <Controller
                control={control}
                name="description"
                render={({ field }) => {
                  return <TextEditor {...field} />;
                }}
              />
              <p className="error-text-12">{formState.errors['description']?.message}</p>
            </Col>
            {isDisableEdit ? null : (
              <Col span={24}>
                <SubmitBottomButton title={wikiQuery.data ? 'Update' : 'Create'} />
              </Col>
            )}
          </Row>
        </form>
      )}
    </Drawer>
  );
};

export default Wiki;
