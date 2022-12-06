import { renderScene2D } from "@/core/renderScene2D";
import { i18n } from "@/locales/i18n";
import { BufferGeometry, Line, LineBasicMaterial } from "three";
import { DoorData } from "./doorData";
import mHouseClass from "@/core/houseClass";
import { MathClass } from "@/core/utils/math";

/**
 * @api DoorClass
 * @apiGroup DoorClass
 * @apiName  0
 * @apiDescription 门操作类
 * @apiParam (成员变量) mDoorArray 门数组
 * @apiParam (成员变量) m_pCurDoor 当前操作的门
 */
export default class DoorClass {
  mDoorArray = <DoorData[]>[];
  m_pCurDoor: DoorData | null = null;
  mCurMouseX = -9999;
  mCurMouseY = -9999;

  // 操控帮助界面(不用保存)
  //====================================================================
  m_HelpBox: any;
  m_HelpPos1: any;
  m_HelpPos2: any;
  m_HelpPos1_Pick = false;	// 拉动拾取点1
  m_HelpPos2_Pick = false; // 拉动拾取点2
  m_pCurWall = null;	// 窗户所在墙体
  m_LineLeft_Box: any;
  m_LineRight_Box: any;
  m_LineCenter_Box: any;
  m_LineLeft_Label: any;
  m_LineRight_Label: any;
  m_LineCenter_Label: any;
  m_LineLeft: any;
  m_LineRight: any;
  m_LineCenter: any;
  g_GaiLiQiangJuLi: any;
  m_LineTop_Box: any;

  m_LineLeft_Box1: any;
  m_LineTop_Box1: any;
  m_LineCenter_Box1: any;

  m_strLeft_Value: any;
  m_strRight_Value: any;
  m_strCenter_Value: any;
  m_fLeftOld: any;
  m_fRightOld: any;
  m_fCenterOld: any;

  // /**
  //  * @api OnInit()
  //  * @apiGroup DoorClass 
  //  * @apiName  0
  //  * @apiDescription 初始化门控制类
  //  * 
  //  */
  // OnInit() {

  //   // const result_poly = new BufferGeometry();
  //   // const vertices = []
  //   // vertices.push(-0.5, -0.5, 1, -0.5, 0.5, 1);
  //   // vertices.push(0.5, 0.5, 1, 0.5, -0.5, 1);
  //   // vertices.push(-0.5, -0.5, 1);
  //   // this.m_HelpBox = new Line(result_poly, new LineBasicMaterial({ color: 0x00A2E8, linewidth: 15, opacity: 1 }));
  //   // renderScene2D.scene.add(this.m_HelpBox);

  //   // const sphere = new CircleGeometry(9, 9);
  //   // const BlueMaterial = new LineBasicMaterial({ color: 0x0000ff });
  //   // this.m_HelpPos1 = new Mesh(sphere, new PointsMaterial({ color: 0xffffff }));
  //   // this.m_HelpPos2 = new Mesh(sphere, new PointsMaterial({ color: 0xffffff }));
  //   // this.m_HelpPos1.add(new Line(sphere, BlueMaterial));
  //   // this.m_HelpPos2.add(new Line(sphere, BlueMaterial));
  //   // scene.add(this.m_HelpPos1);
  //   // scene.add(this.m_HelpPos2);

  //   // // 尺寸标注
  //   // const geometry1 = new Geometry();
  //   // geometry1.vertices.push(new Vector3(0, 0, 1), new Vector3(0, 0, 1));
  //   // const geometry2 = new Geometry();
  //   // geometry2.vertices.push(new Vector3(0, 0, 1), new Vector3(0, 0, 1));
  //   // const geometry3 = new Geometry();
  //   // geometry3.vertices.push(new Vector3(0, 0, 1), new Vector3(0, 0, 1));
  //   // const geometry4 = new Geometry();
  //   // geometry4.vertices.push(new Vector3(0, 0, 1), new Vector3(0, 0, 1));
  //   // this.m_LineLeft = new LineSegments(geometry1, new LineBasicMaterial({ color: 0xAAAAAA, opacity: 1, linewidth: 0.8 }));
  //   // this.m_LineRight = new LineSegments(geometry2, new LineBasicMaterial({ color: 0xAAAAAA, opacity: 1, linewidth: 0.8 }));
  //   // this.m_LineCenter = new LineSegments(geometry3, new LineBasicMaterial({ color: 0xAAAAAA, opacity: 1, linewidth: 0.8 }));

  //   // scene.add(this.m_LineLeft);
  //   // scene.add(this.m_LineRight);
  //   // scene.add(this.m_LineCenter);

  //   // this.OnHideCtrl();	// 隐藏操控

  // };

  // /**
  //  * @api OnShowAll()
  //  * @apiGroup DoorClass 
  //  * @apiName  0
  //  * @apiDescription 是否显示所有的门
  //  * @apiParam (参数) bShow true显示 false 不显示
  //  */
  // OnShowAll(bShow) {
  //   for (let j = 0; j < this.mDoorArray.length; j++)
  //     this.mDoorArray[j].m_Object.visible = bShow;
  // };

  // OnShowAll2D(bShow) {
  //   for (let j = 0; j < this.mDoorArray.length; j++) {
  //     this.mDoorArray[j].m_RenderData2D.visible = bShow;
  //     this.mDoorArray[j].m_RenderWin2D.visible = bShow;
  //   }
  // };

  /**
   * @api CreateDoor(iType)
   * @apiGroup DoorClass 
   * @apiName  0
   * @apiDescription 创建门
   * @apiParam (参数) iType 门的类型
   */
  CreateDoor(iType: number, mstrFile?: string) {

    // if (IsContain(container, renderer2.domElement) != false) {
    //   alert(i18n.t("Language.poips"));
    //   return;
    // }
    // OnMouseRightUp();

    renderScene2D.m_cPenType = 2;
    this.m_pCurDoor = new DoorData();
    if (mstrFile != undefined) {
      this.m_pCurDoor.OnInit(iType, -1, mstrFile);
    } else {
      this.m_pCurDoor.OnInit(iType, -1);
    }
  }

  // /**
  //  * @api OnClear()
  //  * @apiGroup DoorClass 
  //  * @apiName  0
  //  * @apiDescription 清空所有门 
  //  */
  // this.OnClear = function () {
  //   this.OnHideCtrl();
  //   for (let i = 0; i < this.mDoorArray.length; i++) {
  //     this.mDoorArray[i].OnClear();
  //   }
  //   this.mDoorArray.length = 0;
  //   this.m_pCurDoor = null;
  // };


  // this.OnUpdate3D = function () {
  //   for (let i = 0; i < this.mDoorArray.length; i++)
  //     this.mDoorArray[i].OnUpdate3D();
  // };


  DrawDoor(x: number, y: number) {
    if (true == this.OnMouseMove(x, y)) {
      this.mDoorArray.push(this.m_pCurDoor!);
      this.m_pCurDoor = null;
      renderScene2D.m_cPenType = 0;

      // mHouseClass.mHistory.Store();
    }
  }

  /**
   * @api OnMouseMove(mouseX,mouseY)
   * @apiGroup DoorClass 
   * @apiName  0
   * @apiDescription 平面上移动门 ，( 墙中线绘制、墙内线绘制、CAD绘制 )
   */
  OnMouseMove(mouseX: number, mouseY: number) {
    // 移动当前门
    if (this.m_pCurDoor == null)
      return false;
    // GetMouseXY2D();
    // // 快速画墙 (墙中线对齐、内线对齐)
    for (let i = 0; i < mHouseClass.wallClass.mWallArray.length; i++) {
      const aa = mHouseClass.wallClass.mWallArray[i].DeDaoZhongXian();
      const ab = MathClass.ClosestPointOnLine1(aa[0].x, aa[0].y, aa[1].x, aa[1].y, mouseX, mouseY, this.m_pCurDoor.m_fWidth);
      if (ab[0] != 0) {
        this.m_pCurDoor.m_fRotate = MathClass.GetLineRotate(
          mHouseClass.wallClass.mWallArray[i].m_vStart.x,
          mHouseClass.wallClass.mWallArray[i].m_vStart.y,
          mHouseClass.wallClass.mWallArray[i].m_vEnd.x,
          mHouseClass.wallClass.mWallArray[i].m_vEnd.y);

        if (this.m_pCurDoor.m_fLength > mHouseClass.wallClass.mWallArray[i].m_fLength && mHouseClass.wallClass.mWallArray[i].m_fLength > 50)
          this.m_pCurDoor.m_fLength = mHouseClass.wallClass.mWallArray[i].m_fLength - 30;

        this.m_pCurDoor.OnMouseMove(ab[1], ab[2], 0, this.m_pCurDoor.m_fRotate, mHouseClass.wallClass.mWallArray[i].m_fWidth);
        return true;
      }
    }

    this.m_pCurDoor.OnMouseMove(mouseX, mouseY, 0, 0, this.m_pCurDoor.m_fWidth);

    return false;
  }

  // /**
  //  * @api OnMouseRightUp2D()
  //  * @apiGroup DoorClass 
  //  * @apiName  0
  //  * @apiDescription 2D下鼠标右键释放 
  //  */
  // this.OnMouseRightUp2D = function () {
  //   if (this.m_pCurDoor && m_cPenType == 2)
  //     this.OnDelete(this.m_pCurDoor);
  //   this.m_pCurDoor = null;

  //   for (j = 0; j < this.mDoorArray.length; j++)
  //     this.mDoorArray[j].m_RenderWin2D.material.color.set(mResource.mColor);

  //   this.OnHideCtrl();
  // };

  // /**
  //  * @api OnDelete(tDoor)
  //  * @apiGroup DoorClass 
  //  * @apiName  0
  //  * @apiDescription 删除指定的门
  //  */
  // this.OnDelete = function (tDoor) {

  //   this.OnHideCtrl();
  //   tDoor.OnClear();
  //   const iIndex = this.mDoorArray.indexOf(tDoor);
  //   if (iIndex == -1)
  //     return;
  //   this.mDoorArray.splice(iIndex, 1);

  //   mHouseClass.mHistory.Store();
  // };

  // /**
  //  * @api OnHideCtrl()
  //  * @apiGroup DoorClass 
  //  * @apiName  0
  //  * @apiDescription 隐藏控制
  //  * 
  //  */
  // this.OnHideCtrl = function () {
  //   this.m_HelpBox.position.x = -99999;
  //   this.m_HelpBox.position.y = -99999;
  //   this.m_HelpPos1.position.x = -99999;
  //   this.m_HelpPos1.position.y = -99999;
  //   this.m_HelpPos2.position.x = -99999;
  //   this.m_HelpPos2.position.y = -99999;

  //   this.m_HelpPos1_Pick = false;
  //   this.m_HelpPos2_Pick = false;

  //   this.m_LineLeft.visible = false;
  //   this.m_LineRight.visible = false;
  //   this.m_LineCenter.visible = false;
  // };

  // /**
  //  * @api OnShowCtrl(tDoor)
  //  * @apiGroup DoorClass 
  //  * @apiName  0
  //  * @apiDescription 在指定的门显示操作辅助
  //  * @apiParam (参数) tDoor 指定的门
  //  * 
  //  */
  // this.OnShowCtrl = function (tDoor) {
  //   // 单击显示操作系统
  //   mHelpClass.ClearOutline();
  //   this.m_HelpBox.geometry.vertices.length = 0;
  //   this.m_HelpBox.geometry.vertices.push(new Vector3(-tDoor.m_fLength / 2, -tDoor.m_fWidth / 2, 1.5), new Vector3(-tDoor.m_fLength / 2, tDoor.m_fWidth / 2, 1.5));
  //   this.m_HelpBox.geometry.vertices.push(new Vector3(tDoor.m_fLength / 2, tDoor.m_fWidth / 2, 1.5), new Vector3(tDoor.m_fLength / 2, -tDoor.m_fWidth / 2, 1.5));
  //   this.m_HelpBox.geometry.vertices.push(new Vector3(-tDoor.m_fLength / 2, -tDoor.m_fWidth / 2, 1.5));
  //   this.m_HelpBox.geometry.verticesNeedUpdate = true;

