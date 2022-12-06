import { renderScene2D } from "@/core/renderScene2D";
import { MathClass } from "@/core/utils/math";
import { Box3, BufferGeometry, DoubleSide, Mesh, MeshBasicMaterial, RepeatWrapping, Shape, ShapeGeometry, TextureLoader, Vector2, Vector3 } from "three";

/**
 * @api FloorData
 * @apiGroup FloorData
 * @apiName  0
 * @apiDescription 地平面类
 * @apiParam (成员变量) m_OBBox_Max 包围盒最大值
 * @apiParam (成员变量) m_OBBox_Min 包围盒最小值
 * @apiParam (成员变量) mFloorMesh  	  平面图地面Mesh
 * @apiParam (成员变量) mFloorMeshSVG 施工图地面Mesh
 * @apiParam (成员变量) mFloorMesh3D  3D地面Mesh
 * @apiParam (成员变量) mFloorExtrude 地面边挤压厚度
 * @apiParam (成员变量) mVerticesOld  原始数据
 * @apiParam (成员变量) mLabelArray   所有边的尺寸标注
 * @apiParam (成员变量) mLabelArray_Out 外围标注
 * @apiParam (成员变量) mPath   原始轮廓
 * @apiParam (成员变量) mPathHoles   洞轮廓
 * @apiParam (成员变量) mTextureData   材质数据
 * @apiParam (成员变量) mfLayer   层级
 * @apiParam (成员变量) mfArea   地面面积
 * @apiParam (成员变量) bUpdate  是否更新，地面重建时用
 * @apiParam (成员变量) m_fHeight  高度
 * @apiParam (成员变量) m_tmpWall  单房间显示时的临时墙体, 类似墙顶厚
 */
export default class FloorData {
  // 地面(2D/3D地面在一起)
  m_OBBox_Max = new Vector3();		// 包围盒
  m_OBBox_Min = new Vector3();
  mFloorMesh!: Mesh<ShapeGeometry, MeshBasicMaterial>; 								// 地面三角形
  mFloorMeshSVG: any;								// 颜色地块
  mFloorMesh3D: any;								// 3D地面
  mFloorExtrude: any;								// 挤压

  mTextData = null;
  mVerticesOld = [];				// 原始数据
  mLabelArray = [];				// 所有边的尺寸标注
  mLabelArray_Out = [];				// 外围标注
  mPath: any;										// 原始轮廓
  mPathHoles: any;								// 洞
  mTextureData: any;								// 材质数据
  mfLayer = -0.1;
  mfArea = 0.00;  							// 地面面积
  bUpdate = false;							// 是否更新，地面重建时用
  m_fHeight = 0;								// 高度
  m_tmpWall: any;									// 单房间显示时的临时墙体, 类似墙顶厚
  m_bGround = false;							// 是否是区域线绘制的地面

  mPathOutline: any

  // ExtrudeGeometry = function () {
  //   const offsetX = 0;
  //   const offsetY = 0;
  //   const shape = new THREE.Shape();
  //   shape.moveTo(this.mPath[0].X - offsetX, this.mPath[0].Y - offsetY);
  //   for (let i = 0; i < this.mPath.length; i++)
  //     shape.lineTo(this.mPath[i].X - offsetX, this.mPath[i].Y - offsetY);

  //   shape.lineTo(this.mPath[0].X - offsetX, this.mPath[0].Y - offsetY);

  //   const extrudeSettings = { amount: 1, bevelEnabled: false, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
  //   const tGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  //   if (this.mFloorExtrude)
  //     scene3D.remove(this.mFloorExtrude);

  //   const material = new THREE.MeshPhongMaterial({ color: 0x606060, specular: 0x909090, side: THREE.DoubleSide, wireframe: false, shading: THREE.SmoothShading });
  //   this.mFloorExtrude = new THREE.Mesh(tGeometry, material);
  //   this.mFloorExtrude.rotation.x = -Math.PI / 2;
  //   this.mFloorExtrude.scale.z = -20;
  //   this.mFloorExtrude.position.y = this.mfLayer - 1;
  //   scene3D.add(this.mFloorExtrude);
  // };

  OnPreBuildFloor(paths: number[][]) {
    this.m_OBBox_Max.x = -99999;
    this.m_OBBox_Max.y = -99999;
    this.m_OBBox_Min.x =  99999;
    this.m_OBBox_Min.y =  99999;
    for(let j = 0; j < paths.length; j++)
    {
      if( this.m_OBBox_Max.x < paths[j][0] ) this.m_OBBox_Max.x  = paths[j][0];
      if( this.m_OBBox_Max.y < paths[j][1] ) this.m_OBBox_Max.y  = paths[j][1];
      if( this.m_OBBox_Min.x > paths[j][0] ) this.m_OBBox_Min.x  = paths[j][0];
      if( this.m_OBBox_Min.y > paths[j][1] ) this.m_OBBox_Min.y  = paths[j][1]; 
    } 
  }

