import Vue from 'vue';
import BytedToast from './Toast';
import { isObj } from '../../utils';

const defaultOptions = {
  value: true,
  type: 'text',
  message: '',
  onClose: null,
  onOpened: null,
  duration: 3000,
  position: 'middle',
  forbidClick: false,
  getContainer: 'body',
  overlay: false,
  overlayStyle: null,
};

let queue = [];
let multiple = false;
const currentOptions = { ...defaultOptions };

function parseOptions(message) {
  return isObj(message) ? message : { message };
}

function createInstance() {
  if (!queue.length || multiple) {
    const toast = new (Vue.extend(BytedToast))({
      el: document.createElement('div'),
    });
    queue.push(toast);
  }
  return queue[queue.length - 1];
}

function transformOptions(options) {
  options = { ...options };
  delete options.duration;
  return options;
}

function Toast(options = {} as any) {
  const toast = createInstance();

  if (toast.value) {
    toast.updateZIndex();
  }

  function clear() {
    toast.value = false;
    if (options.onClose) {
      options.onClose();
    }

    if (multiple) {
      toast.$on('closed', () => {
        clearTimeout(toast.timer);
        queue = queue.filter(item => item !== toast);

        toast.$destroy();
      });
    }
  }

  options = {
    ...currentOptions,
    ...parseOptions(options),
    colse() {
      clear();
    },
    clear() {
      clear();
    },
  };

  Object.assign(toast, transformOptions(options));
  clearTimeout(toast.timer);

  if (options.duration > 0) {
    toast.timer = setTimeout(() => {
      toast.clear();
    }, options.duration);
  }

  return toast;
}

const createMethod = type => options =>
  Toast({
    type,
    ...parseOptions(options),
  });

['success', 'warning', 'error', 'loading'].forEach(method => {
  Toast[method] = createMethod(method);
});

Toast.clear = all => {
  if (queue.length) {
    if (all) {
      queue.forEach(toast => {
        toast.clear();
      });
      queue = [];
    } else if (!multiple) {
      queue[0].clear();
    } else {
      queue.shift().clear();
    }
  }
};

Toast.allowMultiple = (value = true) => {
  multiple = value;
};

Toast.install = (Vue, options) => {
  const funcName = options && typeof options === 'object' && options.funcName;

  if (funcName && typeof funcName === 'string') {
    Vue[`$${funcName}`] = Vue.prototype[`$${funcName}`] = Toast;
  } else {
    Vue.$toast = Vue.prototype.$toast = Toast;
  }

  Vue.use(BytedToast);
};

export default Toast;
