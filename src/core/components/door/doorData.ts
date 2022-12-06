import { renderScene2D } from "@/core/renderScene2D";
import { Box3, BufferAttribute, BufferGeometry, Group, Line, LineBasicMaterial, LineSegments, Matrix4, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Vector3 } from "three";
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader'

const m_strHttp = 'https://3d.shixianjia.com/ihouse/data'
const mResource = {mColor: 0xff0000}

enum DOOR_PART {
  'menshan' = 'menshan',
  'mentao' = 'mentao',
  'menkan' = 'menkan'
}
type DoorPartStr = {
  [DOOR_PART.menshan]?: string,
  [DOOR_PART.mentao]?: string,
  [DOOR_PART.menkan]?: string,
}

export class DoorData{
  m_vPos!: Vector3;
  m_fLength = 0;					// 长
  m_fHeight = 0;					// 高
  m_fRotate = 0;   			// 旋转
  m_fWidth = 0;					// 宽
  m_fHight = 0;			// 离地高
  m_iMode = 0;						//
  m_iMirror = 0;					// 镜像
  m_fMirror = 0;
  m_strFile = '';					//
  m_iStyle = 0;					// 单开门 0  	 双开门 2 		推拉门 3		门洞 4  圆拱门5  圆角门6  子母门7
  mData: any;							// 原始数据

  m_RenderData2D!: Mesh;		// 2D图标绘制
  m_Object!: Mesh | Group;
  m_RenderWin2D!: Line;

  //		m_fLength2;				// 移动时遇到短墙保存
  m_fLengthOld = 0;
  m_fWidthOld = 0;
  m_fHeightOld = 0;

  m_infoXML = "";
  isOpen = false; // 默认门关闭

  // 部分替换路径
  // m_menshan_src = "";
  // m_mentao_src = "";
  // m_menkan_src = "";
  m_part_src:DoorPartStr = {}
  m_part_name = <string[]>[]

  // 开门角度
  m_openingAgl = 45;
  m_openingRatio = 0.8;
  m_openingAglOld = 0;
  m_openingRatioOld = 0;

  OnInit(a: number, index: number, mstrFile?: string) {
    this.m_strFile = "cAF2488D8F0DE8F7D6C534817A60F9391/c8157435A40887E2EB4A54817A660A446/c74000EF390AFD5E068CBC00C0ACE93B1/Mldc688/Mldc688.jpg";
    this.mData = a;
    this.m_vPos = new Vector3(-9999, -9999, 0);

    if (a == 0)	// 单开门
    {
      this.m_strFile = "c9D6CCC12727C54E017D32BFCC7A6D68E/c3BE84C5ED247622240F82AC908B17E59/c74000EF390AFD5E068CBC00C0ACE93B1/adbc9772b329439ca15839d401a75daa/OSkctZ05/OSkctZ05.jpg";
      this.m_fLength = 100;//100;
      this.m_fWidth = 22;//22;//fWidth/10;
      this.m_fHeight = 230;//220;
      this.m_fRotate = 0;
      this.m_iMode = 0;
      this.m_iMirror = 0;
      this.m_iStyle = 0;
      this.m_part_name = ['menshan', 'mentao', 'menkan']

      // if (mHouseClass.mConfigurationFile.has("单开门")) {
      //   this.m_strFile = mHouseClass.mConfigurationFile.get("单开门");
      // }
    }

    if (a == 2)	// 双开门
    {
      //this.m_strFile 	 = "c9D6CCC12727C54E017D32BFCC7A6D68E/c916BA0B2F61BA555BB502B5BD2613533/c74000EF390AFD5E068CBC00C0ACE93B1/MECmen09/MECmen09.jpg";
      this.m_strFile = "c9D6CCC12727C54E017D32BFCC7A6D68E/c916BA0B2F61BA555BB502B5BD2613533/c74000EF390AFD5E068CBC00C0ACE93B1/427dcd3f9dbc4c75afec9057ff140487/THTvr02/THTvr02.jpg";
      this.m_fLength = 150;
      this.m_fWidth = 22;//22;//fWidth/10;
      this.m_fHeight = 230;//220;
      this.m_fRotate = 0;
      this.m_iMode = 0;
      this.m_iMirror = 0;
      this.m_iStyle = 2;
      this.m_part_name = ['menshanLef', 'menshanRig', 'mentao', 'menkan']

      // if (mHouseClass.mConfigurationFile.has("双开门")) {
      //   this.m_strFile = mHouseClass.mConfigurationFile.get("双开门");
      // }
    }

    if (a == 3)	// 推拉门
    {
      //this.m_strFile 	 = "c9D6CCC12727C54E017D32BFCC7A6D68E/c019CDDB9E1CADEF8D5A325EB3EC1AC25/c74000EF390AFD5E068CBC00C0ACE93B1/MECmen07/MECmen07.jpg";
      // this.m_strFile = "c9D6CCC12727C54E017D32BFCC7A6D68E/c019CDDB9E1CADEF8D5A325EB3EC1AC25/c74000EF390AFD5E068CBC00C0ACE93B1/MECmen11/MECmen11.jpg";
      this.m_strFile = "c9D6CCC12727C54E017D32BFCC7A6D68E/4deb9903c19a4cbb8a03c892ca3e13fe/c74000EF390AFD5E068CBC00C0ACE93B1/cc7a6ba667564054afaba3659904cc9a/yimen1/yimen1.jpg"
      this.m_fLength = 200;//180;
      this.m_fWidth = 22;//22;//fWidth/10;
      this.m_fHeight = 230;//220;
      this.m_fRotate = 0;
      this.m_iMode = 0;
      this.m_iMirror = 0;
      this.m_iStyle = 3;

      // if (mHouseClass.mConfigurationFile.has("移门")) {
      // 	this.m_strFile = mHouseClass.mConfigurationFile.get("移门");
      // }
    }


    if (a == 4)	// 门洞
    {
      this.m_strFile = "c9D6CCC12727C54E017D32BFCC7A6D68E/c916BA0B2F61BA555BB502B5BD2613533/c318DC7341D80337E0C93745A20367092/SFdfs01/SFdfs01.jpg";
      this.m_fLength = 180;
      this.m_fWidth = 22;//fWidth/10;
      this.m_fHeight = 220;
      this.m_fRotate = 0;
      this.m_iMode = 0;
      this.m_iMirror = 0;
      this.m_iStyle = 4;

      // if (mHouseClass.mConfigurationFile.has("门洞")) {
      //   this.m_strFile = mHouseClass.mConfigurationFile.get("门洞");
      // }
    }

    if (a == 5)	// 圆拱门
    {
      this.m_strFile = "c9D6CCC12727C54E017D32BFCC7A6D68E/c318DC7341D80337E0C93745A20367092/c318DC7341D80337E0C93745A20367092/GXmen01/GXmen01.jpg";
      this.m_fLength = 98;//100;
      this.m_fWidth = 22;//22;//fWidth/10;
      this.m_fHeight = 230;//220;
      this.m_fRotate = 0;
      this.m_iMode = 0;
      this.m_iMirror = 0;
      this.m_iStyle = 5;
    }

    if (a == 6)	// 圆角门
    {
      this.m_strFile = "c9D6CCC12727C54E017D32BFCC7A6D68E/c318DC7341D80337E0C93745A20367092/c318DC7341D80337E0C93745A20367092/GXmen02/GXmen02.jpg";
      this.m_fLength = 98;//100;
      this.m_fWidth = 22;//22;//fWidth/10;
      this.m_fHeight = 230;//220;
      this.m_fRotate = 0;
      this.m_iMode = 0;
      this.m_iMirror = 0;
      this.m_iStyle = 5;
    }

    if (a == 7)	// 子母门
    {
      this.m_strFile = "c9D6CCC12727C54E017D32BFCC7A6D68E/c916BA0B2F61BA555BB502B5BD2613533/c74000EF390AFD5E068CBC00C0ACE93B1/MECmen09/MECmen09.jpg";
      this.m_fLength = 120;//100;
      this.m_fWidth = 22;//22;//fWidth/10;
      this.m_fHeight = 230;//220;
      this.m_fRotate = 0;
      this.m_iMode = 0;
      this.m_iMirror = 0;
      this.m_iStyle = 7;

      // if (mHouseClass.mConfigurationFile.has("子母门")) {
      //   this.m_strFile = mHouseClass.mConfigurationFile.get("子母门");
      // }
    }

    if (mstrFile != undefined) {
      this.m_strFile = mstrFile;
    }

    this.OnCreateDoor2D();
    this.OnCreateDoor3D(index);
    this.UpdateDoor();
  }

