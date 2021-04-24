import React, { useRef } from 'react';
import { Popconfirm, Button, message, Image } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProForm, { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import { getBanners, addBanner, updateBanner, delBanner } from '@/services/modules/banner';
import FormUpload from '@/components/FormUpload';
import useModal from '@/hooks/useModal';
import { getStorage, Types } from '@/helpers/storage';

export interface IBanner {
  imageSrc: string; // 资源地址
  title: string; // 标题
  subTitle: string; // 副标题
  description: string; // 描述
  detailUrl: string; // 跳转地址
  status: '1' | '2'; // 状态，1不展示 2展示
  sort: number; // 排序顺序
  createdAt?: string; // 更新时间
  updatedAt?: string; // 更新时间
  _id?: string;
  project: string;
  client: string;
}
// 排序输入框校验规则
const sortRule = [
  { required: true, message: '请输入排序' },
  { pattern: /^[1-9]\d*$/, message: '请输入正整数' },
];

// 地址输入框校验规则
const addressRule = [
  { required: true, message: '请输入地址' },
  {
    pattern: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
    message: '请输入网址',
  },
];

export default function BannerPage() {
  // 表格实例--控制重新获取数据等
  const actionRef = useRef<ActionType>();

  // 自定义弹窗，内部维护了展示状态，编辑的id，表单实例（从antd form得到的），打开关闭方法。
  const { modelForm, isModalVisible, itemId, setIsModalVisible, showModal, onCancel } = useModal<IBanner>();

  // 编辑按钮click
  const editorClick = (record: IBanner) => {
    showModal({
      ...record,
      imageSrc: [
        {
          uid: -1,
          status: 'done',
          url: record.imageSrc,
          name: '轮播图片',
        },
      ] as any,
    });
  };

  // 弹窗提交表单
  const onFinish = async (values) => {
    try {
      // 获取图片地址，如果修改了，就从response里面拿，如果没有就取之前的。
      const imageSrc = values.imageSrc?.[0]?.response?.data?.url || values.imageSrc?.[0]?.url;

      const data = {
        ...values,
        sort: Number(values.sort),
        imageSrc,
      };

      // 根据有无id判断是新增还是编辑，调用不同的方法，并作不同的提示。
      const result = itemId
        ? await updateBanner<IBanner>({ ...data, id: itemId })
        : await addBanner<IBanner>({ ...data, project: getStorage(Types.Project) });

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
      message.error('系统异常');
    }
  };

  // 删除图片
  const deleteBanner = async (id: string) => {
    try {
      const result = await delBanner(id);
      if (result.success) {
        message.success('删除成功');
        actionRef.current?.reload();
        return;
      }

      message.error(result.errorMessage);
    } catch (error) {
      message.error('系统异常');
    }
  };

  // 表格字段配置
  const columns: ProColumns<IBanner>[] = [
    {
      dataIndex: 'imageSrc',
      title: '图片',
      align: 'center',
      render: (src) => <Image width={100} src={src as string} />,
    },
    {
      dataIndex: 'sort',
      title: '排序',
      align: 'center',
      sorter: (a, b) => a.sort - b.sort,
    },
    {
      dataIndex: 'title',
      title: '标题',
      align: 'center',
    },
    {
      dataIndex: 'subTitle',
      title: '副标题',
      align: 'center',
    },
    {
      dataIndex: 'detailUrl',
      title: '地址',
      align: 'center',
    },
    {
      dataIndex: 'client',
      title: '客户端',
      align: 'center',
      valueType: 'select',
      valueEnum: {
        3: { text: '全部' },
        2: { text: '移动端' },
        1: { text: 'PC端' },
      },
    },
    {
      dataIndex: 'status',
      title: '状态',
      align: 'center',
      filters: true,
      valueType: 'select',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        2: { text: '展示', status: 'Success' },
        1: { text: '不展示', status: 'Default' },
      },
    },
    {
      dataIndex: 'description',
      title: '描述',
      align: 'center',
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
          onConfirm={() => deleteBanner(record._id!)}
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
      <ProTable<IBanner>
        bordered
        rowKey="_id"
        headerTitle="首页轮播图"
        search={false}
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          interface IResult {
            total: number;
            banners: IBanner[];
          }

          try {
            const result = await getBanners<IResult>(params);
            return {
              success: result.success,
              total: result?.data?.total ?? 0,
              data: result?.data?.banners ?? [],
            };
          } catch (error) {
            return message.error('系统异常');
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
        title="新增"
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
          <ProFormText width="m" name="title" label="标题" placeholder="请输入" />
          <ProFormText width="m" name="subTitle" label="副标题" placeholder="请输入" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText width="xl" name="description" label="描述" placeholder="请输入" />
          <ProFormSelect
            required
            width="xs"
            name="status"
            label="状态"
            options={[
              { value: '1', label: '不展示' },
              { value: '2', label: '展示' },
            ]}
            rules={[{ required: true, message: '请选择状态' }]}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormSelect
            required
            width="xs"
            name="client"
            label="客户端"
            options={[
              { value: '1', label: 'PC 端' },
              { value: '2', label: '移动端' },
              { value: '3', label: '全部' },
            ]}
            rules={[{ required: true, message: '请选择客户端' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText width="m" name="detailUrl" label="详情地址" placeholder="请输入" required rules={addressRule} />
          <ProFormText width="m" name="sort" label="排序" placeholder="请输入" required rules={sortRule} />
        </ProForm.Group>
        <FormUpload />
      </ModalForm>
    </div>
  );
}
