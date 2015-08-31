import FGroup from './FGroup';

export default class FSelection extends FGroup{
  constructor({x, y, width = 0, height = 0, layer, scaleX, scaleY, angle, background, canvas, outlineStyle = '#2222BB', outlineWidth = 5, outlineDash = [5, 15], transparency = 0.5} = {}){
    super({x, y, width, height, layer, scaleX, scaleY, angle, background, canvas});

    this._outlineStyle    = outlineStyle;
    this._outlineWidth    = outlineWidth;
    this._outlineDash     = outlineDash;
    this._transparency    = transparency;

    this._ctx.globalAlpha = this._transparency;
  }

  draw(ctx){
    super.draw(ctx);

    ctx.save();

      ctx.translate(this._center.x, this._center.y);
      ctx.scale(this._scale.x, this._scale.y);
      ctx.rotate(this._rotation * Math.PI/180);

      ctx.setLineDash(this._outlineDash);
      ctx.lineWidth = this._outlineWidth;
      ctx.strokeStyle = this._outlineStyle;

      ctx.beginPath();
      ctx.moveTo(-this._width / 2, -this._height / 2);
      ctx.lineTo(-this._width / 2 + this._width, -this._height / 2);
      ctx.lineTo(-this._width / 2 + this._width, -this._height / 2 + this._height);
      ctx.lineTo(-this._width / 2, -this._height / 2 + this._height);
      ctx.lineTo(-this._width / 2, -this._height / 2);
      ctx.stroke();

    ctx.restore();
  }

  _updatePositionAndDimensions(){
    var leftMost = undefined;
    var rightMost = undefined;
    var topMost = undefined;
    var bottomMost = undefined;

    for(let child of this){
      let childWorldBB = child.getWorldBoundingBox();
      for(let point of childWorldBB){
        if(leftMost === undefined) leftMost = point.x;
        if(rightMost === undefined) rightMost = point.x;
        if(bottomMost === undefined) bottomMost = point.y;
        if(topMost === undefined) topMost = point.y;

        leftMost = point.x < leftMost ? point.x : leftMost;
        rightMost = point.x > rightMost ? point.x : rightMost;
        topMost = point.y < topMost ? point.y : topMost;
        bottomMost = point.y > bottomMost ? point.y : bottomMost;
      }
    }

    this._position.x = leftMost || this._position.x;
    this._position.y = topMost || this._position.y;
    this._width =  leftMost !== undefined && rightMost !== undefined ? (rightMost - leftMost) : 0;
    this._height = bottomMost !== undefined && topMost !== undefined ? (bottomMost - topMost) : 0;

    this._calculateCenter();
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

    var addedObjs = super.add(toAdd);
    for(let obj of addedObjs){
      obj.setSelector(this);
    }

    this._updatePositionAndDimensions();

    return addedObjs;
  }

  remove(objs){
    if(!Array.isArray(objs)){
      objs = [objs];
    }

    var removedObjs = super.remove(objs);
    for(let obj of removedObjs){
      obj.setSelector(undefined);
    }

    this._updatePositionAndDimensions();

    return removedObjs;
  }

  clear(){
    var removedObjs = super.clear();
    for(let obj of removedObjs){
      obj.setSelector(undefined);
    }

    this._updatePositionAndDimensions();

    return removedObjs;
  }




























}