  OnClear() {
    // if (this.m_Object != undefined && this.m_Object != null) {
    //   for (let i = 0; i < this.m_Object.children.length; i++) {
    //     scene3D.remove(this.m_Object.children[i]);
    //   }
    //   scene3D.remove(this.m_Object);
    // }
    renderScene2D.scene.remove(this.m_RenderData2D);
    renderScene2D.scene.remove(this.m_RenderWin2D);

  }

  // 3D下旋转
  OnUpdate3D() {
    // +1 是因为门与墙面配件是 并排关系
    const tmpMatrix4 = new Matrix4().makeScale(this.m_fLength / this.m_fLengthOld,
      (this.m_fWidth + 1) / this.m_fWidthOld,
      this.m_fHeight / this.m_fHeightOld);
    //	let tmpMatrix0= new Matrix4().makeTranslation(0,12,0);	// 墙体厚度
    const tmpMatrix0 = new Matrix4().makeTranslation(0, 0, 0);
    //let tmpMatrix1= new Matrix4().makeRotationZ(this.m_fRotate);
    const tmpMatrix1 = new Matrix4().makeRotationZ(this.m_fRotate + this.m_fMirror);
    //let tmpMatrix2= new Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,this.m_fHeight/2);
    const tmpMatrix2 = new Matrix4().makeTranslation(this.m_vPos.x, this.m_vPos.y, 0);
    const tmpMatrix3 = new Matrix4().makeRotationX(-Math.PI / 2);
    tmpMatrix0.multiply(tmpMatrix4);
    tmpMatrix1.multiply(tmpMatrix0);
    tmpMatrix2.multiply(tmpMatrix1);
    tmpMatrix3.multiply(tmpMatrix2);

    this.m_Object.rotation.x = 0;
    this.m_Object.rotation.y = 0;
    this.m_Object.rotation.z = 0;
    this.m_Object.position.x = 0;
    this.m_Object.position.y = 0;
    this.m_Object.position.z = 0;
    this.m_Object.scale.x = 1;
    this.m_Object.scale.y = 1;
    this.m_Object.scale.z = 1;
    this.m_Object.matrixWorld.identity();
    this.m_Object.matrix.identity();
    this.m_Object.applyMatrix4(tmpMatrix3);


    if ("" != this.m_infoXML) {
      // this.OnUpdateTex3D(this.m_infoXML);
    }
  }

  async OnCreateDoor3D(index: number) {
    const loader = new TDSLoader();

    const strPathFile = m_strHttp + "jiaju/" + this.m_strFile.slice(0, this.m_strFile.length - 4) + ".3ds";
    /*			// 兼容户型库老门窗数据
                    if( this.m_strFile.slice(0,4) == "door")
                            strPathFile = m_strHttp + this.m_strFile.slice(0,this.m_strFile.length-4)+".3ds";*/
    const paths = []


    const group = new Group()


    // 默认单开门路径替换为本地路径(门扇、门框、门槛分离的模型)
    if (strPathFile === "https://3d.shixianjia.com/ihouse/data/jiaju/c9D6CCC12727C54E017D32BFCC7A6D68E/c3BE84C5ED247622240F82AC908B17E59/c74000EF390AFD5E068CBC00C0ACE93B1/MECmen08/MECmen08.3ds" && Object.keys(this.m_part_src).length === 0) {
      this.m_part_src = {
        'mentao': 'c9D6CCC12727C54E017D32BFCC7A6D68E/c3BE84C5ED247622240F82AC908B17E59/c6EB07AC2BC8E92DDB0E32F68D9374E77/3fd9416346ec4a2889e83fac2442be01/DKmt1/DKmt1.3ds',
        'menshan': 'c9D6CCC12727C54E017D32BFCC7A6D68E/c3BE84C5ED247622240F82AC908B17E59/af3d17126e014e9d83c337a5a638afe7/da020637ef3841fdbc89e94cf81f42ff/DKms3/DKms3.3ds',
        'menkan': 'c9D6CCC12727C54E017D32BFCC7A6D68E/c3BE84C5ED247622240F82AC908B17E59/eea5146692964bbeb398ef196347802c/9825011c41c04bd9bf9c7ce26fdf82b8/DKmk3/DKmk3.3ds',
      }
      // await this.initSingleMenshanDoor(group)
    }

    // 默认双开门路径替换
    if (strPathFile === "https://3d.shixianjia.com/ihouse/data/jiaju/c9D6CCC12727C54E017D32BFCC7A6D68E/c916BA0B2F61BA555BB502B5BD2613533/c74000EF390AFD5E068CBC00C0ACE93B1/MECmen09/MECmen09.3ds" && Object.keys(this.m_part_src).length === 0) {
      this.m_part_src = {
        'mentao': 'c9D6CCC12727C54E017D32BFCC7A6D68E/c916BA0B2F61BA555BB502B5BD2613533/c6EB07AC2BC8E92DDB0E32F68D9374E77/25e2f707a3b3418c89a5f1a32af2040c/SKmt01/SKmt01.3ds',
        'menshan': 'c9D6CCC12727C54E017D32BFCC7A6D68E/c916BA0B2F61BA555BB502B5BD2613533/af3d17126e014e9d83c337a5a638afe7/378796dbfa054283b10945569588b3f8/SKms01/SKms01.3ds',
        'menkan': 'c9D6CCC12727C54E017D32BFCC7A6D68E/c916BA0B2F61BA555BB502B5BD2613533/eea5146692964bbeb398ef196347802c/1cef10d1258043e6991a0186fcb4aed9/SKmk01/SKmk01.3ds'
      }
      // await this.initDoubleMenshanDoor(group)
    }

    // 
    if (strPathFile === "https://3d.shixianjia.com/ihouse/data/jiaju/c9D6CCC12727C54E017D32BFCC7A6D68E/4deb9903c19a4cbb8a03c892ca3e13fe/c74000EF390AFD5E068CBC00C0ACE93B1/cc7a6ba667564054afaba3659904cc9a/yimen1/yimen1.3ds" && Object.keys(this.m_part_src).length === 0) {
      this.m_part_src = {
        'mentao': 'c9D6CCC12727C54E017D32BFCC7A6D68E/4deb9903c19a4cbb8a03c892ca3e13fe/c6EB07AC2BC8E92DDB0E32F68D9374E77/de0e65d96ab34977a0ce9bc196c5e172/YMmt01/YMmt01.3ds',
        'menshan': 'c9D6CCC12727C54E017D32BFCC7A6D68E/4deb9903c19a4cbb8a03c892ca3e13fe/af3d17126e014e9d83c337a5a638afe7/f7f00422b5e04e7fa203b0e4d96a9977/YMms01/YMms01.3ds',
        'menkan': 'c9D6CCC12727C54E017D32BFCC7A6D68E/4deb9903c19a4cbb8a03c892ca3e13fe/eea5146692964bbeb398ef196347802c/12898d23c4c84efe9dd44cb00c4faa4b/YMmk01/YMmk01.3ds'
      }
    }

    switch (this.m_iStyle) {
      case 0:
        await this.initSingleMenshanDoor(group)
        break
      case 2:
        await this.initDoubleMenshanDoor(group)
        break
      case 3:
        await this.initDoubleMenshanDoor(group)
        break
      default:
        break

    }
    // scene3D.add(group)

    // if (strPathFile === 'https://3d.shixianjia.com/ihouse/data/jiaju/c9D6CCC12727C54E017D32BFCC7A6D68E/c019CDDB9E1CADEF8D5A325EB3EC1AC25/c74000EF390AFD5E068CBC00C0ACE93B1/MECmen07/MECmen07.3ds') {
    // 	strPathFile = 'https://3d.shixianjia.com/ihouse/data/jiaju/c9D6CCC12727C54E017D32BFCC7A6D68E/4deb9903c19a4cbb8a03c892ca3e13fe/c74000EF390AFD5E068CBC00C0ACE93B1/cc7a6ba667564054afaba3659904cc9a/yimen1/yimen1.3ds'
    // }

    const k = strPathFile.lastIndexOf("/");


    // this.m_strPath = strPathFile.slice(0, k + 1);


    const box = new Box3();
    box.setFromObject(group);
    this.m_fLengthOld = (box.max.x - box.min.x);
    this.m_fWidthOld = (box.max.y - box.min.y);
    this.m_fHeightOld = (box.max.z - box.min.z);

    this.m_Object = group
  }