  //   const tmpMatrix2 = new Matrix4().makeRotationZ(tDoor.m_fRotate);
  //   const tmpMatrix3 = new Matrix4().makeTranslation(tDoor.m_vPos.x, tDoor.m_vPos.y, 1);
  //   tmpMatrix3.multiply(tmpMatrix2);
  //   this.m_HelpBox.rotation.z = 0;
  //   this.m_HelpBox.position.x = 0;
  //   this.m_HelpBox.position.y = 0;
  //   this.m_HelpBox.position.z = 0;
  //   this.m_HelpBox.scale.x = 1;
  //   this.m_HelpBox.scale.y = 1;
  //   this.m_HelpBox.scale.z = 1;
  //   this.m_HelpBox.matrixWorld.identity();
  //   this.m_HelpBox.matrix.identity();
  //   this.m_HelpBox.updateMatrixWorld(true);
  //   this.m_HelpBox.applyMatrix(tmpMatrix3);

  //   const pos1 = new Vector3(-tDoor.m_fLength / 2, 0, 1.7);
  //   pos1.applyMatrix4(tmpMatrix3);
  //   const pos2 = new Vector3(tDoor.m_fLength / 2, 0, 1.7);
  //   pos2.applyMatrix4(tmpMatrix3);
  //   this.m_HelpPos1.position.x = pos1.x;
  //   this.m_HelpPos1.position.y = pos1.y;
  //   this.m_HelpPos1.position.z = pos1.z;
  //   this.m_HelpPos2.position.x = pos2.x;
  //   this.m_HelpPos2.position.y = pos2.y;
  //   this.m_HelpPos2.position.z = pos2.z;

  //   this.UpdateLabel(tDoor);
  // };

  // /**
  //  * @api UpdateLabel(tDoor)
  //  * @apiGroup DoorClass 
  //  * @apiName  0
  //  * @apiDescription 更新尺寸
  //  * @apiParam (参数) tDoor 指定的门
  //  * 
  //  */
  // this.UpdateLabel = function (tWindow) {

  //   // 显示尺寸
  //   this.m_LineLeft.visible = false;
  //   this.m_LineRight.visible = false;
  //   this.m_LineCenter.visible = false;

  //   // 窗户对应的Matrix
  //   const tmpMatrix1 = new Matrix4().makeRotationZ(tWindow.m_fRotate);
  //   const tmpMatrix2 = new Matrix4().makeTranslation(tWindow.m_vPos.x, tWindow.m_vPos.y, 1);
  //   tmpMatrix2.multiply(tmpMatrix1);

  //   // 窗户的一个端点
  //   let pos1 = new Vector3(-tWindow.m_fLength / 2, -tWindow.m_fWidth / 2 - 30, 0);
  //   pos1.applyMatrix4(tmpMatrix2);

  //   let pos2 = new Vector3(0, 0, 0);
  //   let pos22 = new Vector3(0, 0, 0);
  //   let pos11 = new Vector3(0, 0, 0);

  //   let posLeft = new Vector3(-tWindow.m_fLength / 2, -tWindow.m_fWidth / 2, 0);
  //   posLeft.applyMatrix4(tmpMatrix2);
  //   let posRight = new Vector3(tWindow.m_fLength / 2, -tWindow.m_fWidth / 2, 0);
  //   posRight.applyMatrix4(tmpMatrix2);

  //   let posStart1 = new Vector3(-tWindow.m_fLength / 2, -tWindow.m_fWidth / 2 - 22, 0);
  //   posStart1.applyMatrix4(tmpMatrix2);
  //   let posEnd1 = new Vector3(-tWindow.m_fLength / 2, -tWindow.m_fWidth / 2 - 38, 0);
  //   posEnd1.applyMatrix4(tmpMatrix2);

  //   let posStart2 = new Vector3(tWindow.m_fLength / 2, -tWindow.m_fWidth / 2 - 22, 0);
  //   posStart2.applyMatrix4(tmpMatrix2);
  //   let posEnd2 = new Vector3(tWindow.m_fLength / 2, -tWindow.m_fWidth / 2 - 38, 0);
  //   posEnd2.applyMatrix4(tmpMatrix2);

  //   const vPos1 = new Vector3(pos1.x, pos1.y, 10);
  //   const vNormal = new Vector3(0, 0, -1);
  //   let raycaster1 = new Raycaster(vPos1, vNormal);
  //   raycaster1.linePrecision = 3;

  //   let tFloor = null;
  //   var tDis = -99999;
  //   for (var j = 0; j < mHouseClass.mFloorClass.mFloorArray.length; j++) {
  //     var Intersections;
  //     if (mHouseClass.mFloorClass.mFloorArray[j].mFloorMesh.visible == true)
  //       Intersections = raycaster1.intersectObject(mHouseClass.mFloorClass.mFloorArray[j].mFloorMesh);
  //     else
  //       Intersections = raycaster1.intersectObject(mHouseClass.mFloorClass.mFloorArray[j].mFloorMeshSVG);
  //     if (Intersections.length >= 1) {
  //       if (tDis < mHouseClass.mFloorClass.mFloorArray[j].mfLayer) {
  //         tDis = mHouseClass.mFloorClass.mFloorArray[j].mfLayer;
  //         tFloor = mHouseClass.mFloorClass.mFloorArray[j];
  //       }
  //     }
  //   }

  //   if (tFloor == null) {
  //     pos1 = new Vector3(-tWindow.m_fLength / 2, tWindow.m_fWidth / 2 + 30, 0);
  //     pos1.applyMatrix4(tmpMatrix2);
  //     posLeft = new Vector3(-tWindow.m_fLength / 2, tWindow.m_fWidth / 2, 0);
  //     posLeft.applyMatrix4(tmpMatrix2);
  //     posRight = new Vector3(tWindow.m_fLength / 2, tWindow.m_fWidth / 2, 0);
  //     posRight.applyMatrix4(tmpMatrix2);

  //     posStart1 = new Vector3(-tWindow.m_fLength / 2, tWindow.m_fWidth / 2 + 22, 0);
  //     posStart1.applyMatrix4(tmpMatrix2);
  //     posEnd1 = new Vector3(-tWindow.m_fLength / 2, tWindow.m_fWidth / 2 + 38, 0);
  //     posEnd1.applyMatrix4(tmpMatrix2);

  //     posStart2 = new Vector3(tWindow.m_fLength / 2, tWindow.m_fWidth / 2 + 22, 0);
  //     posStart2.applyMatrix4(tmpMatrix2);
  //     posEnd2 = new Vector3(tWindow.m_fLength / 2, tWindow.m_fWidth / 2 + 38, 0);
  //     posEnd2.applyMatrix4(tmpMatrix2);

  //     raycaster1 = new Raycaster(new Vector3(pos1.x, pos1.y, 10), vNormal);
  //     raycaster1.linePrecision = 3;

  //     tFloor = null;
  //     var tDis = -99999;
  //     for (var j = 0; j < mHouseClass.mFloorClass.mFloorArray.length; j++) {
  //       var Intersections;
  //       if (mHouseClass.mFloorClass.mFloorArray[j].mFloorMesh.visible == true)
  //         Intersections = raycaster1.intersectObject(mHouseClass.mFloorClass.mFloorArray[j].mFloorMesh);
  //       else
  //         Intersections = raycaster1.intersectObject(mHouseClass.mFloorClass.mFloorArray[j].mFloorMeshSVG);
  //       if (Intersections.length >= 1) {
  //         if (tDis < mHouseClass.mFloorClass.mFloorArray[j].mfLayer) {
  //           tDis = mHouseClass.mFloorClass.mFloorArray[j].mfLayer;
  //           tFloor = mHouseClass.mFloorClass.mFloorArray[j];
  //         }
  //       }
  //     }
  //     if (tFloor == null)// 不显示尺寸
  //       return;
  //   }
  //   tFloor.OnShowLabel(false);	//  隐藏地面尺寸

  //   const iLeft = this.GetLiQiangJuLi(posLeft, tFloor);	// 得到左侧相交的墙线数值			
  //   if (iLeft != -1) {
  //     var SegArray1 = mMathClass.GetStartAndEndPosFromWall(tFloor.mLabelArray[iLeft].m_vStart, posLeft, tFloor.mFloorMesh, 30);
  //     var SegArray2 = mMathClass.GetStartAndEndPosFromWall(tFloor.mLabelArray[iLeft].m_vStart, posRight, tFloor.mFloorMesh, 30);

  //     pos1 = SegArray1[0];

  //     var fValue1 = pos1.distanceTo(SegArray1[1]);
  //     var fValue2 = pos1.distanceTo(SegArray2[1]);
  //     pos11 = SegArray1[1];
  //     if (fValue1 > fValue2)
  //       pos11 = SegArray2[1];
  //     pos1.z = 1;
  //     pos11.z = 0;
  //     this.m_LineLeft.visible = true;					//  到左边墙的线段
  //     this.m_LineLeft.geometry.vertices.length = 0;
  //     this.m_LineLeft.geometry.vertices.push(pos1, pos11);
  //     this.m_LineLeft.geometry.verticesNeedUpdate = true;

  //     var fValue = pos1.distanceTo(pos11);
  //     this.m_fLeftOld = fValue;

  //     // 文字
  //     //=============================================================================================
  //     this.m_LineLeft.remove(this.m_LineLeft_Label);
  //     this.m_strLeft_Value = parseInt(fValue * 10).toString();

  //     // 左边数字
  //     const shapes = mHouseClass.mFont.generateShapes(this.m_strLeft_Value, 8);
  //     const geometryText = new ShapeBufferGeometry(shapes);
  //     geometryText.computeBoundingBox();
  //     var tWidth = geometryText.boundingBox.max.x - geometryText.boundingBox.min.x;
  //     var tHeight = geometryText.boundingBox.max.y - geometryText.boundingBox.min.y;
  //     geometryText.translate(- 0.5 * tWidth, -0.5 * tHeight, 1.2);
  //     this.m_LineLeft_Label = new Mesh(geometryText, mResource.mFontTex);

  //     const geometry = new BoxBufferGeometry(tWidth + 10, tHeight + 10, 0);
  //     geometry.translate(0, 0, 0.5);
  //     this.m_LineLeft_Box1 = new Mesh(geometry, new MeshBasicMaterial({ color: 0xeeeeee, opacity: 1.0, transparent: true }));
  //     const tPoly = new Geometry();
  //     tPoly.vertices.push(new Vector3(-(tWidth + 10) / 2, -(tHeight + 10) / 2, 1), new Vector3(-(tWidth + 10) / 2, (tHeight + 10) / 2, 1));
  //     tPoly.vertices.push(new Vector3((tWidth + 10) / 2, (tHeight + 10) / 2, 1), new Vector3((tWidth + 10) / 2, -(tHeight + 10) / 2, 1));
  //     tPoly.vertices.push(new Vector3(-(tWidth + 10) / 2, -(tHeight + 10) / 2, 1));
  //     this.m_LineLeft_Box = new Line(tPoly, new LineBasicMaterial({ color: 0x0088F8, linewidth: 1, opacity: 1 }));
  //     this.m_LineLeft_Label.add(this.m_LineLeft_Box1);
  //     this.m_LineLeft_Label.add(this.m_LineLeft_Box);
  //     this.m_LineLeft_Label.position.x = (pos1.x + pos11.x) / 2;
  //     this.m_LineLeft_Label.position.y = (pos1.y + pos11.y) / 2;
  //     this.m_LineLeft.add(this.m_LineLeft_Label);
  //   }