  /**
   * 生成地面区域(地板)
   *
   * @param {number[][]} paths 路径
   * @param {number} fLayer 层高
   * @memberof FloorData
   */
  OnBuildFloor(paths: number[][], fLayer: number) {
    // 生成所有地面区域
    this.mPath = paths;
    this.mPathOutline = paths;
    this.mfLayer = fLayer;
    this.mVerticesOld.length = 0;
    this.mfArea = 0;

    const shape = new Shape(paths.map(item => new Vector2(item[0] / 10, item[1] / 10)))
    const geom = new ShapeGeometry(shape)

    const loader = new TextureLoader()
    const tFloorTex = loader.load('https://3d.shixianjia.com/iHouse/data/texture/h5/img/floor.jpg', () => {renderScene2D.render()});
    tFloorTex.wrapS = tFloorTex.wrapT = RepeatWrapping;
    tFloorTex.needsUpdate = true;
    const mat = new MeshBasicMaterial({ map: tFloorTex });

    this.mFloorMesh = new Mesh(geom, mat);


    // ! ShapeGeometry需要缩放uv到[0.0,1.0]范围内，否则纹理显示异常
    const box = new Box3().setFromObject(this.mFloorMesh);
    const size = new Vector3();
    box.getSize(size);
    const vec3 = new Vector3(); // temp vector
    const attPos = geom.attributes.position;
    const attUv = geom.attributes.uv;
    for (let i = 0; i < attPos.count; i++){
      vec3.fromBufferAttribute(attPos, i);
      attUv.setXY(i,
        (vec3.x - box.min.x) / size.x,
        (vec3.y - box.min.y) / size.y
      );
    }

    const positions = geom.getAttribute('position').array
    for(let i = 0; i < positions.length; i += 6) {
      this.mfArea += MathClass.GetAreaInTri(positions[0], positions[1], positions[2], positions[3], positions[4], positions[5])
    }

    renderScene2D.scene.add(this.mFloorMesh);

    // ? 暂不清楚作用
    this.mFloorMeshSVG = new Mesh(geom, new MeshBasicMaterial({ color: 0xffffff }));
    renderScene2D.scene.add(this.mFloorMeshSVG);
    this.mFloorMeshSVG.visible = false;

    // TODO 以下方法还未迁移
    // this.OnUpdateLabel(tFloor1);	// 更新尺寸信息

    // this.OnChange2DTo3D();
    // this.OnShowLabel(true);			// 是否显示尺寸

    //去除了默认的房间文字
    //this.mTextData = mHouseClass.mTextClass.OnCreate((this.m_OBBox_Max.x+this.m_OBBox_Min.x)/2,(this.m_OBBox_Max.y+this.m_OBBox_Min.y)/2)
  }

  // /**
  //  * @api OnUpdateLabel()
  //  * @apiGroup FloorData 
  //  * @apiName  0
  //  * @apiDescription 更新标注
  //  * @apiParam (参数) tFloor 地面指针
  //  */
  // this.OnUpdateLabel = function (tFloor) {
  //   for (let i = 0; i < this.mLabelArray.length; i++)		// 内轮廓
  //     this.mLabelArray[i].OnClear();
  //   this.mLabelArray.length = 0;

  //   for (let i = 0; i < this.mLabelArray_Out.length; i++)	// 外轮廓
  //     this.mLabelArray_Out[i].OnClear();
  //   this.mLabelArray_Out.length = 0;

  //   // 生成内尺寸
  //   //===============================================================================================
  //   for (i = 0; i < tFloor.length - 1; i++) {
  //     let tLabel = new LabelClass();
  //     tLabel.OnInit(0x666666);	//0x58A3F3
  //     tLabel.OnUpdateLabel_2(tFloor[i], tFloor[i + 1], this);
  //     tLabel.m_vStart_Floor.x = tFloor[i].x;
  //     tLabel.m_vStart_Floor.y = tFloor[i].y;
  //     tLabel.m_vEnd_Floor.x = tFloor[i + 1].x;
  //     tLabel.m_vEnd_Floor.y = tFloor[i + 1].y;
  //     this.mLabelArray.push(tLabel);
  //   }

  //   let tLabel = new LabelClass();
  //   tLabel.OnInit(0x666666);
  //   tLabel.OnUpdateLabel_2(tFloor[i], tFloor[0], this);
  //   tLabel.m_vStart_Floor.x = tFloor[i].x;
  //   tLabel.m_vStart_Floor.y = tFloor[i].y;
  //   tLabel.m_vEnd_Floor.x = tFloor[0].x;
  //   tLabel.m_vEnd_Floor.y = tFloor[0].y;
  //   this.mLabelArray.push(tLabel);


  //   // 生成外尺寸
  //   //===============================================================================================			
  //   for (i = 0; i < tFloor.length - 1; i++) {
  //     let tLabel = new LabelClass();
  //     tLabel.OnInit(0x363636);
  //     tLabel.OnUpdateLabel_3(tFloor[i], tFloor[i + 1]);
  //     tLabel.m_vStart_Floor.x = tFloor[i].x;
  //     tLabel.m_vStart_Floor.y = tFloor[i].y;
  //     tLabel.m_vEnd_Floor.x = tFloor[i + 1].x;
  //     tLabel.m_vEnd_Floor.y = tFloor[i + 1].y;
  //     tLabel.OnShowLabel(false);
  //     this.mLabelArray_Out.push(tLabel);
  //   }

