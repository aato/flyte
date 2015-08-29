  *[Symbol.iterator](){
    var iter = this._children[Symbol.iterator]();

    var value = iter.next();
    while(!value.done){
      yield value.value;
      value = iter.next();
    }
  }




  
  traverse(fn){
    fn();

    for(let child of this){
      child.traverse(fn);
    }
  }

  add(objs){
    if(!Array.isArray(objs)){
      objs = [objs];
    }

    var addedObjects = [];

    for(let obj of objs){
      if(obj.getScene()) continue;
      if(this._children.has(obj)) continue;

      if(this._scene){
        let that = this;
        obj.traverse(() => {
          if(!this._scene){
            this._scene = that._scene;
            this._id = that._scene._nextID();
          }
        });
      }

      this._children.add(obj);

      addedObjects.push(obj)
    }

    return addedObjects;
  }

  remove(obj){
    if(!Array.isArray(objs)){
      objs = [objs];
    }

    var removedObjects = [];

    for(let obj of objs){
      if(!this._children.has(obj)) continue;

      obj.traverse(() => {
        delete this.obj._scene;
        delete this.obj._id;
      });

      this._children.delete(obj);

      removedObjects.push(obj)
    }

    return removedObjects;
  }

  // Maybe make recursive?
  contains(obj){
    return this._children.has(obj);
  }

  getScene(){
    return this._scene;
  }

  draw(ctx){
    // Draw this object.

    // Draw outline if selected.

    // for(let child of this._children){
    //   child.draw(ctx);
    // }
  }

  hitTest({top, left, width, height} = {}){
    var hitObjs = [];

    this.traverse(() => {
      var temp = [];

      if(!top && !left) return [];

      if(!width || !height){
        if(left >= this._left && left <= this._left + this._width && top <= this._top + this._height && top >= this._top){
          temp.push(this);
        }
      } else if(width && height) {
        if(left <= this._left && left + width >= this._left){
          if(top <= this._top && top + height >= this._top){
            temp.push(this);
          } else if (top <= this._top + this._height && top + height >= this._top + this._height){
            temp.push(this);
          }
        } else if(left <= this._left + this._width && left + width >= this._left + this._width) {
          if(top <= this._top && top + height >= this._top){
            temp.push(this);
          } else if (top <= this._top + this._height && top + height >= this._top + this._height){
            temp.push(this);
          }
        }
      }

      hitObjs = [...hitObjs, ...temp];
    });

    // for(let child of this){
      // let hitChildren = child.hitTest({top, left, width, height});
      // hitObjs = [...hitObjs, ...hitChildren];
    // }

    return hitObjs;
  }
















    _calculateDimensions(){
    if(this._objects.length === -1) return;

    var mostLeft = undefined;
    var mostTop = undefined;
    var mostWide = undefined;
    var mostHigh = undefined;
    for(var i = 0; i < this._objects.length; i++){
      var obj = this._objects[i];
      mostLeft = mostLeft || obj.left;
      mostTop = mostTop || obj.top;
      mostWide = mostWide || obj.width;
      mostHigh = mostHigh || obj.height;

      mostLeft = obj.left < mostLeft ? obj.left : mostLeft;
      mostTop = obj.top < mostTop ? obj.top : mostTop;
      mostWide = obj.width < mostWide ? obj.width : mostWide;
      mostHigh = obj.height < mostHigh ? obj.height : mostHigh;
    }
  }

  containsExactly(objs){
    if(objs.length !== this._objects.length) return false;

    this._objects.sort((a, b) => {
      return
    })
  }