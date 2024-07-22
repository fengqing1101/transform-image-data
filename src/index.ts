type ImageArray = Uint8Array | Uint8ClampedArray;

class TransformImageData {
  /** Input Data */
  inData: ImageArray;
  /** Output Data */
  outData: ImageArray;
  /** Width of input data */
  inw: number;
  /** Height of input data */
  inh: number;
  /** Width of output data */
  outw: number;
  /** Height of output data */
  outh: number;
  /**
   * The transformation matrix from inData to outData.
   * [scale, 0, 0, 0, scale, 0, dx, dy, 1]
   */
  scale!: number;
  dx!: number;
  dy!: number;
  /**
   * The transformation matrix from outData to inData.
   * [invScale, 0, 0, 0, invScale, 0, invDx, invDy, 1]
   */
  invScale!: number;
  invDx!: number;
  invDy!: number;
  constructor(inData: ImageArray, inw: number, inh: number, outData: ImageArray, outw: number, outh: number) {
    this.inData = inData;
    this.outData = outData;
    this.inw = inw;
    this.inh = inh;
    this.outw = outw;
    this.outh = outh;
    this.resize(true);
  }

  /**
   * Update outputData
   */
  update() {
    const { inw, inh, inData, outw, outh, outData, invScale, invDx, invDy } = this;
    for (let i = 0; i < outh; i++) {
      const r = Math.round(i * invScale + invDy);
      if (r < 0 || r >= inh) {
        for (let j = 0; j < outw; j++) {
          let index = (i * outw + j) * 4;
          outData[index + 3] = 0;
        }
        continue;
      }
      for (let j = 0; j < outw; j++) {
        const c = Math.round(j * invScale + invDx);
        let index = (i * outw + j) * 4;
        if (c < 0 || c >= inw) {
          outData[index + 3] = 0;
          continue;
        }
        let ti = (r * inw + c) * 4;
        outData[index] = inData[ti];
        outData[index + 1] = inData[ti + 1];
        outData[index + 2] = inData[ti + 2];
        outData[index + 3] = inData[ti + 3];
      }
    }
  }

  /**
   * Translate on outdata
   * @param dx 
   * @param dy 
   * @param silent Whether update outData
   */
  translate(dx: number, dy: number, silent?: boolean) {
    this.dx += dx;
    this.dy += dy;
    this.updateInvMatrix();
    silent || this.update();
  }

  /**
   * Scale ratio multiple at position(cx,cy) on outdata
   * @param cx 
   * @param cy 
   * @param ratio 
   * @param silent Whether update outData
   */
  zoom(cx: number, cy: number, ratio: number, silent?: boolean) {
    const { dx, dy, scale } = this;
    this.dx = (dx - cx) * ratio + cx;
    this.dy = (dy - cy) * ratio + cy;
    this.scale = scale * ratio;
    this.updateInvMatrix();
    silent || this.update();
  }

  /**
   * like:
   *    background-size: contain;
   *    background-repeat: no-repeat;
   *    background-position: center; 
   * @param silent Whether update outData
   */
  resize(silent?: boolean) {
    const { inw, inh, outw, outh } = this;
    let scale;
    if (outw / outh > inw / inh) {
      scale = outh / inh;
    } else {
      scale = outw / inw;
    }

    this.scale = scale;
    this.dx = (outw - inw * scale) / 2;
    this.dy = (outh - inh * scale) / 2;
    this.updateInvMatrix();
    silent || this.update();
  }

  /**
   * Update the transformation matrix.
   */
  updateInvMatrix() {
    this.invScale = 1 / this.scale;
    this.invDx = -this.dx / this.scale;
    this.invDy = -this.dy / this.scale;
  }
}

export {
  TransformImageData,
}