  /**
   * @apiName initSingleMenshanDoor
   * @apiDescription 加载单门扇模型
   * @apiParam  {Object3D} group 父节点
   * @apiGroup DoorData
   */
  async initSingleMenshanDoor(group: Group) {
    // 路径
    const menshanPath = m_strHttp + "jiaju/" + this.m_part_src['menshan']
    const mentaoPath = m_strHttp + "jiaju/" + this.m_part_src['mentao']
    const menkanPath = m_strHttp + "jiaju/" + this.m_part_src['menkan']
    // 加载
    const menshanObj = await loadPromise(menshanPath) as Group
    const mentaoObj = await loadPromise(mentaoPath) as Group
    const menkanObj = await loadPromise(menkanPath) as Group
    // 命名(最好在建模时名字就统一好，但是有些模型节点名字)
    const menshanMesh = menshanObj.children[0]
    const mentaoMesh = mentaoObj.children[0]
    const menshanBoxMesh = mentaoObj.children[1]
    const menkanMesh = menkanObj.children[0]
    menshanMesh.name = 'menshan'
    mentaoMesh.name = 'mentao'
    menkanMesh.name = 'menkan'
    // 门扇需要根据门套进行一次缩放
    const menshanBox = new Box3()
    menshanBox.setFromObject(menshanBoxMesh)
    const menshanBoxOld = new Box3()
    menshanBoxOld.setFromObject(menshanMesh)
    const menshanBoxLen = menshanBox.max.x - menshanBox.min.x
    const menshanBoxHeight = menshanBox.max.z - menshanBox.min.z
    const menshanLen = menshanBoxOld.max.x - menshanBoxOld.min.x
    const menshanHeight = menshanBoxOld.max.z - menshanBoxOld.min.z
    menshanMesh.scale.x *= -menshanBoxLen / menshanLen
    menshanMesh.scale.z *= menshanBoxHeight / menshanHeight
    //把节点添加进group
    group.add(menshanMesh)
    group.add(mentaoMesh)
    group.add(menkanMesh)
  }

  /**
   * @apiName initSingleMenshanDoor
   * @apiDescription 加载双门扇模型
   * @apiParam  {Object3D} group 父节点
   * @apiGroup DoorData
   */
  async initDoubleMenshanDoor(group: Group) {
    // 路径
    const menshanPath = m_strHttp + "jiaju/" + this.m_part_src['menshan']
    const mentaoPath = m_strHttp + "jiaju/" + this.m_part_src['mentao']
    const menkanPath = m_strHttp + "jiaju/" + this.m_part_src['menkan']
    // 加载
    const menshanObj = await loadPromise(menshanPath) as Group
    const mentaoObj = await loadPromise(mentaoPath) as Group
    const menkanObj = await loadPromise(menkanPath) as Group
    const menshanLef = menshanObj.getObjectByName('menshanLef')
    const menshanRig = menshanObj.getObjectByName('menshanRig')
    // 命名(最好在建模时名字就统一好，但是有些模型节点名字)
    const mentaoMesh = mentaoObj.children[0]
    const menkanMesh = menkanObj.children[0]
    // menshanMesh.name = 'menshan'
    mentaoMesh.name = 'mentao'
    menkanMesh.name = 'menkan'
    menshanObj.name = 'menshan'
    //把节点添加进group
    group.add(menshanObj)
    group.add(mentaoMesh)
    group.add(menkanMesh)
  }

  /** 
   * @api OnChangePart
   * @apiGroup DoorData
   * @apiDescription 替换门的部分(门扇/门框/门槛)
   */
  OnchangePart(part: string, path: string) {
    if (!this.m_Object) {
      return;
    }

    if (this.isOpen) {
      this.OnOpen();
    }

    const changeMap: any = {
      0: {
        'menshan': ['menshan'],
        'mentao': ['mentao'],
        'menkan': ['menkan'],
      },
      2: {
        // 'menshan': ['menshanLef', 'menshanRig'],
        'menshan': ['menshan'],
        'mentao': ['mentao'],
        'menkan': ['menkan'],
        'menshanLef': ['menshanLef'],
        'menshanRig': ['menshanRig'],
      },
      3: {
        'menshan': ['menshan'],
        'mentao': ['mentao'],
        'menkan': ['menkan'],
        'menshanLef': ['menshanLef'],
        'menshanRig': ['menshanRig'],
      }
    }

    // loader.load(path, function (object) {
    const changeObj = changeMap[this.m_iStyle]
    if (changeObj) {
      const changePart = changeObj[part];
      let error = false;
      changePart && changePart.forEach(async (item: DOOR_PART) => {
        if (error) {
          return
        }
        const obj = this.m_Object.getObjectByName(item);
        if (!obj) {
          error = true
          alert('该模型不支持部分替换')
          return
        }
        const object = await loadPromise(m_strHttp + "jiaju/" + path) as Group
        const obj_copy = obj.clone();
        let obj_new
        if ((this.m_iStyle === 2 || this.m_iStyle === 3) && item === 'menshan') {
          obj_new = object
        } else {
          obj_new = object.getObjectByName(item) || object.children[0];
        }

        if (obj_new.name !== item) {
          obj_new.name = item;
        }
        obj_copy.applyMatrix4(new Matrix4().identity())


        const box = new Box3();
        box.setFromObject(obj_copy);

        const box2 = new Box3();
        box2.setFromObject(obj_new);

        // 新部分的长宽高
        const m_fLength = (box2.max.x - box2.min.x);
        const m_fWidth = (box2.max.y - box2.min.y);
        const m_fHeight = (box2.max.z - box2.min.z);

        // 被替换部分的长宽高
        const m_fLengthOld = (box.max.x - box.min.x);
        const m_fWidthOld = (box.max.y - box.min.y);
        const m_fHeightOld = (box.max.z - box.min.z);

        // 将新部分的外接矩形缩放至和被替换部分的外接矩形一样
        obj_new.scale.set(m_fLengthOld / m_fLength, m_fWidthOld / m_fWidth, m_fHeightOld / m_fHeight || 1)

        this.m_Object.remove(obj);
        if (this.m_iStyle === 0 && item === 'menshan') {
          obj_new.scale.x *= -1
        }

        this.m_Object.add(obj_new);
        this.m_Object.updateWorldMatrix(true, true);
        object.applyMatrix4(obj_new.matrixWorld);
        object.updateWorldMatrix(true, true);
        // 如果替换门套，需要同时更新门扇
        if (item === 'mentao') {
          const menshans = changeObj['menshan']
          menshans && menshans.forEach((item: string) => {
            item && this.updateMenshan(this.m_Object.getObjectByName(item), object, m_fLengthOld / m_fLength, m_fHeightOld / m_fHeight)
          })
        }
        // scene3D.add(obj_new)

        // this[`m_${item}_src`] = path;
        this.m_part_src[item] = path;
      })
    }
    // })
  }

