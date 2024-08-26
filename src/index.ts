import { TransferToWindow } from 'transfer-to-window';

interface param {
  /** 输入数据 */
  inData: ArrayBuffer;
  /** 输入宽 */
  inw: number;
  /** 输入高 */
  inh: number;
  /** 输出数据 */
  outData: ArrayBuffer;
  /** 输出宽 */
  outw: number;
  /** 输出高 */
  outh: number;
  /** 输入窗口转化到输出窗口后最小的宽高尺寸；默认值:1 */
  minWH?: number;
  /** 输入窗口转化到输出窗口后最大的宽高尺寸；默认值:Infinity */
  maxWH?: number;
}

class TransformImageData extends TransferToWindow {
  /** 输入数据 */
  inData: Uint32Array;
  /** 输出数据 */
  outData: Uint32Array;
  constructor(param: param) {
    super(param, true);
    this.inData = new Uint32Array(param.inData);
    this.outData = new Uint32Array(param.outData);
    this.resize();
  }

  /**
   * Update outputData
   */
  update() {
    const { inw, inh, inData, outw, outh, outData, invScale, invDx, invDy } = this;
    for (let i = 0; i < outh; i++) {
      const r = Math.round(i * invScale + invDy);
      if (r < 0 || r >= inh) {
        outData.fill(0, i * outw, (i + 1) * outw);
        continue;
      }
      for (let j = 0; j < outw; j++) {
        const c = Math.round(j * invScale + invDx);
        let index = i * outw + j;
        if (c < 0 || c >= inw) {
          outData[index] = 0;
          continue;
        }
        let ti = r * inw + c;
        outData[index] = inData[ti];
      }
    }
  }

  /**
   * 平移
   * @param dx 
   * @param dy 
   * @param silent 是否更新outData
   */
  translate(dx: number, dy: number, silent?: boolean) {
    super.translate(dx, dy);
    silent || this.update();
  }

  /**
   * 以(cx,cy)为中心缩放ratio比例
   * @param cx 
   * @param cy 
   * @param ratio 
   * @param silent 是否更新outData
   */
  zoom(cx: number, cy: number, ratio: number, silent?: boolean) {
    super.zoom(cx, cy, ratio);
    silent || this.update();
  }

  /**
   * 将输入数据完整放置于输出窗口的正中间；效果类似于CSS效果：
   *    background-size: contain;
   *    background-repeat: no-repeat;
   *    background-position: center; 
   * @param silent 是否更新outData
   */
  resize(silent?: boolean) {
    super.resize();
    silent || this.update();
  }

}

export { TransformImageData }