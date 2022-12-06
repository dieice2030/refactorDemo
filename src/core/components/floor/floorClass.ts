import { Vector3 } from "three";
import FloorData from "./floorData";
import mHouseClass from '@/core/houseClass'

/**
 * @api FloorClass
 * @apiGroup FloorClass
 * @apiName  0
 * @apiDescription 地面操作类
 * @apiParam (成员变量) m_OBBox_Max 包围盒
 * @apiParam (成员变量) m_OBBox_Min 包围盒
 * @apiParam (成员变量) mFloorArray 房间地面数组
 * @apiParam (成员变量) m_pCurFloor 当前地面
 * @apiParam (成员变量) mLabelH 总长度尺寸标注
 * @apiParam (成员变量) mLabelV 总宽度尺寸标注
 */
export default class FloorClass {
  // 地面区域
  m_OBBox_Max = new Vector3();		// 户型包围盒
  m_OBBox_Min = new Vector3();
  mFloorArray = <FloorData[]>[];
  m_pCurFloor: null | FloorData = null;

  mLabelH: any;		// 标注尺寸线
  mLabelV: any;		// 标注尺寸线

  /**
   * @api OnInit
   * @apiDescription 初始化函数
   * @apiGroup FloorClass
   *                         
   */
  // OnInit() {
  //   this.mLabelH = new LabelClass();		//  包围盒长宽
  //   this.mLabelH.OnInit(0x363636);
  //   this.mLabelV = new LabelClass();
  //   this.mLabelV.OnInit(0x363636);
  // };


  // /**
  //  * @api ComputerArea
  //  * @apiDescription 计算套内面积(地面面积)
  //  * @apiGroup FloorClass
  //  *                         
  //  */
  // this.ComputerArea = function () {
  //   let fArea = 0;
  //   for (i = 0; i < this.mFloorArray.length; i++)
  //     fArea += this.mFloorArray[i].mfArea;

  //   fArea = fArea / 20000;
  //   return fArea.toFixed(2);
  // };


  /**
   * @api OnClear
   * @apiDescription 清空
   * @apiGroup FloorClass
   *                         
   */
  OnClear() {
    for (let i = 0; i < this.mFloorArray.length; i++)
      this.mFloorArray[i].OnClear();
    this.mFloorArray.length = 0;

    // this.mLabelV.mLabel.visible = false;		// 户型总长宽尺寸显示
    // if (this.mLabelV.mText)
    //   this.mLabelV.mText.visible = false;
    // this.mLabelH.mLabel.visible = false;
    // if (this.mLabelH.mText)
    //   this.mLabelH.mText.visible = false;

    this.m_OBBox_Max.x = -99999;
    this.m_OBBox_Max.y = -99999;
    this.m_OBBox_Min.x = 99999;
    this.m_OBBox_Min.y = 99999;
    this.m_pCurFloor = null;
  }