  //   const iRight = this.GetLiQiangJuLi(posRight, tFloor);	// 得到右侧端点
  //   if (iRight != -1) {

  //     var SegArray1 = mMathClass.GetStartAndEndPosFromWall(tFloor.mLabelArray[iLeft].m_vEnd, posLeft, tFloor.mFloorMesh, 30);
  //     var SegArray2 = mMathClass.GetStartAndEndPosFromWall(tFloor.mLabelArray[iLeft].m_vEnd, posRight, tFloor.mFloorMesh, 30);

  //     pos2 = SegArray1[0];

  //     var fValue1 = pos2.distanceTo(SegArray1[1]);
  //     var fValue2 = pos2.distanceTo(SegArray2[1]);
  //     pos22 = SegArray1[1];
  //     if (fValue1 > fValue2)
  //       pos22 = SegArray2[1];
  //     pos2.z = 1;
  //     pos22.z = 0;

  //     this.m_LineRight.visible = true;
  //     this.m_LineRight.geometry.vertices.length = 0;
  //     this.m_LineRight.geometry.vertices.push(pos2, pos22);
  //     this.m_LineRight.geometry.verticesNeedUpdate = true;

  //     this.m_LineRight.remove(this.m_LineRight_Label);

  //     var fValue = pos2.distanceTo(pos22);
  //     this.m_fRightOld = fValue;
  //     this.m_strRight_Value = parseInt(fValue * 10).toString();

  //     // 右边数字
  //     //===========================================================================================================================
  //     var shapes1 = mHouseClass.mFont.generateShapes(this.m_strRight_Value, 8);
  //     var geometryText1 = new ShapeBufferGeometry(shapes1);
  //     geometryText1.computeBoundingBox();
  //     tWidth = geometryText1.boundingBox.max.x - geometryText1.boundingBox.min.x;
  //     tHeight = geometryText1.boundingBox.max.y - geometryText1.boundingBox.min.y;
  //     geometryText1.translate(- 0.5 * tWidth, -0.5 * tHeight, 1.2);
  //     this.m_LineRight_Label = new Mesh(geometryText1, mResource.mFontTex);

  //     var geometry1 = new BoxBufferGeometry(tWidth + 10, tHeight + 10, 0);
  //     geometry1.translate(0, 0, 0.5);
  //     this.m_LineRight_Box1 = new Mesh(geometry1, new MeshBasicMaterial({ color: 0xeeeeee, opacity: 1.0, transparent: true }));
  //     var tPoly1 = new Geometry();
  //     tPoly1.vertices.push(new Vector3(-(tWidth + 10) / 2, -(tHeight + 10) / 2, 1), new Vector3(-(tWidth + 10) / 2, (tHeight + 10) / 2, 1));
  //     tPoly1.vertices.push(new Vector3((tWidth + 10) / 2, (tHeight + 10) / 2, 1), new Vector3((tWidth + 10) / 2, -(tHeight + 10) / 2, 1));
  //     tPoly1.vertices.push(new Vector3(-(tWidth + 10) / 2, -(tHeight + 10) / 2, 1));
  //     this.m_LineRight_Box = new Line(tPoly1, new LineBasicMaterial({ color: 0x0088F8, linewidth: 1, opacity: 1 }));
  //     this.m_LineRight_Label.add(this.m_LineRight_Box);
  //     this.m_LineRight_Label.add(this.m_LineRight_Box1);
  //     this.m_LineRight_Label.position.x = (pos2.x + pos22.x) / 2;
  //     this.m_LineRight_Label.position.y = (pos2.y + pos22.y) / 2;
  //     //===========================================================================================================================		
  //     this.m_LineRight.add(this.m_LineRight_Label);
  //   }

  //   this.m_LineCenter.visible = true;
  //   this.m_LineCenter.geometry.vertices.length = 0;

  //   this.m_LineCenter.geometry.vertices.push(pos1, pos2);
  //   this.m_LineCenter.geometry.vertices.push(posStart1, posEnd1);
  //   this.m_LineCenter.geometry.vertices.push(posStart2, posEnd2);
  //   this.m_LineCenter.geometry.verticesNeedUpdate = true;

  //   // 右边数字
  //   //===========================================================================================================================
  //   this.m_LineCenter.remove(this.m_LineCenter_Label);
  //   var fValue = Math.round(pos11.distanceTo(pos22));
  //   this.m_strCenter_Value = parseInt(fValue * 10).toString();
  //   var shapes1 = mHouseClass.mFont.generateShapes(this.m_strCenter_Value, 8);
  //   var geometryText1 = new ShapeBufferGeometry(shapes1);
  //   geometryText1.computeBoundingBox();
  //   tWidth = geometryText1.boundingBox.max.x - geometryText1.boundingBox.min.x;
  //   tHeight = geometryText1.boundingBox.max.y - geometryText1.boundingBox.min.y;
  //   geometryText1.translate(- 0.5 * tWidth, -0.5 * tHeight, 1.2);
  //   this.m_LineCenter_Label = new Mesh(geometryText1, mResource.mFontTex);

  //   var geometry1 = new BoxBufferGeometry(tWidth + 10, tHeight + 10, 0);
  //   geometry1.translate(0, 0, 0.5);
  //   this.m_LineCenter_Box1 = new Mesh(geometry1, new MeshBasicMaterial({ color: 0xeeeeee, opacity: 1.0, transparent: true }));
  //   var tPoly1 = new Geometry();
  //   tPoly1.vertices.push(new Vector3(-(tWidth + 10) / 2, -(tHeight + 10) / 2, 1), new Vector3(-(tWidth + 10) / 2, (tHeight + 10) / 2, 1));
  //   tPoly1.vertices.push(new Vector3((tWidth + 10) / 2, (tHeight + 10) / 2, 1), new Vector3((tWidth + 10) / 2, -(tHeight + 10) / 2, 1));
  //   tPoly1.vertices.push(new Vector3(-(tWidth + 10) / 2, -(tHeight + 10) / 2, 1));
  //   this.m_LineCenter_Box = new Line(tPoly1, new LineBasicMaterial({ color: 0x0088F8, linewidth: 1, opacity: 1 }));
  //   this.m_LineCenter_Label.add(this.m_LineCenter_Box);
  //   this.m_LineCenter_Label.add(this.m_LineCenter_Box1);
  //   this.m_LineCenter_Label.position.x = (pos11.x + pos22.x) / 2;
  //   this.m_LineCenter_Label.position.y = (pos11.y + pos22.y) / 2;
  //   //===========================================================================================================================		
  //   this.m_LineCenter.add(this.m_LineCenter_Label);
  //   // 显示尺寸
  //   /*			this.m_LineLeft.visible   = false;
  //         this.m_LineRight.visible  = false;
  //         this.m_LineCenter.visible = false;
    
  //         var tmpMatrix1 = new Matrix4().makeRotationZ(tDoor.m_fRotate);
  //         var tmpMatrix2 = new Matrix4().makeTranslation(tDoor.m_vPos.x,tDoor.m_vPos.y,1);
  //             tmpMatrix2.multiply(tmpMatrix1);
    
  //         var pos1 = new Vector3(-tDoor.m_fLength/2, -tDoor.m_fWidth/2-30,0);	//门最左点
  //             pos1.applyMatrix4(tmpMatrix2);	
  //         var pos2 = new Vector3( tDoor.m_fLength/2, -tDoor.m_fWidth/2-30,0);	//门最右点
  //             pos2.applyMatrix4(tmpMatrix2);
              
  //         var posStart1 = new Vector3(-tDoor.m_fLength/2, -tDoor.m_fWidth/2-25,0);
  //             posStart1.applyMatrix4(tmpMatrix2);	
  //         var posEnd1 = new Vector3(-tDoor.m_fLength/2, -tDoor.m_fWidth/2-35,0);
  //             posEnd1.applyMatrix4(tmpMatrix2);
              
  //         var posStart2 = new Vector3( tDoor.m_fLength/2, -tDoor.m_fWidth/2-25,0);
  //             posStart2.applyMatrix4(tmpMatrix2);
  //         var posEnd2 = new Vector3( tDoor.m_fLength/2, -tDoor.m_fWidth/2-35,0);
  //             posEnd2.applyMatrix4(tmpMatrix2);					
          
  //         var posLeft = new Vector3(-tDoor.m_fLength/2, -tDoor.m_fWidth/2,0);	//左侧测试点
  //             posLeft.applyMatrix4(tmpMatrix2);	
  //         var posRight = new Vector3( tDoor.m_fLength/2, -tDoor.m_fWidth/2,0);	//门最右点
  //             posRight.applyMatrix4(tmpMatrix2);	
              
  //         var bRotate = false;
          
  //         //更新到四边的距离
  //         //得到当前所在地面
  //         var vPos1 = new Vector3( pos1.x, pos1.y, 10 );
  //         var vNormal = new Vector3(0,0,-1);
  //         var raycaster1 = new Raycaster(vPos1,vNormal);
  //             raycaster1.linePrecision = 3;
        
  //         var tFloor = null;
  //         var tDis   =-99999;
  //         for(var j=0; j<mHouseClass.mFloorClass.mFloorArray.length; j++)
  //         {
  //           var Intersections;
  //           if(mHouseClass.mFloorClass.mFloorArray[j].mFloorMesh.visible == true)
  //              Intersections = raycaster1.intersectObject(  mHouseClass.mFloorClass.mFloorArray[j].mFloorMesh );
  //           else
  //              Intersections = raycaster1.intersectObject(  mHouseClass.mFloorClass.mFloorArray[j].mFloorMeshSVG );
  //           if( Intersections.length>=1)
  //           {
  //             if( tDis < mHouseClass.mFloorClass.mFloorArray[j].mfLayer)
  //             {
  //               tDis  = mHouseClass.mFloorClass.mFloorArray[j].mfLayer;
  //               tFloor= mHouseClass.mFloorClass.mFloorArray[j];
  //             }
  //           }			
  //         }
          
  //         if( tFloor == null )
  //         {
            
  //           bRotate = true;
  //             pos1 = new Vector3(-tDoor.m_fLength/2,  tDoor.m_fWidth/2+30,0);
  //           pos1.applyMatrix4(tmpMatrix2);	
  //             pos2 = new Vector3( tDoor.m_fLength/2,  tDoor.m_fWidth/2+30,0);
  //           pos2.applyMatrix4(tmpMatrix2);
              
  //             posStart1 = new Vector3(-tDoor.m_fLength/2, tDoor.m_fWidth/2+25,0);
  //           posStart1.applyMatrix4(tmpMatrix2);	
  //             posEnd1 = new Vector3(-tDoor.m_fLength/2,  tDoor.m_fWidth/2+35,0);
  //           posEnd1.applyMatrix4(tmpMatrix2);
              
  //             posStart2 = new Vector3( tDoor.m_fLength/2, tDoor.m_fWidth/2+25,0);
  //           posStart2.applyMatrix4(tmpMatrix2);
  //             posEnd2   = new Vector3( tDoor.m_fLength/2, tDoor.m_fWidth/2+35,0);
  //           posEnd2.applyMatrix4(tmpMatrix2);					
              
  //             posLeft  = new Vector3(-tDoor.m_fLength/2, tDoor.m_fWidth/2,0);
  //           posLeft.applyMatrix4(tmpMatrix2);	
  //             posRight = new Vector3( tDoor.m_fLength/2, tDoor.m_fWidth/2,0);
  //           posRight.applyMatrix4(tmpMatrix2);				
            