  //   let tLabel1 = new LabelClass();
  //   tLabel1.OnInit(0x363636);
  //   tLabel1.OnUpdateLabel_3(tFloor[i], tFloor[0]);
  //   tLabel1.m_vStart_Floor.x = tFloor[i].x;
  //   tLabel1.m_vStart_Floor.y = tFloor[i].y;
  //   tLabel1.m_vEnd_Floor.x = tFloor[0].x;
  //   tLabel1.m_vEnd_Floor.y = tFloor[0].y;
  //   tLabel1.OnShowLabel(false);
  //   this.mLabelArray_Out.push(tLabel1);
  //   //=================================================================================================			
  // };

  // /**
  //  * @api OnUpdateTex()
  //  * @apiGroup FloorData 
  //  * @apiName  0
  //  * @apiDescription 更新2D地面材质贴图
  //  * @apiParam (参数) ab 新贴图数据
  //  */
  // this.OnUpdateTex = function (ab) {
  //   this.mTextureData = new TextureData();
  //   this.mTextureData.OnCreate(ab);
  //   this.mTextureData.mTexture.wrapS = this.mTextureData.mTexture.wrapT = THREE.RepeatWrapping;
  //   this.mTextureData.mTexture.needsUpdate = true;

  //   this.mFloorMesh.material.map = this.mTextureData.mTexture;
  //   this.mFloorMesh.material.needsUpdate = true;
  // };

  // /**
  //  * @api OnUpdateHeight(fHeight)
  //  * @apiGroup FloorData 
  //  * @apiName  0
  //  * @apiDescription 更新3D下地面高度 
  //  */
  // this.OnUpdateHeight = function (fHeight) {
  //   if (this.mFloorMesh3D == null)
  //     return;
  //   this.m_fHeight = fHeight;
  //   for (let i = 0; i < this.mFloorMesh3D.geometry.vertices.length; i++)
  //     this.mFloorMesh3D.geometry.vertices[i].z = fHeight;

  //   this.mFloorMesh3D.geometry.computeBoundingBox();
  //   this.mFloorMesh3D.geometry.computeFaceNormals();
  //   this.mFloorMesh3D.geometry.verticesNeedUpdate = true;
  //   this.mFloorMesh3D.geometry.uvsNeedUpdate = true;
  // };

  // /**
  //  * @api OnChangeFloorTex()
  //  * @apiGroup FloorData 
  //  * @apiName  0
  //  * @apiDescription 更新3D地面材质贴图
  //  * @apiParam (参数) ab 新贴图数据
  //  */
  // this.OnChangeFloorTex = function (ab) {
  //   if (g_dataTex == null)
  //     return;
  //   this.OnUpdateTex3D(ab);		// 同时更新3D，2D地面
  // };

  // /**
  //  * @api OnUpdateTex3D(ab)
  //  * @apiGroup FloorData 
  //  * @apiName  0
  //  * @apiDescription 更新3D下地面
  //  * 
  //  */
  // this.OnUpdateTex3D = function (ab) {
  //   this.mTextureData = new TextureData();
  //   this.mTextureData.OnCreate(ab);
  //   this.mTextureData.mTexture.wrapS = this.mTextureData.mTexture.wrapT = THREE.RepeatWrapping;

  //   let fw = (this.m_OBBox_Max.x - this.m_OBBox_Min.x) / this.mTextureData.m_fLength;
  //   let fh = (this.m_OBBox_Max.y - this.m_OBBox_Min.y) / this.mTextureData.m_fWidth;

  //   this.mTextureData.mTexture.offset.set(0, 0);
  //   this.mTextureData.mTexture.repeat.set(fw * 10, fh * 10);
  //   this.mTextureData.mTexture.center.set(0, 0);
  //   this.mTextureData.mTexture.rotation = 0;

  //   this.mTextureData.m_x1 = (this.m_OBBox_Max.x + this.m_OBBox_Min.x) / 2;
  //   this.mTextureData.m_y1 = (this.m_OBBox_Max.y + this.m_OBBox_Min.y) / 2;
  //   // 判断3D地面是否生成
  //   if (this.mFloorMesh3D != undefined) {
  //     this.mFloorMesh3D.material.map = this.mTextureData.mTexture;
  //     this.mFloorMesh3D.material.needsUpdate = true;
  //   }
  //   this.mFloorMesh.material.map = this.mTextureData.mTexture;
  //   this.mFloorMesh.material.needsUpdate = true;
  // };

  // /**
  //  * @api OnShowLabel(bShow)
  //  * @apiGroup FloorData 
  //  * @apiName  0
  //  * @apiDescription 是否显示尺寸
  //  * @apiParam (参数) bShow false不显示 true显示
  //  */
  // this.OnShowLabel = function (bShow) {
  //   if (this.mFloorMesh.visible == false)
  //     return;
  //   if (this.m_bGround == true)		//  地面区域
  //   {
  //     if (this.mTextData)
  //       this.mTextData.OnShow(false);

