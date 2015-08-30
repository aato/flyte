import FGroup from './FGroup';

export default class FSelection extends FGroup{
  constructor({} = {}){
    super({});
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
      obj.setSelection(this);
    }

    return addedObjs;
  }

  remove(objs){
    if(!Array.isArray(objs)){
      objs = [objs];
    }

    var removedObjs = this.super.remove(objs);
    for(let obj of removedObjs){
      obj.setSelection(undefined);
    }

    return removedObjs;
  }

  clear(){
    var removedObjs = this.super.clear();
    for(let obj of removedObjs){
      obj.setSelection(undefined);
    }

    return removedObjs;
  }




























}
