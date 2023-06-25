import {
  METHOD_COLOR_DEFAULT,
  METHOD_COLOR_MAP,
} from '../constants/method-color-map.constants';

const methodColor = (method: string) =>
  METHOD_COLOR_MAP.find((item) => item.method === method)?.color ||
  METHOD_COLOR_DEFAULT;

export default methodColor;
