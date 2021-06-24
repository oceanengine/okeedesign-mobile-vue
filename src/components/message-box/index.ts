import Vue from 'vue';
import BytedDialog from '../dialog';

let instance;
let todo = 'resolve';
const size = ['small', 'normal', 'large'];

const defaultOptions = {
  value: true,
  title: '',
  message: '',
  className: '',
  beforeClose: null,
  cancelButtonText: '',
  confirmButtonText: '',
  size: size[1],
  showConfirmButton: true,
  showCancelButton: false,
  overlay: true,
  closeOnClickOverlay: false,
  lockScroll: true,
  getContainer: 'body',
  callback: action => {
    todo = action === 'confirm' ? 'resolve' : 'reject';
    instance[todo] && instance[todo](action);
  },
  actions: [],
  actionCallback: item => {
    instance.resolve && instance.resolve(item);
  },

  // render func
  renderTitle: null,
  renderMessage: null,
};

function isInDocument(element) {
  return document.body.contains(element);
}

function initInstance() {
  if (instance) {
    instance.$destroy();
  }

  instance = new (Vue.extend(BytedDialog))({
    el: document.createElement('div'),
    // avoid missing animation when first rendered
    propsData: {
      lazyRender: false,
    },
  });

  instance.$on('input', value => {
    instance.value = value;
  });
}

function MessageBox(options) {
  return new Promise((resolve, reject) => {
    if (!instance || !isInDocument(instance.$el)) {
      initInstance();
    }

    instance.$slots = {};

    Object.assign(instance, defaultOptions, options, {
      resolve,
      reject,
    });

    if (options.renderTitle) {
      instance.$slots.title = instance.renderTitle(instance.$createElement);
    }
    if (instance.renderMessage) {
      instance.$slots.default = instance.renderMessage(instance.$createElement);
    }

    instance.$emit('input', true);
  });
}

MessageBox.defaultOptions = Object.assign({}, defaultOptions);

MessageBox.alert = (message, title, options) => {
  if (typeof message === 'object') {
    options = message;
    title = '';
    message = '';
  } else if (typeof title === 'object') {
    options = title;
    title = '';
  } else if (title === undefined) {
    title = '';
  }
  if (!options) {
    options = {};
  }
  return MessageBox(
    Object.assign(
      {
        title,
        message,
      },
      options,
    ),
  );
};

MessageBox.confirm = (message, title, options) => {
  if (typeof message === 'object') {
    options = message;
    title = '';
    message = '';
  } else if (typeof title === 'object') {
    options = title;
    title = '';
  } else if (title === undefined) {
    title = '';
  }
  if (!options) {
    options = {};
  }
  return MessageBox(
    Object.assign(
      {
        title,
        message,
        showCancelButton: true,
      },
      options,
    ),
  );
};

MessageBox.dialog = options => {
  return MessageBox(
    Object.assign(
      {
        showCancelButton: false,
        showConfirmButton: false,
      },
      options,
    ),
  );
};

MessageBox.close = () => {
  if (instance) {
    instance.value = false;
  }
};

function getName(option) {
  return option && option.funcName && typeof option.funcName === 'string' ? option.funcName : '';
}

MessageBox.install = (Vue, options) => {
  if (options && typeof options === 'object') {
    const { alert, confirm, dialog } = options;

    const alertName = getName(alert);
    if (alertName) {
      Vue[`$${alertName}`] = Vue.prototype[`$${alertName}`] = MessageBox.alert;
    } else {
      Vue.$alert = Vue.prototype.$alert = MessageBox.alert;
    }

    const confirmName = getName(confirm);
    if (confirmName) {
      Vue[`$${confirmName}`] = Vue.prototype[`$${confirmName}`] = MessageBox.confirm;
    } else {
      Vue.$confirm = Vue.prototype.$confirm = MessageBox.confirm;
    }

    const dialogName = getName(dialog);
    if (dialogName) {
      Vue[`$${dialogName}`] = Vue.prototype[`$${dialogName}`] = MessageBox.dialog;
    } else {
      Vue.$dialog = Vue.prototype.$dialog = MessageBox.dialog;
    }
  } else {
    Vue.$alert = Vue.prototype.$alert = MessageBox.alert;
    Vue.$confirm = Vue.prototype.$confirm = MessageBox.confirm;
    Vue.$dialog = Vue.prototype.$dialog = MessageBox.dialog;
  }

  Vue.use(BytedDialog);
};

MessageBox.Component = BytedDialog;

export default MessageBox;
