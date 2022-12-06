import { renderScene2D } from '@/core/renderScene2D';
import { BufferAttribute, BufferGeometry, CircleGeometry, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, Object3D, Vector3 } from 'three';

/**
 * @api WallData
 * @apiGroup WallData
 * @apiName  0
 * @apiDescription 每段墙体类
 * @apiParam (成员变量) m_vStart  起点
 * @apiParam (成员变量) m_vEnd 	   终点
 * @apiParam (成员变量) m_vCenter 中心点
 * @apiParam (成员变量) m_fLength 墙体长度
 * @apiParam (成员变量) m_fWidth  墙体宽度
 * @apiParam (成员变量) m_fHeight 墙体高度
 * @apiParam (成员变量) m_fRotate 旋转弧度
 * @apiParam (成员变量) m_fValue  捕捉精度常数
 */
export default class WallData {
  /** 起点 */
  m_vStart!: Vector3;
  /** 终点 */
  m_vEnd!: Vector3;		// 终点	(需要保存)
  m_iType = 0;		// 0 墙中线对齐，1内墙线对齐，2外墙线对齐 (需要保存)
  m_fWidth = 20;		// (需要保存)

  m_vCenter!: Vector3;		// 中心点		
  m_fLength = 0;		// 长度

  m_fHeight = 280;	// 高度
  m_fRotate = 0;				// 旋转弧度
  m_fValue = 0;
  m_WallLineArray!: Vector3[];		// 计算用线条
  m_LastLineArray!: Vector3[];		// 渲染用线条
  mCurMouseX = 0;
  mCurMouseY = 0;

  mLabel?: Object3D;		// 标注尺寸线
  // mText;			// 尺寸文字
  // m_bShowLabel;	// 2D下是否显示标注到外侧

  // m_iWallType = 0; // 墙体类型 0 非承重墙; 1承重墙; 2矮墙（m_fHeight相关)
  mWall!: Mesh;			  // 辅助墙体
  // m_fLayer = 0.8;  // 帮助层高
  // mLoadBearingWall;// 承重墙显示
  // mLowWall;		  // 矮墙显示

