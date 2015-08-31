import FObject from './FObject';
import FSelection from './FSelection';

export default class FGroupMember extends FObject {
  constructor({x = 0, y = 0, width = 100, height = 100, layer = 0, scaleX = 1, scaleY = 1, angle = 0, background = '#DDDDDD', canvas} = {}){
    super({x, y, width, height, layer, scaleX, scaleY, angle, background, canvas});

    this._mask            = undefined;
    this._selector        = undefined;
  }

  setSelector(selector){
    if(!(selector instanceof FSelection)) return false;

    this._selector = selector;
    return true;
  }
}