  //           vPos1 = new Vector3( pos1.x, pos1.y, 10 );
  //           vNormal = new Vector3(0,0,-1);
  //           raycaster1 = new Raycaster(vPos1,vNormal);
  //           raycaster1.linePrecision = 3;
        
  //           tFloor = null;
  //           var tDis   =-99999;
  //           for(var j=0; j<mHouseClass.mFloorClass.mFloorArray.length; j++)
  //           {
  //             var Intersections;
  //             if(mHouseClass.mFloorClass.mFloorArray[j].mFloorMesh.visible == true)
  //                Intersections = raycaster1.intersectObject(  mHouseClass.mFloorClass.mFloorArray[j].mFloorMesh );
  //             else
  //                Intersections = raycaster1.intersectObject(  mHouseClass.mFloorClass.mFloorArray[j].mFloorMeshSVG );
  //             if( Intersections.length>=1)
  //             {
  //               if( tDis < mHouseClass.mFloorClass.mFloorArray[j].mfLayer)
  //               {
  //                 tDis  = mHouseClass.mFloorClass.mFloorArray[j].mfLayer;
  //                 tFloor= mHouseClass.mFloorClass.mFloorArray[j];
  //               }
  //             }			
  //           }
          
  //           if( tFloor == null )// 不显示尺寸
  //             return;
  //         }
    
  //         tFloor.OnShowLabel(false);	//  隐藏地面尺寸
          
        
  //         var iLeft  = this.GetLiQiangJuLi(posLeft, tFloor);	// 到左侧端点
  //         if( iLeft !=-1)
  //         {
  //             var tmpMatrix1 = new Matrix4().makeTranslation(0,0,0);
  //             var tmpMatrix2 = new Matrix4().makeRotationZ(tFloor.mLabelArray[iLeft].m_fRotate);
  //             var tmpMatrix3 = new Matrix4().makeTranslation(tFloor.mLabelArray[iLeft].m_fCenterX,tFloor.mLabelArray[iLeft].m_fCenterY,0);	
  //             tmpMatrix2.multiply(tmpMatrix1);
  //             tmpMatrix3.multiply(tmpMatrix2);				
            
  //             this.m_LineLeft.visible   = true;
  //             this.m_LineLeft.geometry.vertices.length 	= 0;
          
  //             var pos11 = new Vector3(-tFloor.mLabelArray[iLeft].m_fLength/2, -30, 0);	
  //             if( bRotate == true )
  //               pos11 = new Vector3(-tFloor.mLabelArray[iLeft].m_fLength/2, 30, 0);
  //             pos11.applyMatrix4(tmpMatrix3);
              
  //             this.m_LineLeft.geometry.vertices.push(pos1, pos11);
  //             this.m_LineLeft.geometry.verticesNeedUpdate = true;		
    
  //             var fValue = pos1.distanceTo(pos11);
  //             this.m_fLeftOld  = fValue;
  //             // 文字
  //             //=============================================================================================
  //             this.m_LineLeft.remove(this.m_LineLeft_Label);
  //             this.m_strLeft_Value = Math.round(fValue*10).toFixed(0);//parseInt(fValue*10).toString();
        
  //             // 左边数字
  //             var shapes = mHouseClass.mFont.generateShapes( this.m_strLeft_Value, 8 );
  //             var geometryText = new ShapeBufferGeometry( shapes );
  //               geometryText.computeBoundingBox();
  //             var tWidth = geometryText.boundingBox.max.x - geometryText.boundingBox.min.x;
  //             var tHeight= geometryText.boundingBox.max.y - geometryText.boundingBox.min.y;		
  //             geometryText.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );
  //             this.m_LineLeft_Label = new Mesh( geometryText, mResource.mFontTex );
              
  //             var geometry  = new BoxBufferGeometry( tWidth+10, tHeight+10, 0);
  //             geometry.translate( 0, 0, 0.5 );
  //               this.m_LineLeft_Box1= new Mesh(geometry, new MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 
  //             var tPoly = new Geometry();					
  //             tPoly.vertices.push(new Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
  //             tPoly.vertices.push(new Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
  //             tPoly.vertices.push(new Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
  //             this.m_LineLeft_Box = new Line( tPoly, new LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
  //             this.m_LineLeft_Label.add(this.m_LineLeft_Box1);
  //             this.m_LineLeft_Label.add(this.m_LineLeft_Box);
  //             this.m_LineLeft_Label.position.x  = ( pos1.x+ pos11.x )/2;			
  //             this.m_LineLeft_Label.position.y  = ( pos1.y+ pos11.y )/2;				
  //             this.m_LineLeft.add(this.m_LineLeft_Label);						
  //         }
          
    
  //         var iRight  = this.GetLiQiangJuLi(posRight, tFloor);	// 得到右侧端点
  //         if( iRight !=-1)
  //         {
            
  //           var tmpMatrix1 = new Matrix4().makeTranslation(0,0,0);
  //           var tmpMatrix2 = new Matrix4().makeRotationZ(tFloor.mLabelArray[iRight].m_fRotate);
  //           var tmpMatrix3 = new Matrix4().makeTranslation(tFloor.mLabelArray[iRight].m_fCenterX,tFloor.mLabelArray[iRight].m_fCenterY,0);	
  //           tmpMatrix2.multiply(tmpMatrix1);
  //           tmpMatrix3.multiply(tmpMatrix2);				
            
  //           this.m_LineRight.visible   = true;
  //           this.m_LineRight.geometry.vertices.length 	= 0;
        
  //           var pos22 = new Vector3(tFloor.mLabelArray[iRight].m_fLength/2, -30, 0);
  //           if( bRotate == true )
  //             pos22 = new Vector3(tFloor.mLabelArray[iRight].m_fLength/2, +30, 0);
  //           pos22.applyMatrix4(tmpMatrix3);
  //           this.m_LineRight.geometry.vertices.push(pos2, pos22);
  //           this.m_LineRight.geometry.verticesNeedUpdate = true;	
            
  //           this.m_LineRight.remove(this.m_LineRight_Label);
            
  //           var fValue = pos2.distanceTo(pos22);
  //           this.m_fRightOld = fValue;
  //           this.m_strRight_Value = Math.round(fValue*10).toFixed(0);//parseInt(fValue*10).toString();
            
  //           // 右边数字
  //           //===========================================================================================================================
  //           var shapes1 = mHouseClass.mFont.generateShapes( this.m_strRight_Value, 8 );
  //           var geometryText1 = new ShapeBufferGeometry( shapes1 );
  //               geometryText1.computeBoundingBox();
  //           tWidth = geometryText1.boundingBox.max.x - geometryText1.boundingBox.min.x;
  //           tHeight= geometryText1.boundingBox.max.y - geometryText1.boundingBox.min.y;		
  //           geometryText1.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );
  //           this.m_LineRight_Label = new Mesh( geometryText1, mResource.mFontTex );
            
  //           var geometry1  = new BoxBufferGeometry( tWidth+10, tHeight+10, 0);
  //           geometry1.translate( 0, 0, 0.5 );
  //             this.m_LineRight_Box1= new Mesh(geometry1, new MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 		
  //           var tPoly1 = new Geometry();					
  //           tPoly1.vertices.push(new Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
  //           tPoly1.vertices.push(new Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
  //           tPoly1.vertices.push(new Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
  //           this.m_LineRight_Box = new Line( tPoly1, new LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
  //           this.m_LineRight_Label.add(this.m_LineRight_Box);
  //           this.m_LineRight_Label.add(this.m_LineRight_Box1);
  //           this.m_LineRight_Label.position.x  = ( pos2.x+ pos22.x )/2;			
  //           this.m_LineRight_Label.position.y  = ( pos2.y+ pos22.y )/2;
  //           //===========================================================================================================================		
  //           this.m_LineRight.add(this.m_LineRight_Label);				
  //         }		
    
  //         this.m_LineCenter.visible   = true;
  //         this.m_LineCenter.geometry.vertices.length 	= 0;
          
  //         this.m_LineCenter.geometry.vertices.push(pos1, pos2);
  //         this.m_LineCenter.geometry.vertices.push(posStart1, posEnd1);
  //         this.m_LineCenter.geometry.vertices.push(posStart2, posEnd2);
  //         this.m_LineCenter.geometry.verticesNeedUpdate = true;	
          
  //         // 右边数字
  //         //===========================================================================================================================
  //         this.m_LineCenter.remove(this.m_LineCenter_Label);
  //         var fValue = pos1.distanceTo(pos2);
  //         this.m_strCenter_Value = parseInt(fValue*10).toString();
  //         var shapes1 = mHouseClass.mFont.generateShapes( this.m_strCenter_Value, 8 );
  //         var geometryText1 = new ShapeBufferGeometry( shapes1 );
  //             geometryText1.computeBoundingBox();
  //         tWidth = geometryText1.boundingBox.max.x - geometryText1.boundingBox.min.x;
  //         tHeight= geometryText1.boundingBox.max.y - geometryText1.boundingBox.min.y;		
  //         geometryText1.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );
  //         this.m_LineCenter_Label = new Mesh( geometryText1, mResource.mFontTex );
          
  //         var geometry1  = new BoxBufferGeometry( tWidth+10, tHeight+10, 0);
  //         geometry1.translate( 0, 0, 0.5 );
  //         this.m_LineCenter_Box1= new Mesh(geometry1, new MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 		
  //         var tPoly1 = new Geometry();					
  //         tPoly1.vertices.push(new Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
  //         tPoly1.vertices.push(new Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
  //         tPoly1.vertices.push(new Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
  //         this.m_LineCenter_Box = new Line( tPoly1, new LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
  //         this.m_LineCenter_Label.add(this.m_LineCenter_Box);
  //         this.m_LineCenter_Label.add(this.m_LineCenter_Box1);
  //         this.m_LineCenter_Label.position.x  = ( pos1.x+ pos2.x )/2;			
  //         this.m_LineCenter_Label.position.y  = ( pos1.y+ pos2.y )/2;
  //         //===========================================================================================================================		
  //         this.m_LineCenter.add(this.m_LineCenter_Label);			
  //         */
  // };

  // this.UpdateText = function (tFlue, fValue, iType) {
  //   // 只更新文字，不更新位置
  //   const box = new Box3();
  //   box.setFromObject(tFlue.m_RenderData2D);
  //   // 显示离墙距离		
  //   switch (iType) {
  //     case 0:
  //       {
  //         var fx = this.m_LineLeft_Label.position.x;
  //         var fy = this.m_LineLeft_Label.position.y;
  //         this.m_LineLeft.remove(this.m_LineLeft_Label);

  //         this.m_strLeft_Value = parseInt(fValue).toString();

  //         // 左边数字
  //         const shapes = mHouseClass.mFont.generateShapes(parseInt(fValue).toString(), 8);
  //         const geometryText = new ShapeBufferGeometry(shapes);
  //         geometryText.computeBoundingBox();
  //         var tWidth = geometryText.boundingBox.max.x - geometryText.boundingBox.min.x;
  //         var tHeight = geometryText.boundingBox.max.y - geometryText.boundingBox.min.y;
  //         geometryText.translate(- 0.5 * tWidth, -0.5 * tHeight, 1.2);
  //         this.m_LineLeft_Label = new Mesh(geometryText, mResource.mFontTex);