  /**
   * @apiName updateMenshan
   * @apiDescription 更新门扇的大小(替换门套时用到)
   * @apiParam  {Object3D} menshanObj 门扇object
   * @apiParam  {Ojbect3D} mentaoObj 门套object
   * @apiParam  {number} scaleX 门套缩放的x分量
   * @apiParam  {number} scaleZ 门套缩放的z分量
   * @apiGroup DoorData
   */
  updateMenshan(menshanObj: Object3D | undefined, mentaoObj: Object3D | undefined, scaleX: number, scaleZ: number) {
    if (!menshanObj || !mentaoObj) return
    const obj = mentaoObj.getObjectByName('menshanBox');
    if (!obj) return;
    const obj_copy = obj.clone();

    const obj_new = menshanObj.clone();

    const box = new Box3();
    box.setFromObject(obj_copy);

    const box_new = new Box3();
    box_new.setFromObject(obj_new);

    const m_fLength = (box_new.max.x - box_new.min.x);
    const m_fHeight = (box_new.max.z - box_new.min.z);

    const m_fLengthOld = (box.max.x - box.min.x) * scaleX;
    const m_fHeightOld = (box.max.z - box.min.z) * scaleZ;

    menshanObj.scale.x *= m_fLengthOld / m_fLength
    menshanObj.scale.z *= m_fHeightOld / m_fHeight
  }

  OnChangeMirror () {
    this.BuildDoorIcon(this.m_iStyle);

    if (this.m_iStyle == 0) // 单开门
    {

      if (this.m_iMirror == 0) {
        this.m_fMirror = 0;
        return;
      }

      if (this.m_iMirror == 1) {
        this.m_fMirror = 0;
        // for (let i = 0; i < this.m_RenderWin2D.geometry.vertices.length; i++) {
        //   this.m_RenderWin2D.geometry.vertices[i].x = -this.m_RenderWin2D.geometry.vertices[i].x;
        //   this.m_RenderWin2D.geometry.verticesNeedUpdate = true;
        // }
        return;
      }

      if (this.m_iMirror == 2) {
        this.m_fMirror = Math.PI;
        return;
      }

      if (this.m_iMirror == 3) {
        this.m_fMirror = Math.PI;
        // for (let i = 0; i < this.m_RenderWin2D.geometry.vertices.length; i++) {
        //   this.m_RenderWin2D.geometry.vertices[i].x = -this.m_RenderWin2D.geometry.vertices[i].x;
        //   this.m_RenderWin2D.geometry.verticesNeedUpdate = true;
        // }
        return;
      }
    }

    if (this.m_iStyle == 2) // 对开门
    {
      if (this.m_iMirror == 0) {
        this.m_fMirror = 0;
        return;
      }

      if (this.m_iMirror == 2) {
        this.m_fMirror = Math.PI;
        return;
      }
    }

    if (this.m_iStyle == 7) // 单开门
    {

      if (this.m_iMirror == 0) {
        this.m_fMirror = 0;
        return;
      }

      if (this.m_iMirror == 1) {
        this.m_fMirror = 0;
        // for (let i = 0; i < this.m_RenderWin2D.geometry.vertices.length; i++) {
        //   this.m_RenderWin2D.geometry.vertices[i].x = -this.m_RenderWin2D.geometry.vertices[i].x;
        //   this.m_RenderWin2D.geometry.verticesNeedUpdate = true;
        // }
        return;
      }

      if (this.m_iMirror == 2) {
        this.m_fMirror = Math.PI;
        return;
      }

      if (this.m_iMirror == 3) {
        this.m_fMirror = Math.PI;
        // for (let i = 0; i < this.m_RenderWin2D.geometry.vertices.length; i++) {
        //   this.m_RenderWin2D.geometry.vertices[i].x = -this.m_RenderWin2D.geometry.vertices[i].x;
        //   this.m_RenderWin2D.geometry.verticesNeedUpdate = true;
        // }
        return;
      }
    }
  }

  OnCreateDoor2D () {
    const groundGeometry = new PlaneGeometry(1, 1, 1, 1);
    const groundMaterial = new MeshBasicMaterial({ color: 0xffffff, opacity: 1, transparent: true });
    this.m_RenderData2D = new Mesh(groundGeometry, groundMaterial);
    renderScene2D.scene.add(this.m_RenderData2D);
    switch (this.m_iStyle) {
      case 0:		// 单开门
        this.BuildDoorIcon(0);
        break;
      case 2:	//双开门
        this.BuildDoorIcon(2);
        break;
      case 3: //推拉门
        this.BuildDoorIcon(3);
        break;
      case 4: // 洞
      case 5:
        this.BuildDoorIcon(4);
        break;
      case 7:
        this.BuildDoorIcon(7);
        break;
    }
  }

  OnMouseMove(x1: number, y1: number, z1: number, radian: number, width1: number) {
    this.m_vPos.x = x1;
    this.m_vPos.y = y1;
    this.m_vPos.z = z1;
    this.m_fRotate = radian;
    this.m_fWidth = width1;
    this.UpdateDoor();
  }

