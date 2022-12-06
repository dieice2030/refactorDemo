import WallData from "./wallData";
import mHouseClass from '@/core/houseClass'
import { BufferAttribute, BufferGeometry, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, Shape, ShapeGeometry, Vector2, Vector3 } from "three";
import { MathClass } from '../../utils/math'

import * as martinez from 'martinez-polygon-clipping';
import { renderScene2D } from "../../renderScene2D";

export default class WallClass {
  mWallArray = <WallData[]>[]; // 墙体数组
  m_pCurWall?: WallData;
  mMouseX = 0;
  mMouseY = 0;
  mGeometry?: BufferGeometry;
  // mWall;
  // solution_paths;
  iMaxAreaFloor = 0;
  mRenderLine = <Line[]>[];	// 墙体2D渲染时显示的线条
  wallInsideMesh: Mesh<ShapeGeometry, MeshBasicMaterial> | null = null
  mRenderWallTop = []; 	// 墙体顶厚

  mHelpWall = null;		// 帮助墙体	

  m_WallLineArray?: BufferGeometry[]

  solution_paths: number[][][] | null = null

  OnAddWall(x1: number, y1: number, x2: number, y2: number) {
    const tWall = new WallData()
    tWall.OnInit(x1, y1, 0);
    tWall.m_vEnd.x = x2;
    tWall.m_vEnd.y = y2;
    tWall.OnRender();
    this.mWallArray.push(tWall)
  }

  OnUpdateAllWall() {
    if (this.mWallArray.length <= 0)	//是CAD线条方式、绘制情况
    {
      /*					this.OnClearLastWall();
            this.OnClearRenderLine();
            mHouseClass.OnClearWallTop();				// 墙顶厚度是个整体
            mHouseClass.mFloorClass.OnClear();	// 清空地面
            mHouseClass.mCeilingClass.OnClear();*/
      return;
    }

    this.OnClearLastWall();
    this.OnClearRenderLine();		// 清除轮廓线

    this.OnUpdateRenderWall();		// 重新绘制整个户型

    // mHouseClass.OnClearWallTop();
    // mHouseClass.mFloorClass.OnUpdateFloor(this.solution_paths, this.iMaxAreaFloor);
    mHouseClass.floorClass.OnUpdateFloor(this.solution_paths, 0)
    // mFloorCameraClass.OnUpdate(this.solution_paths, this.iMaxAreaFloor);			// 更新区域选择窗口显示内容

    // mHouseClass.BuildWallTop2D(this.solution_paths, this.iMaxAreaFloor);					// 墙厚顶
    // mHouseClass.mCeilingClass.OnUpdateCeiling(this.solution_paths, this.iMaxAreaFloor);			// 

    this.OnUpdateWallRenderLine();	// 得到每堵墙的最终形状
    this.RenderWallInside()

    // $("#mArea").text(mHouseClass.mFloorClass.ComputerArea());	//更新面积显示
  }

