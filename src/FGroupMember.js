import FObject from './FObject';
import FGroup from './FGroup';

export default class FGroupMember extends FObject {
  constructor({x = 0, y = 0, width = 100, height = 100, layer = 0, scaleX = 1, scaleY = 1, angle = 0, background = '#DDDDDD', canvas} = {}){
    super({x, y, width, height, scaleX, scaleY, angle, background, canvas});

    this._position.layer  = layer;
    this._mask            = undefined;
    this._selector        = undefined;
  }

  setSelector(selector){
    if(!(selector instanceof FSelection)) return false;

    this._selector = selector;
    return true;
  }

  setPosition({x = this._position.x, y = this._position.y, layer = this._position.layer} = {}){
    this.super({x, y});

    this._position.layer = layer;
  }

  getLayer(){
    return this._position.layer;
  }

  setLayer(layer = this._position.layer){
    if(layer === this._position.layer) return;

    this._position.layer = layer;
    if(this._scene) this._scene.setFlag('drawOrderDirty', true);
  }
}
