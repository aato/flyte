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

  _updatePositionAndDimensions(){
    var leftMost = undefined;
    var rightMost = undefined;
    var topMost = undefined;
    var bottomMost = undefined;

    for(let child of this){
      let childWorldBB = child.getWorldBoundingBox();
      for(let point of childWorldBB){
        if(!leftMost) leftMost = point.x;
        if(!rightMost) rightMost = point.x;
        if(!bottomMost) bottomMost = point.y;
        if(!topMost) topMost = point.y;

        leftMost = point.x < leftMost ? point.x : leftMost;
        rightMost = point.x > rightMost ? point.x : rightMost;
        topMost = point.y < topMost ? point.y : topMost;
        bottomMost = point.y > bottomMost ? point.y : bottomMost;
      }
    }

    this._position.x = leftMost || this._position.x;
    this._position.y = topMost || this._position.y;
    this._width =  leftMost && rightMost ? (rightMost - leftMost) : 0;
    this._height = bottomMost && topMost ? (bottomMost - topMost) : 0;

    this._calculateCenter();
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

    this._updatePositionAndDimensions();

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

    this._updatePositionAndDimensions();

    return removedObjs;
  }

  clear(){
    var removedObjs = [];

    // If this group doesn't belong to a scene.
    if(!this._scene || !this._id) return addedObjs;

    removedObjs = Array.from(this._children);
    this._children.clear();

    this._updatePositionAndDimensions();

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
