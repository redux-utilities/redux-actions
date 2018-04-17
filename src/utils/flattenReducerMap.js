import isPlainObject from 'lodash/isPlainObject';
import isMap from 'lodash/isMap';
import hasGeneratorInterface from './hasGeneratorInterface';
import flattenWhenNode from './flattenWhenNode';

export default flattenWhenNode(
  node => (isPlainObject(node) || isMap(node)) && !hasGeneratorInterface(node)
);
