import { useModel } from 'umi';

export default function AdminIndexPage() {
  const { initialState } = useModel('@@initialState');
  console.log(initialState);
  return <div>欢迎使用</div>;
}
