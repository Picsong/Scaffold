import type { RefObject } from 'react';
import React, { useCallback, useState, createRef, forwardRef, useImperativeHandle } from 'react';
import type { EditorState } from 'braft-editor';
import BraftEditor from 'braft-editor';
import { uploadFile } from '@/services/modules/test';
import { preview } from '@/helpers/editor-preview';
import 'braft-editor/dist/index.css';

interface IProps {
  editorContent?: string;
}
export interface EditorInstance {
  editorInstance: RefObject<BraftEditor>;
  editorState: EditorState;
}

/**
 * 转发ref
 */
const Editor = forwardRef(({ editorContent }: IProps, ref) => {
  // 获取编辑器实例
  const editorRef = createRef<BraftEditor>();

  // 设置初始值
  const [editorState, setEditorState] = useState<EditorState>(
    BraftEditor.createEditorState(editorContent),
  );

  const onChange = useCallback((state: EditorState) => setEditorState(state), []);

  // 本地资源上传服务器钩子
  const uploadFn = useCallback(async (params) => {
    const data = new FormData();
    data.append('file', params.file);
    const result = await uploadFile({
      data,
      // fetch未实现上传进度监控
      // onUploadProgress: (progressEvent) => {
      //   params.progress((progressEvent.loaded / progressEvent.total) * 100);
      // },
    });
    if (result.success) {
      params.success({
        url: result.data.url,
        meta: {
          id: params.id,
          title: '图片',
          alt: '测试',
          loop: true, // 指定音视频是否循环播放
          autoPlay: true, // 指定音视频是否自动播放
          controls: true, // 指定音视频是否显示控制栏
          poster: 'http://192.168.50.123:3030/uploads/upload_f838305a02a88c5511eeb6185d92ce87.jpg', // 指定视频播放器的封面
        },
      });
    } else {
      params.error({ msg: '上传失败！' });
    }
  }, []);

  // 暴露给父组件的
  useImperativeHandle(ref, () => ({
    editorInstance: editorRef,
    editorState,
  }));

  return (
    <div
      style={{
        border: '1px solid #ccc',
      }}
    >
      <BraftEditor
        ref={editorRef}
        value={editorState}
        onChange={onChange}
        excludeControls={['emoji']}
        extendControls={[
          {
            key: 'preview',
            type: 'button',
            text: '预览',
            onClick: () => preview(editorState.toHTML()),
          },
        ]}
        media={{
          uploadFn,
        }}
        onSave={() => {
          console.log('用户 command/ctrl+s 触发，这里可以提交一次数据防止用户关闭编辑器数据丢失');
        }}
      />
    </div>
  );
});

Editor.displayName = 'RecruitmentEditor';

export default Editor;
