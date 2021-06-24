import Vue from 'vue';
import { createNamespace } from '../../utils';
import uploadAjax from './upload';

import Toast from '../toast';

export type UploadProps = {
  action: string;
  name: string;
  data: any;
  headers: any;
  accept: string;
  beforeUpload(): void;
  onSuccess(): void;
  onError(): void;
  disabled: boolean;
  multiple: boolean;
  maxSize: number;
  exceedMaxSizeText: string;
  maxCount: number;
  withCredentials: boolean;
  capture: string;
};

const [createComponent, bem, t] = createNamespace('upload');

export default createComponent<UploadProps>({
  props: {
    // 上传地址
    action: {
      type: String,
      default: '',
      required: true,
    },
    // 上传的文件字段名
    name: {
      type: String,
      default: 'Filedata',
    },
    // 额外参数
    data: Object,
    headers: Object,
    // 支持文件类型
    accept: {
      type: String,
      default: '',
    },
    // 选择文件后，上传之前（返回false，终止上传操作）
    beforeUpload: {
      type: Function,
      default: () => {},
    },
    // 上传请求成功回调
    onSuccess: {
      type: Function,
      default: () => {},
    },
    // 上传请求失败回调
    onError: {
      type: Function,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    // 文件上传大小限制，单位为byte
    maxSize: {
      type: Number,
      default: 0,
    },
    // 文件超大后的toast提醒文案
    exceedMaxSizeText: {
      type: String,
      default: t('exceedText'),
    },
    // 多文件上传时，文件上传个数限制，默认是10个
    maxCount: {
      type: Number,
      default: 10,
    },
    withCredentials: {
      // 是否携带cookie信息
      type: Boolean,
      default: false,
    },
    capture: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      uploadAjax,
    };
  },

  methods: {
    handleClick(this: any) {
      if (this.disabled) {
        return false;
      }
      this.$refs.input.click();
    },
    handleChange(this: any, e) {
      const files = e.target.files;
      if (!files.length) {
        return;
      }
      let postFiles = Array.prototype.slice.call(files);
      this.$refs.input.value = null; // 清空
      if (!files || !postFiles.length) {
        return false;
      }
      if (!this.multiple) {
        postFiles = postFiles.slice(0, 1);
      }
      // TODO 待商议，多文件上传超过数据是提醒，还是直接截取前多少个文件？
      // 目前采用直接截取最大上传数量的文件
      if (this.multiple && this.maxCount) {
        postFiles = postFiles.slice(0, this.maxCount);
      }
      const fileLength = postFiles.length;
      postFiles.forEach((file, index) => {
        file.index = index;
        file.total_length = fileLength;
        this.uploadFile(file);
      });
    },
    wrapperUploadAjax(this: any, options) {
      Vue.nextTick(() => {
        Object.assign(options, {
          headers: this.headers,
          withCredentials: this.withCredentials, // 默认不发送
          data: this.data,
          filename: this.name, // 表单的name
          action: this.action,
          onProgress: () => {},
          onSuccess: res => {
            this.onSuccess(res, options.file, this);
          },
          onError: err => {
            this.onError(err, options.file, this);
          },
        });
        this.uploadAjax(options);
      });
    },
    uploadFile(this: any, file) {
      const options = {
        file,
      };
      if (this.maxSize) {
        const size = file.size;
        if (size > this.maxSize) {
          Toast({
            type: 'fail',
            duration: 1500,
            message: this.exceedMaxSizeText,
          });
          return false;
        }
      }
      if (!this.beforeUpload) {
        this.wrapperUploadAjax(options);
        return;
      }
      const beforeReturn = this.beforeUpload(file, this);
      if (beforeReturn && beforeReturn.then) {
        // 返回的是promise对象
        beforeReturn.then(
          processedFile => {
            // 传进来处理后的文件
            const toString = Object.prototype.toString;
            if (toString.call(processedFile) === '[object File]') {
              options.file = processedFile;
              this.wrapperUploadAjax(options);
            } else {
              this.wrapperUploadAjax(options);
            }
          },
          () => {},
        );
      } else if (beforeReturn !== false) {
        this.wrapperUploadAjax(options);
      }
    },
  },

  render(this: any) {
    const UploadSlot = this.slots() || (
      <div class={bem('upload-icon-box')}>
        <div class={bem('upload-icon')}>
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.25 1.25a1.25 1.25 0 10-2.5 0v7.5h-7.5a1.25 1.25 0 100 2.5h7.5v7.5a1.25 1.25 0 102.5 0v-7.5h7.5a1.25 1.25 0 100-2.5h-7.5v-7.5z"
              fill="#D8D8D8"
            />
          </svg>
        </div>
      </div>
    );

    return (
      <div class={bem()}>
        {this.multiple && (
          <div onClick={this.handleClick}>
            <input
              ref="input"
              accept={this.accept}
              disabled={this.disabled}
              multiple="multiple"
              type="file"
              name="Filedata"
              class="_file-input"
              onChange={this.handleChange}
              capture={this.capture}
            />
            {UploadSlot}
          </div>
        )}
        {!this.multiple && (
          <div onClick={this.handleClick}>
            <input
              ref="input"
              accept={this.accept}
              disabled={this.disabled}
              type="file"
              name="Filedata"
              class="_file-input"
              onChange={this.handleChange}
              capture={this.capture}
            />
            {UploadSlot}
          </div>
        )}
      </div>
    );
  },
});