  //     bShow = false;
  //   }

  //   for (let i = 0; i < this.mLabelArray.length; i++)
  //     this.mLabelArray[i].OnShowLabel(bShow);
  // };

  // // 显示 区域的轮廓尺寸标注
  // this.OnShowLabel_Out = function (bShow) {
  //   return;

  //   let fCenterX = (mHouseClass.mFloorClass.m_OBBox_Max.x + mHouseClass.mFloorClass.m_OBBox_Min.x) / 2;
  //   let fCenterY = (mHouseClass.mFloorClass.m_OBBox_Max.y + mHouseClass.mFloorClass.m_OBBox_Min.y) / 2;

  //   let off = 160; // 偏移高度
  //   for (let i = 0; i < this.mLabelArray_Out.length; i++) {
  //     if (this.mLabelArray_Out[i].mbShowLabel == false)	// 如果不显示，则不更新
  //       continue;

  //     let fPosX = (this.mLabelArray_Out[i].m_vEnd.x + this.mLabelArray_Out[i].m_vStart.x) / 2;
  //     let fPosY = (this.mLabelArray_Out[i].m_vEnd.y + this.mLabelArray_Out[i].m_vStart.y) / 2;

  //     let fL = Math.abs(this.mLabelArray_Out[i].m_vEnd.x - this.mLabelArray_Out[i].m_vStart.x);
  //     let fW = Math.abs(this.mLabelArray_Out[i].m_vEnd.y - this.mLabelArray_Out[i].m_vStart.y);

  //     //横向画线
  //     if (fL > fW) {
  //       if (fPosY > fCenterY) {
  //         let vStartH = new THREE.Vector3(this.mLabelArray_Out[i].m_vStart.x, mHouseClass.mFloorClass.m_OBBox_Max.y + off, 0);
  //         let vEndH = new THREE.Vector3(this.mLabelArray_Out[i].m_vEnd.x, mHouseClass.mFloorClass.m_OBBox_Max.y + off, 0);
  //         this.mLabelArray_Out[i].OnUpdateLabel_3(vStartH, vEndH);

  //       }
  //       else {
  //         let vStartH = new THREE.Vector3(this.mLabelArray_Out[i].m_vStart.x, mHouseClass.mFloorClass.m_OBBox_Min.y - off, 0);
  //         let vEndH = new THREE.Vector3(this.mLabelArray_Out[i].m_vEnd.x, mHouseClass.mFloorClass.m_OBBox_Min.y - off, 0);
  //         this.mLabelArray_Out[i].OnUpdateLabel_4(vStartH, vEndH);
  //       }
  //     }
  //     else	//竖向画线
  //     {
  //       if (fPosX > fCenterX) {
  //         let vStartV = new THREE.Vector3(mHouseClass.mFloorClass.m_OBBox_Max.x + off, this.mLabelArray_Out[i].m_vStart.y, 0);
  //         let vEndV = new THREE.Vector3(mHouseClass.mFloorClass.m_OBBox_Max.x + off, this.mLabelArray_Out[i].m_vEnd.y, 0);
  //         this.mLabelArray_Out[i].OnUpdateLabel_3(vStartV, vEndV);
  //       }
  //       else {
  //         let vStartV = new THREE.Vector3(mHouseClass.mFloorClass.m_OBBox_Min.x - off, this.mLabelArray_Out[i].m_vStart.y, 0);
  //         let vEndV = new THREE.Vector3(mHouseClass.mFloorClass.m_OBBox_Min.x - off, this.mLabelArray_Out[i].m_vEnd.y, 0);
  //         this.mLabelArray_Out[i].OnUpdateLabel_3(vStartV, vEndV);
  //       }
  //     }

  //     this.mLabelArray_Out[i].OnShowLabel(bShow);
  //   }
  // };

  /**
   * @api OnClear()
   * @apiGroup FloorData 
   * @apiName  0
   * @apiDescription 清除当前地面
   * 
   */
  OnClear () {
    this.OnClear2D();
    this.OnClear3D();
    // if (this.mTextData)
    //   mHouseClass.mTextClass.OnDelete(this.mTextData);
  }

  /**
   * @api OnClear2D()
   * @apiGroup FloorData 
   * @apiName  0
   * @apiDescription 清除当前2D地面
   * 
   */
  OnClear2D() {
    renderScene2D.scene.remove(this.mFloorMesh);		// 地面	
    renderScene2D.scene.remove(this.mFloorMeshSVG);
    // for (let i = 0; i < this.mLabelArray.length; i++)
    //   this.mLabelArray[i].OnClear();

    // this.mLabelArray.length = 0;

    // for (let i = 0; i < this.mLabelArray_Out.length; i++)
    //   this.mLabelArray_Out[i].OnClear();

    // this.mLabelArray_Out.length = 0;
  }

  /**
   * @api OnClear3D()
   * @apiGroup FloorData 
   * @apiName  0
   * @apiDescription 清除当前3D地面
   * 
   */
  OnClear3D() {
    // scene3D.remove(this.mFloorMesh3D);
  }

