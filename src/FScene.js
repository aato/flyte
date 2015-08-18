import {FCanvas} from "./FCanvas";
import {FRequestFrame} from "./FRequestFrame";

export class FScene{
  constructor({canvasID, width, height} = {}){
    if(!canvasID){
      let e = new Error('Flyte: Must supply an id for the target canvas.');
      e.code = "E_NO_CANVAS_ID";
      throw e;
    }

    if(!/^[0-9]+$/.test(width) || !/^[0-9]+$/.test(height)){
      let e = new Error('Flyte: Canvas dimensions must be positive integers.');
      e.code = "E_INVALID_CANVAS_DIMENSIONS";
      throw e;
    }

    this._objects = [];
    this._selection = undefined;

    this._prevX = 0;
    this._prevY = 0;

    this._dirtyZIndexes = true;

    var c = new FCanvas(canvasID);
    c.style.width = width + 'px';
    c.style.height = height + 'px';
    c.width  = c.offsetWidth;
    c.height = c.offsetHeight;

    this._c = c;
    this._ctx = this._c.getContext("2d");

    this._nextID = (
      function(){
        var index = 0;

        return function(){
          return index++;
        }
    })();

    var __onMouseDown = this._onMouseDown.bind(this);
    this._c.onmousedown = __onMouseDown;

    var __onMouseUp = this._onMouseUp.bind(this);
    this._c.onmouseup = __onMouseUp;

    var __onClick = this._onClick.bind(this);
    this._c.onclick = __onClick;

    var __onDoubleClick = this._onDoubleClick.bind(this);
    this._c.ondblclick = __onDoubleClick;

    var __onMouseMove = this._onMouseMove.bind(this);
    this._c.onmousemove = __onMouseMove;

    var __onMouseOut = this._onMouseOut.bind(this);
    this._c.onmouseout = __onMouseOut;

    this._request = new FRequestFrame('request');
    this._cancel = new FRequestFrame('cancel');

    this.__tick = this._tick.bind(this);
    this._requestID = this._request(this.__tick);
  }

  _onMouseDown(e){
    var {x, y} = this._getMouseCoords(e);
    var collisions = this._getMouseCollisions(x, y, {withObjects : true, withDeleteCtrls : true, withScaleCtrls : true});
    var topObj = collisions.objects ? collisions.objects[0] : undefined;
    var topScaleCtrl = collisions.scaleCtrls ? collisions.scaleCtrls[0] : undefined;
    var topDeleteCtrl = collisions.deleteCtrls ? collisions.deleteCtrls[0] : undefined;

    if(topScaleCtrl && topScaleCtrl.isSelected()) {
      topScaleCtrl.selectedScaleCtrl = topScaleCtrl.scaleCtrlHitTest(x, y);
    } else if((!topDeleteCtrl || !topDeleteCtrl.isSelected()) && topObj) {
      this.select(topObj);
      topObj.dragged = true;
    } else if(!topDeleteCtrl || !topDeleteCtrl.isSelected()) {
      this.unselect(this._selection);
    }

    if(topObj){
      topObj.mouseDownCB(e);
    }

    this._prevX = x;
    this._prevY = y;

    return false;
  }

  _onMouseUp(e){
    var {x, y} = this._getMouseCoords(e);
    var collisions = this._getMouseCollisions(x, y, {withObjects : true, withDeleteCtrls : false, withScaleCtrls : false});
    var topObj = collisions.objects ? collisions.objects[0] : undefined;

    this._c.style.cursor = 'default';

    if(topObj){
      topObj.mouseUpCB(e);
    }

    this._prevX = x;
    this._prevY = y;
  }