  /**
   * @api OnUpdateFloor
   * @apiDescription 更新地面
   * 				   1. 如果新地面区域中心点与老地面区域中心点一致，且面积相同， 保留老地面区域
   * 				   2. 否则使用新区域且材质初始化
   * 				   3. 如果是新区域更新标注
   * @apiGroup FloorClass
   * @apiParam (参数) solution_paths 地面轮廓数据
   * @apiParam (参数) iMaxAreaFloor  最外侧轮廓
   */
  OnUpdateFloor (solution_paths: any, iMaxAreaFloor = 0) {
    if (solution_paths == null)
      return;

    // this.mLabelH.OnShowLabel(false);
    // this.mLabelV.OnShowLabel(false);

    // for (let k = 0; k < this.mFloorArray.length; k++)		// 准备比较所有墙线
    //   this.mFloorArray[k].bUpdate = true;

    for (let j = 0; j < solution_paths.length; j++) {
      if (j == iMaxAreaFloor)	// 去掉外轮廓,且不是内墙线
        continue;

      this.m_pCurFloor = new FloorData();
      this.m_pCurFloor.OnBuildFloor(solution_paths[j], 0);
      
      for (let i = 0; i < this.mFloorArray.length; i++) {
        if (true == this.mFloorArray[i].IsSameAs(this.m_pCurFloor))	//   判断是否相同
        {
          this.mFloorArray[i].bUpdate = false;	// 不更新地面
          this.m_pCurFloor.OnClear();
          this.m_pCurFloor = null;
          break;
        }
      }
      if (this.m_pCurFloor)
        this.mFloorArray.push(this.m_pCurFloor);
    }
    this.m_pCurFloor = null;

    // 清除不用的地面
    // for (let k = 0; k < this.mFloorArray.length; k++) {
    //   if (this.mFloorArray[k].bUpdate == true && mHouseClass.mGroundClass.FindGround(this.mFloorArray[k]) == null) {
    //     this.mFloorArray[k].OnClear();
    //     this.mFloorArray.splice(k, 1);
    //     k = -1;
    //   }
    // }

    this.OnUpdateBox(solution_paths, iMaxAreaFloor);	// 整个户型的BBOX
    // this.OnUpdateLabel();								// 户型总尺寸			
  }

  /**
   * @api OnUpdateBox()
   * @apiGroup FloorClass 
   * @apiName  0
   * @apiDescription 更新总包围盒
   * @apiParam (参数) solution_paths 地面轮廓数据
   * @apiParam (参数) iMaxAreaFloor  最外侧轮廓
   */
  OnUpdateBox(solution_paths: any, iMaxAreaFloor = 0) {
    if (solution_paths == null)
      return;

    this.m_OBBox_Max.x = -99999;
    this.m_OBBox_Max.y = -99999;
    this.m_OBBox_Min.x = 99999;
    this.m_OBBox_Min.y = 99999;
    for (let i = 0; i < solution_paths.length; i++) {
      if (i == iMaxAreaFloor)
        continue;

      for (let j = 0; j < solution_paths[i].length; j++) {
        if (iMaxAreaFloor != -99) {
          if (this.m_OBBox_Max.x < solution_paths[i][j].X) this.m_OBBox_Max.x = solution_paths[i][j].X;
          if (this.m_OBBox_Max.y < solution_paths[i][j].Y) this.m_OBBox_Max.y = solution_paths[i][j].Y;
          if (this.m_OBBox_Min.x > solution_paths[i][j].X) this.m_OBBox_Min.x = solution_paths[i][j].X;
          if (this.m_OBBox_Min.y > solution_paths[i][j].Y) this.m_OBBox_Min.y = solution_paths[i][j].Y;
        }
        else {
          if (this.m_OBBox_Max.x < solution_paths[i][j].x) this.m_OBBox_Max.x = solution_paths[i][j].x;
          if (this.m_OBBox_Max.y < solution_paths[i][j].y) this.m_OBBox_Max.y = solution_paths[i][j].y;
          if (this.m_OBBox_Min.x > solution_paths[i][j].x) this.m_OBBox_Min.x = solution_paths[i][j].x;
          if (this.m_OBBox_Min.y > solution_paths[i][j].y) this.m_OBBox_Min.y = solution_paths[i][j].y;
        }
      }
    }
  }

  // // 显示房间内部尺寸 + 总尺寸
  /**
  //  * @api OnUpdateBox()
  //  * @apiGroup FloorClass 
  //  * @apiName  0
  //  * @apiDescription 更新总包围盒
  //  */
  // OnUpdateLabel() {
  //   if (this.m_OBBox_Max.x == -99999)
  //     return;

  //   const off = 190; // 偏移高度		
  //   const vStartH = new THREE.Vector3(this.m_OBBox_Min.x, this.m_OBBox_Max.y + off, 0);
  //   const vEndH = new THREE.Vector3(this.m_OBBox_Max.x, this.m_OBBox_Max.y + off, 0);
  //   // this.mLabelH.OnUpdateLabel_3(vStartH, vEndH);
  //   // this.mLabelH.OnShowLabel(true);

