import FObject from './FObject';

export default class FScene extends FObject{
  constructor({canvas, width = 600, height = 300} = {}){
    if(!canvas){
      var e = new Error('Flyte.FScene#constructor: Scene must be supplied a canvas.');
      e.code = "E_CANVAS_UNDEFINED";
      throw e;
    }

    super({canvas, width, height});

    this._prevMouseLeft = 0;
    this._prevMouseTop = 0;

    this._c.tabIndex = 1000;
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

  _onMouseDown(e){
    var {left, top} = this._getMouseCoords(e);

    this._prevMouseLeft = left;
    this._prevMouseTop = top;
  }

  _onMouseUp(e){
    var {left, top} = this._getMouseCoords(e);

    this._prevMouseLeft = left;
    this._prevMouseTop = top;
  }

  _onClick(e){
    var {left, top} = this._getMouseCoords(e);

    console.log(this.hitTest({left, top}));

    this._prevMouseLeft = left;
    this._prevMouseTop = top;
  }

  _onDoubleClick(e){
    var {left, top} = this._getMouseCoords(e);

    this._prevMouseLeft = left;
    this._prevMouseTop = top;
  }

  _onMouseMove(e){
    var {left, top} = this._getMouseCoords(e);

    this._prevMouseLeft = left;
    this._prevMouseTop = top;
  }

  _onMouseOut(e){
    var {left, top} = this._getMouseCoords(e);

    this._prevMouseLeft = left;
    this._prevMouseTop = top;
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
    var left = e.clientX - rect.left;
    var top = e.clientY - rect.top;

    return {left, top};
  }
}
