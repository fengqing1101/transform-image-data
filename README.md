# TransformImageData  

## Installation   

Install with npm:
```
npm install transform-image-data
```

## class TransformImageData   

### Constructor   

`new TransformImageData(param: param, slient?: boolean) => TransformImageData`    

- param
  - `inw: number` 输入宽
  - `inh: number` 输入高
  - `inData: ArrayBuffer` 输入图像缓冲区
  - `outw: number` 输出宽
  - `outh: number` 输出高
  - `outData: ArrayBuffer` 输出图像缓冲区
  - `minWH?: number` (defalut: 1) 输入窗口转化到输出窗口后最小的宽高尺寸；默认值:1
  - `maxWH?: number` 输入窗口转化到输出窗口后最大的宽高尺寸；默认值:Infinity
- `silent?: boolean` 是否计算输入输出窗口之间的变化矩阵；默认值：false

### Instance Function  

`.update()` 更新outData

`.translate(dx: number, dy: number, silent?: boolean)` 平移

`.zoom(cx: number, cy: number, ratio: number, silent?: boolean)` 以(cx,cy)为中心缩放ratio比例

`.resize(silent?: boolean)` 将输入数据完整放置于输出窗口的正中间

`.scrollToRect(x: number, y: number, width: number, height: number, margin?: number)` 将输入窗口的roi:[x,y,width,heigght]区域放置于输出窗口正中间

`.updateMatrix(scale: number, dx: number, dy: number)` 更新输入->输出矩阵

`.inCoorIsIn(x: number, y: number): boolean` 坐标(x,y)是否位于输出视框内

`.outCoorIsIn(x: number, y: number): boolean` 坐标(x,y)是否位于输出视框内

`.transInToOut(coors: number[])` 将输入坐标组(x,y,...)转化为输出坐标组

`.transOutToIn(coors: number[])` 将输出坐标组(x,y,...)转化为输入坐标组