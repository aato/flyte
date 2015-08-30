import FObject from './FObject';
import FGroup from './FGroup';

export default class FGroupMember extends FObject {
  constructor({x = 0, y = 0, width = 100, height = 100, layer = 0, scaleX = 1, scaleY = 1, angle = 0, background = '#DDDDDD', canvas} = {}){
    super({x, y, width, height, scaleX, scaleY, angle, background, canvas});

    this._position.layer = layer;
    this._mask = undefined;
    this._selection = undefined;
  }

  setSelection(selection){
    if(!(selection instanceof FSelection)) return false;

    this._selection = selection;
    return true;
  }

  setPosition({x = this._position.x, y = this._position.y, layer = this._position.layer} = {}){
    this.super({x, y});

    this._position.layer = layer;
  }
}
