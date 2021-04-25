import type { FC, ComponentProps } from 'react';
import React from 'react';
import { message } from 'antd';
import { ProFormUploadDragger } from '@ant-design/pro-form';
import { getStorage, Types } from '@/helpers/storage';

type Props = ComponentProps<typeof ProFormUploadDragger>;

const FormUpload: FC<Props> = (props) => {
  // 上传图片预览
  const onPreview = (file) => {
    // 上传中
    if (file.status === 'uploading') return message.error('上传中！');
    // 上传失败
    if (file.status === 'error') return message.error('上传失败，请重试！');
    // 预览最新上传url
    if (file?.response?.data?.url) return window.open(file?.response?.data?.url);
    // 预览之前上传url
    if (file.url) return window.open(file.url);

    return message.error('预览失败');
  };

  return (
    <ProFormUploadDragger
      name="imageSrc"
      accept="image/*"
      action="/api/upload"
      label="上传图片"
      required
      max={1}
      rules={[
        {
          validator(rule, value) {
            if (value?.length > 0) {
              const boo = value?.[0]?.response?.data?.url || value?.[0]?.url;
              return boo ? Promise.resolve() : Promise.reject('请重新上传图片');
            }
            if (props.required) return Promise.reject('请上传图片');
            return Promise.resolve();
          },
        },
      ]}
      {...props}
      fieldProps={{
        name: 'file',
        listType: 'picture',
        headers: {
          Authorization: `Bearer ${getStorage(Types.Token, 'local')}`,
        },
        onPreview: (file) => onPreview(file),
        ...props.fieldProps,
      }}
    />
  );
};

export default FormUpload;