  //   const vStartV = new THREE.Vector3(this.m_OBBox_Max.x + off, this.m_OBBox_Max.y, 0);
  //   const vEndV = new THREE.Vector3(this.m_OBBox_Max.x + off, this.m_OBBox_Min.y, 0);
  //   // this.mLabelV.OnUpdateLabel_3(vStartV, vEndV);
  //   // this.mLabelV.OnShowLabel(true);
  // }

  // /**
  //  * @api OnMouseRightUp2D
  //  * @apiDescription 鼠标右键
  //  * @apiGroup FloorClass
  //  *                         
  //  */
  // this.OnMouseRightUp2D = function () {
  //   this.m_pCurFloor = null;
  // };

  // /**
  //  * @api OnPick3D
  //  * @apiDescription 3D下拾取地面
  //  * @apiGroup FloorClass
  //  * @apiParam (参数) mouseX 鼠标X值
  //  * @apiParam (参数) mouseY 鼠标Y值
  //  */
  // this.OnPick3D = function (mouseX, mouseY) {
  //   let tFloor = null;
  //   let tDis = 99999;
  //   mHelpClass.ClearOutline();
  //   for (let j = 0; j < this.mFloorArray.length; j++) {
  //     const Intersections = raycaster.intersectObject(this.mFloorArray[j].mFloorMesh3D);
  //     if (Intersections.length >= 1) {
  //       if (tDis > Intersections[0].distance) {
  //         tDis = Intersections[0].distance;
  //         tFloor = this.mFloorArray[j];
  //       }
  //     }
  //   }

  //   if (tFloor != null) {
  //     this.m_pCurFloor = tFloor;
  //     mHelpClass.ShowOutLine_Floor3D(tFloor);	// 显示地面选择区域
  //     return tFloor;
  //   }
  //   return null;
  // };


  // this.GetFloor3DByXY = function (x1, y1) {
  //   let tFloor = null;
  //   const vecA = new THREE.Vector3(x1, y1, 10);	// 10 高 5宽		 
  //   const vNormal = new THREE.Vector3(0, 0, -1);
  //   const rayA = new THREE.Raycaster(vecA, vNormal);
  //   rayA.linePrecision = 3;


  //   for (let j = 0; j < this.mFloorArray.length; j++) {
  //     const IntersectionA = rayA.intersectObject(this.mFloorArray[j].mFloorMesh3D);
  //     if (IntersectionA.length >= 1) {
  //       tFloor = this.mFloorArray[j];
  //       return tFloor;
  //     }
  //   }

  //   return tFloor;
  // }

  // this.GetFloor2DByXY = function (x1, y1) {
  //   let tFloor = null;
  //   const vecA = new THREE.Vector3(x1, y1, 10);	// 10 高 5宽		 
  //   const vNormal = new THREE.Vector3(0, 0, -1);
  //   const rayA = new THREE.Raycaster(vecA, vNormal);
  //   rayA.linePrecision = 3;
  //   for (let j = 0; j < this.mFloorArray.length; j++) {
  //     const IntersectionA = rayA.intersectObject(this.mFloorArray[j].mFloorMesh);
  //     if (IntersectionA.length >= 1) {
  //       tFloor = this.mFloorArray[j];
  //       return tFloor;
  //     }
  //   }

  //   return tFloor;
  // }

