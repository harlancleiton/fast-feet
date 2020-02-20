import multer from 'multer';

import config from '../../config/multer';

export default function(name, type = 'single') {
  switch (type) {
    case 'single':
      return multer(config).single(name);
    case 'array':
      return multer(config).array(name);
    default:
      return multer(config).none();
  }
}