  /****
   *
   *
   */
  UpdateDoor() {
    this.m_RenderWin2D.rotation.z = 0;
    this.m_RenderWin2D.position.x = 0;
    this.m_RenderWin2D.position.y = 0;
    this.m_RenderWin2D.position.z = 0;
    this.m_RenderWin2D.scale.x = 1;
    this.m_RenderWin2D.scale.y = 1;
    this.m_RenderWin2D.scale.z = 1;
    this.m_RenderWin2D.matrixWorld.identity();
    this.m_RenderWin2D.matrix.identity();
    this.m_RenderWin2D.updateMatrixWorld(true);

    this.m_RenderData2D.rotation.z = 0;
    this.m_RenderData2D.position.x = 0;
    this.m_RenderData2D.position.y = 0;
    this.m_RenderData2D.position.z = 0;
    this.m_RenderData2D.scale.x = 1;
    this.m_RenderData2D.scale.y = 1;
    this.m_RenderData2D.scale.z = 1;
    this.m_RenderData2D.matrixWorld.identity();
    this.m_RenderData2D.matrix.identity();
    this.m_RenderData2D.updateMatrixWorld(true);
    // const axis = new Vector3(0, 0, 1, 0);
    // const tmpMatrix = new Matrix4();
    switch (this.m_iStyle) {
      case 0:
        {
          const tmpMatrix1 = new Matrix4().makeTranslation(0, 100 / 2, 0);		// 门框图标是矩形
          const tmpMatrix2 = new Matrix4().makeScale(this.m_fLength / 100, this.m_fLength / 100, 1);// 100   符号初始大小
          let tmpMatrix3 = new Matrix4().makeTranslation(0, this.m_fWidth / 2, 0);
          let tmpMatrix4 = new Matrix4().makeRotationZ(this.m_fRotate + this.m_fMirror);
          let tmpMatrix5 = new Matrix4().makeTranslation(this.m_vPos.x, this.m_vPos.y, 1);
          tmpMatrix2.multiply(tmpMatrix1);
          tmpMatrix3.multiply(tmpMatrix2);
          tmpMatrix4.multiply(tmpMatrix3);
          tmpMatrix5.multiply(tmpMatrix4);
          this.m_RenderWin2D.applyMatrix4(tmpMatrix5);

           tmpMatrix3 = new Matrix4().makeScale(this.m_fLength, this.m_fWidth, 1);
           tmpMatrix4 = new Matrix4().makeRotationZ(this.m_fRotate);
           tmpMatrix5 = new Matrix4().makeTranslation(this.m_vPos.x, this.m_vPos.y, 1);
          tmpMatrix4.multiply(tmpMatrix3);
          tmpMatrix5.multiply(tmpMatrix4);
          this.m_RenderData2D.applyMatrix4(tmpMatrix5);
        }
        break;
      case 2:
        {
          const tmpMatrix1 = new Matrix4().makeTranslation(0, 180 / 4, 0);		// 门框图标是矩形	 180是初始大小
          const tmpMatrix2 = new Matrix4().makeScale(this.m_fLength / 180, this.m_fLength / 180, 1);// 180   符号初始大小
          const tmpMatrix3 = new Matrix4().makeTranslation(0, this.m_fWidth / 2, 0);
          let tmpMatrix4 = new Matrix4().makeRotationZ(this.m_fRotate + this.m_fMirror);
          let tmpMatrix5 = new Matrix4().makeTranslation(this.m_vPos.x, this.m_vPos.y, 1);
          tmpMatrix2.multiply(tmpMatrix1);
          tmpMatrix3.multiply(tmpMatrix2);
          tmpMatrix4.multiply(tmpMatrix3);
          tmpMatrix5.multiply(tmpMatrix4);
          this.m_RenderWin2D.applyMatrix4(tmpMatrix5);

          tmpMatrix4 = new Matrix4().makeScale(this.m_fLength, this.m_fWidth, 1);
          tmpMatrix5 = new Matrix4().makeRotationZ(this.m_fRotate);
          const tmpMatrix6 = new Matrix4().makeTranslation(this.m_vPos.x, this.m_vPos.y, 1);
          tmpMatrix5.multiply(tmpMatrix4);
          tmpMatrix6.multiply(tmpMatrix5);
          this.m_RenderData2D.applyMatrix4(tmpMatrix6);
        }
        break;
      case 3:
        {
          const tmpMatrix1 = new Matrix4().makeScale(this.m_fLength / 180, this.m_fWidth / 24, 1);
          const tmpMatrix2 = new Matrix4().makeRotationZ(this.m_fRotate);
          const tmpMatrix3 = new Matrix4().makeTranslation(this.m_vPos.x, this.m_vPos.y, 1);
          tmpMatrix2.multiply(tmpMatrix1);
          tmpMatrix3.multiply(tmpMatrix2);
          this.m_RenderWin2D.applyMatrix4(tmpMatrix3);

          const tmpMatrix4 = new Matrix4().makeScale(this.m_fLength, this.m_fWidth, 1);
          const tmpMatrix5 = new Matrix4().makeRotationZ(this.m_fRotate);
          const tmpMatrix6 = new Matrix4().makeTranslation(this.m_vPos.x, this.m_vPos.y, 1);
          tmpMatrix5.multiply(tmpMatrix4);
          tmpMatrix6.multiply(tmpMatrix5);
          this.m_RenderData2D.applyMatrix4(tmpMatrix6);
        }
        break;

      case 4:	//  洞
      case 5:
        {
          const tmpMatrix1 = new Matrix4().makeScale(this.m_fLength / 180, this.m_fWidth / 24, 1);
          const tmpMatrix2 = new Matrix4().makeRotationZ(this.m_fRotate);
          const tmpMatrix3 = new Matrix4().makeTranslation(this.m_vPos.x, this.m_vPos.y, 1);
          tmpMatrix2.multiply(tmpMatrix1);
          tmpMatrix3.multiply(tmpMatrix2);
          this.m_RenderWin2D.applyMatrix4(tmpMatrix3);

          const tmpMatrix4 = new Matrix4().makeScale(this.m_fLength, this.m_fWidth, 1);
          const tmpMatrix5 = new Matrix4().makeRotationZ(this.m_fRotate);
          const tmpMatrix6 = new Matrix4().makeTranslation(this.m_vPos.x, this.m_vPos.y, 1);
          tmpMatrix5.multiply(tmpMatrix4);
          tmpMatrix6.multiply(tmpMatrix5);
          this.m_RenderData2D.applyMatrix4(tmpMatrix6);
        }
        break;
      case 7:	//子母门
        {
          const tmpMatrix1 = new Matrix4().makeTranslation(0, 120 / 4, 0);		// 门框图标是矩形
          const tmpMatrix2 = new Matrix4().makeScale(this.m_fLength / 100, this.m_fLength / 100, 1);// 100   符号初始大小
          let tmpMatrix3 = new Matrix4().makeTranslation(0, this.m_fWidth / 2, 0);
          let tmpMatrix4 = new Matrix4().makeRotationZ(this.m_fRotate + this.m_fMirror);
          let tmpMatrix5 = new Matrix4().makeTranslation(this.m_vPos.x, this.m_vPos.y, 1);
          tmpMatrix2.multiply(tmpMatrix1);
          tmpMatrix3.multiply(tmpMatrix2);
          tmpMatrix4.multiply(tmpMatrix3);
          tmpMatrix5.multiply(tmpMatrix4);
          this.m_RenderWin2D.applyMatrix4(tmpMatrix5);

          tmpMatrix3 = new Matrix4().makeScale(this.m_fLength, this.m_fWidth, 1);
          tmpMatrix4 = new Matrix4().makeRotationZ(this.m_fRotate);
          tmpMatrix5 = new Matrix4().makeTranslation(this.m_vPos.x, this.m_vPos.y, 1);
          tmpMatrix4.multiply(tmpMatrix3);
          tmpMatrix5.multiply(tmpMatrix4);
          this.m_RenderData2D.applyMatrix4(tmpMatrix5);
        }
        break;
    }
  }

  OnShowHelp() {
    // this.m_RenderWin2D.material.color.set(0x00A2E8);
    // $('#container').css("cursor", "move");
  }

  BuildDoorIcon(iType: number) {
    const part = (180 * Math.PI / 180) / 20;
    const result_poly = new BufferGeometry();

    renderScene2D.scene.remove(this.m_RenderWin2D);
    let tLength = 98;
    let tWidth = 22;
    switch (iType) {
      case 0:	// 单开门
        {
          tLength = 98;
          const vertices = []
          for (let i = 0; i <= 4 * 2; i++)		// 弧形扇面
          {
            const dx = Math.cos(0 + i * part) * tLength;
            const dy = Math.sin(0 + i * part) * tLength;
            const dx1 = Math.cos(0 + (i + 1) * part) * tLength;
            const dy1 = Math.sin(0 + (i + 1) * part) * tLength;
            vertices.push(-tLength / 2 + dx, -tLength / 2 + dy, 1);
            vertices.push(-tLength / 2 + dx1, -tLength / 2 + dy1, 1);
          }
          // 门扇
          vertices.push(-tLength / 2 + 10, tLength / 2, 1, -tLength / 2 + 10, -tLength / 2 - 10, 1);
          vertices.push(-tLength / 2 + 0, -tLength / 2 - 10, 1, -tLength / 2 + 0, tLength / 2, 1);
          vertices.push(-tLength / 2 + 10, tLength / 2, 1);
          result_poly.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3))
          result_poly.computeVertexNormals()
          this.m_RenderWin2D = new Line(result_poly, new LineBasicMaterial({ color: mResource.mColor, linewidth: 1, opacity: 1 }));
          renderScene2D.scene.add(this.m_RenderWin2D);
        }
        break;
      case 2:	// 双开门
        {
          tLength = 180;	// 初始大小
          const vertices = []
          vertices.push(-tLength / 2 + 10, tLength / 4, 1, -tLength / 2 - 0, tLength / 4, 1);
          vertices.push(-tLength / 2 - 0, tLength / 4, 1, -tLength / 2 - 0, -tLength / 4 - 10, 1);
          vertices.push(-tLength / 2 + 10, -tLength / 4 - 10, 1, -tLength / 2 + 10, tLength / 4, 1);

          for (let i = 4 * 2; i >= 0; i--) {
            const dx = Math.cos(0 + i * part) * tLength / 2;
            const dy = Math.sin(0 + i * part) * tLength / 2;
            const dx1 = Math.cos(0 + (i + 1) * part) * tLength / 2;
            const dy1 = Math.sin(0 + (i + 1) * part) * tLength / 2;
            //		result_poly.vertices.push(new Vector3(-tLength/2+dx,  -tLength/4+dy,  1));
            vertices.push(-tLength / 2 + dx1, -tLength / 4 + dy1, 1);
          }

          for (let i = 0; i <= 4 * 2; i++) {
            const dx = tLength - Math.cos(0 + (i + 1) * part) * tLength / 2;
            const dy = Math.sin(0 + (i + 1) * part) * tLength / 2;
            const dx1 = tLength - Math.cos(0 + (i + 1) * part) * tLength / 2;
            const dy1 = Math.sin(0 + (i + 1) * part) * tLength / 2;
            vertices.push(-tLength / 2 + dx, -tLength / 4 + dy, 1);
            vertices.push(-tLength / 2 + dx1, -tLength / 4 + dy1, 1);
          }
          vertices.push(tLength / 2 - 10, tLength / 4, 1, tLength / 2 - 10, -tLength / 4 - 10, 1);
          vertices.push(tLength / 2 + 0, -tLength / 4 - 10, 1, tLength / 2 + 0, tLength / 4, 1);
          vertices.push(tLength / 2 - 10, tLength / 4, 1);
          this.m_RenderWin2D = new Line(result_poly, new LineBasicMaterial({ color: mResource.mColor, linewidth: 1, opacity: 1 }));
          renderScene2D.scene.add(this.m_RenderWin2D);
        }
        break;