  // /**
  //  * @api OnPick2D
  //  * @apiDescription 2D下拾取地面
  //  * @apiGroup FloorClass
  //  * @apiParam (参数) mouseX 鼠标X值
  //  * @apiParam (参数) mouseY 鼠标Y值
  //  */
  // this.OnPick2D = function (mouseX, mouseY) {
  //   let tFloor = null;
  //   let tDis = -99999;
  //   mHelpClass.ClearOutline();
  //   for (j = 0; j < this.mFloorArray.length; j++) {
  //     var Intersections;
  //     if (this.mFloorArray[j].mFloorMesh.visible == true)
  //       Intersections = raycaster.intersectObject(this.mFloorArray[j].mFloorMesh);
  //     else
  //       Intersections = raycaster.intersectObject(this.mFloorArray[j].mFloorMeshSVG);
  //     if (Intersections.length >= 1) {
  //       if (tDis < this.mFloorArray[j].mfLayer) {
  //         tDis = this.mFloorArray[j].mfLayer;
  //         tFloor = this.mFloorArray[j];
  //       }
  //     }
  //   }

  //   if (tFloor != null) {
  //     this.m_pCurFloor = tFloor;
  //     mHelpClass.ShowOutLine_Floor2D(tFloor);	// 显示地面选择区域
  //     this.m_pCurFloor.OnShowLabel(false);	// 是否显示尺寸
  //     return tFloor;
  //   }
  //   return null;
  // };

  // /**
  //  * @api OnPick2D_Quick
  //  * @apiDescription 2D下拾取地面，不检测排序
  //  * @apiGroup FloorClass
  //  * @apiParam (参数) mouseX 鼠标X值
  //  * @apiParam (参数) mouseY 鼠标Y值
  //  */
  // this.OnPick2D_Quick = function (mouseX, mouseY) {
  //   let tFloor = null;
  //   for (j = 0; j < this.mFloorArray.length; j++) {
  //     const Intersections = raycaster.intersectObject(this.mFloorArray[j].mFloorMesh);
  //     if (Intersections.length >= 1) {
  //       tFloor = this.mFloorArray[j];
  //       return tFloor;
  //     }
  //   }
  //   return null;
  // };

  // // 循环所有地面轮廓,拾取标注
  // this.OnPick2D_Label = function (mouseX, mouseY) {
  //   for (j = 0; j < this.mFloorArray.length; j++) {
  //     const ret = this.mFloorArray[j].OnPick2D_Label(mouseX, mouseY);
  //     if (ret != null)
  //       return ret;
  //   }
  //   return null;
  // };


  // /**
  //  * @api CreateFloor
  //  * @apiDescription 创建地面区域
  //  * @apiGroup FloorClass
  //  * @apiParam (参数) itype 类型
  //  */
  // this.CreateFloor = function (itype) {
  //   if (itype == 0)
  //     m_cPenType = 4;
  // };

  // // 绘制矩形区域
  // this.DrawFloorRect = function (mouseX, mouseY) {
  //   const clip_paths = [[{ X: mouseX - 100, Y: mouseY - 100 },
  //   { X: mouseX + 100, Y: mouseY - 100 },
  //   { X: mouseX + 100, Y: mouseY + 100 },
  //   { X: mouseX - 100, Y: mouseY + 100 }]];
  //   ClipperLib.JS.ScaleUpPaths(clip_paths, 1);
  //   this.m_pCurFloor = new FloorData();
  //   this.m_pCurFloor.OnBuildFloor(clip_paths[0], 0.1);
  //   this.mFloorArray.push(this.m_pCurFloor);
  //   this.m_pCurFloor = null;

  //   m_cPenType = 0;
  // };

  // // 创建矩形区域
  // this.CreateFloorRect = function (vMin, vMax) {
  //   const clip_paths = [[{ X: vMin.x, Y: vMin.y },
  //   { X: vMax.x, Y: vMin.y },
  //   { X: vMax.x, Y: vMax.y },
  //   { X: vMin.x, Y: vMax.y }]];
  //   ClipperLib.JS.ScaleUpPaths(clip_paths, 1);
  //   this.m_pCurFloor = new FloorData();
  //   this.m_pCurFloor.OnBuildFloor(clip_paths[0], -0.1);
  //   this.mFloorArray.push(this.m_pCurFloor);
  //   this.m_pCurFloor = null;

  //   m_cPenType = 0;
  // };

