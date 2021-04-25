import { useRef } from 'react';
// import { useModel } from 'umi';
import { Button } from 'antd';

import type { EditorInstance } from '@/components/Editor';
import Editor from '@/components/Editor';

export default function AdminIndexPage() {
  // const { initialState } = useModel('@@initialState');
  const editorRef = useRef<EditorInstance>();

  return (
    <div style={{ padding: 20, backgroundColor: '#fff' }}>
      欢迎使用
      <div>
        <Button
          onClick={() => {
            console.log(editorRef.current?.editorState.toHTML());
          }}
        >
          按钮
        </Button>
        <Editor ref={editorRef} />
      </div>
    </div>
  );
}