  _onClick(e){
    var {x, y} = this._getMouseCoords(e);
    var collisions = this._getMouseCollisions(x, y, {withObjects : true, withDeleteCtrls : true, withScaleCtrls : false});
    var topDeleteCtrl = collisions.deleteCtrls ? collisions.deleteCtrls[0] : undefined;
    var topObj = collisions.objects ? collisions.objects[0] : undefined;

    if(topDeleteCtrl && topDeleteCtrl.isSelected() && !topDeleteCtrl.dragged){
      this.remove(topDeleteCtrl);
    }

    if(this._selection){
      this._selection.dragged = false;
      this._selection.selectedScaleCtrl = -1;
    }

    if(topObj){
      topObj.clickCB(e);
    }

    this._prevX = x;
    this._prevY = y;
  }

  _onDoubleClick(e){
    var {x, y} = this._getMouseCoords(e);
    var collisions = this._getMouseCollisions(x, y, {withObjects : true, withScaleCtrls : false, withDeleteCtrls : false})
    var topObj = collisions.objects ? collisions.objects[0] : undefined;

    if(this._selection && this._selection.hitTest(y, x)){
      if(this._selection._onDoubleClick){
        this._selection._onDoubleClick(e, x, y);
      }
    }

    if(topObj){
      topObj.doubleClickCB(e);
    }

    this._prevX = x;
    this._prevY = y;
  }

  _onMouseMove(e){
    var {x, y} = this._getMouseCoords(e);
    var collisions = this._getMouseCollisions(x, y, {withObjects : true, withScaleCtrls : true, withDeleteCtrls : true})
    var topObj = collisions.objects ? collisions.objects[0] : undefined;
    var topScaleCtrl = collisions.scaleCtrls ? collisions.scaleCtrls[0] : undefined;
    var topDeleteCtrl = collisions.deleteCtrls ? collisions.deleteCtrls[0] : undefined;

    var canvasStyle = this._c.style;
    canvasStyle.cursor = 'default';

    var dx = x - this._prevX;
    var dy = y - this._prevY;

    var obj = this._selection;

    if(obj && obj.selectedScaleCtrl > -1){
      obj.hasMouseOverScaleCtrl = true;

      if(obj.selectedScaleCtrl > -1) {
        obj.scale(dx, dy, obj.selectedScaleCtrl);
      }
    } else if (obj && obj.dragged) {
      obj.hasMouseOver = true;
      obj.translate(dx, dy);
    } else {
      for(let i in this._objects) {
        let obj = this._objects[i];

        if(!obj.isSelected()){
          obj.hasMouseOver = false;
          obj.hasMouseOverDeleteCtrl = false;
          obj.hasMouseOverScaleCtrl = false;
        }
      }

      if(topObj) {
        topObj.hasMouseOver = true;

        if(topObj.isSelected()){
          canvasStyle.cursor = 'move';
        } else {
          canvasStyle.cursor = 'pointer';
        }
      }

      if(topScaleCtrl && topScaleCtrl.isSelected()) {
        topScaleCtrl.hasMouseOverScaleCtrl = true;

        let whichScaleCtrl = topScaleCtrl.scaleCtrlHitTest(x, y);
        if(whichScaleCtrl === 0 || whichScaleCtrl === 2){
          canvasStyle.cursor = 'nwse-resize';
        } else if (whichScaleCtrl === 1 || whichScaleCtrl === 3) {
          canvasStyle.cursor = 'nesw-resize';
        }
      }

      if(topDeleteCtrl && topDeleteCtrl.isSelected()) {
        topDeleteCtrl.hasMouseOverDeleteCtrl = true;
        canvasStyle.cursor = 'pointer';
      }

      if(this._selection){
        this._selection._controlsDirty = true;
      }
    }

    if(topObj){
      topObj.mouseMoveCB(e);
    }

    this._prevX = x;
    this._prevY = y;
  }

  _onMouseOut(e){
    if(this._selection){
      this._selection.dragged = false;
      this._selection.selectedScaleCtrl = -1;
    }

    this._c.onmouseup(e);
  }

  _getMouseCoords(e){
    var rect = this._c.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    return {x, y};
  }