  // // 按多边形创建地面
  // this.CreateFloorPoly = function (vLineArray, fValue) {
  //   const clip_paths = [];
  //   const tArray = [];
  //   for (let i = 0; i < vLineArray.length; i++)
  //     tArray.push({ X: vLineArray[i].x, Y: vLineArray[i].y });

  //   clip_paths.push(tArray);
  //   //ClipperLib.JS.ScaleUpPaths(clip_paths, 1);
  //   this.m_pCurFloor = new FloorData();
  //   this.m_pCurFloor.OnBuildFloor(clip_paths[0], fValue);
  //   this.mFloorArray.push(this.m_pCurFloor);
  //   //this.m_pCurFloor.ExtrudeGeometry();
  //   //this.m_pCurFloor = null;			
  // };

  // // 创建地台形式
  // this.CreatePlatformPoly = function (vLineArray, fValue) {
  //   const clip_paths = [];
  //   const tArray = [];
  //   for (let i = 0; i < vLineArray.length; i++)
  //     tArray.push({ X: vLineArray[i].x, Y: vLineArray[i].y });

  //   clip_paths.push(tArray);
  //   ClipperLib.JS.ScaleUpPaths(clip_paths, 1);
  //   this.m_pCurFloor = new FloorData();
  //   this.m_pCurFloor.OnBuildFloor(clip_paths[0], fValue);
  //   this.mFloorArray.push(this.m_pCurFloor);
  //   //	this.m_pCurFloor.ExtrudeGeometry();			
  // };


  // /**
  //  * @api CreateFloor
  //  * @apiDescription 是否显示所有地面尺寸
  //  * @apiGroup FloorClass
  //  * @apiParam (参数) bShow true显示，false不显示
  //  */
  // this.OnShowLabelAll = function (bShow) {
  //   if (this.mFloorArray.length <= 0)		// 没有数据不要显示
  //     bShow = false;

  //   if (mHouseClass.mGroundClass.mGroundArray.length == 0)	// 有区域不显示
  //   {
  //     this.mLabelH.OnShowLabel(bShow);
  //     this.mLabelV.OnShowLabel(bShow);
  //   }
  //   for (let j = 0; j < this.mFloorArray.length; j++)
  //     this.mFloorArray[j].OnShowLabel_Out(bShow);
  // };

  // this.OnShowAll_3D = function (bShow) {
  //   for (let i = 0; i < this.mFloorArray.length; i++)
  //     this.mFloorArray[i].mFloorMesh3D.visible = bShow;
  // };

  // this.OnShowLabelOut = function (bShow) {
  //   for (let j = 0; j < this.mFloorArray.length; j++)
  //     this.mFloorArray[j].OnShowLabel_Out(bShow);
  // };

  // // 2D转换3D, 按2D数据重新生成3D地面
  // this.OnChange2DTo3D = function () {
  //   for (let k = 0; k < this.mFloorArray.length; k++) {
  //     this.mFloorArray[k].OnChange2DTo3D();
  //   }
  // };

  // this.ChangeEmptyRoom = function () {
  //   for (let k = 0; k < this.mFloorArray.length; k++) {
  //     this.mFloorArray[k].mFloorMesh3D.material = mResource.boxProjectedMat;
  //     this.mFloorArray[k].mFloorMesh3D.material.needsUpdate = true;
  //   }
  // };

  // this.OnShowAll = function (bShow) {
  //   for (let k = 0; k < this.mFloorArray.length; k++) {
  //     this.mFloorArray[k].mFloorMesh.visible = bShow;
  //     this.mFloorArray[k].mFloorMeshSVG.visible = !bShow;
  //   }
  // };

  // /**
  //  * @api OnSave_XML
  //  * @apiDescription 保存场景
  //  * @apiGroup FloorClass
  //  */
  // this.OnSave_XML = function () {
  //   let iIndex = 0;
  //   for (let k = 0; k < this.mFloorArray.length; k++) {
  //     const that = this.mFloorArray[k].mTextureData;
  //     if (that == undefined)
  //       continue;

