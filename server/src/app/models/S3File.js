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
          afterFind: S3FileHook.getUrl,
          afterSave: S3FileHook.getUrl,
          afterDestroy: S3FileHook.deleteS3,
        },
      }
    );
  }
}

export default S3File;
