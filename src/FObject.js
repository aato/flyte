export default class FObject{
  constructor({x = 0, y = 0, width = 100, height = 100, layer = 0, scaleX = 1, scaleY = 1, angle = 0, background = '#DDDDDD', canvas} = {}){
    this._id          = undefined;
    this._scene       = undefined;

    this._position    = {x: x, y: y, layer: layer};
    this._rotation    = angle;
    this._scale       = {x: scaleX, y: scaleY};

    this._width       = width;
    this._height      = height;

    this._background  = background;
    this._center      = {x: -1, y: -1};

    this._dirty       = true;

    this._c           = canvas || document.createElement('canvas');
    this._c.width     = this._width;
    this._c.height    = this._height;
    this._ctx         = this._c.getContext('2d');

    this._calculateCenter();
  }

  setPosition({x = this._position.x, y = this._position.y} = {}){
    if(x === this._position.x && y === this._position.y) return;

    this._position.x = x;
    this._position.y = y;

    this._dirty = true;
    this._calculateCenter();
  }

  setDimensions({width = this._width, height = this._height} = {}){
    if(width === this._width && height === this._height) return;

    this._width = width;
    this._height = height;

    this._c.width = width;
    this._c.height = height;

    this._dirty = true;
    this._calculateCenter();
  }

  setBackground(background = this._background){
    if(background === this._background) return;

    this._dirty = true;
    this._background = background;
  }

  _calculateCenter(){
    this._center = {
      x: this._position.x + this._width / 2,
      y: this._position.y + this._height / 2
    };
  }

  setScene(scene){
    if(this._scene) return false;

    this._scene = scene;
    return true;
  }

  setID(id){
    if(this._id) return false;

    this._id = id;
    return true;
  }

  draw(ctx){
    if(this._dirty){
      this._render();
      this._dirty = false;
    }

    ctx.save();
      ctx.translate(this._center.x, this._center.y);
      ctx.scale(this._scale.x, this._scale.y);

      ctx.drawImage(this._c, this._position.x, this._position.y);
    ctx.restore();
  }

  _render(){
    this._ctx.save();
      this._ctx.clearRect(0, 0, this._width, this._height);
      this._ctx.fillStyle = this._background;
      this._ctx.fillRect(0, 0, this._width, this._height);

      // Update this object's canvas here.
    this._ctx.restore();
  }

  hitTest({x, y, width, height} = {}){
    if(!x || !y) return false;

    // If we're testing for a single point.
    if(!width || !height){
      if(x >= this._position.x && x <= this._position.x + this._width && y <= this._position.y + this._height && y >= this._position.y){
        return true;
      }
    // If we're testing for a rectangle.
    } else {
      if(x <= this._position.x && x + width >= this._position.x){
        if(y <= this._position.y && y + height >= this._position.y){
          return true;
        } else if (y <= this._position.y + this._height && y + height >= this._position.y + this._height){
          return true;
        }
      } else if(x <= this._position.x + this._width && x + width >= this._position.x + this._width) {
        if(y <= this._position.y && y + height >= this._position.y){
          return true;
        } else if (y <= this._position.y + this._height && y + height >= this._position.y + this._height){
          return true;
        }
      }
    }

    return false;
  }
}
