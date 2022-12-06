import * as THREE from 'three'
import mHouseClass from '@/core/houseClass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { BoxGeometry, Camera, Mesh, MeshBasicMaterial } from 'three'

import {
  Bend,
  ModifierStack,
  Twist,
  Noise,
  Cloth,
  UserDefined,
  Taper,
  Break,
  Bloat,
  Vector3,
  ModConstant
} from "three.modifiers";

class RenderScene2D {
  scene: any
  scene3D: any
  renderer: any
  renderer3D: any
  m_Camera!: Camera
  m_Camera3D!: Camera
  m_Control3D!: OrbitControls
  raycaster?: THREE.Raycaster
  plane: any

  scale = 1
  cameraZ = 600

  g_mouseX = 0 // 画布上的坐标
  g_mouseY = 0 // 画布上的坐标

  m_iMouseX_Old = 0
  m_iMouseY_Old = 0

  m_cPenType = 0

  // WIDTH: 

  constructor() {
    this.init()
    this.initPlane()
    this.initGrid()
    this.initEvent()
    this.render()
    this.initControls()
  }

  init() {
    const scene = new THREE.Scene();									// 2D平面
    scene.background = new THREE.Color(0xf1f3f8);
    this.scene = scene

    const m_Camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 50000);
    this.m_Camera = m_Camera
    this.m_Camera.position.x = 0;
    this.m_Camera.position.y = 0;
    this.m_Camera.position.z = 600;

    const scene3D = new THREE.Scene();	// 3D
    scene3D.background = new THREE.Color(0xe8e8e8);
    this.scene3D = scene3D