  //         const geometry = new BoxBufferGeometry(tWidth + 10, tHeight + 10, 0);
  //         geometry.translate(0, 0, 0.5);
  //         this.m_LineLeft_Box1 = new Mesh(geometry, new MeshBasicMaterial({ color: 0xeeeeee, opacity: 1.0, transparent: true }));
  //         const tPoly = new Geometry();
  //         tPoly.vertices.push(new Vector3(-(tWidth + 10) / 2, -(tHeight + 10) / 2, 1), new Vector3(-(tWidth + 10) / 2, (tHeight + 10) / 2, 1));
  //         tPoly.vertices.push(new Vector3((tWidth + 10) / 2, (tHeight + 10) / 2, 1), new Vector3((tWidth + 10) / 2, -(tHeight + 10) / 2, 1));
  //         tPoly.vertices.push(new Vector3(-(tWidth + 10) / 2, -(tHeight + 10) / 2, 1));
  //         this.m_LineLeft_Box = new Line(tPoly, new LineBasicMaterial({ color: 0x0088F8, linewidth: 1, opacity: 1 }));
  //         this.m_LineLeft_Label.add(this.m_LineLeft_Box1);
  //         this.m_LineLeft_Label.add(this.m_LineLeft_Box);
  //         this.m_LineLeft_Label.position.x = fx;
  //         this.m_LineLeft_Label.position.y = fy;
  //         this.m_LineLeft.add(this.m_LineLeft_Label);
  //       }
  //       break;
  //     case 1:
  //       {
  //         var fx = this.m_LineRight_Label.position.x;
  //         var fy = this.m_LineRight_Label.position.y;
  //         this.m_LineRight.remove(this.m_LineRight_Label);

  //         this.m_strRight_Value = parseInt(fValue).toString();

  //         // 右边数字
  //         //===========================================================================================================================
  //         const shapes1 = mHouseClass.mFont.generateShapes(parseInt(fValue).toString(), 8);
  //         const geometryText1 = new ShapeBufferGeometry(shapes1);
  //         geometryText1.computeBoundingBox();
  //         tWidth = geometryText1.boundingBox.max.x - geometryText1.boundingBox.min.x;
  //         tHeight = geometryText1.boundingBox.max.y - geometryText1.boundingBox.min.y;
  //         geometryText1.translate(- 0.5 * tWidth, -0.5 * tHeight, 1.2);
  //         this.m_LineRight_Label = new Mesh(geometryText1, mResource.mFontTex);

  //         const geometry1 = new BoxBufferGeometry(tWidth + 10, tHeight + 10, 0);
  //         geometry1.translate(0, 0, 0.5);
  //         this.m_LineRight_Box1 = new Mesh(geometry1, new MeshBasicMaterial({ color: 0xeeeeee, opacity: 1.0, transparent: true }));
  //         const tPoly1 = new Geometry();
  //         tPoly1.vertices.push(new Vector3(-(tWidth + 10) / 2, -(tHeight + 10) / 2, 1), new Vector3(-(tWidth + 10) / 2, (tHeight + 10) / 2, 1));
  //         tPoly1.vertices.push(new Vector3((tWidth + 10) / 2, (tHeight + 10) / 2, 1), new Vector3((tWidth + 10) / 2, -(tHeight + 10) / 2, 1));
  //         tPoly1.vertices.push(new Vector3(-(tWidth + 10) / 2, -(tHeight + 10) / 2, 1));
  //         this.m_LineRight_Box = new Line(tPoly1, new LineBasicMaterial({ color: 0x0088F8, linewidth: 1, opacity: 1 }));
  //         this.m_LineRight_Label.add(this.m_LineRight_Box);
  //         this.m_LineRight_Label.add(this.m_LineRight_Box1);
  //         this.m_LineRight_Label.position.x = fx;
  //         this.m_LineRight_Label.position.y = fy;
  //         //===========================================================================================================================		
  //         this.m_LineRight.add(this.m_LineRight_Label);
  //       }
  //       break;
  //     case 2:
  //       {
  //         var fx = this.m_LineCenter_Label.position.x;
  //         var fy = this.m_LineCenter_Label.position.y;
  //         this.m_LineCenter.remove(this.m_LineCenter_Label);
  //         this.m_strCenter_Value = parseInt(fValue).toString();

  //         // 顶部数字
  //         //===========================================================================================================================
  //         const shapes2 = mHouseClass.mFont.generateShapes(parseInt(fValue).toString(), 8);
  //         const geometryText2 = new ShapeBufferGeometry(shapes2);
  //         geometryText2.computeBoundingBox();
  //         tWidth = geometryText2.boundingBox.max.x - geometryText2.boundingBox.min.x;
  //         tHeight = geometryText2.boundingBox.max.y - geometryText2.boundingBox.min.y;
  //         geometryText2.translate(- 0.5 * tWidth, -0.5 * tHeight, 1.2);
  //         this.m_LineCenter_Label = new Mesh(geometryText2, mResource.mFontTex);

  //         const geometry2 = new BoxBufferGeometry(tWidth + 10, tHeight + 10, 0);
  //         geometry2.translate(0, 0, 0.5);
  //         this.m_LineCenter_Box1 = new Mesh(geometry2, new MeshBasicMaterial({ color: 0xeeeeee, opacity: 1.0, transparent: true }));
  //         this.m_LineCenter_Label.add(this.m_LineCenter_Box1);

  //         const tPoly2 = new Geometry();
  //         tPoly2.vertices.push(new Vector3(-(tWidth + 10) / 2, -(tHeight + 10) / 2, 1), new Vector3(-(tWidth + 10) / 2, (tHeight + 10) / 2, 1));
  //         tPoly2.vertices.push(new Vector3((tWidth + 10) / 2, (tHeight + 10) / 2, 1), new Vector3((tWidth + 10) / 2, -(tHeight + 10) / 2, 1));
  //         tPoly2.vertices.push(new Vector3(-(tWidth + 10) / 2, -(tHeight + 10) / 2, 1));
  //         this.m_LineCenter_Box = new Line(tPoly2, new LineBasicMaterial({ color: 0x0088F8, linewidth: 1, opacity: 1 }));
  //         this.m_LineCenter_Label.add(this.m_LineCenter_Box);

  //         this.m_LineCenter_Label.position.x = fx;
  //         this.m_LineCenter_Label.position.y = fy;
  //         //===========================================================================================================================				
  //         this.m_LineCenter.add(this.m_LineCenter_Label);
  //       }
  //       break;
  //   }
  // };

  // this.GetLiQiangJuLi = function (pos, tFloor) {
  //   for (let i = 0; i < tFloor.mLabelArray.length; i++) {
  //     const sx = tFloor.mLabelArray[i].m_vStart_Floor.x;
  //     const sy = tFloor.mLabelArray[i].m_vStart_Floor.y;
  //     const ex = tFloor.mLabelArray[i].m_vEnd_Floor.x;
  //     const ey = tFloor.mLabelArray[i].m_vEnd_Floor.y;

  //     // 门窗，距离墙交点小于5时，容易判断不对在哪个墙上，和判断距离5有关系
  //     const ab = mMathClass.ClosestPointOnLine1(sx, sy, ex, ey, pos.x, pos.y, 1);
  //     if (ab[0] != 0)
  //       return i;
  //   }
  //   return -1;
  // };


  // this.OnPick2D_CtrlPos = function (mouseX, mouseY) {
  //   // 拾取HelpPos
  //   this.m_HelpPos1.material.color.set(0xffffff);
  //   this.m_HelpPos2.material.color.set(0xffffff);
  //   this.m_HelpPos1_Pick = false;
  //   this.m_HelpPos2_Pick = false;

  //   raycaster.setFromCamera(mouse, mCameraClass.m_Camera);
  //   var Intersections = raycaster.intersectObject(this.m_HelpPos1, true);
  //   if (Intersections.length > 0) {
  //     this.m_HelpPos1.material.color.set(0xffff00);
  //     this.m_HelpPos1_Pick = true;
  //     this.mCurMouseX = mouseX;
  //     this.mCurMouseY = mouseY;
  //     // 所在墙体
  //     for (var i = 0; i < mHouseClass.wallClass.mWallArray.length; i++) {
  //       var aa = mHouseClass.wallClass.mWallArray[i].DeDaoZhongXian();
  //       var ab = mMathClass.ClosestPointOnLine1(aa[0].x, aa[0].y, aa[1].x, aa[1].y, this.m_HelpPos1.position.x, this.m_HelpPos1.position.y, 10);
  //       if (ab[0] != 0) {
  //         this.m_pCurWall = mHouseClass.wallClass.mWallArray[i];
  //         break;
  //       }
  //     }
  //     return true;
  //   }

  //   var Intersections = raycaster.intersectObject(this.m_HelpPos2, true);
  //   if (Intersections.length > 0) {
  //     this.m_HelpPos2.material.color.set(0xffff00);
  //     this.m_HelpPos2_Pick = true;
  //     this.mCurMouseX = mouseX;
  //     this.mCurMouseY = mouseY;

  //     // 所在墙体
  //     for (var i = 0; i < mHouseClass.wallClass.mWallArray.length; i++) {
  //       var aa = mHouseClass.wallClass.mWallArray[i].DeDaoZhongXian();
  //       var ab = mMathClass.ClosestPointOnLine1(aa[0].x, aa[0].y, aa[1].x, aa[1].y, this.m_HelpPos2.position.x, this.m_HelpPos2.position.y, 10);
  //       if (ab[0] != 0) {
  //         this.m_pCurWall = mHouseClass.wallClass.mWallArray[i];
  //         break;
  //       }
  //     }
  //     return true;
  //   }

  //   return false;
  // };


  // this.ScaleDoor = function (mouseX, mouseY, e) {	// 拉伸窗户
  //   if (e.buttons == 1 && this.m_pCurDoor != null) {
  //     const axisZ = new Vector3(0, 0, 1);

  //     if (this.m_HelpPos1_Pick === true) {
  //       var aa = this.m_pCurWall.DeDaoZhongXian();
  //       var ab = mMathClass.ClosestPointOnLine1(aa[0].x, aa[0].y, aa[1].x, aa[1].y,
  //         this.m_HelpPos1.position.x + mouseX - this.mCurMouseX,
  //         this.m_HelpPos1.position.y + mouseY - this.mCurMouseY, 10);
  //       if (ab[0] != 0) {

  //         var fLength = Math.sqrt((ab[1] - this.m_HelpPos2.position.x) * (ab[1] - this.m_HelpPos2.position.x)
  //           + (ab[2] - this.m_HelpPos2.position.y) * (ab[2] - this.m_HelpPos2.position.y) + 0);

  //         if (this.m_pCurDoor.m_fLength < 30 && this.m_pCurDoor.m_fLength >= fLength)
  //           return true;
  //         this.m_pCurDoor.m_vPos.x = (ab[1] + this.m_HelpPos2.position.x) / 2;
  //         this.m_pCurDoor.m_vPos.y = (ab[2] + this.m_HelpPos2.position.y) / 2;
  //         this.m_pCurDoor.m_fLength = fLength;
  //         this.m_pCurDoor.OnMouseMove(this.m_pCurDoor.m_vPos.x, this.m_pCurDoor.m_vPos.y, 0,
  //           this.m_pCurDoor.m_fRotate, this.m_pCurDoor.m_fWidth);
  //         this.OnShowCtrl(this.m_pCurDoor);
  //         this.mCurMouseX = mouseX;
  //         this.mCurMouseY = mouseY;
  //         return true;
  //       }
  //     }

  //     if (this.m_HelpPos2_Pick === true) {
  //       var aa = this.m_pCurWall.DeDaoZhongXian();
  //       var ab = mMathClass.ClosestPointOnLine1(aa[0].x, aa[0].y, aa[1].x, aa[1].y,
  //         this.m_HelpPos2.position.x + mouseX - this.mCurMouseX,
  //         this.m_HelpPos2.position.y + mouseY - this.mCurMouseY, 10);
  //       if (ab[0] != 0) {
  //         var fLength = Math.sqrt((ab[1] - this.m_HelpPos1.position.x) * (ab[1] - this.m_HelpPos1.position.x)
  //           + (ab[2] - this.m_HelpPos1.position.y) * (ab[2] - this.m_HelpPos1.position.y) + 0);

