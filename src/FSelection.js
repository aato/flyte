import FGroup from './FGroup';

export default class FSelection extends FGroup{
  constructor({x = 0, y = 0, width = 100, height = 100, scaleX = 1, scaleY = 1, angle = 0, background = '#DDDDDD', canvas, children} = {}){
    super({x, y, width, height, layer, scaleX, scaleY, angle, background, canvas});
  }

  add(objs){
    if(!Array.isArray(objs)){
      objs = [objs];
    }

    var toAdd = [];

    for(let obj of objs){
      // If it belongs to a different scene, ignore it.
      if(obj.getScene() !== this._scene) continue;

      toAdd.push(obj);
    }

    var addedObjs = this.super.add(toAdd);
    for(let obj of addedObjs){
      obj.setSelector(this);
    }

    return addedObjs;
  }

  remove(objs){
    if(!Array.isArray(objs)){
      objs = [objs];
    }

    var removedObjs = this.super.remove(objs);
    for(let obj of removedObjs){
      obj.setSelector(undefined);
    }

    return removedObjs;
  }

  clear(){
    var removedObjs = this.super.clear();
    for(let obj of removedObjs){
      obj.setSelector(undefined);
    }

    return removedObjs;
  }




























}