  //     iIndex++;
  //   }

  //   let strXML = `<Floor3D num="${iIndex}"/>`;

  //   for (let k = 0; k < this.mFloorArray.length; k++) {
  //     const that = this.mFloorArray[k].mTextureData;
  //     if (that == undefined)
  //       continue;
  //     const strFile = 'texture/' + that.m_strFile;
  //     //let strFile = that.m_strFile;

  //     let strX = 1;
  //     let strY = 1;
  //     if (strFile != "texture/floor.jpg") {
  //       strX = that.mTexture.repeat.x;
  //       strY = that.mTexture.repeat.y;
  //     }

  //     strXML += `<Line3D PosX="${that.m_x1}" PosY="${that.m_y1}" PosZ="${that.m_z1}"
  //                             TexWidth="${that.m_fLength}" TexHeight="${that.m_fWidth}" 
  //                             OffX="${that.m_fOffX}" OffY="${that.m_fOffY}" Alpha="${that.m_fAlpha}" 
  //                             Rotate="${that.m_fRotate}"  source="${strFile}" Mode="${that.m_fMode}" 
  //                             ScaleX="${strX}" ScaleY="${strY}" />`;
  //   }

  //   return strXML;
  // };

  // /**
  //  * @api OnDelete(tFloor)
  //  * @apiDescription 删除指定的地面
  //  * @apiGroup FlueClass
  //  * @apiParam (成员变量) tFloor  指定的地面                         
  //  */
  // this.OnDelete = function (tFloor) {
  //   tFloor.OnClear();
  //   const iIndex = this.mFloorArray.indexOf(tFloor);
  //   if (iIndex == -1)
  //     return;
  //   this.mFloorArray.splice(iIndex, 1);
  // };

  // /**
  //  * @api OnUpdate_Hole(tFloor)
  //  * @apiDescription 在3D下用2D形状计算
  //  * @apiGroup FlueClass
  //  * @apiParam (成员变量) tFloor  指定的地面                         
  //  */
  // // 
  // this.OnUpdate_Hole = function () {
  //   const scale = 1;
  //   // 循环所有地面
  //   for (let i = 0; i < this.mFloorArray.length; i++) {
  //     const tFloor = this.mFloorArray[i];
  //     const fw = (tFloor.m_OBBox_Max.x - tFloor.m_OBBox_Min.x);
  //     const fh = (tFloor.m_OBBox_Max.y - tFloor.m_OBBox_Min.y);

  //     const subj_paths = [];
  //     const tArray = [];
  //     for (var j = 0; j < tFloor.mPath.length; j++)
  //       tArray.push({ X: tFloor.mPath[j].X, Y: tFloor.mPath[j].Y });
  //     tArray.push({ X: tFloor.mPath[0].X, Y: tFloor.mPath[0].Y });
  //     subj_paths.push(tArray);
  //     ClipperLib.JS.ScaleUpPaths(subj_paths, scale);
  //     const cpr = new ClipperLib.Clipper();
  //     //	cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);

  //     // 循环所有物体
  //     for (var j = 0; j < mHouseClass.mFurnitureClass.mFurnitureArray.length; j++) {
  //       //if( mHouseClass.mFurnitureClass.mFurnitureArray[j].mData[8] != '斜坡')
  //       //	continue;

  //       if (mHouseClass.mFurnitureClass.mFurnitureArray[j].m_hole == false && mHouseClass.mFurnitureClass.mFurnitureArray[j].mData[8] != '斜坡')
  //         continue;

  //       const box = new THREE.Box3();
  //       box.setFromObject(mHouseClass.mFurnitureClass.mFurnitureArray[j].m_RenderData2D);	// 当前Box的位置
  //       const vMin = box.min;
  //       const vMax = box.max;

  //       const clip_paths = [[{ X: vMin.x, Y: vMin.y },
  //       { X: vMax.x, Y: vMin.y },
  //       { X: vMax.x, Y: vMax.y },
  //       { X: vMin.x, Y: vMax.y },
  //       { X: vMin.x, Y: vMin.y }]];

