import { Result, Button } from 'antd';
import { history } from 'umi';

export default function NotFoundPage() {
  return (
    <div>
      <Result
        status="404"
        title="404"
        subTitle="对不起，您访问的页面不存在！"
        extra={
          <Button type="primary" onClick={() => history.goBack()}>
            返回
          </Button>
        }
      />
    </div>
  );
}