  OnUpdateRenderWall() {
    let fAngle = 0;
    let fAngleMax = -99999;
    let iIndex = 0;
    for (let i = 1; i < this.mWallArray.length; i++) {
      fAngleMax = -99999;

      // vEnd点判断相交
      for (let j = 0; j < this.mWallArray.length; j++) {
        if (this.mWallArray[i] == this.mWallArray[j]) // 相同墙体
          continue;

        // 相连接的两条线段
        if (MathClass.Vec_Equals(this.mWallArray[i].m_vEnd, this.mWallArray[j].m_vStart, 0.001) == true) {
          // 找到所有相关交夹角最大的线段
          fAngle = MathClass.dotProduct(this.mWallArray[j].m_vEnd, this.mWallArray[i].m_vEnd, this.mWallArray[i].m_vStart);
          if (fAngleMax < Math.abs(fAngle)) {
            fAngleMax = Math.abs(fAngle);
            iIndex = j;
          }
        }

        if (MathClass.Vec_Equals(this.mWallArray[i].m_vEnd, this.mWallArray[j].m_vEnd, 0.001) == true) {
          // 找到所有相关交夹角最大的线段
          fAngle = MathClass.dotProduct(this.mWallArray[j].m_vStart, this.mWallArray[i].m_vEnd, this.mWallArray[i].m_vStart);
          if (fAngleMax < Math.abs(fAngle)) {
            fAngleMax = Math.abs(fAngle);
            iIndex = j;
          }
        }
      }
      if (fAngleMax != -99999)
        this.BuildCorner(this.mWallArray[iIndex], this.mWallArray[i]);
    }

    for (let i = 0; i < this.mWallArray.length; i++) // m_vStart点判断相交
    {
      fAngleMax = -99999;
      for (let j = 0; j < this.mWallArray.length; j++) {
        if (this.mWallArray[i] == this.mWallArray[j])
          continue;

        if (MathClass.Vec_Equals(this.mWallArray[i].m_vStart, this.mWallArray[j].m_vStart, 0.001) == true) {
          fAngle = MathClass.dotProduct(this.mWallArray[j].m_vEnd, this.mWallArray[i].m_vStart, this.mWallArray[i].m_vEnd);
          if (fAngleMax < Math.abs(fAngle)) {
            fAngleMax = Math.abs(fAngle);
            iIndex = j;
          }
        }

        if (MathClass.Vec_Equals(this.mWallArray[i].m_vStart, this.mWallArray[j].m_vEnd, 0.001) == true) {
          fAngle = MathClass.dotProduct(this.mWallArray[j].m_vStart, this.mWallArray[i].m_vStart, this.mWallArray[i].m_vEnd);
          if (fAngleMax < Math.abs(fAngle)) {
            fAngleMax = Math.abs(fAngle);
            iIndex = j;
          }
        }
      }

      if (fAngleMax != -99999)
        this.BuildCorner(this.mWallArray[iIndex], this.mWallArray[i]);
    }

    this.OnRenderLine();	// 显示轮廓
  }

  BuildCorner(tWall1: WallData, tWall: WallData) {
    let iIndex = 0;
    const foff = 2; //
    if (MathClass.Vec_Equals(tWall.m_WallLineArray[0], tWall1.m_WallLineArray[0], foff) == true ||
      MathClass.Vec_Equals(tWall.m_WallLineArray[0], tWall1.m_WallLineArray[1], foff) == true ||
      MathClass.Vec_Equals(tWall.m_WallLineArray[0], tWall1.m_WallLineArray[2], foff) == true ||
      MathClass.Vec_Equals(tWall.m_WallLineArray[0], tWall1.m_WallLineArray[3], foff) == true) {
      iIndex++;
    }

    if (MathClass.Vec_Equals(tWall.m_WallLineArray[1], tWall1.m_WallLineArray[0], foff) == true ||
      MathClass.Vec_Equals(tWall.m_WallLineArray[1], tWall1.m_WallLineArray[1], foff) == true ||
      MathClass.Vec_Equals(tWall.m_WallLineArray[1], tWall1.m_WallLineArray[2], foff) == true ||
      MathClass.Vec_Equals(tWall.m_WallLineArray[1], tWall1.m_WallLineArray[3], foff) == true) {
      iIndex++;
    }

    if (MathClass.Vec_Equals(tWall.m_WallLineArray[2], tWall1.m_WallLineArray[0], foff) == true ||
      MathClass.Vec_Equals(tWall.m_WallLineArray[2], tWall1.m_WallLineArray[1], foff) == true ||
      MathClass.Vec_Equals(tWall.m_WallLineArray[2], tWall1.m_WallLineArray[2], foff) == true ||
      MathClass.Vec_Equals(tWall.m_WallLineArray[2], tWall1.m_WallLineArray[3], foff) == true) {
      iIndex++;
    }

    if (MathClass.Vec_Equals(tWall.m_WallLineArray[3], tWall1.m_WallLineArray[0], foff) == true ||
      MathClass.Vec_Equals(tWall.m_WallLineArray[3], tWall1.m_WallLineArray[1], foff) == true ||
      MathClass.Vec_Equals(tWall.m_WallLineArray[3], tWall1.m_WallLineArray[2], foff) == true ||
      MathClass.Vec_Equals(tWall.m_WallLineArray[3], tWall1.m_WallLineArray[3], foff) == true) {
      iIndex++;
    }

    if (iIndex >= 2)
      return;

    const tArray1 = MathClass.Get2Line(tWall.m_WallLineArray[0], tWall.m_WallLineArray[1], tWall1.m_WallLineArray[0], tWall1.m_WallLineArray[1]);
    const tArray2 = MathClass.Get2Line(tWall.m_WallLineArray[0], tWall.m_WallLineArray[1], tWall1.m_WallLineArray[2], tWall1.m_WallLineArray[3]);

    const tArray3 = MathClass.Get2Line(tWall.m_WallLineArray[2], tWall.m_WallLineArray[3], tWall1.m_WallLineArray[0], tWall1.m_WallLineArray[1]);
    const tArray4 = MathClass.Get2Line(tWall.m_WallLineArray[2], tWall.m_WallLineArray[3], tWall1.m_WallLineArray[2], tWall1.m_WallLineArray[3]);

    if (tArray1[0] == 0 && tArray2[0] == 0)
      return;

    const vPos3 = new Vector3(tArray3[1], tArray3[2], tArray3[3]);
    if (MathClass.Vec_Equals(tWall.m_WallLineArray[2], vPos3, 0.001) == true && MathClass.Vec_Equals(tWall.m_WallLineArray[3], vPos3, 0.001) == true) {
      iIndex++;
    }

    const vPos4 = new Vector3(tArray4[1], tArray4[2], tArray4[3]);
    if (MathClass.Vec_Equals(tWall.m_WallLineArray[2], vPos4, 0.001) == true && MathClass.Vec_Equals(tWall.m_WallLineArray[3], vPos4, 0.001) == true) {
      iIndex++;
    }

    if (iIndex >= 2)
      return;

    this.GetMaxLine(tWall, tArray1, tArray2, 0);
    this.GetMaxLine(tWall, tArray3, tArray4, 2);
  }

