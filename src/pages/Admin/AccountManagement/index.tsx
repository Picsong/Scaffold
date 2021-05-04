import React, { useRef } from 'react';
import { Popconfirm, Button, message, Image } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProForm, { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import { getUsers, addUser, updateUser, delUser } from '@/services/modules/user';
import FormUpload from '@/components/FormUpload';
import useModal from '@/hooks/useModal';

export interface IUser {
  _id: string;
  name: string; // 姓名
  role: 1 | 2 | 3; // 角色
  project: '1' | '2' | '3'; // 项目
  avatar_url: ImageUrl; // 头像
  updatedAt: string; // 修改时间
  createdAt: string; // 创建时间
}

type ImageUrl =
  | string
  | {
      response: { data: { url: string } };
      url?: string;
      uid?: number;
      status?: string;
      name?: string;
    }[];
export default function UserPage() {
  // 表格实例--控制重新获取数据等
  const actionRef = useRef<ActionType>();

  // 自定义弹窗，内部维护了展示状态，编辑的id，表单实例（从antd form得到的），打开关闭方法。
  const {
    modelForm,
    isModalVisible,
    itemId, // 可以判断是编辑还是新增
    setIsModalVisible,
    showModal,
    onCancel,
  } = useModal<IUser>();

  // 编辑按钮click
  const editorClick = (record: IUser) => {
    showModal({
      ...record,
      avatar_url: record.avatar_url
        ? ([
            {
              uid: -1,
              status: 'done',
              url: record.avatar_url,
              name: '用户头像',
            },
          ] as ImageUrl)
        : '',
    });
  };

  // 弹窗提交表单
  const onFinish = async (data: IUser) => {
    try {
      // 获取图片地址，如果修改了，就从response里面拿，如果没有就取之前的。
      const avatar_url = data.avatar_url?.[0]?.response?.data?.url || data.avatar_url?.[0]?.url;
      // 根据有无id判断是新增还是编辑，调用不同的方法，并作不同的提示。
      const result = itemId
        ? await updateUser<IUser>({
            data: { ...data, itemId, avatar_url },
          })
        : await addUser<IUser>({ data: { ...data, avatar_url } });

      if (result.success) {
        // 提示
        message.success(itemId ? '更新成功' : '新增成功');
        // 重置表单数据
        modelForm.resetFields();
        // 关闭弹窗
        setIsModalVisible(false);
        // 重新获取表格数据
        actionRef.current?.reload();
        return;
      }
      // 操作失败，给予用户提示。
      message.error(result.errorMessage);
    } catch (error) {
      if (error.name !== 'BizError') message.error('系统异常');
    }
  };

  // 删除图片
  const deleteUser = async (id: string) => {
    try {
      const result = await delUser({ data: id });
      if (result.success) {
        message.success('删除成功');
        actionRef.current?.reload();
        return;
      }
      message.error(result.errorMessage);
    } catch (error) {
      if (error.name !== 'BizError') message.error('系统异常');
    }
  };

  // 表格字段配置
  const columns: ProColumns<IUser>[] = [
    {
      dataIndex: 'avatar_url',
      title: '图片',
      align: 'center',
      render: (src) => <Image width={100} src={src as string} />,
    },
    {
      dataIndex: '_id',
      title: 'id',
      align: 'center',
    },
    {
      dataIndex: 'name',
      title: '姓名',
      align: 'center',
    },
    {
      dataIndex: 'role',
      title: '角色',
      align: 'center',
      filters: true,
      valueType: 'select',
      valueEnum: {
        3: { text: 'HR' },
        2: { text: '运维' },
        1: { text: '超级管理员' },
      },
    },
    {
      dataIndex: 'project',
      title: '项目',
      align: 'center',
      filters: true,
      valueType: 'select',
      valueEnum: {
        3: { text: '智启云服' },
        2: { text: '忆享科技' },
        1: { text: '腾云忆想' },
      },
    },
    {
      dataIndex: 'createdAt',
      title: '创建时间',
      align: 'center',
      valueType: 'dateTime',
    },
    {
      dataIndex: 'updatedAt',
      title: '修改时间',
      align: 'center',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'x',
      align: 'center',
      valueType: 'option',
      width: '160px',
      render: (dom, record) => [
        <Button key="edit" type="primary" size="small" onClick={() => editorClick(record)}>
          编辑
        </Button>,
        <Popconfirm
          okText="是"
          cancelText="否"
          key="popconfirm"
          title="确认删除吗?"
          onConfirm={() => deleteUser(record._id)}
        >
          <Button type="primary" size="small" danger>
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <div>
      <ProTable<IUser>
        bordered
        rowKey="_id"
        headerTitle="用户"
        search={false}
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          interface IResult {
            total: number;
            users: IUser[];
          }

          try {
            const result = await getUsers<IResult>({ data: params });
            return {
              success: result.success,
              total: result?.data?.total ?? 0,
              data: result?.data?.users ?? [],
            };
          } catch (error) {
            if (error.name !== 'BizError') message.error('系统异常');
            return { success: false, total: 0, data: [] };
          }
        }}
        pagination={{
          showQuickJumper: true,
        }}
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={() => showModal()}>
            <PlusOutlined />
            新增
          </Button>,
        ]}
      />
      {/* 下面是新增/编辑的弹窗 */}
      <ModalForm
        title={itemId ? '编辑' : '新增'}
        form={modelForm}
        onFinish={onFinish}
        visible={isModalVisible}
        modalProps={{
          onCancel,
          okText: '提交',
          cancelText: '关闭',
        }}
        submitter={{
          resetButtonProps: {
            onClick: () => setIsModalVisible(false),
          },
        }}
      >
        <ProForm.Group>
          <ProFormText
            required={!itemId}
            width="xl"
            name="name"
            label="登录名"
            placeholder="请输入"
          />
          <ProFormText
            required={!itemId}
            width="xl"
            name="password"
            label="密码"
            placeholder="请输入"
          />
          <ProFormSelect
            required={!itemId}
            width="md"
            name="role"
            label="角色"
            options={[
              { value: 1, label: '超级管理员' },
              { value: 2, label: '运维人员' },
              { value: 3, label: 'HR' },
            ]}
            rules={[{ required: true, message: '请选择角色' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            required={!itemId}
            width="xl"
            name="project"
            label="项目"
            options={[
              { value: '1', label: '腾云忆想' },
              { value: '2', label: '忆享科技' },
              { value: '3', label: '智启云服' },
            ]}
            rules={[{ required: true, message: '请选择项目' }]}
          />
        </ProForm.Group>
        <FormUpload label="头像" name="avatar_url" required={false} />
      </ModalForm>
    </div>
  );
}