    this.m_Camera3D = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 50000);
    this.m_Camera3D.position.x = 0;
    this.m_Camera3D.position.y = 400;
    this.m_Camera3D.position.z = 820;

    // const geometry = new THREE.SphereGeometry(50);
    // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    // const sphereInter = new THREE.Mesh(geometry, material);
    // sphereInter.visible = true;
    // scene3D.add(sphereInter)
    // scene.add(sphereInter);

    const root = new THREE.Object3D();

    const raycaster = new THREE.Raycaster();
    raycaster.params.Line = { threshold: 5 };
    this.raycaster = raycaster

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);			// 2D
    renderer.clearDepth(); // important!
    this.renderer = renderer;

    const renderer2 = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });			// 3D
    renderer2.setPixelRatio(window.devicePixelRatio);
    renderer2.setSize(window.innerWidth, window.innerHeight);
    this.renderer3D = renderer2

    // const labelRenderer = new THREE.CSS2DRenderer();
    // labelRenderer.setSize( window.innerWidth, window.innerHeight );
    // labelRenderer.domElement.style.position = 'absolute';
    // labelRenderer.domElement.style.top = 0;

    // mPluginsClass = new PluginsClass();				// 插件相关
    // // mPluginsClass2 = new PluginsClass2();				// 插件相关

    // mFloorCameraClass = new FloorCameraClass();		// 地面选择操作
    // mFloorCameraClass.OnInit();

    // mResource  = new ResourceClass();
    // //mResource.OnInit(); //成功登录后调用此方法(mResource.InitFloor(floorAddr))

    // mBakImage = new BakImage();

    // mCameraClass  = new CameraClass();
    // mCameraClass.OnInit();

    // m_Coordniate = new Coordniate();	
    // m_Coordniate.OnInit();	

    // mHouseClass = new HouseClass();
    // mHouseClass.OnInit();	

    // mHelpClass = new HelpClass();
    // mHelpClass.OnInit();

    // mHelpLineClass = new HelpLineClass();
    // mHelpLineClass.OnInit();

    // mMathClass  = new MathClass();
    // mLightClass = new LightClass();
    // mLightClass.OnInit();


    // 初始化轮廓
    //===============================================================================================
    const composer = new EffectComposer(renderer2);

    const renderPass = new RenderPass(scene3D, this.camera3D);
    composer.addPass(renderPass);
    const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene3D, this.camera3D);
    composer.addPass(outlinePass);

    const effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    effectFXAA.renderToScreen = true;
    composer.addPass(effectFXAA);

    outlinePass.edgeStrength = 5.0;
    outlinePass.edgeGlow = 0.0;
    outlinePass.edgeThickness = 1.0;
    outlinePass.pulsePeriod = 0;
    // outlinePass.rotate = false;
    outlinePass.usePatternTexture = false;
    outlinePass.visibleEdgeColor.set(0xff0000);
    outlinePass.hiddenEdgeColor.set(0xff0000);
    //===============================================================================================

    // m_ParamObjDlg  = new Dlg_FurnitureAttribute();	// 家具参数窗口
    // m_ParamDoorDlg = new Dlg_DoorAttribute();   	// 门参数窗口
    // m_ParamWinDlg  = new Dlg_WindowAttribute(); 	// 窗户参数窗口
    // mParamSystemDlg= new Dlg_SystemAttribute();  	// 系统参数
    // m_ParamWallDlg = new Dlg_WallAttribute();		// 墙体参数窗口
    // m_ParamWallLineDlg = new Dlg_WallLineAttribute();		// CAD线条参数窗口
    // m_ParamTextDlg = new Dlg_TextAttribute();		// 文字参数窗口
    // m_ParamLabelDlg= new Dlg_LabelAttribute();		// 轮廓标注
    // m_ParamGroupDlg= new Dlg_GroupAttribute();      // 成组窗口
    // m_ParamGroundDlg=new Dlg_GroundAttribute();
    // m_ParamFloorDlg =new Dlg_FloorAttribute();		// 地面参数窗口  
    // m_ParamGroundData=new Dlg_GroundDataParam();	// 线段属性

    // m_ParamImageToPlanDlg= new Dlg_ImageToPlanAttribute();
    // mAnimation = new Animation();

    //	m_ParamTexDlg  = new Dlg_ParamTex();
    //	mRenderImage = new RenderImageClass();
    // document.querySelector('#container').appendChild( renderer.domElement );
    // console.log(container)
    // return renderer.domElement;

    //	initStats();
    // window.addEventListener('resize', onWindowResize,false );
    // container.addEventListener('mousewheel',mousewheel, false );
    // container.addEventListener('DOMMouseScroll', mousewheel);
    // container.addEventListener('mousedown', mouseDown,  false );
    // container.addEventListener('mousemove', mouseMove,  false );
    // container.addEventListener('mouseup', 	mouseUp,    false );

    // document.oncontextmenu = function (event) {
    //     event.preventDefault();
    //   };

    // //	OnpenupdateLogs();	// 日志

    // m_ParamImageToPlanDlg.Show();
    // $('#container1').hide();

    // mHouseClass.mHistory.Store();

    // mWebAPI	= new WebAPI();
    this.test()
  }

  /**
   * 初始化辅助平面
   *
   * @memberof RenderScene2D
   */
  initPlane() {
    const geo = new THREE.PlaneGeometry(16000, 16000)
    const mat = new THREE.MeshBasicMaterial({ color: '0xE8E8E8', opacity: 0, transparent: true })
    const plane = new THREE.Mesh(geo, mat)
    this.plane = plane
    this.getScene().add(plane);
  }

  /**
   * 初始化网格
   *
   * @memberof RenderScene2D
   */
  initGrid() {
    const size = 80000;
    const divisions = 800;
    const gridHelper = new THREE.GridHelper(size, divisions, 0xfbfbfb, 0xfbfbfb);
    const gridHelper2 = gridHelper.clone()
    gridHelper.rotateX(Math.PI / 2)
    this.getScene().add(gridHelper);
    this.scene3D.add(gridHelper2)
  }

  /**
   * 初始化事件
   *
   * @memberof RenderScene2D
   */
  initEvent() {
    this.getDom().addEventListener('wheel', this.onWheel.bind(this))
    this.getDom().addEventListener('mousemove', this.onMousemove.bind(this))
    this.getDom().addEventListener('mousedown', this.onMouseDown.bind(this))
    this.getDom3D().addEventListener('wheel', this.onWheel3D.bind(this))
    this.getDom3D().addEventListener('mousemove', this.onMousemove3D.bind(this))
  }

  initControls() {
    this.m_Control3D = new OrbitControls(this.m_Camera3D, this.getDom3D());

    this.m_Control3D.enabled = true;
    this.m_Control3D.maxPolarAngle = Math.PI / 2;
    // this.m_Control3D.center.set(0,160,0)
  }

  onWheel(ev: WheelEvent) {
    ev.preventDefault();

    if (ev.deltaY) {
      if (ev.deltaY < 0) this.zoomIn()
      if (ev.deltaY > 0) this.zoomOut()
    }
    // app.sliderSize.sliderSizeValue = m_Camera.position.z;

    this.m_Control3D.update()

    this.render()
  }
  
  onWheel3D(ev: WheelEvent) {
    this.render3D()
  }

  onMousemove(ev: MouseEvent) {
    let x = 0, y = 0
    x = ((ev.clientX) / window.innerWidth) * 2 - 1;
    y = - ((ev.clientY - 48) / window.innerHeight) * 2 + 1;
    // console.log(ev)
    this.GetMouseXY2D(x, y)
    if (ev.buttons === 1) { // 长按
      const m_Camera = this.getCamera()
      if (m_Camera.position.z < 2000) {
        m_Camera.position.x += (this.m_iMouseX_Old - ev.clientX);
        m_Camera.position.y += -(this.m_iMouseY_Old - ev.clientY);
      }
      else if (m_Camera.position.z >= 2000 && m_Camera.position.z < 3000) {
        m_Camera.position.x += (this.m_iMouseX_Old - ev.clientX) * 3;
        m_Camera.position.y += -(this.m_iMouseY_Old - ev.clientY) * 3;
      }
      else if (m_Camera.position.z >= 3000) {
        m_Camera.position.x += (this.m_iMouseX_Old - ev.clientX) * 5;
        m_Camera.position.y += -(this.m_iMouseY_Old - ev.clientY) * 5;
      }
      this.render()
    } else {
      switch (this.m_cPenType) {
        case 0:
          break;
        case 1:
          mHouseClass.wallClass.OnMouseMove(this.g_mouseX, this.g_mouseY)
          this.render()
          break
        case 2:
          mHouseClass.doorClass.OnMouseMove(this.g_mouseX, this.g_mouseY)
          this.render()
          break;
      }
    }
    this.m_iMouseX_Old = ev.clientX;
    this.m_iMouseY_Old = ev.clientY;
  }

  onMousemove3D() {
    this.render3D()
  }

  onMouseDown(ev: MouseEvent) {
    let x = 0, y = 0
    x = ((ev.clientX) / window.innerWidth) * 2 - 1;
    y = - ((ev.clientY - 48) / window.innerHeight) * 2 + 1;
    // console.log(ev)
    this.GetMouseXY2D(x, y)

    if (ev.button === 0) {
      switch (this.m_cPenType) {
        case 1:
          mHouseClass.wallClass.DrawWall(this.g_mouseX, this.g_mouseY, 0)
          break
        case 2:
          mHouseClass.doorClass.DrawDoor(this.g_mouseX, this.g_mouseY)
          break
      }
    }

  }

  /** 缩放(放大)
   * 
   */
  zoomIn() {
    const m_Camera = this.getCamera()
    m_Camera.position.z -= this.cameraZ;
    if (m_Camera.position.z < 0) m_Camera.position.z = 1;
    // m_Camera.updateProjectionMatrix();
  }

  /** 缩放(缩小)
   * 
   */
  zoomOut() {
    const m_Camera = this.getCamera()
    m_Camera.position.z += this.cameraZ;
    // m_Camera.updateProjectionMatrix();
  }

  render() {
    this.getRenderer().render(this.getScene(), this.getCamera())
  }

  render3D() {
    this.getRenderer3D().render(this.scene3D, this.camera3D)
  }

  getScene(): THREE.Scene {
    return this.scene;
  }

  getRenderer(): THREE.Renderer {
    return this.renderer;
  }

  getRenderer3D(): THREE.Renderer {
    return this.renderer3D
  }

  getDom() {
    return this.getRenderer().domElement;
  }

  getDom3D() {
    return this.getRenderer3D().domElement
  }

  getCamera() {
    return this.m_Camera
  }

  get camera3D() {
    return this.m_Camera3D
  }

  // OnCreateRoom1(iIndex)
  // {
  //    OnClear();
  //   let fValue = 0;
  //   switch(iIndex)
  //   {
  //     case 1:
  //     {
  //       fValue = 300;
  //       mHouseClass.mWallClass.OnAddWall(-fValue, fValue, fValue, fValue);
  //       mHouseClass.mWallClass.OnAddWall( fValue, fValue, fValue,-fValue);
  //       mHouseClass.mWallClass.OnAddWall( fValue,-fValue,-fValue,-fValue);
  //       mHouseClass.mWallClass.OnAddWall(-fValue,-fValue,-fValue, fValue);					
  //     }
  //     break;
  //     case 2:
  //     {
  //       fValue = 300;
  //       mHouseClass.mWallClass.OnAddWall(-fValue, fValue,      0, fValue);
  //       mHouseClass.mWallClass.OnAddWall(      0, fValue,      0,    100);
  //       mHouseClass.mWallClass.OnAddWall(      0,    100, fValue,	 100);
  //       mHouseClass.mWallClass.OnAddWall( fValue,    100, fValue,-fValue);
  //       mHouseClass.mWallClass.OnAddWall( fValue,-fValue,-fValue,-fValue);
  //       mHouseClass.mWallClass.OnAddWall(-fValue,-fValue,-fValue, fValue);
  //     }
  //     break;
  //     case 3:
  //     {
  //       fValue = 260;
  //       mHouseClass.mWallClass.OnAddWall(-fValue+130, fValue, fValue-130, fValue);
  //       mHouseClass.mWallClass.OnAddWall( fValue-130, fValue, fValue-130,      0);				
  //       mHouseClass.mWallClass.OnAddWall( fValue-130,      0, fValue,     	   0);					
  //       mHouseClass.mWallClass.OnAddWall( fValue,          0, fValue,	 -fValue);
  //       mHouseClass.mWallClass.OnAddWall( fValue,    -fValue,-fValue,    -fValue);
  //       mHouseClass.mWallClass.OnAddWall(-fValue,	 -fValue,-fValue,		   0);
  //       mHouseClass.mWallClass.OnAddWall(-fValue,          0,-fValue+130,      0);
  //       mHouseClass.mWallClass.OnAddWall(-fValue+130,	   0,-fValue+130, fValue);				
  //     }
  //     break;
  //     case 4:
  //     {
  //       fValue = 300;
  //       mHouseClass.mWallClass.OnAddWall( fValue, fValue,      0, fValue);
  //       mHouseClass.mWallClass.OnAddWall(      0, fValue,      0,    100);
  //       mHouseClass.mWallClass.OnAddWall(      0,    100,-fValue,	 100);
  //       mHouseClass.mWallClass.OnAddWall(-fValue,    100,-fValue,-fValue);
  //       mHouseClass.mWallClass.OnAddWall(-fValue,-fValue, fValue,-fValue);
  //       mHouseClass.mWallClass.OnAddWall( fValue,-fValue, fValue, fValue);					
  //     }
  //     break;
  //   }

  //   for( let i = 0; i< mHouseClass.mWallClass.mWallArray.length; i++ ){
  //     mHouseClass.mWallClass.mWallArray[i].OnShow(false);
  //   }
  //   mHouseClass.mWallClass.OnUpdateAllWall();	// 生成所有墙体
  //   mHouseClass.mFloorClass.OnUpdateLabel();			
  // };

  GetMouseXY2D(x: number, y: number) {
    this.raycaster!.setFromCamera({ x, y }, this.getCamera());
    const Intersections = this.raycaster!.intersectObjects([this.plane]);
    if (Intersections.length > 0) {
      this.g_mouseX = Intersections[0].point.x;
      this.g_mouseY = Intersections[0].point.y;
    }
  }

  test() {
    const box = new BoxGeometry(100, 100, 5)
    const mat = new MeshBasicMaterial({color: 'red'})
    const mesh = new Mesh(box, mat)
    this.scene3D.add(mesh)
    const modifier = new ModifierStack(mesh);
    const bend = new Bend(0, 50, 0);
    bend.constraint = ModConstant.LEFT;
    this.render3D()
    modifier.addModifier(bend);
    modifier.apply();
    this.render3D()
  }
}

export const renderScene2D = new RenderScene2D();
