import { Matrix4, Mesh, Object3D, Raycaster, Vector3 } from "three";

export class MathClass {
  mRetVec: any;

  static GetUUID() {
    const s = [];
    const hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substring(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substring((Number(s[19]) & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    const uuid = s.join("");
    return uuid;
  }

  static Identity(tObject: Object3D) {
    tObject.rotation.x = 0;
    tObject.rotation.y = 0;
    tObject.rotation.z = 0;
    tObject.position.x = 0;
    tObject.position.y = 0;
    tObject.position.z = 0;
    tObject.scale.x = 1;
    tObject.scale.y = 1;
    tObject.scale.z = 1;
    tObject.matrixWorld.identity();
    tObject.matrix.identity();
  }

  static RotateVecFromAxis(vVec: Vector3, vAxis: Vector3, angle: number) {

    const edge1 = new Vector3(vVec.x - vAxis.x, vVec.y - vAxis.y, vVec.z - vAxis.z);

    if (Math.abs(edge1.x) < 0.001)
      edge1.x = 0.0;
    if (Math.abs(edge1.y) < 0.001)
      edge1.y = 0.0;

    let radian;
    if (edge1.x != 0)
      radian = Math.atan(edge1.y / edge1.x);
    else
      radian = 0;
    let degree = radian * 180 / Math.PI;

    if (degree < 0)
      degree = 360 + degree;

    const itmp = degree / angle;

    degree = degree - Math.floor(itmp) * angle;
    if (degree > angle / 2.0)
      degree -= angle;

    const tmpMatrix = new Matrix4().makeTranslation(-vAxis.x, -vAxis.y, -vAxis.z);
    const tmpMatrix1 = new Matrix4().makeRotationZ(-degree * Math.PI / 180);
    const tmpMatrix2 = new Matrix4().makeTranslation(vAxis.x, vAxis.y, vAxis.z);
    tmpMatrix1.multiply(tmpMatrix);
    tmpMatrix2.multiply(tmpMatrix1);

    return vVec.applyMatrix4(tmpMatrix2);
  }

  static Float_Equals(a: number, b: number, fValue: number) {
    if (Math.abs(a - b) < fValue)
      return true;
    return false;
  }

  static Vec_Equals(a: any, b: any, fValue: number) {
    if (true == this.Float_Equals(a.x, b.x, fValue) &&
      true == this.Float_Equals(a.y, b.y, fValue) &&
      true == this.Float_Equals(a.z, b.z, fValue))
      return true;
    return false;
  }


  static dotProduct(vPos1: Vector3, vPos2: Vector3, vPos3: Vector3) {
    const vVector1 = new Vector3(vPos3.x - vPos2.x, vPos3.y - vPos2.y, vPos3.z - vPos2.z);
    const vVector2 = new Vector3(vPos1.x - vPos2.x, vPos1.y - vPos2.y, vPos1.z - vPos2.z);
    vVector1.normalize();
    vVector2.normalize();
    const fRadian = Math.acos(vVector2.dot(vVector1));

    const fArea = this.GetAreaInTri(vPos1.x, vPos1.y, vPos2.x, vPos2.y, vPos3.x, vPos3.y);

    if (fArea < 0)
      return fRadian * 180 / Math.PI;

    return -fRadian * 180 / Math.PI;
  }


  static GetAreaInTri(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    return (x1 - x3) * (y2 - y3) - (y1 - y3) * (x2 - x3);  //S△=1/2 * |(x2-x1)(y3-y1)-(x3-x1)(y2-y1)|
  }


  static Get2Line(a: Vector3, b: Vector3, c: Vector3, d: Vector3) {
    const vLine11 = new Vector3(a.x, a.y, a.z);
    const vLine12 = new Vector3(b.x, b.y, c.z);
    const vLine21 = new Vector3(c.x, c.y, c.z);
    const vLine22 = new Vector3(d.x, d.y, d.z);

    const vOutPos = new Vector3();

    const bRet = 0;
    const array = [];
    array.push(bRet);


    const A1 = vLine12.y - vLine11.y;
    const B1 = vLine11.x - vLine12.x;
    const C1 = vLine12.x * vLine11.y - vLine11.x * vLine12.y;

    const A2 = vLine22.y - vLine21.y;
    const B2 = vLine21.x - vLine22.x;
    const C2 = vLine22.x * vLine21.y - vLine21.x * vLine22.y;

    if (Math.abs(A1 * B2 - B1 * A2) < 0.001) {
      /*			if( Math.abs( (A1+B1)*C2 - (A2+B2)*C1 ) )   
            return false;	 
            else
            return false;  */
      return array;
    }
    else {
      vOutPos.x = (B2 * C1 - B1 * C2) / (A2 * B1 - A1 * B2);
      vOutPos.y = (A1 * C2 - A2 * C1) / (A2 * B1 - A1 * B2);
      vOutPos.z = 0;
      array[0] = 1;
      array.push(vOutPos.x);
      array.push(vOutPos.y);
      array.push(vOutPos.z);
    }
    return array;
  }

  static Get2Line3D(a: Vector3, b: Vector3, c: Vector3, d: Vector3) {
    const vLine11 = new Vector3(a.x, a.y, -a.z);
    const vLine12 = new Vector3(b.x, b.y, -c.z);
    const vLine21 = new Vector3(c.x, c.y, -c.z);
    const vLine22 = new Vector3(d.x, d.y, -d.z);
    const vOutPos = new Vector3();

    const bRet = false;
    const array = [];
    array.push(bRet);

    const A1 = vLine12.z - vLine11.z;
    const B1 = vLine11.x - vLine12.x;
    const C1 = vLine12.x * vLine11.z - vLine11.x * vLine12.z;

    const A2 = vLine22.z - vLine21.z;
    const B2 = vLine21.x - vLine22.x;
    const C2 = vLine22.x * vLine21.z - vLine21.x * vLine22.z;

    if (Math.abs(A1 * B2 - B1 * A2) < 0.001) {
      return array;
    }
    else {
      vOutPos.x = (B2 * C1 - B1 * C2) / (A2 * B1 - A1 * B2);
      vOutPos.z = (A1 * C2 - A2 * C1) / (A2 * B1 - A1 * B2);
      vOutPos.y = 0;
      array[0] = true;
      array.push(vOutPos.x);
      array.push(vOutPos.y);
      array.push(vOutPos.z);
    }
    return array;
  }


  static ClosestPointOnLine(pWallLine: any, x1: any, y1: any, z1: any, fDis: any) {
    /***
     * 点是否在线段上
     * 
     */
    const ab = [];
    if (Math.abs(x1 - pWallLine.m_vStart.x) < fDis &&
      Math.abs(y1 - pWallLine.m_vStart.y) < fDis) {
      ab.push(1);
      ab.push(pWallLine.m_vStart.x);
      ab.push(pWallLine.m_vStart.y);
      ab.push(pWallLine.m_vStart.z);
      return ab;
    }

    if (Math.abs(x1 - pWallLine.m_vEnd.x) < fDis &&
      Math.abs(y1 - pWallLine.m_vEnd.y) < fDis) {
      ab.push(2);
      ab.push(pWallLine.m_vEnd.x);
      ab.push(pWallLine.m_vEnd.y);
      ab.push(pWallLine.m_vEnd.z);
      return ab;
    }

    const vVector1 = new Vector3(x1 - pWallLine.m_vStart.x, y1 - pWallLine.m_vStart.y, z1 - pWallLine.m_vStart.z);
    const vVector2 = new Vector3(pWallLine.m_vEnd.x - pWallLine.m_vStart.x, pWallLine.m_vEnd.y - pWallLine.m_vStart.y, pWallLine.m_vEnd.z - pWallLine.m_vStart.z);

    vVector2.normalize();

    let d = Math.sqrt((pWallLine.m_vEnd.x - pWallLine.m_vStart.x) * (pWallLine.m_vEnd.x - pWallLine.m_vStart.x) +
      (pWallLine.m_vEnd.y - pWallLine.m_vStart.y) * (pWallLine.m_vEnd.y - pWallLine.m_vStart.y) +
      (pWallLine.m_vEnd.z - pWallLine.m_vStart.z) * (pWallLine.m_vEnd.z - pWallLine.m_vStart.z));

    const t = vVector2.dot(vVector1);


    if (t <= 0) {
      ab.push(0);
      return ab;
    }
    if (t >= d) {
      ab.push(0);
      return ab;
    }


    const vClosestPoint = new Vector3();
    vClosestPoint.x = pWallLine.m_vStart.x + vVector2.x * t;
    vClosestPoint.y = pWallLine.m_vStart.y + vVector2.y * t;
    vClosestPoint.z = pWallLine.m_vStart.z + vVector2.z * t;


    d = Math.sqrt((x1 - vClosestPoint.x) * (x1 - vClosestPoint.x) +
      (y1 - vClosestPoint.y) * (y1 - vClosestPoint.y) +
      (z1 - vClosestPoint.z) * (z1 - vClosestPoint.z));


    if (d >= fDis) {
      ab.push(0);
      return ab;
    }

    ab.push(3);
    ab.push(vClosestPoint.x);
    ab.push(vClosestPoint.y);
    ab.push(vClosestPoint.z);

    return ab;
  }

  static ClosestPointOnLine1(sx: any, sy: any, ex: any, ey: any, x1: any, y1: any, fDis: any) {
    // 判断点是否在线段内
    const ab = [];
    if (Math.abs(x1 - sx) < fDis &&
      Math.abs(y1 - sy) < fDis) {
      ab.push(1);
      ab.push(sx);
      ab.push(sy);
      ab.push(0);
      return ab;
    }

    if (Math.abs(x1 - ex) < fDis &&
      Math.abs(y1 - ey) < fDis) {
      ab.push(2);
      ab.push(ex);
      ab.push(ey);
      ab.push(0);
      return ab;
    }

    const vVector1 = new Vector3(x1 - sx, y1 - sy, 0);
    const vVector2 = new Vector3(ex - sx, ey - sy, 0);

    vVector2.normalize();

    let d = Math.sqrt((ex - sx) * (ex - sx) + (ey - sy) * (ey - sy) + 0);

    const t = vVector2.dot(vVector1);
    if (t <= 0) {
      ab.push(0);
      return ab;
    }
    if (t >= d) 	// 判断是否在线段内
    {
      ab.push(0);
      return ab;
    }

    const vClosestPoint = new Vector3();
    vClosestPoint.x = sx + vVector2.x * t;
    vClosestPoint.y = sy + vVector2.y * t;
    vClosestPoint.z = 0 + vVector2.z * t;


    d = Math.sqrt((x1 - vClosestPoint.x) * (x1 - vClosestPoint.x) +
      (y1 - vClosestPoint.y) * (y1 - vClosestPoint.y) + 0);


    if (d >= fDis) {
      ab.push(0);
      return ab;
    }

    ab.push(3);
    ab.push(vClosestPoint.x);
    ab.push(vClosestPoint.y);
    ab.push(d);

    return ab;
  }

  static ClosestPointOnLine2(sx: any, sy: any, ex: any, ey: any, x1: any, y1: any, fDis: any) {
    // 判断点是否在直线上
    const ab = [];
    if (Math.abs(x1 - sx) < fDis &&
      Math.abs(y1 - sy) < fDis) {
      ab.push(1);
      ab.push(sx);
      ab.push(sy);
      ab.push(0);
      return ab;
    }

    if (Math.abs(x1 - ex) < fDis &&
      Math.abs(y1 - ey) < fDis) {
      ab.push(2);
      ab.push(ex);
      ab.push(ey);
      ab.push(0);
      return ab;
    }

    const vVector1 = new Vector3(x1 - sx, y1 - sy, 0);
    const vVector2 = new Vector3(ex - sx, ey - sy, 0);

    vVector2.normalize();

    let d = Math.sqrt((ex - sx) * (ex - sx) +
      (ey - sy) * (ey - sy) +
      0);

    const t = vVector2.dot(vVector1);

    const vClosestPoint = new Vector3();
    vClosestPoint.x = sx + vVector2.x * t;
    vClosestPoint.y = sy + vVector2.y * t;
    vClosestPoint.z = 0 + vVector2.z * t;


    d = Math.sqrt((x1 - vClosestPoint.x) * (x1 - vClosestPoint.x) +
      (y1 - vClosestPoint.y) * (y1 - vClosestPoint.y) + 0);


    if (d >= fDis) {
      ab.push(0);
      return ab;
    }

    ab.push(3);
    ab.push(vClosestPoint.x);
    ab.push(vClosestPoint.y);
    ab.push(d);

    return ab;
  }


  static GetLineRotate(sx: any, sy: any, ex: any, ey: any) {
    // 旋转角度
    let fRotate;
    const edge1 = new Vector3;
    edge1.x = ex - sx;
    edge1.y = ey - sy;
    edge1.z = 0;

    if (Math.abs(edge1.x) < 0.001)
      edge1.x = 0.0;
    if (Math.abs(edge1.y) < 0.001)
      edge1.y = 0.0;

    if (edge1.x == 0.0 && edge1.y == 0.0)
      fRotate = 0.0;
    else
      fRotate = Math.atan(edge1.y / edge1.x);

    return fRotate;
  }


  static IntersectedPlane(vPos1: any, vPos2: any, vPos3: any, testPos: any, fValue: any) {
    // 判断一个点在平面内
    const vec1 = new Vector3(vPos1.x, vPos1.y, vPos1.z);
    const vec2 = new Vector3(vPos2.x, vPos2.y, vPos2.z);
    const vec3 = new Vector3(vPos3.x, vPos3.y, vPos3.z);
    const a = ((vec2.y - vec1.y) * (vec3.z - vec1.z) - (vec2.z - vec1.z) * (vec3.y - vec1.y));
    const b = ((vec2.z - vec1.z) * (vec3.x - vec1.x) - (vec2.x - vec1.x) * (vec3.z - vec1.z));
    const c = ((vec2.x - vec1.x) * (vec3.y - vec1.y) - (vec2.y - vec1.y) * (vec3.x - vec1.x));
    const d = (0 - (a * vec1.x + b * vec1.y + c * vec1.z));

    const ftmp = Math.abs(a * testPos.x + b * testPos.y + c * testPos.z + d) / Math.sqrt(a * a + b * b + c * c);
    if (ftmp < fValue) //0.1
      return true;

    return false;
  }

  static GetAngleFromP4(p1: any, p2: any, p3: any, p4: any) {
    const vVector1 = new Vector3;
    const vVector2 = new Vector3;

    vVector1.x = p2.x - p1.x;
    vVector1.y = p2.y - p1.y;
    vVector1.z = p2.z - p1.z;

    vVector2.x = p4.x - p3.x;
    vVector2.y = p4.y - p3.y;
    vVector2.z = p4.z - p3.z;

    //	vVector1.normalize();
    vVector2.normalize();
    const t = vVector2.dot(vVector1);
    const t1 = Math.sqrt((vVector1.x * vVector1.x) + (vVector1.y * vVector1.y) + (vVector1.z * vVector1.z));
    const t2 = Math.sqrt((vVector2.x * vVector2.x) + (vVector2.y * vVector2.y) + (vVector2.z * vVector2.z));

    let fAngle = Math.acos(t / (t1 * t2)) * 180 / Math.PI;

    const dx1 = p2.x - p1.x;
    const dx2 = p4.x - p1.x;
    const dy1 = p2.y - p1.y;
    const dy2 = p4.y - p1.y;

    if (dx1 * dy2 - dy1 * dx2 >= 0) {
      fAngle = -fAngle;
    }
    return fAngle;
  }

  static OnCreateLine_In(tFloor: any, fValue: any) {
    // 生成外轮廓
    //=========================================================================================================
    let vVec2;
    //var fValue = -30;
    const tLineArray = [];
    let SegArray1 = this.GetStartAndEndPosFromWall1(tFloor.mPath[0], tFloor.mPath[1], tFloor.mFloorMesh, fValue);
    let SegArray2 = this.GetStartAndEndPosFromWall1(tFloor.mPath[tFloor.mPath.length - 1], tFloor.mPath[0], tFloor.mFloorMesh, fValue);

    let PosArray = this.Get2Line(SegArray1[0], SegArray1[1], SegArray2[0], SegArray2[1]);
    if (PosArray[0]) {
      vVec2 = new Vector3(PosArray[1], PosArray[2], 0);
      tLineArray.push(vVec2);
    }

    for (let i = 1; i < tFloor.mPath.length - 1; i++) {
      SegArray1 = this.GetStartAndEndPosFromWall1(tFloor.mPath[i - 1], tFloor.mPath[i], tFloor.mFloorMesh, fValue);
      SegArray2 = this.GetStartAndEndPosFromWall1(tFloor.mPath[i], tFloor.mPath[i + 1], tFloor.mFloorMesh, fValue);
      PosArray = this.Get2Line(SegArray1[0], SegArray1[1], SegArray2[0], SegArray2[1]);
      if (PosArray[0]) {
        const vVec1 = new Vector3(PosArray[1], PosArray[2], 0);
        tLineArray.push(vVec1);
      }
    }

    SegArray1 = this.GetStartAndEndPosFromWall1(tFloor.mPath[tFloor.mPath.length - 1], tFloor.mPath[0], tFloor.mFloorMesh, fValue);
    SegArray2 = this.GetStartAndEndPosFromWall1(tFloor.mPath[tFloor.mPath.length - 2], tFloor.mPath[tFloor.mPath.length - 1], tFloor.mFloorMesh, fValue);
    PosArray = this.Get2Line(SegArray1[0], SegArray1[1], SegArray2[0], SegArray2[1]);
    if (PosArray[0]) {
      const vVec1 = new Vector3(PosArray[1], PosArray[2], 0);
      tLineArray.push(vVec1);
    }

    tLineArray.push(vVec2);
    return tLineArray;
  }

  /**
   * @api GetStartAndEndPosFromWall1()
   * @apiGroup MathClass 
   * @apiName  0
   * @apiDescription 得到两点(Path数据)，在地面上离墙fDisWall距离的线 (类似波打线 )
   * @apiParam (参数) vStart   起点
   * @apiParam (参数) vEnd   	 终点
   * @apiParam (参数) tMesh   	 所在地面
   * @apiParam (参数) fDisWall 距离
   */

  static GetStartAndEndPosFromWall1(vStart: Vector3, vEnd: Vector3, tMesh: Mesh, fDisWall: any) {
    const vecMax = new Vector3(vEnd.x, vEnd.y, 0);
    const vecMin = new Vector3(vStart.x, vStart.y, 0);
    const vPos = new Vector3;
    vPos.x = (vecMax.x + vecMin.x) / 2;
    vPos.y = (vecMax.y + vecMin.y) / 2;
    vPos.z = (vecMax.z + vecMin.z) / 2;

    let fRotate = 0;
    const edge1 = new Vector3;
    edge1.x = vEnd.x - vStart.x;
    edge1.y = vEnd.y - vStart.y;

    if (Math.abs(edge1.x) < 0.001)
      edge1.x = 0.0;
    if (Math.abs(edge1.y) < 0.001)
      edge1.y = 0.0;

    if (edge1.x == 0.0 && edge1.y == 0.0)
      fRotate = 0.0;
    else
      fRotate = Math.atan(edge1.y / edge1.x);

    let tmpMatrix1 = new Matrix4().makeTranslation(-vPos.x, -vPos.y, 0);
    let tmpMatrix2 = new Matrix4().makeRotationZ(Math.PI / 2 + fRotate);		// 当前角度
    let tmpMatrix3 = new Matrix4().makeTranslation(vPos.x, vPos.y, 0);
    tmpMatrix2.multiply(tmpMatrix1);
    tmpMatrix3.multiply(tmpMatrix2);

    let vPos1 = new Vector3(vPos.x + fDisWall, vPos.y, 10);
    const vPos2 = vPos1.applyMatrix4(tmpMatrix3);
    const vNormal = new Vector3(0, 0, -1);
    const raycaster1 = new Raycaster(vPos2, vNormal);
    raycaster1.params.Line!.threshold = 3;

    // tMesh.geometry.computeFaceNormals();
    tMesh.geometry.computeVertexNormals();
    // tMesh.geometry.uvsNeedUpdate = true;
    // tMesh.geometry.normalsNeedUpdate = true;
    tMesh.geometry.computeBoundingSphere();
    tMesh.updateMatrixWorld();
    const Intersections = raycaster1.intersectObject(tMesh);

    if (Intersections.length <= 0) {
      fDisWall = -fDisWall;
    }

    tmpMatrix1 = new Matrix4().makeTranslation(-vStart.x, -vStart.y, 0);
    tmpMatrix2 = new Matrix4().makeRotationZ(Math.PI / 2 + fRotate);		// 当前角度
    tmpMatrix3 = new Matrix4().makeTranslation(vStart.x, vStart.y, 0);
    tmpMatrix2.multiply(tmpMatrix1);
    tmpMatrix3.multiply(tmpMatrix2);

    vPos1 = new Vector3(vStart.x + fDisWall, vStart.y, 0);
    const vPosStart = vPos1.applyMatrix4(tmpMatrix3);

    const tmpMatrix4 = new Matrix4().makeTranslation(-vEnd.x, -vEnd.y, 0);
    const tmpMatrix5 = new Matrix4().makeRotationZ(Math.PI / 2 + fRotate);
    const tmpMatrix6 = new Matrix4().makeTranslation(vEnd.x, vEnd.y, 0);
    tmpMatrix5.multiply(tmpMatrix4);
    tmpMatrix6.multiply(tmpMatrix5);

    vPos1 = new Vector3(vEnd.x + fDisWall, vEnd.y, 0);
    const vPosEnd = vPos1.applyMatrix4(tmpMatrix6);

    const OutArray = [];
    OutArray.push(vPosStart);
    OutArray.push(vPosEnd);
    return OutArray;
  }

  // MoXingWaDong(tObj: any, tDong: any) {
  //   if (tObj.m_Object3D.children.length == 0)	// 已经挖洞的墙体
  //     return;

  //   const tMesh1 = this.FormatMesh(tObj);
  //   const tMesh2 = this.FormatMeshBox(tDong);
  //   const tMeshBSP1 = new ThreeBSP(tMesh1);
  //   const tMeshBSP2 = new ThreeBSP(tMesh2);
  //   const resultBSP = tMeshBSP1.subtract(tMeshBSP2);
  //   const result = resultBSP.toMesh();

  //   if (result) {
  //     result.scale.set((tObj.m_fLength / tObj.m_fLengthOld) / 10,
  //       (tObj.m_fWidth / tObj.m_fWidthOld) / 10,
  //       (tObj.m_fHeight / tObj.m_fHeightOld) / 10);

  //     const tImage1 = tObj.m_Object3D.children[0].material.map.image.src;

  //     result.material = new THREE.MeshPhongMaterial();
  //     result.material.color.setRGB(0.5843137254901961, 0.5843137254901961, 0.5843137254901961);//0.5882352941176471
  //     result.material.map = new THREE.TextureLoader().load(tImage1);
  //     result.material.shininess = 48;
  //     result.material.specular.setRGB(0.8980392156862745, 0.8980392156862745, 0.8980392156862745);
  //     result.material.needsUpdate = true;
  //     tObj.ChangeMesh(result);
  //     //  	tObj.ShowEdges(tObj.m_iColor);

  //     /*		    result.material     = tObj.m_Object3D.children[0].material.clone();
  //             result.material.needsUpdate = true;
  //             tObj.ChangeMesh(result);*/
  //   }
  // }

  // FormatMesh(tObj) {
  //   //格式化MESH
  //   const tMaterial = new THREE.MeshBasicMaterial({ color: '#FFFF00', wireframe: true, transparent: true, opacity: 0.6 });
  //   const tGeometry = tObj.m_Object3D.children[0].geometry;

  //   let k = 0;
  //   const geom = new THREE.Geometry();
  //   for (let i = 0; i < tGeometry.attributes.position.count / 3; i++) {
  //     const x1 = tGeometry.attributes.position.array[i * 9 + 0];
  //     const y1 = tGeometry.attributes.position.array[i * 9 + 1];
  //     const z1 = tGeometry.attributes.position.array[i * 9 + 2];

  //     const x2 = tGeometry.attributes.position.array[i * 9 + 3];
  //     const y2 = tGeometry.attributes.position.array[i * 9 + 4];
  //     const z2 = tGeometry.attributes.position.array[i * 9 + 5];

  //     const x3 = tGeometry.attributes.position.array[i * 9 + 6];
  //     const y3 = tGeometry.attributes.position.array[i * 9 + 7];
  //     const z3 = tGeometry.attributes.position.array[i * 9 + 8];

  //     geom.vertices.push(new THREE.Vector3(x1, y1, z1));
  //     geom.vertices.push(new THREE.Vector3(x2, y2, z2));
  //     geom.vertices.push(new THREE.Vector3(x3, y3, z3));

  //     geom.faces.push(new THREE.Face3(k + 0, k + 1, k + 2));
  //     k = k + 3;
  //   }

  //   for (let i = 0; i < tGeometry.attributes.uv.length / 6; i++) {
  //     const u1 = tGeometry.attributes.uv.array[i * 6 + 0];
  //     const v1 = tGeometry.attributes.uv.array[i * 6 + 1];

  //     const u2 = tGeometry.attributes.uv.array[i * 6 + 2];
  //     const v2 = tGeometry.attributes.uv.array[i * 6 + 3];

  //     const u3 = tGeometry.attributes.uv.array[i * 6 + 4];
  //     const v3 = tGeometry.attributes.uv.array[i * 6 + 5];

  //     const t0 = new THREE.Vector2(u1, v1);
  //     const t1 = new THREE.Vector2(u2, v2);
  //     const t2 = new THREE.Vector2(u3, v3);

  //     uv1 = [t0, t1, t2];

  //     geom.faceVertexUvs[0].push(uv1);
  //   }
  //   geom.computeFaceNormals();
  //   geom.verticesNeedUpdate = true;
  //   geom.uvsNeedUpdate = true;
  //   const tMesh = new THREE.Mesh(geom, tMaterial);
  //   tMesh.scale.set((tObj.m_fLength / tObj.m_fLengthOld) / 10,
  //     (tObj.m_fWidth / tObj.m_fWidthOld) / 10,
  //     (tObj.m_fHeight / tObj.m_fHeightOld) / 10);
  //   tMesh.rotation.x = -Math.PI / 2;
  //   tMesh.rotation.z = tObj.m_fRotate * Math.PI / 180;
  //   tMesh.position.x = tObj.m_Object3D.position.x;
  //   tMesh.position.y = tObj.m_Object3D.position.y;
  //   tMesh.position.z = tObj.m_Object3D.position.z;

  //   return tMesh;
  // }

  // FormatMeshBox(tObj) {
  //   const tMaterial = new THREE.MeshBasicMaterial({ color: '#FFFF00', transparent: true, opacity: 0.6 });
  //   const geometrBox = new THREE.BoxGeometry(tObj.m_fLength, tObj.m_fWidth + 20, tObj.m_fHeight);

  //   const tMesh = new THREE.Mesh(geometrBox, tMaterial);

  //   const tmpMatrix4 = new THREE.Matrix4().makeScale((tObj.m_fLength / tObj.m_fLengthOld),
  //     ((tObj.m_fWidth + 20) / tObj.m_fWidthOld),
  //     (tObj.m_fHeight / tObj.m_fHeightOld));
  //   const tmpMatrix0 = new THREE.Matrix4().makeTranslation(0, 0, 0);
  //   const tmpMatrix1 = new THREE.Matrix4().makeRotationZ(tObj.m_fRotate);
  //   const tmpMatrix2 = new THREE.Matrix4().makeTranslation(tObj.m_Object.position.x, -tObj.m_Object.position.z, tObj.m_Object.position.y);
  //   const tmpMatrix3 = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
  //   //	tmpMatrix0.multiply(tmpMatrix4);
  //   tmpMatrix1.multiply(tmpMatrix0);
  //   tmpMatrix2.multiply(tmpMatrix1);
  //   tmpMatrix3.multiply(tmpMatrix2);

  //   tMesh.rotation.x = 0;
  //   tMesh.rotation.y = 0;
  //   tMesh.rotation.z = 0;
  //   tMesh.position.x = 0;
  //   tMesh.position.y = 0;
  //   tMesh.position.z = 0;
  //   tMesh.scale.x = 1;
  //   tMesh.scale.y = 1;
  //   tMesh.scale.z = 1;
  //   tMesh.matrixWorld.identity();
  //   tMesh.matrix.identity();
  //   tMesh.applyMatrix(tmpMatrix3);
  //   tMesh.updateMatrixWorld(true);
  //   return tMesh;
  // }

  // FormatMeshBox1(tObj) {
  //   let minX = 99999;
  //   let maxX = -99999;
  //   let minY = 99999;
  //   let maxY = -99999;
  //   let minZ = 99999;
  //   let maxZ = -99999;

  //   const tMaterial = new THREE.MeshBasicMaterial({ color: '#FFFF00', transparent: true, opacity: 0.6 });

  //   for (let i = 0; i < tObj.m_Object.children.length; i++) {
  //     tObj.m_Object.children[i].geometry.computeBoundingBox();
  //     const tGeometry1 = tObj.m_Object.children[i].geometry;
  //     const minVec = new THREE.Vector3(tGeometry1.boundingBox.min.x, tGeometry1.boundingBox.min.y, tGeometry1.boundingBox.min.z);
  //     const maxVec = new THREE.Vector3(tGeometry1.boundingBox.max.x, tGeometry1.boundingBox.max.y, tGeometry1.boundingBox.max.z);
  //     if (minVec.x < minX)
  //       minX = minVec.x;
  //     if (minVec.y < minY)
  //       minY = minVec.y;
  //     if (minVec.z < minZ)
  //       minZ = minVec.z;

  //     if (maxVec.x > maxX)
  //       maxX = maxVec.x;
  //     if (maxVec.y > maxY)
  //       maxY = maxVec.y;
  //     if (maxVec.z > maxZ)
  //       maxZ = maxVec.z;
  //   }

  //   const geom = new THREE.Geometry();
  //   geom.vertices.push(new THREE.Vector3(minX, maxY, minZ));	// 底面
  //   geom.vertices.push(new THREE.Vector3(minX, minY, minZ));
  //   geom.vertices.push(new THREE.Vector3(maxX, minY, minZ));
  //   geom.vertices.push(new THREE.Vector3(maxX, minY, minZ));
  //   geom.vertices.push(new THREE.Vector3(maxX, maxY, minZ));
  //   geom.vertices.push(new THREE.Vector3(minX, maxY, minZ));

  //   geom.vertices.push(new THREE.Vector3(minX, maxY, maxZ));	// 顶面		    			    
  //   geom.vertices.push(new THREE.Vector3(maxX, minY, maxZ));
  //   geom.vertices.push(new THREE.Vector3(minX, minY, maxZ));
  //   geom.vertices.push(new THREE.Vector3(maxX, minY, maxZ));
  //   geom.vertices.push(new THREE.Vector3(minX, maxY, maxZ));
  //   geom.vertices.push(new THREE.Vector3(maxX, maxY, maxZ));

  //   geom.vertices.push(new THREE.Vector3(minX, minY, minZ));	// 左面
  //   geom.vertices.push(new THREE.Vector3(minX, maxY, minZ));
  //   geom.vertices.push(new THREE.Vector3(minX, maxY, maxZ));
  //   geom.vertices.push(new THREE.Vector3(minX, maxY, maxZ));
  //   geom.vertices.push(new THREE.Vector3(minX, minY, maxZ));
  //   geom.vertices.push(new THREE.Vector3(minX, minY, minZ));

  //   geom.vertices.push(new THREE.Vector3(maxX, minY, minZ));	// 右面
  //   geom.vertices.push(new THREE.Vector3(maxX, maxY, maxZ));
  //   geom.vertices.push(new THREE.Vector3(maxX, maxY, minZ));
  //   geom.vertices.push(new THREE.Vector3(maxX, maxY, maxZ));
  //   geom.vertices.push(new THREE.Vector3(maxX, minY, minZ));
  //   geom.vertices.push(new THREE.Vector3(maxX, minY, maxZ));

  //   for (let i = 0; i < 24 / 3; i++) {
  //     geom.faces.push(new THREE.Face3(i * 3 + 0, i * 3 + 1, i * 3 + 2));
  //     geom.faceVertexUvs[0][i] = [new THREE.Vector2(0, 0), new THREE.Vector2(0, 0), new THREE.Vector2(0, 0)];
  //   }

  //   geom.computeFaceNormals();
  //   geom.verticesNeedUpdate = true;
  //   geom.uvsNeedUpdate = true;

  //   const tMesh = new THREE.Mesh(geom, tMaterial);

  //   const tmpMatrix4 = new THREE.Matrix4().makeScale((tObj.m_fLength / tObj.m_fLengthOld),
  //     ((tObj.m_fWidth + 20) / tObj.m_fWidthOld),
  //     (tObj.m_fHeight / tObj.m_fHeightOld));
  //   const tmpMatrix0 = new THREE.Matrix4().makeTranslation(0, 0, 0);
  //   const tmpMatrix1 = new THREE.Matrix4().makeRotationZ(tObj.m_fRotate);
  //   const tmpMatrix2 = new THREE.Matrix4().makeTranslation(tObj.m_Object.position.x, -tObj.m_Object.position.z, tObj.m_Object.position.y);
  //   const tmpMatrix3 = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
  //   tmpMatrix0.multiply(tmpMatrix4);
  //   tmpMatrix1.multiply(tmpMatrix0);
  //   tmpMatrix2.multiply(tmpMatrix1);
  //   tmpMatrix3.multiply(tmpMatrix2);

  //   tMesh.rotation.x = 0;
  //   tMesh.rotation.y = 0;
  //   tMesh.rotation.z = 0;
  //   tMesh.position.x = 0;
  //   tMesh.position.y = 0;
  //   tMesh.position.z = 0;
  //   tMesh.scale.x = 1;
  //   tMesh.scale.y = 1;
  //   tMesh.scale.z = 1;
  //   tMesh.matrixWorld.identity();
  //   tMesh.matrix.identity();
  //   tMesh.applyMatrix(tmpMatrix3);
  //   tMesh.updateMatrixWorld(true);
  //   return tMesh;
  // }
}