  /**
   * 
   * @param x1 起点x
   * @param y1 起点y
   * @param iType 对齐形式： 0 墙中线对齐，1内墙线对齐，2外墙线对齐
   */
  OnInit(x1: number, y1: number, iType: number) {
    this.m_iType = iType;
    // this.m_fWidth = app.attributeInterface.wall.width.int / 10;	//墙体宽度
    // this.m_bShowLabel = true;	// 是否显示尺寸

    this.m_vStart = new Vector3(x1, y1, 0);
    this.m_vEnd = new Vector3(x1, y1, 0);
    this.m_vCenter = new Vector3(x1, y1, 0);

    this.m_WallLineArray = [];

    if (this.m_iType == 0)	// 0 墙中线对齐，1内墙线对齐，2外墙线对齐
      this.m_fValue = 0;
    if (this.m_iType == 1)
      this.m_fValue = 0.5;
    if (this.m_iType == 2)
      this.m_fValue = -0.5;

    this.m_WallLineArray.push(new Vector3(-0.5, -0.5 + this.m_fValue, 0));
    this.m_WallLineArray.push(new Vector3(0.5, -0.5 + this.m_fValue, 0));
    this.m_WallLineArray.push(new Vector3(0.5, 0.5 + this.m_fValue, 0));
    this.m_WallLineArray.push(new Vector3(-0.5, 0.5 + this.m_fValue, 0));

    this.m_LastLineArray = [];
    this.m_LastLineArray.push(new Vector3(-0.5, -0.5 + this.m_fValue, 0));
    this.m_LastLineArray.push(new Vector3(0.5, -0.5 + this.m_fValue, 0));
    this.m_LastLineArray.push(new Vector3(0.5, 0.5 + this.m_fValue, 0));
    this.m_LastLineArray.push(new Vector3(-0.5, 0.5 + this.m_fValue, 0));

    // 创建墙体矩形
    const wallGeom = new BufferGeometry();
    const wallVertices = new Float32Array([
      -0.5, -0.5 + this.m_fValue, 0,
      0.5, -0.5 + this.m_fValue, 0,
      -0.5, 0.5 + this.m_fValue, 0,
      0.5, -0.5 + this.m_fValue, 0,
      0.5, 0.5 + this.m_fValue, 0,
      -0.5, 0.5 + this.m_fValue, 0
    ])
    wallGeom.setAttribute('position', new BufferAttribute(wallVertices, 3))
    this.mWall = new Mesh(wallGeom, new MeshBasicMaterial({ color: 0x66A0f0, opacity: 0.6, transparent: true }));
    wallGeom.computeVertexNormals()

    renderScene2D.scene.add(this.mWall);
    this.mWall.visible = false

    // 创建墙体边框
    const wallBoundingGeom = new BufferGeometry();
    const wallBoundingVertices = new Float32Array([
      -0.5, -0.5 + this.m_fValue, 0.1,
      0.5, -0.5 + this.m_fValue, 0.1,
      0.5, -0.5 + this.m_fValue, 0.1,
      0.5, 0.5 + this.m_fValue, 0.1,
      0.5, 0.5 + this.m_fValue, 0.1,
      -0.5, 0.5 + this.m_fValue, 0.1,
      -0.5, 0.5 + this.m_fValue, 0.1,
      -0.5, -0.5 + this.m_fValue, 0.1,
    ])
    wallBoundingGeom.setAttribute('position', new BufferAttribute(wallBoundingVertices, 3));
    const tEdge = new LineSegments(wallBoundingGeom, new LineBasicMaterial({ color: 0x999999, opacity: 1 }));

    this.mWall.add(tEdge);

    const sphere = new CircleGeometry(6, 16);
    // tMat = new PointsMaterial({ color: 0xeeeeee });
    // this.mHelpWallPos1 = new Mesh(sphere, tMat);
    // this.mHelpWallPos2 = new Mesh(sphere, tMat);
    // this.mHelpWallPos1.position.x = -99999;
    // this.mHelpWallPos1.position.y = -99999;
    // this.mHelpWallPos1.position.z = 1.15;
    // this.mHelpWallPos2.position.x = -99999;
    // this.mHelpWallPos2.position.y = -99999;
    // this.mHelpWallPos2.position.z = 1.15;
    // scene.add(this.mHelpWallPos1);
    // scene.add(this.mHelpWallPos2);
    // const geometry = new Geometry();
    // geometry.vertices.push(
    //   new Vector3(-100 / 2, 0, 0), new Vector3(100 / 2, 0, 0),
    //   new Vector3(-100 / 2, -20, 0), new Vector3(-100 / 2, 20, 0),
    //   new Vector3(100 / 2, -20, 0), new Vector3(100 / 2, 20, 0)
    // );
    // this.mLabel = new LineSegments(geometry, new LineBasicMaterial({ color: '#525759', linewidth: 1, opacity: 1 }));
    // this.mLabel.visible = false;
    // scene.add(this.mLabel);

    // 将墙体坐标设置在课件范围之外
    this.mWall.position.x = -9999;
    this.mWall.position.y = -9999;
  }

  OnClearLine() {
    this.m_WallLineArray[0].x = -0.5;
    this.m_WallLineArray[0].y =  0.5+this.m_fValue;
    this.m_WallLineArray[0].z =  0;

    this.m_WallLineArray[1].x =  0.5;
    this.m_WallLineArray[1].y =  0.5+this.m_fValue;
    this.m_WallLineArray[1].z =  0;
    
        this.m_WallLineArray[2].x =  0.5;
        this.m_WallLineArray[2].y = -0.5+this.m_fValue;
        this.m_WallLineArray[2].z =  0;

    this.m_WallLineArray[3].x = -0.5;
    this.m_WallLineArray[3].y = -0.5+this.m_fValue;
    this.m_WallLineArray[3].z =  0;
  }

