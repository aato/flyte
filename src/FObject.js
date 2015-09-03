export default class FObject{
  constructor({x = 0, y = 0, width = 100, height = 100, scaleX = 1, scaleY = 1, angle = 0, background = '#DDDDDD', layer = 0, canvas} = {}){
    this._id          = undefined;
    this._scene       = undefined;

    this._position    = {x: x, y: y, layer: layer};
    this._rotation    = angle;
    this._scale       = {x: scaleX, y: scaleY};

    this._width       = width;
    this._height      = height;

    this._background  = background;
    this._center      = {x: undefined, y: undefined};

    this._c           = canvas || document.createElement('canvas');
    this._c.width     = this._width;
    this._c.height    = this._height;
    this._ctx         = this._c.getContext('2d');

    this._flags       = {
                        canvasDirty: true
                      }

    this._events      = new Map();

    this._calculateCenter();

    this.addEventListener('onmousedown', this._onMouseDown);
    this.addEventListener('onmouseup', this._onMouseUp);
    this.addEventListener('onmousemove', this._onMouseMove);
  }

  getLayer(){
    return this._position.layer;
  }

  setLayer(layer = this._position.layer){
    if(layer === this._position.layer) return;

    this._position.layer = layer;
    if(this._scene) this._scene.setFlag('drawOrderDirty', true);
  }

  setFlag(flag, value){
    this._flags[flag] = value;
  }

  getWorldBoundingBox(){
    var topLeft = {px : this._position.x, py : this._position.y};
    var topRight = {px : this._position.x + this._width, py : this._position.y};
    var bottomRight = {px : this._position.x + this._width, py : this._position.y + this._height};
    var bottomLeft = {px : this._position.x, py : this._position.y + this._height};

    var theta = this._rotation * (Math.PI / 180);
    var ox = this._center.x;
    var oy = this._center.y;

    var rot = ({px, py}) => {
      var pxPrime = Math.cos(theta) * (px - ox) - Math.sin(theta) * (py - oy) + ox;
      var pyPrime = Math.sin(theta) * (px - ox) + Math.cos(theta) * (py - oy) + oy;

      return {x: pxPrime, y: pyPrime};
    };

    return [rot(topLeft), rot(topRight), rot(bottomRight), rot(bottomLeft)];
  }

  setPosition({x = this._position.x, y = this._position.y, layer = this._position.layer} = {}){
    if(x === this._position.x && y === this._position.y && layer === this._position.layer) return false;

    this._position.x = x;
    this._position.y = y;
    this._position.layer = layer;

    this._calculateCenter();

    if(this._scene) this._scene.setFlag('canvasDirty', true);

    return true;
  }

  getPosition(){
    return this._position;
  }

  setDimensions({width = this._width, height = this._height} = {}){
    if(width === this._width && height === this._height) return false;

    this._width = width;
    this._height = height;

    this._c.width = width;
    this._c.height = height;

    this._calculateCenter();
    this.setFlag('canvasDirty', true);
    if(this._scene) this._scene.setFlag('canvasDirty', true);

    return true;
  }

  getDimensions(){
    return {width: this._width, height: this._height};
  }

  setBackground(background = this._background){
    if(background === this._background) return;

    this._background = background;
    this.setFlag('canvasDirty', true);
    if(this._scene) this._scene.setFlag('canvasDirty', true);
  }

  getBackground(){
    return this._background;
  }

  _calculateCenter(){
    this._center = {
      x: this._position.x + this._width / 2,
      y: this._position.y + this._height / 2
    };
  }

  getScene(){
    return this._scene;
  }

  getID(){
    return this._id;
  }

  setScene(scene){
    this._scene = scene;
  }

  setID(id){
    this._id = id;
  }

  draw(ctx){
    if(this._flags.canvasDirty){
      this._render();
      this.setFlag('canvasDirty', false);
    }

    ctx.save();
      ctx.translate(this._center.x, this._center.y);
      ctx.scale(this._scale.x, this._scale.y);
      ctx.rotate(this._rotation * Math.PI/180);
      ctx.drawImage(this._c, 0, 0, this._width, this._height, -this._width / 2, -this._height / 2, this._width, this._height);

    ctx.restore();
  }

  _render(){
    // console.log('OBJECT RENDER');
    this._ctx.save();
      this._ctx.clearRect(0, 0, this._width, this._height);
      this._ctx.fillStyle = this._background;
      this._ctx.fillRect(0, 0, this._width, this._height);

      // Update this object's canvas here.
    this._ctx.restore();
  }

  hitTest({x, y, width, height} = {}){
    if(!x || !y) return [];

    // If we're testing for a point.
    if(!width || !height){
      if(x >= this._position.x && x <= this._position.x + this._width && y <= this._position.y + this._height && y >= this._position.y){
        return [this];
      }
    // If we're testing for a rectangle.
    } else {
      // Left edge.
      if(x <= this._position.x && x + width >= this._position.x){
        // Top-left corner.
        if(y <= this._position.y && y + height >= this._position.y){
          return [this];
        // Bottom-left corner.
        } else if (y <= this._position.y + this._height && y + height >= this._position.y + this._height){
          return [this];
        // Only left edge.
        } else if (y >= this._position.y && y + height <= this._position.y + this._height){
          return [this];
        }
      // Right edge.
      } else if(x <= this._position.x + this._width && x + width >= this._position.x + this._width) {
        // Top-right corner.
        if(y <= this._position.y && y + height >= this._position.y){
          return [this];
        // Bottom-right corner.
        } else if (y <= this._position.y + this._height && y + height >= this._position.y + this._height){
          return [this];
        // Only right edge.
        } else if (y >= this._position.y && y + height <= this._position.y + this._height){
          return [this];
        }
      // Center.
      } else if(x >= this._position.x && x + width <= this._position.x + this._width) {
        // Only top edge.
        if(y <= this._position.y && y + height >= this._position.y){
          return [this];
        // Only bottom edge.
        } else if (y <= this._position.y + this._height && y + height >= this._position.y + this._height){
          return [this];
        // Inside (no edges or corners).
        } else if (y >= this._position.y && y + height <= this._position.y + this._height){
          return [this];
        }
      }
    }

    return [];
  }

  addEventListener(eventType, fn){
    var _fn = fn.bind(this);
    this._events.set(eventType, _fn);

    return eventType;
  }

  trigger(eventType, e){
    if(this._events.has(eventType)){
      this._events.get(eventType)(e);
    }
  }

  _onMouseDown(e){
  }

  _onMouseUp(e){
  }

  _onMouseMove(e){
  }
}