  GetMaxLine(tWall: WallData, tArray1: number[], tArray2: number[], iIndex: number) {
    const vPos = new Vector3(tArray1[1], tArray1[2], 0);
    const a = tWall.m_WallLineArray[0 + iIndex].distanceTo(vPos);
    const b = tWall.m_WallLineArray[1 + iIndex].distanceTo(vPos);

    const vPos1 = new Vector3(tArray2[1], tArray2[2], 0);
    const c = tWall.m_WallLineArray[0 + iIndex].distanceTo(vPos1);
    const d = tWall.m_WallLineArray[1 + iIndex].distanceTo(vPos1);

    if (a >= b && a >= c && a >= d) {
      tWall.m_LastLineArray[1 + iIndex].x = tArray1[1];
      tWall.m_LastLineArray[1 + iIndex].y = tArray1[2];
    }
    else if (b >= a && b >= c && b >= d) {
      tWall.m_LastLineArray[0 + iIndex].x = tArray1[1];
      tWall.m_LastLineArray[0 + iIndex].y = tArray1[2];
    }
    else if (c >= a && c >= b && c >= d) {
      tWall.m_LastLineArray[1 + iIndex].x = tArray2[1];
      tWall.m_LastLineArray[1 + iIndex].y = tArray2[2];
    }
    else {
      tWall.m_LastLineArray[0 + iIndex].x = tArray2[1];
      tWall.m_LastLineArray[0 + iIndex].y = tArray2[2];
    }
  }

  OnRenderLine() {
    // 墙体内外黑色轮廓线
    // this.solution_paths = null;

    if (this.mWallArray.length == 0)
      return;

    const firstLineArray = this.mWallArray[0].m_LastLineArray
    let paths = [firstLineArray?.map(item => ([Math.round(item.x * 10), Math.round(item.y * 10)]))]
    paths[0].push([Math.round(firstLineArray[0].x * 10), Math.round(firstLineArray[0].y * 10)])

    for (let i = 1; i < this.mWallArray.length; i += 1) {
      const lineArray = this.mWallArray[i].m_LastLineArray
      const paths2 = [lineArray?.map(item => ([Math.round(item.x * 10), Math.round(item.y * 10)]))]
      paths2[0].push([Math.round(lineArray[0].x * 10), Math.round(lineArray[0].y * 10)])
      const polygon = martinez.union(paths, paths2) as martinez.MultiPolygon
      paths = polygon[0]
    }
    // paths.map(path => path.map(item => {item[0] *= 1 / 10; item[1] *= 1 / 10}))
    this.solution_paths = paths

    // 生成所有的墙体线条
    for (let i = 0; i < paths.length; i++) {
      const vertices = []
      const result_poly = new BufferGeometry();
      for (let j = 0; j < paths[i].length; j++) {
        vertices.push(paths[i][j][0] / 10, paths[i][j][1]  / 10, 0.5)
      }
      vertices.push(paths[i][0][0] / 10, paths[i][0][1] / 10, 0.5)
      console.log(vertices)
      result_poly.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3))