  OnUpdate() {
    //更新墙体
    this.m_fLength = Math.sqrt((this.m_vEnd.x - this.m_vStart.x) * (this.m_vEnd.x - this.m_vStart.x)
      + (this.m_vEnd.y - this.m_vStart.y) * (this.m_vEnd.y - this.m_vStart.y)
      + (this.m_vEnd.z - this.m_vStart.z) * (this.m_vEnd.z - this.m_vStart.z));

    const edge1 = new Vector3();
    edge1.x = this.m_vEnd.x - this.m_vStart.x;
    edge1.y = this.m_vEnd.y - this.m_vStart.y;
    edge1.z = this.m_vEnd.z - this.m_vStart.z;

    if (Math.abs(edge1.x) < 0.001)
      edge1.x = 0.0;
    if (Math.abs(edge1.y) < 0.001)
      edge1.y = 0.0;

    if (edge1.x == 0.0 && edge1.y == 0.0)
      this.m_fRotate = 0.0;
    else
      this.m_fRotate = Math.atan(edge1.y / edge1.x);

    this.m_vCenter.x = (this.m_vEnd.x + this.m_vStart.x) / 2;
    this.m_vCenter.y = (this.m_vEnd.y + this.m_vStart.y) / 2;
    this.m_vCenter.z = (this.m_vEnd.z + this.m_vStart.z) / 2;
  }

  OnRender() {
    this.OnClearLine();
    this.OnUpdate();
    if (this.m_fLength < 0.1)
      return;

    this.mWall.scale.set(this.m_fLength, this.m_fWidth, 1);
    this.mWall.rotation.z = this.m_fRotate;
    this.mWall.position.x = this.m_vCenter.x;
    this.mWall.position.y = this.m_vCenter.y;
    // this.mWall.position.z = this.m_fLayer;
    // this.mWall.geometry.verticesNeedUpdate = true;
    this.mWall.updateMatrix();
    this.m_WallLineArray[0] = this.m_WallLineArray[0].applyMatrix4(this.mWall.matrix);
    this.m_WallLineArray[1] = this.m_WallLineArray[1].applyMatrix4(this.mWall.matrix);
    this.m_WallLineArray[2] = this.m_WallLineArray[2].applyMatrix4(this.mWall.matrix);
    this.m_WallLineArray[3] = this.m_WallLineArray[3].applyMatrix4(this.mWall.matrix);

    // this.mHelpWallPos1.position.x = this.m_vStart.x;			
    // this.mHelpWallPos1.position.y = this.m_vStart.y;

    // this.mHelpWallPos2.position.x = this.m_vEnd.x;			
    // this.mHelpWallPos2.position.y = this.m_vEnd.y;

    // this.UpdateLabel(0);
  }

  /**
 * @api OnClear
 * @apiDescription 清空墙体
 * @apiGroup WallData                        
 */
  OnClear() {
    this.OnClearLine();
    renderScene2D.scene.remove(this.mWall);		// 墙体
    renderScene2D.scene.remove(this.mLabel);		// 尺寸线
    // scene.remove(this.mText);		// 文字	
    // scene.remove(this.mHelpWallPos1);
    // scene.remove(this.mHelpWallPos2);
  }

  /**
 * @api DeDaoZhongXian
 * @apiDescription 得到中线
 * @apiGroup WallData                        
 */
  DeDaoZhongXian() {
    //得到中线		
    const tArray = [];
    const vec1 = new Vector3((this.m_WallLineArray[0].x + this.m_WallLineArray[3].x) / 2, (this.m_WallLineArray[0].y + this.m_WallLineArray[3].y) / 2, 0);
    const vec2 = new Vector3((this.m_WallLineArray[1].x + this.m_WallLineArray[2].x) / 2, (this.m_WallLineArray[1].y + this.m_WallLineArray[2].y) / 2, 0);
    tArray.push(vec1);
    tArray.push(vec2);
    return tArray;
  }
}