      case 3:	//移门
        {
          tLength = 180;	// 初始大小
          tWidth = 22;
          const vertices = []
          const result_poly = new BufferGeometry();
          vertices.push(-tLength / 2, -tWidth / 2, 1, -tLength / 2, tWidth / 2, 1);
          vertices.push(-tLength / 2, tWidth / 2, 1, tLength / 8, tWidth / 2, 1);
          vertices.push(tLength / 2, -tWidth / 2, 1, -tLength / 8, -tWidth / 2, 1);
          vertices.push(tLength / 2, -tWidth / 2, 1, tLength / 2, tWidth / 2, 1);

          vertices.push(-tLength / 2, 0.0, 1, tLength / 2, 0.0, 1);
          vertices.push(-tLength / 8, -tWidth / 2, 1, -tLength / 8, 0.0, 1);
          vertices.push(tLength / 8, 0.0, 1, tLength / 8, tWidth / 2, 1);

          //		result_poly.vertices.push(new Vector3(-this.m_fLength/2+10,-this.m_fWidth/2, 1), new Vector3( -this.m_fLength/2+10, this.m_fWidth/2, 1));
          //		result_poly.vertices.push(new Vector3( this.m_fLength/2-10,-this.m_fWidth/2, 1), new Vector3(  this.m_fLength/2-10, this.m_fWidth/2, 1));

          //		result_poly.vertices.push(new Vector3( this.m_fLength/2,  this.m_fWidth/2, 1),new Vector3( this.m_fLength/2-10,  this.m_fWidth/2, 1));
          //		result_poly.vertices.push(new Vector3(-this.m_fLength/2, -this.m_fWidth/2, 1),new Vector3(-this.m_fLength/2+10, -this.m_fWidth/2, 1));

          this.m_RenderWin2D = new LineSegments(result_poly, new LineBasicMaterial({ color: mResource.mColor, opacity: 1 }));
          renderScene2D.scene.add(this.m_RenderWin2D);
        }
        break;

      // case 4:	//移门
      //   {
      //     const geometry = new PlaneGeometry(1, 1);
      //     const material = new MeshBasicMaterial({ color: 0xffffff });
      //     this.m_RenderWin2D = new Mesh(geometry, material);
      //     scene.add(this.m_RenderWin2D);
      //   }
      //   break;

      // case 7:	// 字
      //   {
      //     tLength = 80;	// 初始大小
      //     result_poly.vertices.push(new Vector3(-tLength / 2 + 0, tLength / 4 - 13, 1), new Vector3(-tLength / 2 - 10, tLength / 4 - 13, 1));
      //     result_poly.vertices.push(new Vector3(-tLength / 2 - 10, tLength / 4 - 13, 1), new Vector3(-tLength / 2 - 10, -tLength / 4 - 20, 1));
      //     result_poly.vertices.push(new Vector3(-tLength / 2 + 0, -tLength / 4 - 20, 1), new Vector3(-tLength / 2 + 0, tLength / 4 - 13, 1));

      //     tLength = 70;
      //     for (let i = 4 * 2; i >= 0; i--) {
      //       const dx1 = Math.cos(0 + (i + 1) * part) * tLength / 2;
      //       const dy1 = Math.sin(0 + (i + 1) * part) * tLength / 2;
      //       result_poly.vertices.push(new Vector3(-tLength / 2 + dx1 - 10, -tLength / 4 + dy1 - 10, 1));
      //     }

