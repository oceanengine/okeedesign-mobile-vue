// component mixin
import { get } from '../../../src/utils';
import { camelize, translate } from '../../../src/utils/format/string';

export default {
  computed: {
    t() {
      const { name } = this.$options;
      const prefix = name ? camelize(name) + '.' : '';
      const messages = this.$bytedMessages[this.$bytedLanguage];

      return (path, ...args) => {
        const message = get(messages, prefix + path) || get(messages, path);
        return translate(message, args);
      };
    },
  },
};
