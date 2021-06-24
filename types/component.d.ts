import Vue from 'vue';

export class BytedComponent {
  static name: string;
  static install(vue: typeof Vue): void;
}