      //     tLength = 120;
      //     for (let i = 0; i <= 4 * 2; i++) {
      //       const dx = tLength - Math.cos(0 + (i + 1) * part) * tLength / 2;
      //       const dy = Math.sin(0 + (i + 1) * part) * tLength / 2;
      //       const dx1 = tLength - Math.cos(0 + (i + 1) * part) * tLength / 2;
      //       const dy1 = Math.sin(0 + (i + 1) * part) * tLength / 2;
      //       result_poly.vertices.push(new Vector3(-tLength / 2 + dx - 10, -tLength / 4 + dy, 1));
      //       result_poly.vertices.push(new Vector3(-tLength / 2 + dx1 - 10, -tLength / 4 + dy1, 1));
      //     }
      //     result_poly.vertices.push(new Vector3(tLength / 2 - 20, tLength / 4, 1), new Vector3(tLength / 2 - 20, -tLength / 4 - 10, 1));
      //     result_poly.vertices.push(new Vector3(tLength / 2 - 10, -tLength / 4 - 10, 1), new Vector3(tLength / 2 - 10, tLength / 4, 1));
      //     result_poly.vertices.push(new Vector3(tLength / 2 - 20, tLength / 4, 1));
      //     this.m_RenderWin2D = new Line(result_poly, new LineBasicMaterial({ color: mResource.mColor, linewidth: 1, opacity: 1 }));
      //     scene.add(this.m_RenderWin2D);
      //   }
      //   break;
    }
  }


  OnChangeDoor(ab: any) {
    // this.m_strFile = ab[1];

    // if (this.m_Object != undefined && this.m_Object != null) {
    //   for (let i = 0; i < this.m_Object.children.length; i++) {
    //     scene3D.remove(this.m_Object.children[i]);
    //   }
    //   scene3D.remove(this.m_Object);
    // }
    // const iIndex = mHouseClass.mDoorClass.mDoorArray.indexOf(this);

    // // 清空自定义部分地址
    // // this.m_menshan_src = "";
    // // this.m_mentao_src = "";
    // // this.m_menkan_src = "";
    // this.m_part_src = {};
    // this.isOpen = false;

    // this.OnCreateDoor3D(iIndex);
    // this.OnUpdate3D();
  }


  FormatMesh() {
    // const tMaterial = new MeshBasicMaterial({ color: '#FFFF00', wireframe: true, transparent: true, opacity: 0.6 });

    // let k = 0;
    // let n = 0;
    // const geom = new BufferGeometry();

    // for (let m = 1; m < this.m_Object.children.length; m++) {
    //   const tGeometry = this.m_Object.children[m].geometry;
    //   for (let i = 0; i < tGeometry.attributes.position.count / 3; i++) {
    //     const x1 = tGeometry.attributes.position.array[n + i * 9 + 0];
    //     const y1 = tGeometry.attributes.position.array[n + i * 9 + 1];
    //     const z1 = tGeometry.attributes.position.array[n + i * 9 + 2];

    //     const x2 = tGeometry.attributes.position.array[n + i * 9 + 3];
    //     const y2 = tGeometry.attributes.position.array[n + i * 9 + 4];
    //     const z2 = tGeometry.attributes.position.array[n + i * 9 + 5];

    //     const x3 = tGeometry.attributes.position.array[n + i * 9 + 6];
    //     const y3 = tGeometry.attributes.position.array[n + i * 9 + 7];
    //     const z3 = tGeometry.attributes.position.array[n + i * 9 + 8];

    //     geom.vertices.push(new Vector3(x1, y1, z1));
    //     geom.vertices.push(new Vector3(x2, y2, z2));
    //     geom.vertices.push(new Vector3(x3, y3, z3));

    //     geom.faces.push(new Face3(k + 0, k + 1, k + 2));
    //     k = k + 3;
    //   }

    //   for (let i = 0; i < tGeometry.attributes.uv.length / 6; i++) {
    //     const u1 = tGeometry.attributes.uv.array[n + i * 6 + 0];
    //     const v1 = tGeometry.attributes.uv.array[n + i * 6 + 1];

    //     const u2 = tGeometry.attributes.uv.array[n + i * 6 + 2];
    //     const v2 = tGeometry.attributes.uv.array[n + i * 6 + 3];

    //     const u3 = tGeometry.attributes.uv.array[n + i * 6 + 4];
    //     const v3 = tGeometry.attributes.uv.array[n + i * 6 + 5];

    //     const t0 = new Vector2(u1, v1);
    //     const t1 = new Vector2(u2, v2);
    //     const t2 = new Vector2(u3, v3);

    //     uv1 = [t0, t1, t2];

    //     geom.faceVertexUvs[0].push(uv1);
    //   }

    //   n += tGeometry.attributes.position.length / 9;
    // }

    // geom.computeFaceNormals();
    // geom.verticesNeedUpdate = true;
    // geom.uvsNeedUpdate = true;

    // const tMesh = new Mesh(geom, tMaterial);
    // const tmpMatrix4 = new Matrix4().makeScale(this.m_fLength / this.m_fLengthOld,
    //   this.m_fWidth / this.m_fWidthOld,
    //   this.m_fHeight / this.m_fHeightOld);

    // const tmpMatrix0 = new Matrix4().makeTranslation(0, 0, 0);
    // const tmpMatrix1 = new Matrix4().makeRotationZ(this.m_fRotate);
    // const tmpMatrix2 = new Matrix4().makeTranslation(this.m_vPos.x, this.m_vPos.y, 0);
    // const tmpMatrix3 = new Matrix4().makeRotationX(-Math.PI / 2);
    // tmpMatrix0.multiply(tmpMatrix4);
    // tmpMatrix1.multiply(tmpMatrix0);
    // tmpMatrix2.multiply(tmpMatrix1);
    // tmpMatrix3.multiply(tmpMatrix2);

    // tMesh.matrixWorld.identity();
    // tMesh.matrix.identity();
    // tMesh.applyMatrix4(tmpMatrix3);

    // return tMesh;
  }

  // 得到所在墙体
  CheckWallData3D_In(iIndex: number) {
    // const tMesh = mHouseClass.mWallClass3D_In.mWallArray[iIndex].mWallMesh;
    // const ab = mMathClass.ClosestPointOnLine1(tMesh.geometry.boundingBox.min.x,
    //   tMesh.geometry.boundingBox.min.y,
    //   tMesh.geometry.boundingBox.max.x,
    //   tMesh.geometry.boundingBox.max.y,
    //   this.m_vPos.x, this.m_vPos.y, 20);	//10 距离
    // if (ab[0] != 0)
    //   return true;
    // return false;
  }

  OnUpdateTex3D(infoXML: any) {
    // // 替换材质
    // const xmlDoc = $.parseXML(infoXML);
    // if (xmlDoc == null)
    //   return;

    // this.m_infoXML = infoXML;

    // const tArray = [];

    // for (let j = 0; j < this.m_Object.children.length; j++) {
    //   if (this.m_Object.children[j].material.map == null)
    //     continue;

    //   tArray.push(j);
    // }

    // for (let i = 0; i < xmlDoc.getElementsByTagName("node").length; i++) {
    //   const strPathImage = xmlDoc.getElementsByTagName("node")[i].attributes[1].nodeValue;
    //   if (strPathImage != "") {
    //     this.m_Object.children[tArray[i]].material.map = new TextureLoader().load(m_strHttp + "texture/" + strPathImage, render);
    //     this.m_Object.children[tArray[i]].material.map.wrapS = this.m_Object.children[tArray[i]].material.map.wrapT = RepeatWrapping;
    //   }
    //   else {
    //     //使用原贴图
    //     const strOldPathImage = xmlDoc.getElementsByTagName("node")[i].attributes[2].nodeValue;
    //     if (-1 == strOldPathImage.indexOf("data")) {
    //       this.m_Object.children[tArray[i]].material.map = new TextureLoader().load(m_strHttp + strOldPathImage, render);
    //     }
    //     else {
    //       this.m_Object.children[tArray[i]].material.map = new TextureLoader().load(m_strWebService + 'ihouse/' + strOldPathImage, render);
    //     }

    //     this.m_Object.children[tArray[i]].material.needsUpdate = true;
    //   }
    // }
  }

  OnSave() {
    // const x1 = this.m_Object.position.x;
    // const y1 = this.m_Object.position.y;
    // const z1 = this.m_Object.position.z;

    // const rotateX = this.m_Object.rotation.x;
    // const rotateY = this.m_Object.rotation.y;
    // const rotateZ = this.m_Object.rotation.z;

    // const scaleX = this.m_Object.scale.x;
    // const scaleY = this.m_Object.scale.y;
    // const scaleZ = this.m_Object.scale.z;

    // const strPathFile = this.m_strFile.slice(0, this.m_strFile.length - 4) + ".3ds";

    // let strXML = '<Door>\r\n';
    // strXML += `<Param X="${x1}" Y="${y1}" Z="${z1}" `;
    // strXML += ` rotateX="${rotateX}" rotateY="${rotateY}" rotateZ="${rotateZ}" `;
    // strXML += ` scaleX="${scaleX}" scaleY="${scaleY}" scaleZ="${scaleZ}" `;
    // strXML += ` Length="${this.m_fLength}" Width="${this.m_fWidth}" Height="${this.m_fHeight}" `;
    // strXML += ` src="${strPathFile}" `;
    // strXML += `/>\r\n`;

    // strXML += `<Part>`

    // Object.keys(this.m_part_src).forEach(key => {
    //   const val = this.m_part_src[key]
    //   // strXML += `${key}="${val}" `
    //   const part = this.m_Object.getObjectByName(key)
    //   const x1 = part.position.x;
    //   const y1 = part.position.y;
    //   const z1 = part.position.z;

    //   const rotateX = part.rotation.x;
    //   const rotateY = part.rotation.y;
    //   const rotateZ = part.rotation.z;

    //   const scaleX = part.scale.x;
    //   const scaleY = part.scale.y;
    //   const scaleZ = part.scale.z;

    //   strXML += `<${key} X="${x1}" Y="${y1}" Z="${z1}" `;
    //   strXML += ` rotateX="${rotateX}" rotateY="${rotateY}" rotateZ="${rotateZ}" `;
    //   strXML += ` scaleX="${scaleX}" scaleY="${scaleY}" scaleZ="${scaleZ}" `;
    //   strXML += ` src="${val}" `;
    //   strXML += `/>\r\n`;
    // })
    // strXML += `</Part>`

    // strXML += `<Texture>`;

    // const xmlDoc = $.parseXML(this.m_infoXML);
    // if (xmlDoc) {
    //   for (let i = 0; i < xmlDoc.getElementsByTagName("node").length; i++) {
    //     const strOld = xmlDoc.getElementsByTagName("node")[i].attributes[2].nodeValue;
    //     const strNew = xmlDoc.getElementsByTagName("node")[i].attributes[1].nodeValue;
    //     if (strNew != "")
    //       strXML += `<node index="${i}" path="${strNew}" pathOld="${strOld}"/>`;	// 被替换
    //     else
    //       strXML += `<node index="${i}" path="" pathOld="${strOld}"/>`;			// 无替换
    //   }
    // }
    // // else	// 第一次加载
    // // {
    // // 	for (let i = 0; i < this.m_Object.children.length; i++) 	// 记录所有节点
    // // 	{

    // // 		if (this.m_Object.children[i].material.map == null)
    // // 			continue;

    // // 		if (this.m_Object.children[i].material.map.image == null)
    // // 			continue;

    // // 		let strOld = this.m_Object.children[i].material.map.image.src;
    // // 		let nPos = strOld.lastIndexOf('data/jiaju/');
    // // 		strOld = strOld.substr(nPos);

    // // 		strXML += `<node index="${i}" path="" pathOld="${strOld}"/>`;
    // // 	}
    // // }

    // strXML += `</Texture>`;
    // strXML += '</Door>\r\n';

    // this.m_infoXML = strXML;
    // return this.m_infoXML;
  }

  // 镜像操作
  OnMirror() {
    const menshan = this.m_Object.getObjectByName('menshan') || this.m_Object.children[0];
    if (this.isOpen) {
      this.OnOpen();
    }
    menshan.scale.x *= -1;
    this.OnUpdate3D();
  }

  /**
   * @apiName OnOpen
   * @apiDescription 门的开关
   * @apiParam  {boolean} needAnimation 是否需要动画
   * @apiGroup DoorData
   */
  OnOpen(needAnimation = false) {
    needAnimation = false
    const angleOld = this.m_openingAglOld / 180 * Math.PI;
    const angle = this.m_openingAgl / 180 * Math.PI;
    const direction = this.m_iMirror % 2 === 0 ? -1 : 1;
    const openTime = 300;
    const frame = 100;
    switch (this.mData) {
      case 0: //单开门
        if (!this.isOpen) {
          if (needAnimation) {
            setAnimation(() => {
              this.singleLeafDoorOpen(angle / frame, direction)
            }, openTime, frame)
          } else {
            this.singleLeafDoorOpen(angle, direction)
          }
        } else {
          if (needAnimation) {
            setAnimation(() => {
              this.singleLeafDoorClose(angleOld / frame, direction);
            }, openTime, frame)
          } else {
            this.singleLeafDoorClose(angleOld, direction)
          }
        }
        break;
      case 2: // 双开门
        if (!this.isOpen) {
          if (needAnimation) {
            setAnimation(() => {
              this.doubleLeafDoorOpen(angle / frame, direction);
            }, openTime, frame);
          } else
            this.doubleLeafDoorOpen(angle, direction)
        } else {
          if (needAnimation) {
            setAnimation(() => {
              this.doubleLeafDoorClose(angleOld / frame, direction);
            }, openTime, frame);
          } else {
            this.doubleLeafDoorClose(angleOld, direction)
          }
        }
        break;
      case 3: // 推拉门
        // eslint-disable-next-line no-case-declarations
        const menshanRig = this.m_Object.getObjectByName('menshanRig')
        if (!menshanRig) return
        if (!this.isOpen) {
          if (needAnimation) {
            setAnimation(() => {
              this.slidingDoorOpen(this.m_openingRatio / frame);
            }, openTime, frame);
          } else {
            this.slidingDoorOpen(this.m_openingRatio)
          }
        } else {
          if (needAnimation) {
            setAnimation(() => {
              this.slidingDoorClose(this.m_openingRatioOld / frame);
            }, openTime, frame);
          } else {
            this.slidingDoorClose(this.m_openingRatioOld)
          }
        }

    }
    this.m_openingAglOld = this.m_openingAgl;
    this.m_openingRatioOld = this.m_openingRatio;
    this.isOpen = !this.isOpen;
  }

  /**
   * @apiName singleLeafDoorOpen
   * @apiDescription 单开门开
   * @apiGroup DoorData
   */
  singleLeafDoorOpen(angle: number, direction: number) {
    const menshan = this.m_Object.getObjectByName('menshan');
    if (!menshan) return

    menshan.translateX(direction * this.m_fLengthOld / 2);
    menshan.rotateZ(-direction * angle);

    menshan.translateX(-direction * this.m_fLengthOld / 2);
  }
    /**
     * @apiName singleLeafDoorClose
     * @apiDescription 单开门关
     * @apiGroup DoorData
     */
    singleLeafDoorClose(angleOld: number, direction: number) {
      const menshan = this.m_Object.getObjectByName('menshan');
      if (!menshan) return
      // menshan.scale.x = 1
      // menshan.scale.y = 1
      // menshan.scale.z = 1
      menshan.translateX(direction * this.m_fLengthOld / 2);
      menshan.rotateZ(direction * angleOld);
      menshan.translateX(-direction * this.m_fLengthOld / 2);
    }
  /**
   * @apiName doubleLeafDoorOpen
   * @apiDescription 双开门开
   * @apiGroup DoorData
   */
  doubleLeafDoorOpen(angle: number, direction: number) {
    const menshanLef = this.m_Object.getObjectByName('menshanLef');
    const menshanRig = this.m_Object.getObjectByName('menshanRig');
    if (!menshanLef) return;
    if (!menshanRig) return;
    menshanLef.translateX(direction * this.m_fLengthOld / 2);
    menshanLef.rotateZ(-direction * angle);
    menshanLef.translateX(-direction * this.m_fLengthOld / 2);
    menshanRig.translateX(-direction * this.m_fLengthOld / 2);
    menshanRig.rotateZ(direction * angle);
    menshanRig.translateX(direction * this.m_fLengthOld / 2);
  }
    /**
     * @apiName doubleLeafDoorClose
     * @apiDescription 双开门关
     * @apiGroup DoorData
     */
    doubleLeafDoorClose(angleOld: number, direction: number) {
      const menshanLef = this.m_Object.getObjectByName('menshanLef');
      const menshanRig = this.m_Object.getObjectByName('menshanRig');
      if (!menshanLef) return;
      if (!menshanRig) return;
      menshanLef.translateX(direction * this.m_fLengthOld / 2);
      menshanLef.rotateZ(direction * angleOld);
      menshanLef.translateX(-direction * this.m_fLengthOld / 2);
      menshanRig.translateX(-direction * this.m_fLengthOld / 2);
      menshanRig.rotateZ(-direction * angleOld);
      menshanRig.translateX(direction * this.m_fLengthOld / 2);
    }
  /**
   * @apiName slidingDoorOpen
   * @apiDescription 推拉门开
   * @apiGroup DoorData
   */
  slidingDoorOpen(ratio: number) {
    const menshanRig = this.m_Object.getObjectByName('menshanRig')
    if (!menshanRig) return
    menshanRig.translateX(-this.m_fLengthOld / 2 * ratio)
  }
  /**
   * @apiName slidingDoorClose
   * @apiDescription 推拉门关
   * @apiGroup DoorData
   */
  slidingDoorClose(ratio: number) {
    const menshanRig = this.m_Object.getObjectByName('menshanRig')
    if (!menshanRig) return
    menshanRig.translateX(this.m_fLengthOld / 2 * ratio)
  }


}

// 返回Promise的TDSLoader
function loadPromise(path: string) {
  const loader = new TDSLoader();
  return new Promise((resolve, reject) => {
    loader.load(path, object => {
      resolve(object)
    })
  })
}

/**
 * @apiName setAnimation
 * @apiDescription 设置动画
 * @apiParam  {function} func 动画每一帧执行的函数
 * @apiParam  {number} time 动画执行的总时间
 * @apiParam  {number} frame 动画帧数
 */
function setAnimation(func: any, time: number, frame: number) {
  let cnt = 0;
  const tick = setInterval(() => {
    try {
      func()
      cnt++;
      if (cnt > frame) clearInterval(tick);
    } catch {
      clearInterval(tick)
    }
  }, time / frame);
}