  //       ClipperLib.JS.ScaleUpPaths(clip_paths, 1);
  //       cpr.AddPaths(clip_paths, ClipperLib.PolyType.ptClip, true);
  //     }

  //     const solution_paths = new ClipperLib.Paths();
  //     cpr.Execute(ClipperLib.ClipType.ctUnion, solution_paths, ClipperLib.PolyFillType.pftEvenOdd, ClipperLib.PolyFillType.pftNonZero);

  //     const cpr1 = new ClipperLib.Clipper();
  //     cpr1.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);
  //     cpr1.AddPaths(solution_paths, ClipperLib.PolyType.ptClip, true);
  //     // 生成新的形状
  //     const pt = new ClipperLib.PolyTree();//ctUnion,ctDifference,ctIntersection
  //     cpr1.Execute(ClipperLib.ClipType.ctDifference, pt, ClipperLib.PolyFillType.pftEvenOdd, ClipperLib.PolyFillType.pftNonZero);
  //     const solution_exPolygons = ClipperLib.JS.PolyTreeToExPolygons(pt);

  //     const tReg = [];
  //     if (solution_exPolygons.length == 0)
  //       return;

  //     // 外轮廓
  //     for (var j = 0; j < solution_exPolygons[0].outer.length; j++) {
  //       tReg.push(new poly2tri.Point(solution_exPolygons[0].outer[j].X, solution_exPolygons[0].outer[j].Y));
  //     }
  //     const swctx = new poly2tri.SweepContext(tReg);

  //     tFloor.OnUpdateLabel(tReg);

  //     let tGroundUnit = null;
  //     for (let m = 0; m < mHouseClass.mGroundClass.mGroundArray.length; m++) {
  //       if (mHouseClass.mGroundClass.mGroundArray[m].m_pCurFloor == tFloor) {
  //         mHouseClass.mGroundClass.mGroundArray[m].OnUpdateLineArray();
  //         tGroundUnit = mHouseClass.mGroundClass.mGroundArray[m];
  //         break;
  //       }
  //     }

  //     if (tGroundUnit == null)
  //       continue;

  //     // 内部洞
  //     for (var j = 0; j < solution_exPolygons[0].holes.length; j++) {
  //       const hole = [];
  //       for (let n = 0; n < solution_exPolygons[0].holes[j].length; n++)
  //         hole.push(new poly2tri.Point(solution_exPolygons[0].holes[j][n].X, solution_exPolygons[0].holes[j][n].Y));

  //       if (hole.length > 0)
  //         swctx.addHole(hole);
  //     }
  //     swctx.triangulate();
  //     const triangles = swctx.getTriangles();

  //     const geom = new THREE.Geometry();
  //     for (let k = 0; k < triangles.length; k++) {
  //       geom.vertices.push(new THREE.Vector3(triangles[k].points_[0].x, triangles[k].points_[0].y, tGroundUnit.m_fDist + tGroundUnit.m_fHeight));
  //       geom.vertices.push(new THREE.Vector3(triangles[k].points_[1].x, triangles[k].points_[1].y, tGroundUnit.m_fDist + tGroundUnit.m_fHeight));
  //       geom.vertices.push(new THREE.Vector3(triangles[k].points_[2].x, triangles[k].points_[2].y, tGroundUnit.m_fDist + tGroundUnit.m_fHeight));

  //       geom.faces.push(new THREE.Face3(3 * k + 0, 3 * k + 1, 3 * k + 2));
  //       geom.faceVertexUvs[0][k] = [
  //         new THREE.Vector2((triangles[k].points_[0].x - tFloor.m_OBBox_Min.x) / fw, (triangles[k].points_[0].y - tFloor.m_OBBox_Min.y) / fh),
  //         new THREE.Vector2((triangles[k].points_[1].x - tFloor.m_OBBox_Min.x) / fw, (triangles[k].points_[1].y - tFloor.m_OBBox_Min.y) / fh),
  //         new THREE.Vector2((triangles[k].points_[2].x - tFloor.m_OBBox_Min.x) / fw, (triangles[k].points_[2].y - tFloor.m_OBBox_Min.y) / fh)];
  //     }