  // // 循环所有的标签，2D下拾取标注尺寸
  // this.OnPick2D_Label = function (mouseX, mouseY) {
  //   for (let i = 0; i < this.mLabelArray_Out.length; i++) {
  //     let ab = this.mLabelArray_Out[i].CheckPosOnLine(mouseX, mouseY);
  //     if (ab[0] != 0) {
  //       return this.mLabelArray_Out[i];
  //     }
  //   }
  //   return null;
  // };

  // this.OnChange2DTo3D = function () {
  //   let geom = new THREE.Geometry();
  //   let faces = this.mFloorMesh.geometry.faces;
  //   for (let k = 0; k < faces.length; k++) {
  //     let v1 = this.mFloorMesh.geometry.vertices[faces[k].a];
  //     let v2 = this.mFloorMesh.geometry.vertices[faces[k].b];
  //     let v3 = this.mFloorMesh.geometry.vertices[faces[k].c];

  //     if (this.mFloorMesh3D == null) {
  //       geom.vertices.push(new THREE.Vector3(v1.x, v1.y, v1.z));
  //       geom.vertices.push(new THREE.Vector3(v2.x, v2.y, v2.z));
  //       geom.vertices.push(new THREE.Vector3(v3.x, v3.y, v3.z));
  //     }
  //     else {
  //       let v11 = this.mFloorMesh3D.geometry.vertices[faces[k].a];
  //       let v21 = this.mFloorMesh3D.geometry.vertices[faces[k].b];
  //       let v31 = this.mFloorMesh3D.geometry.vertices[faces[k].c];

  //       geom.vertices.push(new THREE.Vector3(v1.x, v1.y, v11.z));
  //       geom.vertices.push(new THREE.Vector3(v2.x, v2.y, v21.z));
  //       geom.vertices.push(new THREE.Vector3(v3.x, v3.y, v31.z));
  //     }
  //     geom.faces.push(new THREE.Face3(3 * k + 0, 3 * k + 1, 3 * k + 2));

  //     let uv1 = this.mFloorMesh.geometry.faceVertexUvs[0][k][0];
  //     let uv2 = this.mFloorMesh.geometry.faceVertexUvs[0][k][1];
  //     let uv3 = this.mFloorMesh.geometry.faceVertexUvs[0][k][2];
  //     geom.faceVertexUvs[0][k] = [new THREE.Vector2(uv1.x, uv1.y), new THREE.Vector2(uv2.x, uv2.y), new THREE.Vector2(uv3.x, uv3.y)];
  //   }

  //   geom.computeFaceNormals();
  //   geom.verticesNeedUpdate = true;
  //   geom.uvsNeedUpdate = true;

  //   scene3D.remove(this.mFloorMesh3D);

  //   if (this.mTextureData == null)	// 默认的地面
  //   {

  //     let floorMat = new THREE.MeshStandardMaterial({
  //       roughness: 0.2,
  //       color: 0xbbbbbb,
  //       metalness: 0.2,
  //       map: mResource.floorDiffuseTex,
  //       bumpMap: mResource.floorBumpTex,
  //       roughnessMap: mResource.floorRoughnessTex
  //     });

  //     this.mFloorMesh3D = new THREE.Mesh(geom, floorMat);
  //     mResource.floorMat.needsUpdate = true;
  //   }
  //   else {
  //     let tMat = new THREE.MeshStandardMaterial({
  //       map: this.mTextureData.mTexture,
  //       roughness: 1,
  //     });
  //     this.mFloorMesh3D = new THREE.Mesh(geom, tMat);
  //   }
  //   this.mFloorMesh3D.rotation.x = -Math.PI / 2;
  //   scene3D.add(this.mFloorMesh3D);
  // };


  /**
   * 判断是否是相同地面区域
   *
   * @param {FloorData} tFloor
   * @return {*} 
   * @memberof FloorData
   */
  IsSameAs(tFloor: FloorData) {
    // 判断是否是相同地面区域
    // 中心点相同 && 面积相同 && 			
    const fCenterXOld = (this.m_OBBox_Max.x + this.m_OBBox_Min.x) / 2;
    const fCenterYOld = (this.m_OBBox_Max.y + this.m_OBBox_Min.y) / 2;

    const fCenterX = (tFloor.m_OBBox_Max.x + tFloor.m_OBBox_Min.x) / 2;
    const fCenterY = (tFloor.m_OBBox_Max.y + tFloor.m_OBBox_Min.y) / 2;

    // 面积相同 且 中心点相同
    if (Math.abs(tFloor.mfArea - this.mfArea) < 1 &&
      Math.abs(fCenterXOld - fCenterX) < 1 && Math.abs(fCenterYOld - fCenterY) < 1) {
      const vertices = this.mFloorMesh.geometry.attributes.position;
      console.log(vertices)
      for(let i = 0; i < vertices.array.length; i++) {
        const a = vertices.array[i]
        const b = tFloor.mFloorMesh.geometry.attributes.position.array[i]
        if (Math.abs(a - b) > 0.001) return false
      }
      return true;
    }
    return false;
  }