  _getMouseCollisions(x, y, {withObjects = false, withScaleCtrls = false, withDeleteCtrls = false} = {}){

    var collisions = {objects : undefined, scaleCtrls : undefined, deleteCtrls : undefined};

    if(withObjects){
      let hitObjs = [];
      for(let i in this._objects){
        let obj = this._objects[i];
        if(obj.hitTest(y, x)){
          hitObjs.push(obj);
        }
      }

      if(hitObjs.length > 0){
        hitObjs.sort(function(a, b){
          return b.zIndex - a.zIndex;
        })

        collisions.objects = hitObjs;
      }
    }

    if(withScaleCtrls){
      let hitScaleCtrls = [];
      for(let i in this._objects){
        let obj = this._objects[i];
        if(obj.scaleCtrlHitTest(x, y) !== -1){
          hitScaleCtrls.push(obj);
        }
      }

      if(hitScaleCtrls.length > 0){
        hitScaleCtrls.sort(function(a, b){
          return b.zIndex - a.zIndex;
        })

        collisions.scaleCtrls = hitScaleCtrls;
      }
    }

    if(withDeleteCtrls){
      let hitDeleteCtrls = []
      for(let i in this._objects){
        let obj = this._objects[i];
        if(obj.deleteCtrlHitTest(x, y)){
          hitDeleteCtrls.push(obj);
        }
      }

      if(hitDeleteCtrls.length > 0){
        hitDeleteCtrls.sort(function(a, b){
          return b.zIndex - a.zIndex;
        })

        collisions.deleteCtrls = hitDeleteCtrls;
      }
    }

    return collisions;
  }

  _sortZIndexes(){
    this._objects.sort(function(a, b){
      return a.zIndex - b.zIndex;
    })
  }

  _tick(){
    var anyDirtyObjects = false;
    var anyDirtyControls = false;
    for(let i in this._objects){
      let obj = this._objects[i];

      if(obj.dirty || obj.controlsDirty){
        anyDirtyObjects = obj.dirty;
        anyDirtyControls = obj.controlsDirty;
        break;
      }
    }

    if(anyDirtyObjects || anyDirtyControls || this._dirtyZIndexes){
      this._ctx.clearRect(0, 0, this._c.width, this._c.height);

      this._ctx.fillStyle = "#999999";
      this._ctx.fillRect(0, 0, this._c.width, this._c.height);

      if(this._dirtyZIndexes){
        this._sortZIndexes();
        this._dirtyZIndexes = false;
      }

      for(let i in this._objects){
        let obj = this._objects[i];

        obj.draw(this._ctx, true, false);
      }

      for(let i in this._objects){
        let obj = this._objects[i];

        obj.draw(this._ctx, false, true);
      }
    }

    this._request(this.__tick);
  }

  add(obj){
    obj._id = this._nextID();
    obj._scene = this;

    this._objects.push(obj);

    this._dirtyZIndexes = true;
  }

  remove(obj){
    if(this.contains(obj)){
      this.unselect(obj);

      var removedObj = this._objects.splice(this._objects.indexOf(obj), 1)[0];

      this._dirtyZIndexes = true;

      return removedObj;
    }
  }

  select(obj){
    if(this._selection){
      if(obj.isSameObjectAs(this._selection)){
        return;
      }

      this._selection.selected = false;
      this._selection.dragged = false;
      this._selection.selectedScaleCtrl = -1;

      this._selection = undefined;
    }

    obj.selected = true;
    obj.dragged = false;
    obj.selectedScaleCtrl = -1;

    this._selection = obj;
  }

  unselect(obj){
    if(this._selection && this._selection.isSameObjectAs(obj)){
      this._selection.selected = false;
      this._selection.dragged = false;
      this._selection.selectedScaleCtrl = -1;

      this._selection = undefined;
    }
  }

  contains(obj){
    return this._objects.indexOf(obj) !== -1 ? true : false;
  }

  toJSON(){
    var jsonObj = [];

    this._sortZIndexes();

    for(let i in this._objects){
      let obj = this._objects[i];

      jsonObj.push(obj.toJSON());
    }

    return jsonObj;
  }
}