  //         if (this.m_pCurDoor.m_fLength < 30 && this.m_pCurDoor.m_fLength >= fLength)
  //           return true;

  //         this.m_pCurDoor.m_vPos.x = (ab[1] + this.m_HelpPos1.position.x) / 2;
  //         this.m_pCurDoor.m_vPos.y = (ab[2] + this.m_HelpPos1.position.y) / 2;
  //         this.m_pCurDoor.m_fLength = fLength;
  //         this.m_pCurDoor.OnMouseMove(this.m_pCurDoor.m_vPos.x, this.m_pCurDoor.m_vPos.y, 0,
  //           this.m_pCurDoor.m_fRotate, this.m_pCurDoor.m_fWidth);
  //         this.OnShowCtrl(this.m_pCurDoor);
  //         this.mCurMouseX = mouseX;
  //         this.mCurMouseY = mouseY;
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // };

  // // 选中窗户 返回选中的窗户
  // this.OnPick2D = function (mouseX, mouseY) {
  //   for (j = 0; j < this.mDoorArray.length; j++) {
  //     const Intersections = raycaster.intersectObject(this.mDoorArray[j].m_RenderData2D);
  //     for (let i = 0; i < Intersections.length; i++) {
  //       m_ParamDoorDlg.ShowBar();
  //       return this.mDoorArray[j];
  //     }
  //   }
  //   return null;
  // };

  // this.OnShowHelp = function (mouseX, mouseY) {
  //   $('#container').css("cursor", "default");

  //   if (this.m_LineLeft_Box != undefined && this.m_LineLeft_Box != null)
  //     this.m_LineLeft_Box.material.color.set(0x0088F8);
  //   if (this.m_LineRight_Box != undefined && this.m_LineRight_Box != null)
  //     this.m_LineRight_Box.material.color.set(0x0088F8);
  //   if (this.m_LineCenter_Box != undefined && this.m_LineCenter_Box != null)
  //     this.m_LineCenter_Box.material.color.set(0x0088F8);

  //   //选择门
  //   for (var j = 0; j < this.mDoorArray.length; j++)
  //     this.mDoorArray[j].m_RenderWin2D.material.color.set(mResource.mColor);

  //   for (j = 0; j < this.mDoorArray.length; j++) {
  //     var Intersections = raycaster.intersectObject(this.mDoorArray[j].m_RenderData2D);
  //     for (let i = 0; i < Intersections.length; i++) {
  //       scene.remove(mHouseClass.wallClass.mHelpWall);		// 地面
  //       this.mDoorArray[j].OnShowHelp();
  //       return this.mDoorArray[j];
  //     }
  //   }

  //   // 选中尺寸标注
  //   var Intersections;
  //   if (this.m_LineLeft_Box != undefined && this.m_LineLeft_Box != null) {
  //     Intersections = raycaster.intersectObject(this.m_LineLeft_Box1);
  //     if (Intersections.length > 0) {
  //       $('#container').css("cursor", "text");
  //       this.m_LineLeft_Box.material.color.set(0xffff88);
  //       return this.m_LineLeft_Box;
  //     }
  //   }
  //   if (this.m_LineRight_Box != undefined && this.m_LineRight_Box != null) {
  //     Intersections = raycaster.intersectObject(this.m_LineRight_Box1);
  //     if (Intersections.length > 0) {
  //       $('#container').css("cursor", "text");
  //       this.m_LineRight_Box.material.color.set(0xffff88);
  //       return this.m_LineRight_Box;
  //     }
  //   }
  //   if (this.m_LineCenter_Box != undefined && this.m_LineCenter_Box != null) {
  //     Intersections = raycaster.intersectObject(this.m_LineCenter_Box1);
  //     if (Intersections.length > 0) {
  //       $('#container').css("cursor", "text");
  //       this.m_LineCenter_Box.material.color.set(0xffff88);
  //       return this.m_LineCenter_Box;
  //     }
  //   }

  //   return null;
  // };

  // //  拖拽选中的门
  // this.OnMouseDown_Door = function (mouseX, mouseY) {

  //   // 点击输入数字区域,保持显示
  //   this.g_GaiLiQiangJuLi = this.OnShowHelp(mouseX, mouseY);
  //   if ((this.g_GaiLiQiangJuLi == this.m_LineLeft_Box ||
  //     this.g_GaiLiQiangJuLi == this.m_LineRight_Box ||
  //     this.g_GaiLiQiangJuLi == this.m_LineCenter_Box) && this.g_GaiLiQiangJuLi) {
  //     return true;
  //   }

  //   this.m_pCurDoor = null;
  //   this.mCurMouseX = 0;
  //   this.mCurMouseY = 0;

  //   for (j = 0; j < this.mDoorArray.length; j++) {
  //     const Intersections = raycaster.intersectObject(this.mDoorArray[j].m_RenderData2D);
  //     for (let i = 0; i < Intersections.length; i++) {
  //       //OnMouseRightUp();
  //       mHouseClass.wallClass.OnHideWall();		// 隐藏选中的墙体					
  //       this.m_pCurDoor = this.mDoorArray[j];
  //       this.mCurMouseX = mouseX;
  //       this.mCurMouseY = mouseY;
  //       this.OnShowCtrl(this.mDoorArray[j]);
  //       return true;
  //     }
  //   }
  //   return false;
  // };


  // this.OnMouseMove_Door = function (mouseX, mouseY, e) {
  //   // 创建时，拖拽移动选中的门
  //   if (e.buttons == 1 && this.m_pCurDoor != null) {
  //     // 选中输入框，不移动
  //     if ((this.g_GaiLiQiangJuLi == this.m_LineLeft_Box ||
  //       this.g_GaiLiQiangJuLi == this.m_LineRight_Box ||
  //       this.g_GaiLiQiangJuLi == this.m_LineCenter_Box) && this.g_GaiLiQiangJuLi) {
  //       return true;
  //     }
  //     if (false == this.OnMouseMove(mouseX, mouseY))
  //       this.OnHideCtrl();
  //     else
  //       this.OnShowCtrl(this.m_pCurDoor);
  //     this.mCurMouseX = mouseX;
  //     this.mCurMouseY = mouseY;
  //     return true;
  //   }
  //   return false;
  // };



  // // 读取门数据
  // this.OnLoadDoor_Json = function (data) {
  //   const tDoor = new DoorData();
  //   this.mDoorArray.push(tDoor);

  //   const a1 = Number(data.start.x);
  //   const a2 = Number(data.start.y);
  //   const b1 = Number(data.end.x);
  //   const b2 = Number(data.end.y);
  //   const x1 = (a1 + b1) / 2 * 100;
  //   const y1 = (a2 + b2) / 2 * 100;

  //   const fLength = Math.sqrt((b1 - a1) * (b1 - a1)
  //     + (b2 - a2) * (b2 - a2)) * 100;

  //   const fWidth = 20;
  //   const fHeight = data.height * 100;

  //   const edge1 = new Vector3;
  //   edge1.x = b1 - a1;
  //   edge1.y = b2 - a2;

  //   if (Math.abs(edge1.x) < 0.001)
  //     edge1.x = 0.0;
  //   if (Math.abs(edge1.y) < 0.001)
  //     edge1.y = 0.0;

  //   let fRotate = 0;
  //   if (edge1.x == 0.0 && edge1.y == 0.0)			// atanf(0/0)�����ֵ
  //     fRotate = 0.0;
  //   else
  //     fRotate = Math.atan(edge1.y / edge1.x);

  //   const iMode = 0;
  //   const iMirror = 0;

  //   const strModelType = $(data).attr('source');


  //   const index = this.mDoorArray.length - 1;

  //   if (data.type == "ENTRANCE_DOOR")	//0：子母门
  //     //this.mDoorArray[index].OnInit(0,index);
  //     this.mDoorArray[index].OnInit(7, index);
  //   if (data.type == "DOOR")			//0：单开门
  //     this.mDoorArray[index].OnInit(0, index);
  //   if (data.type == "DOUBLE_DOOR")		//1：双开门
  //     this.mDoorArray[index].OnInit(2, index);
  //   if (data.type == "SLIDE_DOOR")		//2：2扇推拉门
  //     this.mDoorArray[index].OnInit(3, index);
  //   if (data.type == "WALL_HOLE")		//垭口
  //     this.mDoorArray[index].OnInit(4, index);


  //   this.mDoorArray[index].m_fLength = fLength;
  //   this.mDoorArray[index].m_fWidth = fWidth;
  //   this.mDoorArray[index].m_fHeight = fHeight;
  //   this.mDoorArray[index].m_fRotate = fRotate;
  //   this.mDoorArray[index].m_iMode = iMode;
  //   this.mDoorArray[index].m_iMirror = iMirror;
  //   this.mDoorArray[index].m_vPos.x = x1;
  //   this.mDoorArray[index].m_vPos.y = y1;
  //   this.mDoorArray[index].m_vPos.z = 0;
  //   this.mDoorArray[index].OnChangeMirror();
  //   this.mDoorArray[index].UpdateDoor();

  // };

  // /**
  //  * @api OnSave_XML
  //  * @apiDescription 保存门数据
  //  * @apiGroup Doorlass
  //  *                           
  //  */
  // this.OnSave_XML = function () {
  //   const nDoorNum = this.mDoorArray.length;

  //   let strDoorXML = `<DoorInfo num="${nDoorNum}"/>`;

  //   for (let index = 0; index < nDoorNum; ++index) {
  //     const doorInfo = this.mDoorArray[index];

  //     strDoorXML += `<DoorData PosX="${doorInfo.m_vPos.x}" PosY="${doorInfo.m_vPos.y}" PosZ="${doorInfo.m_vPos.z}" 
  //                               Length="${doorInfo.m_fLength}" Width="${doorInfo.m_fWidth}" Height="${doorInfo.m_fHeight}" 
  //                               Rotate="${doorInfo.m_fRotate}" Mode="${doorInfo.m_iMode}" Mirror="${doorInfo.m_iMirror}" ModelType="3ds" 
  //                               source="${doorInfo.m_strFile}" numTexture="1" ReplaceMaterial="0" DoorStyle="${100 + doorInfo.m_iStyle}" Material="">\r\n`;

  //     strDoorXML += `<Part `
  //     Object.keys(doorInfo.m_part_src).forEach(key => {
  //       const val = doorInfo.m_part_src[key]
  //       strDoorXML += `${key}="${val}" `
  //     })
  //     strDoorXML += `></Part>`
  //     strDoorXML += `<Texture>`;

  //     // strDoorXML += `<Part menshan="${doorInfo.m_menshan_src}" mentao="${doorInfo.m_mentao_src}" menkan="${doorInfo.m_menkan_src}"></Part>`

  //     const xmlDoc = $.parseXML(doorInfo.m_infoXML);
  //     if (xmlDoc) {
  //       for (let i = 0; i < xmlDoc.getElementsByTagName("node").length; i++) {
  //         const strOld = xmlDoc.getElementsByTagName("node")[i].attributes[2].nodeValue;
  //         const strNew = xmlDoc.getElementsByTagName("node")[i].attributes[1].nodeValue;
  //         if (strNew != "")
  //           strDoorXML += `<node index="${i}" path="${strNew}" pathOld="${strOld}"/>`;	// 被替换
  //         else
  //           strDoorXML += `<node index="${i}" path="" pathOld="${strOld}"/>`;			// 无替换
  //       }
  //     }

  //     strDoorXML += `</Texture>`;
  //     strDoorXML += `</DoorData>`;
  //   }

  //   return strDoorXML;
  // };

  // // 读取门数据
  // this.OnLoadDoor_XML = function (data) {
  //   const tDoor = new DoorData();
  //   this.mDoorArray.push(tDoor);

  //   const x1 = parseFloat($(data).attr('PosX'));
  //   const y1 = parseFloat($(data).attr('PosY'));
  //   const z1 = parseFloat($(data).attr('PosZ'));

