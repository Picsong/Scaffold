import React, { useState, useCallback, useDebugValue } from 'react';
import { Form, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

export default function useModal<T = any>() {
  const [modelForm] = Form.useForm(); // 表单实例
  const [isModalVisible, setIsModalVisible] = useState(false); // 弹窗展示控制
  const [itemId, setItemId] = useState<string | null>(null); // 当前编辑项的id

  // 显示弹窗
  const showModal = useCallback(
    (record?: T) => {
      if (record) {
        modelForm.setFieldsValue(record);
      }
      setItemId(record?._id ?? null);
      setIsModalVisible(true);
    },
    [modelForm],
  );
  // 弹窗关闭方法
  const onCancel = useCallback(() => {
    confirm({
      title: '确定关闭当前页面？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        setIsModalVisible(false);
        modelForm.resetFields();
      },
      onCancel() {
        message.info('取消关闭');
      },
    });
  }, [modelForm]);

  useDebugValue('表单实例-弹窗展示控制-当前编辑项的id');

  return {
    modelForm,
    isModalVisible,
    itemId,
    setIsModalVisible,
    setItemId,
    showModal,
    onCancel,
  };
}
