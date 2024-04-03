import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
function TextEditor({ onChange, height = 500, isAllowImage = true, disabled, ...props }, ref) {
  return (
    <>
      {disabled ? (
        <div className="section-block" dangerouslySetInnerHTML={{ __html: props.value }} />
      ) : (
        <Editor
          // ref={ref}
          apiKey="lbzgj7rgoy5lzelq1zu7vqp382v3zz17fvkpnyfx8lgnlr88"
          {...props}
          value={props.value} // Đặt giá trị nội dung từ state
          onEditorChange={(content) => {
            onChange(content); // Cập nhật nội dung vào state khi có thay đổi
          }}
          init={{
            height: height,
            menubar: ['insert'],
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount',
              'link',
              'typography',
              'fullpage',
              isAllowImage ? 'image' : '',
            ],
            toolbar:
              'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help |image ' +
              ' link ' +
              ' typography ' +
              ' fullpage ',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            file_picker_callback: function (callback, value, meta) {
              if (meta.filetype === 'image') {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.onchange = function () {
                  const file = input.files[0];
                  const reader = new FileReader();
                  reader.onload = function () {
                    // Đọc dữ liệu của hình ảnh và sau đó gọi callback để chèn nó vào trình soạn thảo
                    callback(reader.result, { alt: file.name });
                  };
                  reader.readAsDataURL(file);
                };
                input.click();
              }
            },
          }}
        />
      )}
    </>
  );
}
export default forwardRef(TextEditor);