  //   const fLength = parseFloat($(data).attr('Length'));
  //   const fWidth = parseFloat($(data).attr('Width'));
  //   const fHeight = parseFloat($(data).attr('Height'));

  //   const fRotate = parseFloat($(data).attr('Rotate'));
  //   const iMode = parseFloat($(data).attr('Mode'));
  //   const iMirror = parseFloat($(data).attr('Mirror'));

  //   const strModelType = $(data).attr('source');
  //   const iTexture = $(data).attr('numTexture');
  //   const iReplaceMaterial = $(data).attr('ReplaceMaterial');
  //   let iDoorStyle = $(data).attr('DoorStyle');

  //   const partInfo = $(data).find('Part');
  //   if (partInfo.length > 0) {
  //     const parts = partInfo[0].attributes;
  //     for (let i = 0; i < parts.length; i++) {
  //       const key = parts[i].nodeName;
  //       const val = parts[i].nodeValue;
  //       tDoor.m_part_src[key] = val;
  //     }
  //   }
  //   // tDoor.m_menshan_src = $(partInfo).attr('menshan');
  //   // tDoor.m_mentao_src = $(partInfo).attr('mentao');
  //   // tDoor.m_menkan_src = $(partInfo).attr('menkan');

  //   if (iDoorStyle == undefined)
  //     iDoorStyle = $(data).attr('Type');
  //   const index = this.mDoorArray.length - 1;
  //   //0：单开门  2：双开门  3：扇推拉门  4. 门洞 5.圆拱门 6.圆角门 7.子母门

  //   switch (iDoorStyle) {
  //     case "100":
  //       // 09-14 单开门增加保存替换
  //       this.mDoorArray[index].OnInit(0, index);
  //       break;
  //     case "102":
  //       this.mDoorArray[index].OnInit(2, index);
  //       break;
  //     case "103":
  //       this.mDoorArray[index].OnInit(3, index);
  //       break;
  //     case "104":
  //       this.mDoorArray[index].OnInit(4, index);
  //       break;
  //     case "105":
  //       this.mDoorArray[index].OnInit(5, index);
  //       break;
  //     case "106":
  //       this.mDoorArray[index].OnInit(6, index);
  //       break;
  //     case "107":
  //       this.mDoorArray[index].OnInit(7, index);
  //       break;
  //     default:
  //       this.mDoorArray[index].OnInit(0, index);
  //       break;
  //   }

  //   this.mDoorArray[index].m_fLength = fLength;
  //   this.mDoorArray[index].m_fWidth = fWidth;
  //   this.mDoorArray[index].m_fHeight = fHeight;
  //   this.mDoorArray[index].m_fRotate = fRotate;
  //   this.mDoorArray[index].m_iMode = iMode;
  //   this.mDoorArray[index].m_iMirror = iMirror;
  //   this.mDoorArray[index].m_vPos.x = x1;
  //   this.mDoorArray[index].m_vPos.y = y1;
  //   this.mDoorArray[index].m_vPos.z = 0;
  //   this.mDoorArray[index].OnChangeMirror();

  //   if ($(data).length > 0) {
  //     this.mDoorArray[index].m_infoXML = $(data)[0].outerHTML;
  //   }

  //   this.mDoorArray[index].UpdateDoor();

  // };

  // this.OnLoadDoor_Scanning = function (data) {
  //   const tDoor = new DoorData();
  //   this.mDoorArray.push(tDoor);

  //   const x1 = parseFloat($(data).attr('StartX'));
  //   const y1 = parseFloat($(data).attr('StartY'));
  //   const z1 = parseFloat($(data).attr('StartZ'));

  //   const x2 = parseFloat($(data).attr('EndX'));
  //   const y2 = parseFloat($(data).attr('EndY'));
  //   const z2 = parseFloat($(data).attr('EndZ'));

  //   const fLength = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) / 10;

  //   const fWidth = 20;
  //   const fHeight = parseFloat($(data).attr('Height')) / 10;

  //   let fRotate = 0.0;
  //   const edge1 = new Vector3;
  //   edge1.x = x2 - x1;
  //   edge1.y = y2 - y1;
  //   edge1.z = z2 - z1;

  //   if (Math.abs(edge1.x) < 0.001)
  //     edge1.x = 0.0;
  //   if (Math.abs(edge1.y) < 0.001)
  //     edge1.y = 0.0;

  //   if (edge1.x == 0.0 && edge1.y == 0.0)
  //     fRotate = 0.0;
  //   else
  //     fRotate = Math.atan(edge1.y / edge1.x);

  //   const iMode = 0;
  //   const iMirror = 0;
  //   //var iDoorStyle	 = 100;
  //   const iDoorStyle = '105';//开装默认测量导入户型门为门洞

  //   const index = this.mDoorArray.length - 1;
  //   //var index = 5; //开装默认测量导入户型门为门洞
  //   //0：单开门  1：双开门  2：2扇推拉门  3.3扇推拉门  4. 4扇推拉门   5. 门洞
  //   switch (iDoorStyle) {
  //     case "100":
  //       this.mDoorArray[index].OnInit(0, index);
  //       break;
  //     case "101":
  //     case "102":
  //       this.mDoorArray[index].OnInit(2, index);
  //       break;
  //     case "103":
  //     case "104":
  //       this.mDoorArray[index].OnInit(3, index);
  //       break;
  //     case "105":
  //       this.mDoorArray[index].OnInit(4, index);
  //       break;
  //     default:
  //       this.mDoorArray[index].OnInit(0, index);
  //       break;
  //   }

  //   this.mDoorArray[index].m_fLength = fLength;
  //   this.mDoorArray[index].m_fWidth = fWidth;
  //   this.mDoorArray[index].m_fHeight = fHeight;
  //   this.mDoorArray[index].m_fRotate = fRotate;
  //   this.mDoorArray[index].m_iMode = iMode;
  //   this.mDoorArray[index].m_iMirror = iMirror;
  //   this.mDoorArray[index].m_vPos.x = (x2 + x1) / 20;
  //   this.mDoorArray[index].m_vPos.y = (y2 + y1) / 20;
  //   this.mDoorArray[index].m_vPos.z = 0;
  //   this.mDoorArray[index].OnChangeMirror();
  //   this.mDoorArray[index].UpdateDoor();
  // };

  // //有三根长度相同的线端，线段间距离最大30CM
  // this.OnLoadDoor_CAD = function () {
  //   const tLineTopArray = [];
  //   const tWinLineArray = [];
  //   // 循环所有线段
  //   for (let i = 0; i < mHouseClass.mWallLineClass.mLineArray.length; i++) {
  //     let iIndex = 0;
  //     let bContinue = true;

  //     // 已确定是门线的线段
  //     for (let j = 0; j < tLineTopArray.length; j++) {
  //       if (tLineTopArray[j] == mHouseClass.mWallLineClass.mLineArray[i]) {
  //         bContinue = false;
  //         break;
  //       }
  //     }

  //     if (bContinue == false)
  //       continue;

  //     mHouseClass.mWallLineClass.mLineArray[i].OnUpdate();
  //     const fLength = mHouseClass.mWallLineClass.mLineArray[i].m_fLength;
  //     if (fLength < 30)  //墙厚
  //       continue;

  //     tWinLineArray.length = 0;
  //     for (let k = 0; k < mHouseClass.mWallLineClass.mLineArray.length; k++) {
  //       let bContinue1 = true;
  //       for (var m = 0; m < tLineTopArray.length; m++) {
  //         if (tLineTopArray[m] == mHouseClass.mWallLineClass.mLineArray[k]) {
  //           bContinue1 = false;
  //           break;
  //         }
  //       }

  //       if (bContinue1 == false)
  //         continue;
  //       mHouseClass.mWallLineClass.mLineArray[k].OnUpdate();
  //       if (Math.abs(fLength - mHouseClass.mWallLineClass.mLineArray[k].m_fLength) < 0.1)	// 线段长度相同
  //       {
  //         // 两线中心点之间距离小于30
  //         if (Math.sqrt((mHouseClass.mWallLineClass.mLineArray[i].m_vCenter.x - mHouseClass.mWallLineClass.mLineArray[k].m_vCenter.x) *
  //           (mHouseClass.mWallLineClass.mLineArray[i].m_vCenter.x - mHouseClass.mWallLineClass.mLineArray[k].m_vCenter.x) +
  //           (mHouseClass.mWallLineClass.mLineArray[i].m_vCenter.y - mHouseClass.mWallLineClass.mLineArray[k].m_vCenter.y) *
  //           (mHouseClass.mWallLineClass.mLineArray[i].m_vCenter.y - mHouseClass.mWallLineClass.mLineArray[k].m_vCenter.y)) < 30) // 厚度
  //         {
  //           tWinLineArray.push(mHouseClass.mWallLineClass.mLineArray[k]);
  //           iIndex++;
  //         }
  //       }
  //     }

  //     if (iIndex == 3)	// 是窗户
  //     {
  //       for (var m = 0; m < tWinLineArray.length; m++)
  //         tLineTopArray.push(tWinLineArray[m]);

  //       this.OnCreateDoor(tWinLineArray);

  //       //	if(this.mDoorArray.length ==2 )
  //       //		return;
  //     }
  //   }
  // };

  // this.OnCreateDoor = function (tWinlineArray) {
  //   let tMainLine;
  //   let MaxX = -99999;
  //   let MaxY = -99999;
  //   let MinX = 99999;
  //   let MinY = 99999;

  //   for (var i = 0; i < tWinlineArray.length; i++) {
  //     if (MaxX < tWinlineArray[i].m_vCenter.x) MaxX = tWinlineArray[i].m_vCenter.x;
  //     if (MaxY < tWinlineArray[i].m_vCenter.y) MaxY = tWinlineArray[i].m_vCenter.y;

  //     if (MinX > tWinlineArray[i].m_vCenter.x) MinX = tWinlineArray[i].m_vCenter.x;
  //     if (MinY > tWinlineArray[i].m_vCenter.y) MinY = tWinlineArray[i].m_vCenter.y;
  //   }


  //   const fWidth = Math.sqrt((MaxX - MinX) * (MaxX - MinX) + (MaxY - MinY) * (MaxY - MinY));
  //   if (fWidth > 1000)
  //     return;

  //   const tWin = new DoorData();
  //   this.mDoorArray.push(tWin);
  //   index = this.mDoorArray.length - 1;
  //   if (tWinlineArray[0].m_fLength < 160)
  //     this.mDoorArray[index].OnInit(0, index);
  //   else
  //     this.mDoorArray[index].OnInit(3, index);
  //   this.mDoorArray[index].m_fLength = tWinlineArray[0].m_fLength;
  //   this.mDoorArray[index].m_fWidth = fWidth + 10;
  //   this.mDoorArray[index].m_fHeight = 200;
  //   this.mDoorArray[index].m_fRotate = tWinlineArray[0].m_fRotate;
  //   this.mDoorArray[index].m_iMode = 0;
  //   this.mDoorArray[index].m_fHight = 0;
  //   this.mDoorArray[index].m_vPos.x = (MaxX + MinX) / 2;
  //   this.mDoorArray[index].m_vPos.y = (MaxY + MinY) / 2;
  //   this.mDoorArray[index].m_vPos.z = 0;
  //   this.mDoorArray[index].UpdateDoor();


  //   for (var i = 0; i < tWinlineArray.length; i++) {
  //     // 保留墙体用来挖洞
  //     if ((Math.abs(MaxX - tWinlineArray[i].m_vCenter.x) < 0.001 &&
  //       Math.abs(MaxY - tWinlineArray[i].m_vCenter.y) < 0.001) ||
  //       (Math.abs(MinX - tWinlineArray[i].m_vCenter.x) < 0.001 &&
  //         Math.abs(MinY - tWinlineArray[i].m_vCenter.y) < 0.001)) {
  //       continue;
  //     }
  //     else
  //       mHouseClass.mWallLineClass.OnDelete(tWinlineArray[i]);
  //   }
  // };