  // this.OnUpdateTmpWall = function () {
  //   let tLineArray = mHouseClass.mRoomClass.OnUpdateWall_3D_Out(this, -20);

  //   let tReg = [];
  //   for (let j = 0; j < tLineArray.length - 1; j++)
  //     tReg.push(new poly2tri.Point(tLineArray[j].x, tLineArray[j].y));

  //   let swctx = new poly2tri.SweepContext(tReg);
  //   //===========================================================
  //   let hole = [];
  //   for (let j = 0; j < this.mPath.length; j++) {
  //     hole.push(new poly2tri.Point(this.mPath[j].X, this.mPath[j].Y));
  //   }
  //   swctx.addHole(hole);

  //   swctx.triangulate();
  //   let triangles = swctx.getTriangles();

  //   let geom = new THREE.Geometry();
  //   for (let k = 0; k < triangles.length; k++) {
  //     geom.vertices.push(new THREE.Vector3(triangles[k].points_[0].x, triangles[k].points_[0].y, 0));
  //     geom.vertices.push(new THREE.Vector3(triangles[k].points_[1].x, triangles[k].points_[1].y, 0));
  //     geom.vertices.push(new THREE.Vector3(triangles[k].points_[2].x, triangles[k].points_[2].y, 0));

  //     geom.faces.push(new THREE.Face3(3 * k + 0, 3 * k + 1, 3 * k + 2));

  //     geom.faceVertexUvs[0][k] = [
  //       new THREE.Vector2(0, 0),
  //       new THREE.Vector2(0, 0),
  //       new THREE.Vector2(0, 0)];
  //   }
  //   geom.computeFaceNormals();
  //   geom.verticesNeedUpdate = true;
  //   geom.uvsNeedUpdate = true;

  //   scene.remove(this.m_tmpWall);
  //   this.m_tmpWall = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, opacity: 1, transparent: false, color: 0xAAAAAA }));
  //   scene.add(this.m_tmpWall);
  // };



  // this.GetWinAndDoorFromWall = function (iWall) {
  //   for (let k = 0; k < mHouseClass.mWindowClass.mWindowArray.length; k++) {
  //     let ab = mMathClass.ClosestPointOnLine1(this.mLabelArray_Out[iWall].m_vStart_Floor.x,
  //       this.mLabelArray_Out[iWall].m_vStart_Floor.y,
  //       this.mLabelArray_Out[iWall].m_vEnd_Floor.x,
  //       this.mLabelArray_Out[iWall].m_vEnd_Floor.y,
  //       mHouseClass.mWindowClass.mWindowArray[k].m_vPos.x,
  //       mHouseClass.mWindowClass.mWindowArray[k].m_vPos.y, 25);
  //     if (ab[0] != 0)
  //       return true;
  //   }

  //   for (let k = 0; k < mHouseClass.mDoorClass.mDoorArray.length; k++) {
  //     let ab = mMathClass.ClosestPointOnLine1(this.mLabelArray_Out[iWall].m_vStart_Floor.x,
  //       this.mLabelArray_Out[iWall].m_vStart_Floor.y,
  //       this.mLabelArray_Out[iWall].m_vEnd_Floor.x,
  //       this.mLabelArray_Out[iWall].m_vEnd_Floor.y,
  //       mHouseClass.mDoorClass.mDoorArray[k].m_vPos.x,
  //       mHouseClass.mDoorClass.mDoorArray[k].m_vPos.y, 25);
  //     if (ab[0] != 0)
  //       return true;
  //   }

  //   return false;
  // };

  // /**
  //  * @api GetWallClass3D_In(iIndex)
  //  * @apiDescription 用地面指定的轮廓线段找对应的墙体
  //  * @apiGroup FloorData
  //  * @apiParam (成员变量) iIndex  指定地面第几条轮廓线段                         
  //  */
  // this.GetWallClass3D_In = function (iIndex) {
  //   for (let i = 0; i < mHouseClass.mWallClass3D_In.mWallArray.length; i++) {
  //     let v1 = mHouseClass.mWallClass3D_In.mWallArray[i].m_vStart;
  //     let v2 = mHouseClass.mWallClass3D_In.mWallArray[i].m_vEnd;

  //     if (this.mLabelArray_Out[iIndex].m_vStart_Floor.distanceTo(v1) < 1 &&
  //       this.mLabelArray_Out[iIndex].m_vEnd_Floor.distanceTo(v2) < 1)
  //       return i;

  //     if (this.mLabelArray_Out[iIndex].m_vStart_Floor.distanceTo(v2) < 1 &&
  //       this.mLabelArray_Out[iIndex].m_vEnd_Floor.distanceTo(v1) < 1)
  //       return i;
  //   }

  //   return -1;
  // };

