import FGroup from './FGroup';

export default class FScene extends FGroup{
  constructor({canvas, width = 600, height = 300} = {}){
    super({canvas, width, height});

    this._prevMouseX = 0;
    this._prevMouseY = 0;

    // Allows us to listen for keydown/up event
    this._c.tabIndex = 9999;
    // Prevents canvas from being outlined.
    this._c.style.outline = "none";

    this._nextID = (
      () => {
        var index = 0;

        return () => {
          return index++;
        }
    })();

    this._id = this._nextID();
    this._scene = this;

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

    var __onKeyDown = this._onKeyDown.bind(this);
    this._c.onkeydown = __onKeyDown;

    var __onKeyUp = this._onKeyUp.bind(this);
    this._c.onkeyup = __onKeyUp;

    this._request = requestFrame('request').bind(window);
    this._cancel = requestFrame('cancel').bind(window);

    this.__tick = this._tick.bind(this);
    this._requestID = this._request(this.__tick);
  }

  add(objs){
    if(!Array.isArray(objs)){
      objs = [objs];
    }

    var toAdd = [];

    for(let obj of objs){
      // If it already belongs to a scene, ignore it.
      if(obj.getScene() && obj.getID()) continue;

      toAdd.push(obj);
    }

    var addedObjs = this.super.add(toAdd);
    for(let obj of addedObjs){
      // Assign the object a unique ID within the scene.
      obj.setID(this._nextID());
      // Assign this scene to the object.
      obj.setScene(this)
    }

    return addedObjs;
  }

  remove(objs){
    if(!Array.isArray(objs)){
      objs = [objs];
    }

    var removedObjs = this.super.remove(objs);
    for(let obj of removedObjs){
      // Remove this object's ID.
      obj.setID(undefined);
      // Remove this scene from this object.
      obj.setScene(undefined)
    }

    return removedObjs;
  }

  clear(){
    var removedObjs = this.super.clear();
    for(let obj of removedObjs){
      // Remove this object's ID.
      obj.setID(undefined);
      // Remove this scene from this object.
      obj.setScene(undefined)
    }

    return removedObjs;
  }

















  _onMouseDown(e){
    var {x, y} = this._getMouseCoords(e);

    this._prevMouseX = x;
    this._prevMouseY = y;
  }

  _onMouseUp(e){
    var {x, y} = this._getMouseCoords(e);

    this._prevMouseX = x;
    this._prevMouseY = y;
  }

  _onClick(e){
    var {x, y} = this._getMouseCoords(e);

    console.log(this.hitTest({x, y}));

    this._prevMouseX = x;
    this._prevMouseY = y;
  }

  _onDoubleClick(e){
    var {x, y} = this._getMouseCoords(e);

    this._prevMouseX = x;
    this._prevMouseY = y;
  }

  _onMouseMove(e){
    var {x, y} = this._getMouseCoords(e);

    this._prevMouseX = x;
    this._prevMouseY = y;
  }

  _onMouseOut(e){
    var {x, y} = this._getMouseCoords(e);

    this._prevMouseX = x;
    this._prevMouseY = y;
  }

  _onKeyDown(e){
    console.log('down');
  }

  _onKeyUp(e){
    console.log('up');
  }

  _tick(){

    // for(let child of this){
    //   // Sort children by layer if necessary.
    //   child.draw(this._ctx);
    // }

    this._request(this.__tick);
  }

  _getMouseCoords(e){
    var rect = this._c.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    return {x, y};
  }
}
