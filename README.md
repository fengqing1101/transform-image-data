# TransformImageData  
将指定宽高的图像缓冲区数据输出到另一宽高的图像缓冲区

### 1. 安装   
```
npm install transform-image-data
```

### 2. 构造   
> 此类继承[TransferToWindow](https://www.npmjs.com/package/transfer-to-window)

```typescript
new TransformImageData(
  param: {
    // 输入宽
    inw: number,
    // 输入高
    inh: number,
    // 输出宽
    outw: number,
    // 输出高
    outh: number,
    // 输入窗口转化到输出窗口后最小的宽高尺寸；默认值:1
    minWH?: number,
    // 输入窗口转化到输出窗口后最大的宽高尺寸；默认值:Infinity
    minWH?: number,
    // 是否限制数据始终有区域位于窗口内部
    limitInWindow?: boolean,
    // 显示在窗口内部的最小值
    limitSize?: number,
    // 输入图像缓冲区
    inData: ArrayBuffer,
    // 输出图像缓冲区
    outData: ArrayBuffer,
  },
  // 是否计算输入输出窗口之间的变化矩阵
  slient?: boolean
) => TransformImageData
```   

### 3. API
- 平移
```typescript
/**
 * 平移
 * @param silent 是否更新outData缓冲区
 */
translate(dx: number, dy: number, silent?: boolean) => void
```

- 缩放；以(cx,cy)为中心缩放ratio比例
```typescript
/**
 * 平移
 * @param silent 是否更新outData缓冲区
 */
zoom(cx: number, cy: number, ratio: number, silent?: boolean) => void
```

- 将输入数据完整放置于输出窗口的正中间
```typescript
/**
 * 平移
 * @param silent 是否更新outData缓冲区
 */
resize(silent?: boolean) => void
```

- 将输入窗口的roi:[x,y,width,heigght]区域放置于输出窗口正中间
```typescript
scrollToRect(x: number, y: number, width: number, height: number, margin?: number) => void
```

- 更新输入->输出矩阵
```typescript
updateMatrix(scale: number, dx: number, dy: number) => void
```

- 坐标(x,y)是否位于输入视框内
```typescript
inCoorIsIn(x: number, y: number) => boolean
```

- 坐标(x,y)是否位于输出视框内
```typescript
outCoorIsIn(x: number, y: number) => boolean
```

- 将输入坐标组(x,y,...)转化为输出坐标组
```typescript
transInToOut(coors: number[]) => number[]
```

- 将输出坐标组(x,y,...)转化为输入坐标组
```typescript
transOutToIn(coors: number[]) => number[]
``` 

- 更新outData缓冲区
```typescript
update() => number[]
``` 

### 使用
以下为将一个原宽高为10*10的图像绘制到指定宽高canvas元素
##### html
```html
<canvas id="canvas"></canvas>
```

##### css
```css
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
}
```

##### javascript
```javascript
import { TransformImageData } from 'transform-image-data';
window.onload = function () {
  const canvas = document.getElementById('canvas');
  const inw = 100;
  const inh = 100;
  const inData = new ArrayBuffer(inw * inh * 4);
  const outw = document.body.clientWidth;
  const outh = document.body.clientHeight;
  const outImageData = new ImageData(outw, outh);
  canvas.width = outw;
  canvas.height = outh;
  const ctx = canvas.getContext('2d');
  const transferImageData = new TransformImageData({
    inw,
    inh,
    inData,
    outw,
    outh,
    outData: outImageData.data.buffer,
  })
  
  let isDirty = true;
  fillInData();
  requestAnimationFrame(update);
  /**
   * 更新画布
   */
  function update() {
    requestAnimationFrame(update);
    if (!isDirty) return;
    isDirty = false
    transferImageData.update();
    ctx.putImageData(outImageData, 0, 0);
  }

  /**
   * 初始化inData
   */
  function fillInData() {
    const data = new Uint32Array(inData);
    for (let i = 0; i < inw; i++) {
      data[i * inw + i] = 4291611705;
      data[(i + 1) * inw - i - 1] = 4291611705;
    }
  }

  /**
   * 获取鼠标相对于canvas的坐标
   */
  function getPosition(e) {
    let rect = canvas.getBoundingClientRect();
    return [e.pageX - rect.left, e.pageY - rect.top];
  }

  /**
   * 重置
   */
  document.addEventListener('keyup', function (e) {
    transferImageData.resize();
    isDirty = true;
  })

  /**
   * 缩放
   */
  canvas.addEventListener('wheel', function (e) {
    const coor = getPosition(e);
    transferImageData.zoom(coor[0], coor[1], e.deltaY < 0 ? 1.1 : 0.9);
    isDirty = true;
  })

  /**
   * 平移
   */
  let pos;
  canvas.addEventListener('mousedown', function (e) {
    pos = getPosition(e);
    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
  })
  function mousemove(e) {
    const cur = getPosition(e);
    transferImageData.translate(cur[0] - pos[0], cur[1] - pos[1]);
    pos = cur;
    isDirty = true;
  }
  function mouseup() {
    document.removeEventListener('mousemove', mousemove)
    document.removeEventListener('mouseup', mouseup)
  }
}
```