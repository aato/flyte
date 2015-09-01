import FObject from './FObject';
import FSelection from './FSelection';

export default class FGroupMember extends FObject {
  constructor({x = 0, y = 0, width = 100, height = 100, layer = 0, scaleX = 1, scaleY = 1, angle = 0, background = '#DDDDDD', canvas} = {}){
    super({x, y, width, height, layer, scaleX, scaleY, angle, background, canvas});

    this._mask            = undefined;
    this._selector        = undefined;
  }

  _onMouseDown(e){
    console.log('mousedown on groupMember!');
  }

  setSelector(selector){
    this._selector = selector;
  }

  setPosition({x = this._position.x, y = this._position.y, layer = this._position.layer} = {}, calledBySelector = false){
    if(this._selector && !calledBySelector) return false;

    return super.setPosition({x, y, layer});
  }

  setDimensions({width = this._width, height = this._height} = {}, calledBySelector = false){
    if(this._selector && !calledBySelector) return false;

    return super.setDimensions({width, height});
  }
}