  // this.GetWinArray = function () {
  //   // 得到房间内的窗户数组
  //   let winArray = new Array();
  //   for (let i = 0; i < this.mLabelArray_Out.length; i++) {
  //     for (let k = 0; k < mHouseClass.mWindowClass.mWindowArray.length; k++) {
  //       let ab = mMathClass.ClosestPointOnLine1(this.mLabelArray_Out[i].m_vStart_Floor.x,
  //         this.mLabelArray_Out[i].m_vStart_Floor.y,
  //         this.mLabelArray_Out[i].m_vEnd_Floor.x,
  //         this.mLabelArray_Out[i].m_vEnd_Floor.y,
  //         mHouseClass.mWindowClass.mWindowArray[k].m_vPos.x,
  //         mHouseClass.mWindowClass.mWindowArray[k].m_vPos.y, 25);
  //       if (ab[0] != 0)
  //         winArray.push(mHouseClass.mWindowClass.mWindowArray[k]);
  //     }
  //   }
  //   return winArray;
  // };

  // this.GetDoorArray = function () {
  //   // 得到房间内的窗户数组
  //   let doorArray = new Array();
  //   for (let i = 0; i < this.mLabelArray_Out.length; i++) {
  //     for (let k = 0; k < mHouseClass.mDoorClass.mDoorArray.length; k++) {
  //       let ab = mMathClass.ClosestPointOnLine1(this.mLabelArray_Out[i].m_vStart_Floor.x,
  //         this.mLabelArray_Out[i].m_vStart_Floor.y,
  //         this.mLabelArray_Out[i].m_vEnd_Floor.x,
  //         this.mLabelArray_Out[i].m_vEnd_Floor.y,
  //         mHouseClass.mDoorClass.mDoorArray[k].m_vPos.x,
  //         mHouseClass.mDoorClass.mDoorArray[k].m_vPos.y, 25);
  //       if (ab[0] != 0)
  //         doorArray.push(mHouseClass.mDoorClass.mDoorArray[k]);
  //     }
  //   }
  //   return doorArray;
  // };

  // this.GetLengthFromWall = function (iWall) {
  //   // 得到墙体长度
  //   let fLength = Math.sqrt((this.mLabelArray_Out[iWall].m_vEnd_Floor.x - this.mLabelArray_Out[iWall].m_vStart_Floor.x) *
  //     (this.mLabelArray_Out[iWall].m_vEnd_Floor.x - this.mLabelArray_Out[iWall].m_vStart_Floor.x) +
  //     (this.mLabelArray_Out[iWall].m_vEnd_Floor.y - this.mLabelArray_Out[iWall].m_vStart_Floor.y) *
  //     (this.mLabelArray_Out[iWall].m_vEnd_Floor.y - this.mLabelArray_Out[iWall].m_vStart_Floor.y));
  //   return fLength;
  // };

  // /**
  //  * @api GetCountWall()
  //  * @apiGroup FloorData
  //  * @apiName  0
  //  * @apiDescription 得到墙体数量
  //  */
  // this.GetCountWall = function () {
  //   // 得到墙体数量
  //   return this.mLabelArray_Out.length;
  // };

  // // 获取角度
  // this.GetAngleFromWall = function (iWall, vPos2) {
  //   /*		    let vPos    = new THREE.Vector3();
  //           vPos.x = ( this.mLabelArray_Out[iWall].m_vEnd_Floor.x + this.mLabelArray_Out[iWall].m_vStart_Floor.x )/2;
  //           vPos.y = ( this.mLabelArray_Out[iWall].m_vEnd_Floor.y + this.mLabelArray_Out[iWall].m_vStart_Floor.y )/2;
  //           vPos.z = ( this.mLabelArray_Out[iWall].m_vEnd_Floor.z + this.mLabelArray_Out[iWall].m_vStart_Floor.z )/2;	
                  
  //         let vPosNew = new THREE.Vector3( vPos2.x - vPos.x, vPos2.y- vPos.y, 0);
          
  //         let P0 = new THREE.Vector3(0,0,0);
  //         let P1 = new THREE.Vector3(1,0,0);
  //         let fDegree = mMathClass.GetAngleFromP4(P0, P1, P0,vPosNew);
          
  //         if( (fDegree<=45 && fDegree>=-45) || (fDegree<=-145 && fDegree>=-180) )
  //           fDegree = fDegree+90;
  //         else
  //           fDegree = fDegree-90;
            
  //         return fDegree;*/

  //   let edge1 = new THREE.Vector3;
  //   edge1.x = this.mLabelArray_Out[iWall].m_vEnd_Floor.x - this.mLabelArray_Out[iWall].m_vStart_Floor.x;
  //   edge1.y = this.mLabelArray_Out[iWall].m_vEnd_Floor.y - this.mLabelArray_Out[iWall].m_vStart_Floor.y;
  //   edge1.z = this.mLabelArray_Out[iWall].m_vEnd_Floor.z - this.mLabelArray_Out[iWall].m_vStart_Floor.z;

  //   if (Math.abs(edge1.x) < 0.001)
  //     edge1.x = 0.0;
  //   if (Math.abs(edge1.y) < 0.001)
  //     edge1.y = 0.0;

  //   let fRotate = 0;
  //   if (edge1.x == 0.0 && edge1.y == 0.0)			// atanf(0/0)ֵ
  //     fRotate = 0.0;
  //   else
  //     fRotate = Math.atan(edge1.y / edge1.x);
  //   return fRotate * 180 / Math.PI;
  // };

