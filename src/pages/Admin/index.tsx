import { useState,useRef } from 'react';
// import { useModel } from 'umi';
import{Button}  from 'antd';

import type { EditorInstance } from '@/components/Editor';
import Editor from '@/components/Editor';


export default function AdminIndexPage() {
  // const { initialState } = useModel('@@initialState');
  const [editorContent] = useState<string>('');
  const editorRef = useRef<EditorInstance>();

  return <div style={{padding:20}}>欢迎使用
    <div>
      <Button onClick={() => {
        // console.log(state);
      }}>按钮</Button>
      <Editor editorContent={editorContent} ref={editorRef} />
    </div>
  </div>;
}