      const result_wall = new Line(result_poly, new LineBasicMaterial({ color: 0x555555, linewidth: 1, opacity: 1 }));
      renderScene2D.scene.add(result_wall);
      this.mRenderLine.push(result_wall);
    }

    // this.GetMaxAreaCount();

    console.log(this.solution_paths);
  }

  OnUpdateWallRenderLine() {
    if (this.solution_paths == null)
      return;
    for (let k = 0; k < this.solution_paths.length; k++) {
      let j;
      for (j = 0; j < this.solution_paths[k].length - 1; j++) {
        const vCenter = new Vector3();
        vCenter.x = (this.solution_paths[k][j][0] / 10+ this.solution_paths[k][j + 1][0] / 10) / 2;
        vCenter.y = (this.solution_paths[k][j][1] / 10+ this.solution_paths[k][j + 1][1] / 10) / 2;
        vCenter.z = 0;

        for (let i = 0; i < this.mWallArray.length; i++) {
          // 判断到中心点的距离
          let ab = MathClass.ClosestPointOnLine1(this.mWallArray[i].m_LastLineArray[0].x,
            this.mWallArray[i].m_LastLineArray[0].y,
            this.mWallArray[i].m_LastLineArray[1].x,
            this.mWallArray[i].m_LastLineArray[1].y, vCenter.x, vCenter.y, 5);
          if (ab[0] == 3) {
            this.mWallArray[i].m_LastLineArray[0].x = this.solution_paths[k][j][0];
            this.mWallArray[i].m_LastLineArray[0].y = this.solution_paths[k][j][1];

            this.mWallArray[i].m_LastLineArray[1].x = this.solution_paths[k][j + 1][0];
            this.mWallArray[i].m_LastLineArray[1].y = this.solution_paths[k][j + 1][1];
            continue;
          }

          ab = MathClass.ClosestPointOnLine1(this.mWallArray[i].m_LastLineArray[2].x,
            this.mWallArray[i].m_LastLineArray[2].y,
            this.mWallArray[i].m_LastLineArray[3].x,
            this.mWallArray[i].m_LastLineArray[3].y, vCenter.x, vCenter.y, 5);
          if (ab[0] == 3) {
            this.mWallArray[i].m_LastLineArray[2].x = this.solution_paths[k][j][0];
            this.mWallArray[i].m_LastLineArray[2].y = this.solution_paths[k][j][1];

            this.mWallArray[i].m_LastLineArray[3].x = this.solution_paths[k][j + 1][0];
            this.mWallArray[i].m_LastLineArray[3].y = this.solution_paths[k][j + 1][1];
            continue;
          }
        }
      }

      //======================================================================================
      const vCenter = new Vector3();
      vCenter.x = (this.solution_paths[k][j - 1][0] + this.solution_paths[k][0][0]) / 2;
      vCenter.y = (this.solution_paths[k][j - 1][1] + this.solution_paths[k][0][1]) / 2;
      vCenter.z = 0;

      for (let i = 0; i < this.mWallArray.length; i++) {
        let ab = MathClass.ClosestPointOnLine1(this.mWallArray[i].m_LastLineArray[0].x,
          this.mWallArray[i].m_LastLineArray[0].y,
          this.mWallArray[i].m_LastLineArray[1].x,
          this.mWallArray[i].m_LastLineArray[1].y, vCenter.x, vCenter.y, 5);
        if (ab[0] == 3) {
          this.mWallArray[i].m_LastLineArray[0].x = this.solution_paths[k][j - 1][0];
          this.mWallArray[i].m_LastLineArray[0].y = this.solution_paths[k][j - 1][1];

          this.mWallArray[i].m_LastLineArray[1].x = this.solution_paths[k][0][0];
          this.mWallArray[i].m_LastLineArray[1].y = this.solution_paths[k][0][1];
          continue;
        }

        ab = MathClass.ClosestPointOnLine1(this.mWallArray[i].m_LastLineArray[2].x,
          this.mWallArray[i].m_LastLineArray[2].y,
          this.mWallArray[i].m_LastLineArray[3].x,
          this.mWallArray[i].m_LastLineArray[3].y, vCenter.x, vCenter.y, 5);
        if (ab[0] == 3) {
          this.mWallArray[i].m_LastLineArray[2].x = this.solution_paths[k][j - 1][0];
          this.mWallArray[i].m_LastLineArray[2].y = this.solution_paths[k][j - 1][1];

          this.mWallArray[i].m_LastLineArray[3].x = this.solution_paths[k][0][0];
          this.mWallArray[i].m_LastLineArray[3].y = this.solution_paths[k][0][1];
          continue;
        }
      }
    }

    for (let i = 0; i < this.mWallArray.length; i++) {
      const tWall = this.mWallArray[i];
      const fLength1 = Math.sqrt((tWall.m_LastLineArray[2].x - tWall.m_LastLineArray[1].x) * (tWall.m_LastLineArray[2].x - tWall.m_LastLineArray[1].x)
        + (tWall.m_LastLineArray[2].y - tWall.m_LastLineArray[1].y) * (tWall.m_LastLineArray[2].y - tWall.m_LastLineArray[1].y)
        + 0);

      const fLength2 = Math.sqrt((tWall.m_LastLineArray[3].x - tWall.m_LastLineArray[1].x) * (tWall.m_LastLineArray[3].x - tWall.m_LastLineArray[1].x)
        + (tWall.m_LastLineArray[3].y - tWall.m_LastLineArray[1].y) * (tWall.m_LastLineArray[3].y - tWall.m_LastLineArray[1].y)
        + 0);

      if (fLength1 > fLength2) {
        const x1 = tWall.m_LastLineArray[3].x;
        const y1 = tWall.m_LastLineArray[3].y;

        tWall.m_LastLineArray[3].x = tWall.m_LastLineArray[2].x;
        tWall.m_LastLineArray[3].y = tWall.m_LastLineArray[2].y;

        tWall.m_LastLineArray[2].x = x1;
        tWall.m_LastLineArray[2].y = y1;
      }
    }
  }

  /**
 * @api OnClearLastWall
 * @apiDescription 清空2D线框
 * @apiGroup WallClass
 *                           
 */
  OnClearLastWall() {
    // 清空线框
    for (let i = 0; i < this.mWallArray.length; i++) {
      this.mWallArray[i].OnUpdate();
      this.mWallArray[i].m_LastLineArray[0].x = this.mWallArray[i].m_WallLineArray[0].x;
      this.mWallArray[i].m_LastLineArray[0].y = this.mWallArray[i].m_WallLineArray[0].y;
      this.mWallArray[i].m_LastLineArray[1].x = this.mWallArray[i].m_WallLineArray[1].x;
      this.mWallArray[i].m_LastLineArray[1].y = this.mWallArray[i].m_WallLineArray[1].y;
      this.mWallArray[i].m_LastLineArray[2].x = this.mWallArray[i].m_WallLineArray[2].x;
      this.mWallArray[i].m_LastLineArray[2].y = this.mWallArray[i].m_WallLineArray[2].y;
      this.mWallArray[i].m_LastLineArray[3].x = this.mWallArray[i].m_WallLineArray[3].x;
      this.mWallArray[i].m_LastLineArray[3].y = this.mWallArray[i].m_WallLineArray[3].y;
    }
  }

  OnClearRenderLine() {
    //删除黑色轮廓线 
    for (let k = 0; k < this.mRenderLine.length; k++)
      renderScene2D.scene.remove(this.mRenderLine[k]);
    this.mRenderLine.length = 0;
  }

  RenderWallInside() {
    if (!this.solution_paths) return
    const shape = new Shape(this.solution_paths[0].map(item => (new Vector2(item[0] / 10, item[1] / 10))))
    for (let i = 1; i < this.solution_paths.length; i++) {
      const hole = this.solution_paths[i].map(item => (new Vector2(item[0] / 10, item[1] / 10)))
      shape.holes.push(new Shape(hole))
    }

    const geometry = new ShapeGeometry(shape)
    const mat = new MeshBasicMaterial({ color: 0xAAAAAA })
    const mesh = new Mesh(geometry, mat)
    this.wallInsideMesh = mesh
    renderScene2D.scene.add(mesh)
  }

  OnClear() {
    for (let i = 0; i < this.mWallArray.length; i++)
      this.mWallArray[i].OnClear();
    this.OnClearRenderLine()
    renderScene2D.scene.remove(this.wallInsideMesh)
    this.mWallArray.length = 0;
    this.mRenderLine.length = 0;
    this.solution_paths = null;
    this.wallInsideMesh = null;
  }

  /**
 * @api DrawWall
 * @apiDescription 鼠标连续绘制墙体
 * @apiGroup WallClass
 * @apiParam (参数) mouseX 鼠标X坐标
 * @apiParam (参数) mouseY 鼠标Y坐标
 * @apiParam (参数) iType  0 墙中线方式绘制，1内墙线方式绘制，2外墙线方式绘制
 * 
 */
  DrawWall(mouseX: number, mouseY: number, iType: number) {
    if (this.m_pCurWall == null) {
      const ab = this.OnMouseMove(mouseX, mouseY);
      if (ab[0] == 0) {
        this.OnBuildNewWall(mouseX, mouseY, iType)
      } else {
        this.OnBuildNewWall(this.mMouseX, this.mMouseY, iType)
      }
    }
    else {
      this.m_pCurWall.mWall.visible = false
      let ab = this.CheckPosOnLine(this.m_pCurWall.m_vEnd.x, this.m_pCurWall.m_vEnd.y);
      console.log(ab);
      if (ab[0] == 1 || ab[0] == 2)	// 顶点
      {
        this.m_pCurWall.m_vEnd.x = ab[1];
        this.m_pCurWall.m_vEnd.y = ab[2];
      }
      else if (ab[0] == 3) 	// 点在线上
      {
        this.m_pCurWall.m_vEnd.x = ab[1];
        this.m_pCurWall.m_vEnd.y = ab[2];

        // // 旋转5度
        // if (app.attributeInterface.wall.zhengjiao == false)
        //   MathClass.RotateVecFromAxis(this.m_pCurWall.m_vEnd, this.m_pCurWall.m_vStart, 5);
        // else
        const {x, y} = MathClass.RotateVecFromAxis(this.m_pCurWall.m_vEnd, this.m_pCurWall.m_vStart, 90);
        this.m_pCurWall.m_vEnd.x = x;
        this.m_pCurWall.m_vEnd.y = y;
      }

      const d = this.m_pCurWall.m_vStart.distanceTo(this.m_pCurWall.m_vEnd);	// 两个点距离太近 ，不创建墙体
      if (d < 2)
        return;

      this.mWallArray.push(this.m_pCurWall);	// 增加这段墙

      // 判断**终点**是否需要打断原有墙体	
      if (iType == 0) {
        if (ab[0] == 3) {
          const tWall = this.mWallArray[ab[4]];
          const tWall1 = new WallData();
          const tWall2 = new WallData();
          tWall1.OnInit(tWall.m_vStart.x, tWall.m_vStart.y, tWall.m_iType);
          tWall1.m_vEnd.x = this.m_pCurWall.m_vEnd.x;
          tWall1.m_vEnd.y = this.m_pCurWall.m_vEnd.y;
          tWall1.m_fWidth = tWall.m_fWidth;
          tWall2.OnInit(tWall.m_vEnd.x, tWall.m_vEnd.y, tWall.m_iType);
          tWall2.m_vStart.x = this.m_pCurWall.m_vEnd.x;
          tWall2.m_vStart.y = this.m_pCurWall.m_vEnd.y;
          tWall2.m_fWidth = tWall.m_fWidth;
          this.mWallArray.push(tWall1);	// 增加打断的两面墙
          this.mWallArray.push(tWall2);
          tWall1.OnRender();
          tWall2.OnRender();
          this.OnDelete(tWall); 				// 删除原来的墙体
        }

        // 判断**起点**是否打断原有墙体
        ab = this.CheckPosOnLine(this.m_pCurWall.m_vStart.x, this.m_pCurWall.m_vStart.y);
        if (ab[0] == 3) {
          const tWall = this.mWallArray[ab[4]];
          const tWall1 = new WallData();
          const tWall2 = new WallData();
          tWall1.OnInit(tWall.m_vStart.x, tWall.m_vStart.y, tWall.m_iType);
          tWall1.m_vEnd.x = this.m_pCurWall.m_vStart.x;
          tWall1.m_vEnd.y = this.m_pCurWall.m_vStart.y;
          tWall1.m_fWidth = tWall.m_fWidth;
          tWall2.OnInit(tWall.m_vEnd.x, tWall.m_vEnd.y, tWall.m_iType);
          tWall2.m_vStart.x = this.m_pCurWall.m_vStart.x;
          tWall2.m_vStart.y = this.m_pCurWall.m_vStart.y;
          tWall2.m_fWidth = tWall.m_fWidth;
          this.mWallArray.push(tWall1);	// 增加打断的两面墙
          this.mWallArray.push(tWall2);
          tWall1.OnRender();
          tWall2.OnRender();
          this.OnDelete(tWall); 				// 删除原来的墙体					
        }
      }
      // for (const i = 0; i < this.mWallArray.length; i++)	//关闭辅助信息
      //   this.mWallArray[i].OnShow(false);

      this.OnUpdateAllWall();		// 重新绘制整个户型

      this.OnBuildNewWall(this.m_pCurWall.m_vEnd.x, this.m_pCurWall.m_vEnd.y, iType);		// 新墙

      // mHouseClass.mHistory.Store();
    }
  }

  /**
 * @api OnMouseMove(mouseX,mouseY,buttonDown)
 * @apiDescription 鼠标连续绘制墙体时的移动操作
 * @apiGroup WallClass
 * @apiParam (参数) mouseX 鼠标X坐标
 * @apiParam (参数) mouseY 鼠标Y坐标
 * @apiParam (参数) buttonDown  鼠标按键状态
 * 
 */
  OnMouseMove(mouseX: number, mouseY: number) {
    let ab = [];
    ab.push(0);
    // 创建时移动墙体
    if (this.m_pCurWall) {
      this.m_pCurWall.m_vEnd.x = mouseX;
      this.m_pCurWall.m_vEnd.y = mouseY;
      // if (this.m_pCurWall.m_vStart.distanceTo(this.m_pCurWall.m_vEnd) > this.m_pCurWall.m_fWidth / 2) {
      //   if (true == this.CheckXYPos1(this.m_pCurWall))	//XY轴对齐
      //   {
      //     mHelpClass.mHelpCoss.position.x = this.mMouseX;
      //     mHelpClass.mHelpCoss.position.y = this.mMouseY;
      //   }
      //   else {
      //     mHelpClass.mHelpCoss.position.x = -999999;
      //     mHelpClass.mHelpCoss.position.y = -999999;
      //     mHelpClass.OnHidePosAll();
      //   }
      //   this.CheckWallPos();
      // }
      this.m_pCurWall.mWall.visible = true
      this.m_pCurWall.OnRender();			// 绘制临时墙体

      this.mMouseX = this.m_pCurWall.m_vEnd.x;
      this.mMouseY = this.m_pCurWall.m_vEnd.y;
    }
    else {
      // 创建墙体，还未画墙时
      this.mMouseX = mouseX;
      this.mMouseY = mouseY;
      for (let i = 0; i < this.mWallArray.length; i++) {
        // if (app.attributeInterface.wall.xifu == false)// 无吸附
        //   break;

        if (this.mWallArray[i].m_iType == 0)// 墙中线移动
        {
          ab = MathClass.ClosestPointOnLine(this.mWallArray[i], mouseX, mouseY, 0, this.mWallArray[i].m_fWidth / 2);
          if (ab[0] != 0)
            break;
        }
        else // 墙边线移动
        {
          ab = MathClass.ClosestPointOnLine1(this.mWallArray[i].m_LastLineArray[0].x,
            this.mWallArray[i].m_LastLineArray[0].y,
            this.mWallArray[i].m_LastLineArray[1].x,
            this.mWallArray[i].m_LastLineArray[1].y,
            mouseX, mouseY, this.mWallArray[i].m_fWidth / 2);
          if (ab[0] != 0)
            break;

          ab = MathClass.ClosestPointOnLine1(this.mWallArray[i].m_LastLineArray[2].x,
            this.mWallArray[i].m_LastLineArray[2].y,
            this.mWallArray[i].m_LastLineArray[3].x,
            this.mWallArray[i].m_LastLineArray[3].y,
            mouseX, mouseY, this.mWallArray[i].m_fWidth / 2);
          if (ab[0] != 0)
            break;
        }
      }

      if (ab[0] != 0) {
        this.mMouseX = ab[1];
        this.mMouseY = ab[2];
        // mHelpClass.mHelpCoss.position.x = this.mMouseX;
        // mHelpClass.mHelpCoss.position.y = this.mMouseY;
        // mHelpClass.mHelpWallPos1.position.x = this.mMouseX;
        // mHelpClass.mHelpWallPos1.position.y = this.mMouseY;
      }
      else {
        // mHelpClass.mHelpCoss.position.x = -999999;
        // mHelpClass.mHelpCoss.position.y = -999999;
        // mHelpClass.OnHidePosAll();
      }
    }

    return ab;
  }

  /**
 * @api OnBuildNewWall(mouseX,mouseY,iType)
 * @apiDescription 创建新的墙体
 * @apiGroup WallClass
 * @apiParam (参数) mouseX 鼠标X坐标
 * @apiParam (参数) mouseY 鼠标Y坐标
 * @apiParam (参数) iType  0 墙中线方式绘制，1内墙线方式绘制，2外墙线方式绘制
 * 
 */
  OnBuildNewWall(mouseX: number, mouseY: number, iType: number) {
    const ab = this.CheckPosOnLine(mouseX, mouseY);
    if (ab[0] == 1 || ab[0] == 2 || ab[0] == 3) {
      this.mMouseX = ab[1];
      this.mMouseY = ab[2];
    }
    else {
      this.mMouseX = mouseX;
      this.mMouseY = mouseY;
    }
    this.m_pCurWall = new WallData();
    this.m_pCurWall.OnInit(this.mMouseX, this.mMouseY, iType);
  }

  /**
 * @api CheckPosOnLine(posX,posY)
 * @apiDescription 判断当前点是否在已有墙体上
 * @apiGroup WallClass
 * @apiParam (参数) posX 鼠标X坐标
 * @apiParam (参数) posY 鼠标Y坐标
 * @apiParam (返回) Array 返回数组,Array[0]=0 点没在墙体上，
 * 								Array[0]=1,或2 在墙体的端点上,	 
 * 								Array[0]=3 在墙体有交点，Array[1-3]的值为交点 x,y,z的值
 */
  CheckPosOnLine(posX: number, posY: number) {
    const ab1 = [];
    ab1.push(0);
    for (let i = 0; i < this.mWallArray.length; i++) {
      // if (app.attributeInterface.wall.xifu == false)		// 无吸附
      //   break;
      const ab = MathClass.ClosestPointOnLine(this.mWallArray[i], posX, posY, 0, this.mWallArray[i].m_fWidth / 2);
      if (ab[0] != 0) {
        ab.push(i);
        return ab;
      }
    }
    return ab1;
  }

  /**
 * @api OnDelete
 * @apiDescription 删除指定的墙体
 * @apiGroup WallClass
 * @apiParam (参数) tWall 指定墙体
 * 
 */
  OnDelete(tWall: WallData) {
    tWall.OnClear();
    const iIndex = this.mWallArray.indexOf(tWall);
    if (iIndex == -1)
      return;
    this.mWallArray.splice(iIndex, 1);
    renderScene2D.scene.remove(this.mHelpWall);		// 帮助墙体

    //  mHouseClass.mHistory.Store();
  }
}