  // // fDisWall 离墙距离
  // // fOffset  墙中心位置偏移距离
  // this.GetPosFromWall = function (iWall, fDisWall, fOffset) {
  //   let vPos = new THREE.Vector3();
  //   vPos.x = (this.mLabelArray_Out[iWall].m_vEnd_Floor.x + this.mLabelArray_Out[iWall].m_vStart_Floor.x) / 2;
  //   vPos.y = (this.mLabelArray_Out[iWall].m_vEnd_Floor.y + this.mLabelArray_Out[iWall].m_vStart_Floor.y) / 2;
  //   vPos.z = (this.mLabelArray_Out[iWall].m_vEnd_Floor.z + this.mLabelArray_Out[iWall].m_vStart_Floor.z) / 2;

  //   let fRotate = 0;
  //   let edge1 = new THREE.Vector3;
  //   edge1.x = this.mLabelArray_Out[iWall].m_vEnd_Floor.x - this.mLabelArray_Out[iWall].m_vStart_Floor.x;
  //   edge1.y = this.mLabelArray_Out[iWall].m_vEnd_Floor.y - this.mLabelArray_Out[iWall].m_vStart_Floor.y;

  //   if (Math.abs(edge1.x) < 0.001)
  //     edge1.x = 0.0;
  //   if (Math.abs(edge1.y) < 0.001)
  //     edge1.y = 0.0;

  //   let fRotate;
  //   if (edge1.x == 0.0 && edge1.y == 0.0)
  //     fRotate = 0.0;
  //   else
  //     fRotate = Math.atan(edge1.y / edge1.x);

  //   let tmpMatrix1 = new THREE.Matrix4().makeTranslation(-vPos.x, -vPos.y, 0);
  //   let tmpMatrix2 = new THREE.Matrix4().makeRotationZ(Math.PI / 2 + fRotate);		// 当前角度
  //   let tmpMatrix3 = new THREE.Matrix4().makeTranslation(vPos.x, vPos.y, 0);
  //   tmpMatrix2.multiply(tmpMatrix1);
  //   tmpMatrix3.multiply(tmpMatrix2);

  //   let vPos1 = new THREE.Vector3(vPos.x + 2, vPos.y + fOffset, 0);
  //   let vPos2 = vPos1.applyMatrix4(tmpMatrix3);
  //   let vNormal = new THREE.Vector3(0, 0, -1);
  //   let raycaster1 = new THREE.Raycaster(vPos2, vNormal);
  //   let Intersections = raycaster1.intersectObject(this.mFloorMesh);

  //   if (Intersections.length <= 0) {
  //     fDisWall = -fDisWall;
  //     vPos1 = new THREE.Vector3(vPos.x + fDisWall, vPos.y + fOffset, 0);
  //     vPos2 = vPos1.applyMatrix4(tmpMatrix3);
  //   }
  //   else {
  //     vPos1 = new THREE.Vector3(vPos.x + fDisWall, vPos.y + fOffset, 0);
  //     vPos2 = vPos1.applyMatrix4(tmpMatrix3);
  //   }

  //   return vPos2;
  // };

  // // 对面墙体
  // this.GetOppositeWallFromWall = function (iWall, fDisWall, fOffset) {
  //   let tPos = new THREE.Vector3()
  //   let vCenter = new THREE.Vector3();
  //   vCenter.x = (this.mLabelArray_Out[iWall].m_vEnd_Floor.x + this.mLabelArray_Out[iWall].m_vStart_Floor.x) / 2;
  //   vCenter.y = (this.mLabelArray_Out[iWall].m_vEnd_Floor.y + this.mLabelArray_Out[iWall].m_vStart_Floor.y) / 2;
  //   vCenter.z = (this.mLabelArray_Out[iWall].m_vEnd_Floor.z + this.mLabelArray_Out[iWall].m_vStart_Floor.z) / 2;

  //   let vPos = this.GetPosFromWall(iWall, fDisWall, fOffset);

  //   for (let i = 0; i < this.mLabelArray_Out.length; i++) {
  //     if (i == iWall || i + 1 == iWall || i - 1 == iWall)
  //       continue;
  //     // 两直线交点	
  //     let tArray = mMathClass.Get2Line(vCenter, vPos, this.mLabelArray_Out[i].m_vStart_Floor, this.mLabelArray_Out[i].m_vEnd_Floor);
  //     if (tArray[0] == true) {
  //       tPos.x = tArray[1];
  //       tPos.y = tArray[2];
  //       tPos.z = 0;

  //       let fTemp1 = this.mLabelArray_Out[i].m_vStart_Floor.distanceTo(tPos);
  //       let fTemp2 = this.mLabelArray_Out[i].m_vEnd_Floor.distanceTo(tPos);
  //       let fL = this.mLabelArray_Out[i].m_vEnd_Floor.distanceTo(this.mLabelArray_Out[i].m_vStart_Floor);
  //       if (fTemp1 < fL && fTemp2 < fL)// 交点在线段内
  //         return i;
  //     }
  //   }

  //   return -1;
  // };

}


