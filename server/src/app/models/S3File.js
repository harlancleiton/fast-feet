import Sequelize, { Model } from 'sequelize';
import S3FileHook from './hooks/S3FileHook';

class S3File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        key: Sequelize.STRING,
        url: Sequelize.VIRTUAL,
      },
      {
        sequelize,
        tableName: 's_3_files',
        hooks: {
          afterFind: S3FileHook.getSignedUrl,
          afterSave: S3FileHook.getSignedUrl,
          afterDestroy: S3FileHook.deleteFromStorage,
        },
      }
    );
  }
}

export default S3File;