  //     geom.computeFaceNormals();
  //     geom.verticesNeedUpdate = true;
  //     geom.uvsNeedUpdate = true;

  //     scene3D.remove(tFloor.mFloorMesh3D);

  //     if (this.mTextureData == null)	// 默认的地面
  //     {
  //       tFloor.mFloorMesh3D = new THREE.Mesh(geom, mResource.floorMat);
  //       mResource.floorMat.needsUpdate = true;
  //     }
  //     else {
  //       const tMat = new THREE.MeshStandardMaterial({
  //         map: this.mTextureData.mTexture,
  //         roughness: 1,
  //       });
  //       tFloor.mFloorMesh3D = new THREE.Mesh(geom, tMat);
  //     }

  //     tFloor.mFloorMesh3D.rotation.x = -Math.PI / 2;
  //     scene3D.add(tFloor.mFloorMesh3D);
  //   }
  // };

  // // 查询碰撞
  // this.CheckCollision = function (tFurniture) {
  //   if (tFurniture.mData[8] == '斜坡')
  //     return null;

  //   const vPos = new THREE.Vector3(tFurniture.m_Object3D.position.x, tFurniture.m_Object3D.position.z, tFurniture.m_Object3D.position.y + 100);
  //   const vNormal = new THREE.Vector3(0, -1, 0);
  //   const raycaster1 = new THREE.Raycaster(vPos, vNormal);

  //   let tFloor = null;
  //   let tDis = 99999;
  //   for (j = 0; j < this.mFloorArray.length; j++) {
  //     const Intersections = raycaster1.intersectObject(this.mFloorArray[j].mFloorMesh3D);
  //     if (Intersections.length >= 1) {
  //       if (tDis > Intersections[0].distance) {
  //         tDis = Intersections[0].distance;
  //         tFloor = this.mFloorArray[j];
  //       }
  //     }
  //   }

  //   if (tFloor != null) {
  //     this.m_pCurFloor = tFloor;
  //     return tFloor;
  //   }
  //   return null;
  // };

  // this.GetFloorCenter = function () {
  //   const off = 250; // 偏移高度

  //   const hStart = new THREE.Vector3(this.m_OBBox_Min.x, this.m_OBBox_Max.y + off, 0);
  //   const hEnd = new THREE.Vector3(this.m_OBBox_Max.x, this.m_OBBox_Max.y + off, 0);

  //   const vStart = new THREE.Vector3(this.m_OBBox_Max.x + off, this.m_OBBox_Max.y, 0);
  //   const vEnd = new THREE.Vector3(this.m_OBBox_Max.x + off, this.m_OBBox_Min.y, 0);

  //   const fLength = Math.sqrt((vEnd.x - vStart.x) * (vEnd.x - vStart.x) + (vEnd.y - vStart.y) * (vEnd.y - vStart.y));
  //   const fWidth = Math.sqrt((hEnd.x - hStart.x) * (hEnd.x - hStart.x) + (hEnd.y - hStart.y) * (hEnd.y - hStart.y));

  //   let maxLength = 0;
  //   let fCenterX = 0;
  //   let fCenterY = 0;

  //   if (fLength > fWidth) {
  //     fCenterX = (vEnd.x + vStart.x) / 2;
  //     fCenterY = (vEnd.y + vStart.y) / 2;
  //     maxLength = fLength;
  //   }
  //   else {
  //     fCenterX = (hEnd.x + hStart.x) / 2;
  //     fCenterY = (hEnd.y + hStart.y) / 2;
  //     maxLength = fWidth;
  //   }

  //   return [fCenterX, fCenterY, maxLength];
  // };
}