import alt from './../alt';

import Photo from './../models/photo';
import Tag from './../models/tag';

class PhotoActions {

  constructor() {
    this.generateActions(
      'getPhotosSuccess',
      'getDatesSuccess',
      'setDateFilterSuccess',
      'updatedPhotoSuccess',
      'setImporting'
    );
  }

  updatedPhoto(e, version) {
    console.log('photo actions new version', version, this);

    new Photo({ id: version.attributes.photo_id })
      .fetch({ withRelated: ['versions', 'tags'] })
      .then((photo) => {
        this.actions.updatedPhotoSuccess(photo);
      });
  }

  getPhotos() {
    console.log('get photos');

    new Photo()
      .fetchAll({ withRelated: ['versions', 'tags'] })
      .then((photos) => {
        this.actions.getPhotosSuccess(photos);
      });
  }

  getDates() {
    Photo.getDates().then((dates) => {
      this.actions.getDatesSuccess(dates);
    });
  }

  getFlagged() {
    new Photo()
      .where({ flag: true })
      .fetchAll({ withRelated: ['versions', 'tags'] })
      .then((photos) => {
        this.actions.getPhotosSuccess(photos);
      });
  }

  setDateFilter(date) {
    new Photo()
      .where({ date: date })
      .fetchAll({ withRelated: ['versions', 'tags'] })
      .then((photos) => {
        this.actions.getPhotosSuccess(photos);
      });
  }

  setTagFilter(tag) {
    new Tag({ id: tag.id })
      .fetch({ withRelated: ['photos'] })
      .then((tag) => {
        let photos = tag.related('photos');
        this.actions.getPhotosSuccess(photos);
      });
  }

  startImport() {
    this.actions.setImporting(true);
  }

  toggleFlag(photo) {
    console.log('photo', photo);

    new Photo({ id: photo.id })
      .save('flag', !photo.flag, { patch: true })
      .then(() => {
        return new Photo({ id: photo.id })
          .fetch({ withRelated: ['versions', 'tags'] });
      })
      .then((photoModel) => {
        this.actions.updatedPhotoSuccess(photoModel);
      })
      .catch((err) => {
        console.log('err toggle flag', err);
      });
  }
}

export default alt.createActions(PhotoActions);