  // /**
  //  * @api OnKeyDown(iKey)
  //  * @apiGroup DoorClass
  //  * @apiDescription 键盘操作
  //  * @apiParam (参数) iKey  键盘值m_pCurWindow
  //  *                             
  //  */
  // this.OnKeyDown = function (iKey) {
  //   // 键盘操作
  //   if (this.m_pCurDoor == null)
  //     return false;

  //   switch (iKey) {
  //     case 46:	// 删除
  //       {
  //         if (this.m_pCurDoor)
  //           this.OnDelete(this.m_pCurDoor);
  //         this.m_pCurDoor = null;
  //       }
  //       return true;
  //   }

  //   if ((this.m_HelpBox.position.x != -99999 || this.m_HelpBox.position.y != -99999) &&
  //     this.g_GaiLiQiangJuLi != null && this.m_pCurDoor != null)	// 调整svg离墙距离
  //   {
  //     let a = e.keyCode;
  //     if (a == 46 || a == 48 ||
  //       a == 49 || a == 50 ||
  //       a == 51 || a == 52 ||
  //       a == 53 || a == 54 ||
  //       a == 55 || a == 56 ||
  //       a == 57 || a == 96 ||
  //       a == 97 || a == 98 ||
  //       a == 99 || a == 100 ||
  //       a == 101 || a == 102 ||
  //       a == 103 || a == 104 ||
  //       a == 105) {
  //       //字符转换成数字
  //       if (a >= 96) {
  //         a = a - 48;
  //       }

  //       if (this.g_GaiLiQiangJuLi == this.m_LineLeft_Box) {
  //         var strText = this.m_strLeft_Value;
  //         if (strText.length < 5) {
  //           strText += String.fromCharCode(a);
  //           this.UpdateText(this.m_pCurDoor, parseInt(strText), 0);
  //           this.g_GaiLiQiangJuLi = this.m_LineLeft_Box;
  //         }
  //         return true;
  //       }
  //       if (this.g_GaiLiQiangJuLi == this.m_LineRight_Box) {
  //         var strText = this.m_strRight_Value;
  //         if (strText.length < 5) {
  //           strText += String.fromCharCode(a);
  //           this.UpdateText(this.m_pCurDoor, parseInt(strText), 1);
  //           this.g_GaiLiQiangJuLi = this.m_LineRight_Box;
  //         }
  //         return true;
  //       }
  //       if (this.g_GaiLiQiangJuLi == this.m_LineCenter_Box) {
  //         var strText = this.m_strCenter_Value;
  //         if (strText.length < 5) {
  //           strText += String.fromCharCode(a);
  //           this.UpdateText(this.m_pCurDoor, parseInt(strText), 2);
  //           this.g_GaiLiQiangJuLi = this.m_LineCenter_Box;
  //         }
  //         return true;
  //       }
  //     }

  //     if (a == 8)		// 后退
  //     {
  //       if (this.g_GaiLiQiangJuLi == this.m_LineLeft_Box) {
  //         var strText = this.m_strLeft_Value;
  //         if (strText.length == 1)
  //           strText = 0;
  //         else
  //           strText = strText.slice(0, strText.length - 1);
  //         this.UpdateText(this.m_pCurDoor, parseInt(strText), 0);
  //         this.g_GaiLiQiangJuLi = this.m_LineLeft_Box;
  //         return true;
  //       }
  //       if (this.g_GaiLiQiangJuLi == this.m_LineRight_Box) {
  //         var strText = this.m_strRight_Value;
  //         if (strText.length == 1)
  //           strText = 0;
  //         else
  //           strText = strText.slice(0, strText.length - 1);
  //         this.UpdateText(this.m_pCurDoor, parseInt(strText), 1);
  //         this.g_GaiLiQiangJuLi = this.m_LineRight_Box;
  //         return true;
  //       }
  //       if (this.g_GaiLiQiangJuLi == this.m_LineCenter_Box) {
  //         var strText = this.m_strCenter_Value;
  //         if (strText.length == 1)
  //           strText = 0;
  //         else
  //           strText = strText.slice(0, strText.length - 1);
  //         this.UpdateText(this.m_pCurDoor, parseInt(strText), 2);
  //         this.g_GaiLiQiangJuLi = this.m_LineCenter_Box;
  //         return true;
  //       }
  //     }

  //     if (a == 13)	// 回车移动
  //     {
  //       if (this.g_GaiLiQiangJuLi == this.m_LineLeft_Box) {
  //         var fValue = this.m_fLeftOld - parseInt(this.m_strLeft_Value) / 10;

  //         // 得到旋转后的位置
  //         var tmpMatrix1 = new Matrix4().makeTranslation(-fValue, 0, 0);
  //         var tmpMatrix2 = new Matrix4().makeRotationZ(this.m_pCurDoor.m_fRotate);
  //         var tmpMatrix3 = new Matrix4().makeTranslation(this.m_LineLeft.geometry.vertices[1].x,
  //           this.m_LineLeft.geometry.vertices[1].y, 1);
  //         tmpMatrix2.multiply(tmpMatrix1);
  //         tmpMatrix3.multiply(tmpMatrix2);

  //         var vPos = new Vector3(0, 0, 0);
  //         vPos.applyMatrix4(tmpMatrix3);
  //         var ff = this.m_LineLeft.geometry.vertices[0].distanceTo(vPos);// 反向移动
  //         if (Math.abs(this.m_strLeft_Value / 10 - ff) > 1) {
  //           tmpMatrix1 = new Matrix4().makeTranslation(fValue, 0, 0);
  //           tmpMatrix2 = new Matrix4().makeRotationZ(this.m_pCurDoor.m_fRotate);
  //           tmpMatrix3 = new Matrix4().makeTranslation(this.m_pCurDoor.m_vPos.x, this.m_pCurDoor.m_vPos.y, 1);
  //           tmpMatrix2.multiply(tmpMatrix1);
  //           tmpMatrix3.multiply(tmpMatrix2);

  //           vPos = new Vector3(0, 0, 0);
  //           vPos.applyMatrix4(tmpMatrix3);
  //         }
  //         else {
  //           tmpMatrix1 = new Matrix4().makeTranslation(-fValue, 0, 0);
  //           tmpMatrix2 = new Matrix4().makeRotationZ(this.m_pCurDoor.m_fRotate);
  //           tmpMatrix3 = new Matrix4().makeTranslation(this.m_pCurDoor.m_vPos.x, this.m_pCurDoor.m_vPos.y, 1);
  //           tmpMatrix2.multiply(tmpMatrix1);
  //           tmpMatrix3.multiply(tmpMatrix2);

  //           vPos = new Vector3(0, 0, 0);
  //           vPos.applyMatrix4(tmpMatrix3);
  //         }


  //         this.m_pCurDoor.m_vPos.x = vPos.x;
  //         this.m_pCurDoor.m_vPos.y = vPos.y;
  //         this.m_pCurDoor.UpdateDoor();
  //         this.OnShowCtrl(this.m_pCurDoor);
  //         this.g_GaiLiQiangJuLi = this.m_LineLeft_Box;
  //         return true;
  //       }
  //       if (this.g_GaiLiQiangJuLi == this.m_LineRight_Box) {
  //         var fValue = this.m_fRightOld - parseInt(this.m_strRight_Value) / 10;

  //         // 得到旋转后的位置
  //         var tmpMatrix1 = new Matrix4().makeTranslation(fValue, 0, 0);
  //         var tmpMatrix2 = new Matrix4().makeRotationZ(this.m_pCurDoor.m_fRotate);
  //         var tmpMatrix3 = new Matrix4().makeTranslation(this.m_LineRight.geometry.vertices[1].x,
  //           this.m_LineRight.geometry.vertices[1].y, 1);
  //         tmpMatrix2.multiply(tmpMatrix1);
  //         tmpMatrix3.multiply(tmpMatrix2);
  //         var vPos = new Vector3(0, 0, 0);
  //         vPos.applyMatrix4(tmpMatrix3);

  //         var ff = this.m_LineRight.geometry.vertices[0].distanceTo(vPos);// 反向移动
  //         if (Math.abs(this.m_strRight_Value / 10 - ff) > 1) {
  //           tmpMatrix1 = new Matrix4().makeTranslation(-fValue, 0, 0);
  //           tmpMatrix2 = new Matrix4().makeRotationZ(this.m_pCurDoor.m_fRotate);
  //           tmpMatrix3 = new Matrix4().makeTranslation(this.m_pCurDoor.m_vPos.x, this.m_pCurDoor.m_vPos.y, 1);
  //           tmpMatrix2.multiply(tmpMatrix1);
  //           tmpMatrix3.multiply(tmpMatrix2);

  //           vPos = new Vector3(0, 0, 0);
  //           vPos.applyMatrix4(tmpMatrix3);
  //         }
  //         else {
  //           tmpMatrix1 = new Matrix4().makeTranslation(fValue, 0, 0);
  //           tmpMatrix2 = new Matrix4().makeRotationZ(this.m_pCurDoor.m_fRotate);
  //           tmpMatrix3 = new Matrix4().makeTranslation(this.m_pCurDoor.m_vPos.x, this.m_pCurDoor.m_vPos.y, 1);
  //           tmpMatrix2.multiply(tmpMatrix1);
  //           tmpMatrix3.multiply(tmpMatrix2);

  //           vPos = new Vector3(0, 0, 0);
  //           vPos.applyMatrix4(tmpMatrix3);
  //         }

  //         this.m_pCurDoor.m_vPos.x = vPos.x;
  //         this.m_pCurDoor.m_vPos.y = vPos.y;
  //         this.m_pCurDoor.UpdateDoor();
  //         this.OnShowCtrl(this.m_pCurDoor);
  //         this.g_GaiLiQiangJuLi = this.m_LineRight_Box;
  //         return true;
  //       }
  //       if (this.g_GaiLiQiangJuLi == this.m_LineCenter_Box) {
  //         if (parseInt(this.m_strCenter_Value) < 50) {
  //           alert(i18n.t("Language.Tdsitspr"));
  //           return false;
  //         }
  //         this.m_pCurDoor.m_fLength = parseInt(this.m_strCenter_Value) / 10;
  //         this.m_pCurDoor.UpdateDoor();
  //         this.OnShowCtrl(this.m_pCurDoor);
  //         this.g_GaiLiQiangJuLi = this.m_LineCenter_Box;
  //         return true;
  //       }
  //     }
  //   }

  //   return false;
  // };

  // // 3D下拾取		
  // this.OnPick3D = function () {
  //   if (app.header.showLable.check_LockAll == true)	// 锁定无法移动
  //     return;


  //   this.mCurMouseX = 0;
  //   this.mCurMouseY = 0;
  //   this.m_pMoveFurniture = null;
  //   let tDis = 99999;
  //   raycaster.setFromCamera(mouse, mCameraClass.m_Camera3D);
  //   // this.HideObjCtrl();
  //   for (let i = 0; i < this.mDoorArray.length; i++) {
  //     // this.mDoorArray[i].OnShowGroup(0);		// 不显示所有成组
  //     const Intersections = raycaster.intersectObject(this.mDoorArray[i].m_Object, true);
  //     if (Intersections.length > 0) {
  //       if (tDis > Intersections[0].distance)	// 距离最近
  //       {
  //         tDis = Intersections[0].distance;
  //         this.m_pCurDoor = this.mDoorArray[i];
  //         return this.mDoorArray[i];
  //       }
  //     }
  //   }
  // };
}