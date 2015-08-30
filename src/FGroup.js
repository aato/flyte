import FObject from './FObject';
import FGroupMember from './FGroupMember';

export default class FGroup extends FObject {
  constructor({x = 0, y = 0, width = 100, height = 100, layer = 0, scaleX = 1, scaleY = 1, angle = 0, background = '#DDDDDD', canvas} = {}){
    super({x, y, width, height, layer, scaleX, scaleY, angle, background, canvas});

    this._children = new Set();
  }

  *[Symbol.iterator](){
    var iter = this._children[Symbol.iterator]();

    var value = iter.next();
    while(!value.done){
      yield value.value;
      value = iter.next();
    }
  }

  add(objs){
    if(!Array.isArray(objs)){
      objs = [objs];
    }

    var addedObjs = [];

    // If this group doesn't belong to a scene.
    if(!this._scene || !this._id) return addedObjs;

    // For each object we want to add.
    for(let obj of objs){
      // If it doesn't derive from FGroupMember, ignore it.
      if(!(obj instanceof FGroupMember)) continue;

      this._children.add(obj);
      addedObjs.push(obj);
    }

    return addedObjs;
  }

  remove(objs){
    if(!Array.isArray(objs)){
      objs = [objs];
    }

    var removedObjs = [];

    // If this group doesn't belong to a scene.
    if(!this._scene || !this._id) return addedObjs;

    // For each object we want to remove.
    for(let obj of objs){
      // If this group doesn't contain this object, ignore it.
      if(!this._children.has(obj)) continue;

      this._children.delete(obj);
      removedObjs.push(obj);
    }

    return removedObjs;
  }

  clear(){
    var removedObjs = [];

    // If this group doesn't belong to a scene.
    if(!this._scene || !this._id) return addedObjs;

    removedObjs = Array.from(this._children);
    this._children.clear();

    return removedObjs;
  }

  contains(objs){
    if(!Array.isArray(objs)){
      objs = [objs];
    }

    for(let obj of objs){
      if(!this._children.has(obj)) return false;
    }

    return true;
  }
}
