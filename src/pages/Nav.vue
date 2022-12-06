<template>
  <div class="cont-header">
    <div class="imgLogo">
      <img src="https://3d.shixianjia.com/iHouse/system/img/bigLogo.png" :key='$t("message.Title")' />
      <span class="imgLogoName text-color">{{ $t("message.LogoName") }}</span>
    </div>
    <div class="header-menu">
      <el-menu default-active="1" class="el-menu-demo" mode="horizontal">
        <el-submenu index="1">
          <template slot="title">{{ $t("message.File") }}</template>
          <el-menu-item index="1-1" onClick="openCreate(-1)">{{
            $t("message.MyDesign")
          }}</el-menu-item>
          <el-menu-item index="1-2" onclick="OnpenProjectEditor('保存')"
            >保存</el-menu-item
          >
          <el-menu-item
            index="1-3"
            onClick='OnpenProjectEditor(i18n.t("message.SaveAs"))'
            v-if="!accountType == 1"
            >{{ $t("message.SaveAs") }}</el-menu-item
          >
          <el-menu-item
            index="1-4"
            onClick='OnpenProjectEditor(i18n.t("message.ShareScheme"))'
            >{{ $t("message.ShareScheme") }}</el-menu-item
          >
          <el-menu-item index="1-7" onClick="mPluginsClass.OnSaveLocalFile()">{{
            $t("message.SaveLocally")
          }}</el-menu-item>
          <el-menu-item index="1-8" onClick="mPluginsClass.OnOpenLocalFile()">{{
            $t("message.LocalOpen")
          }}</el-menu-item>
          <input
            id="ChooseLocalXMLFile"
            type="file"
            style="display: none"
            accept=".zip"
            onchange="mPluginsClass.OpenLocalFile();"
          />
        </el-submenu>
        <el-menu-item index="2" id="gBaoCun">
          <i class="icon iconfont icon-baocun"></i>
          <span onclick="OnpenProjectEditor('保存')">{{
            $t("message.Save")
          }}</span>
        </el-menu-item>
        <el-menu-item index="3" id="gCeLiang" onClick="OnCreateCeLiang()">
          <i class="icon iconfont icon-_celiang-"></i>
          <span>{{ $t("message.Measure") }}</span>
        </el-menu-item>
        <el-submenu index="4" id="gXianShi">
          <template slot="title">
            <i class="el-icon-view"></i>
            <span>{{ $t("message.Show") }}</span>
          </template>
          <el-submenu index="4-0">
            <template slot="title">{{ $t("message.displayMode") }}</template>
            <el-menu-item index="4-1-1">
              <el-radio
                v-model="header.showLable.wallLine"
                label="1"
                onclick="mParamSystemDlg.OnWireframe(false);mParamSystemDlg.OnMaterial(true);"
                >{{ $t("message.MaterialMode") }}</el-radio
              >
            </el-menu-item>
            <el-menu-item index="4-1-2">
              <el-radio
                v-model="header.showLable.wallLine"
                label="2"
                onclick="mParamSystemDlg.OnWireframe(true);mParamSystemDlg.OnMaterial(false);"
                >{{ $t("message.Wireframe") }}</el-radio
              >
            </el-menu-item>
            <el-menu-item index="4-1-3">
              <el-radio
                v-model="header.showLable.wallLine"
                label="3"
                onclick="mParamSystemDlg.OnWireframe(true);mParamSystemDlg.OnMaterial(true);"
                >{{ $t("message.MaterialWireframe") }}</el-radio
              >
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4-1">
            <template slot="title">{{ $t("message.DimensionLin") }}</template>
            <el-menu-item index="4-1-1">
              <el-radio v-model="header.showLable.wallLine" label="1">{{
                $t("message.WallMiddleLine")
              }}</el-radio>
            </el-menu-item>
            <el-menu-item index="4-1-2">
              <el-radio v-model="header.showLable.wallLine" label="2">{{
                $t("message.Position")
              }}</el-radio>
            </el-menu-item>
            <el-menu-item index="4-1-3">
              <el-radio v-model="header.showLable.wallLine" label="3">{{
                $t("message.NoDisplay")
              }}</el-radio>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4-9">
            <template slot="title">{{ $t("message.WindowOpen") }}</template>
            <el-menu-item index="4-9-1">
              <el-checkbox v-model="header.showLable.check_ChildRoam3D">{{
                $t("message.NewWindowRoam")
              }}</el-checkbox>
            </el-menu-item>
            <el-menu-item index="4-9-2">
              <el-checkbox v-model="header.showLable.check_ChildRender">{{
                $t("message.NewWindowRendering")
              }}</el-checkbox>
            </el-menu-item>
            <el-menu-item index="4-9-3">
              <el-checkbox v-model="header.showLable.check_ChildMat3D">{{
                $t("message.NewWindowMaterial")
              }}</el-checkbox>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="4-2">
            <el-checkbox
              v-model="header.showLable.check_coord"
              onchange="mParamSystemDlg.OnShowCoord()"
              >{{ $t("message.Coord") }}</el-checkbox
            >
          </el-menu-item>
          <el-menu-item index="4-3">
            <el-checkbox
              v-model="header.showLable.check_label"
              onclick="mParamSystemDlg.OnShowLabel()"
            >
              {{ $t("message.Size") }}</el-checkbox
            >
          </el-menu-item>
          <el-menu-item index="4-4">
            <el-checkbox
              v-model="header.showLable.check_Furniture"
              onclick="mParamSystemDlg.OnShowFurniture()"
              >{{ $t("message.Furniture") }}</el-checkbox
            >
          </el-menu-item>
          <el-menu-item index="4-5">
            <el-checkbox
              v-model="header.showLable.check_RoomName"
              onchange="mParamSystemDlg.OnShowRoomName()"
              >{{ $t("message.RoomName") }}</el-checkbox
            >
          </el-menu-item>
          <el-menu-item index="4-6">
            <el-checkbox
              v-model="header.showLable.check_TransparentWall"
              onclick="mParamSystemDlg.OnShowTransparentWall()"
              >{{ $t("message.Transparent") }}
            </el-checkbox>
          </el-menu-item>
          <el-menu-item index="4-7">
            <el-checkbox
              v-model="header.showLable.check_TransparentWall1"
              onclick="mParamSystemDlg.OnShowTransparentWall_In()"
              >{{ $t("message.wallTransparent") }}</el-checkbox
            >
          </el-menu-item>
          <el-menu-item index="4-8">
            <el-checkbox v-model="header.showLable.check_ObjectAdsorption">{{
              $t("message.ObjectAdsorption")
            }}</el-checkbox>
          </el-menu-item>

          <el-menu-item index="4-11">
            <el-checkbox
              v-model="header.showLable.check_LockAll"
              onchange="mHouseClass.mFurnitureClass.OnLockAll()"
              >{{ $t("message.LockAllObjects") }}</el-checkbox
            >
          </el-menu-item>

          <el-menu-item index="4-12">
            <el-checkbox v-model="header.showLable.check_DelWall">{{
              $t("message.continuityDeleteWalls")
            }}</el-checkbox>
          </el-menu-item>
          <el-menu-item index="4-13" onClick="mBakImage.OpenBakDlg()">{{
            $t("message.PlanOperation")
          }}</el-menu-item>
        </el-submenu>
        <el-submenu index="5" id="gZhuShou">
          <template slot="title">
            <i class="icon iconfont icon-yingyong2"></i>
            <span>{{ $t("message.Assistant") }}</span>
          </template>
          <el-submenu index="5-1" v-if="!accountType == 1">
            <template slot="title">{{
              $t("message.HouseTypeTransform")
            }}</template>
            <el-menu-item
              index="5-1-1"
              onclick="mHouseClass.HorizontalMirror()"
              >{{ $t("message.HorizontalMirror") }}</el-menu-item
            >
            <el-menu-item
              index="5-1-2"
              onclick="mHouseClass.VerticalMirror()"
              >{{ $t("message.VerticalMirror") }}</el-menu-item
            >
            <el-menu-item index="5-1-3" onclick="mHouseClass.Rotate_Mirror()"
              >90° {{ $t("message.Rotate") }}</el-menu-item
            >
          </el-submenu>
          <el-menu-item index="5-5" onClick="OnpenGlobalSettings()"
            >{{ $t("message.GlobalSetting") }}
          </el-menu-item>
          <!--	<el-menu-item index="5-6" onclick="OnExportCAD()">{{ $t("message.ExportCAD")}}</el-menu-item>-->
          <el-menu-item
            index="5-8"
            onclick="OnClickFullScreen(document.documentElement)"
          >
            {{ $t("message.Fullscreen") }}</el-menu-item
          >
          <el-submenu index="5-10">
            <template slot="title">{{ $t("message.Language") }}</template>
            <el-menu-item index="5-10-1" onclick="Choosemessage('vi')"
              >{{ $t("message.Vietnam") }}
            </el-menu-item>
            <el-menu-item index="5-10-2" onclick="Choosemessage('zh')"
              >{{ $t("message.Chinese") }}
            </el-menu-item>
            <el-menu-item index="5-10-3" onclick="Choosemessage('en')"
              >{{ $t("message.English") }}
            </el-menu-item>
          </el-submenu>
          <!--						<el-submenu index="5-11">
							<template slot="title">{{ $t("message.AnimatioPpath")}}</template>
							<el-menu-item index="5-11-1" onclick="mAnimation.AnimationOper(0)">{{ $t("message.CreateAnimatioPpath")}}</el-menu-item>
							<el-menu-item index="5-11-2" onclick="mAnimation.AnimationOper(2)">{{ $t("message.AnimationPreview")}}</el-menu-item>
							<el-menu-item index="5-11-3" onclick="mAnimation.AnimationOper(3)">{{ $t("message.AnimationStop")}}</el-menu-item>
							<el-menu-item index="5-11-4" onclick="mAnimation.AnimationOper(1)">{{ $t("message.DeleteAnimationPath")}}</el-menu-item>
						</el-submenu>-->

          <el-menu-item index="5-12">
            <span onclick="m_ParamObjDlg.OnShowAllModel()">{{
              $t("message.ShowAllModels")
            }}</span>
          </el-menu-item>
        </el-submenu>
        <!--<el-menu-item index="6">
						<i class="icon iconfont icon-draw not-icon-size"></i>
					</el-menu-item>
					<el-menu-item index="7">
						<i class="icon iconfont icon-undo not-icon-size not-icon-color"></i>
					</el-menu-item>-->
        <el-submenu index="8">
          <template slot="title">
            <i class="icon iconfont icon-qingkong"></i>
            <span>{{ $t("message.ClearAll") }}</span>
          </template>
          <el-menu-item index="8-1" onclick="OnClear()">{{
            $t("message.ClearCanvas")
          }}</el-menu-item>
          <el-menu-item index="8-2" onclick="OnClearObj()">{{
            $t("message.ClearFurniture")
          }}</el-menu-item>
        </el-submenu>
        <el-submenu index="9" v-if="!accountType == 1" id="gCAD">
          <template slot="title">
            <i class="icon iconfont icon-daochu"></i>
            <span>{{ $t("message.Export") }}</span>
          </template>
          <el-menu-item index="9-1" onclick="mHouseClass.OnSave2DtoImage()">{{
            $t("message.Export2D")
          }}</el-menu-item>
          <el-menu-item index="9-2" onclick="mHouseClass.OnSave2DtoImage1()">{{
            $t("message.ExportWithLegendBox")
          }}</el-menu-item>
          <el-menu-item index="9-3" onclick="OnExportCAD()" class="exportCAD">{{
            $t("message.ExportCAD")
          }}</el-menu-item>
        </el-submenu>
        <el-submenu index="50" id="gTools">
          <template slot="title">
            <i class="icon iconfont icon-yingyong2"></i>
            <span>{{ $t("message.Tool") }}</span>
          </template>
          <!--						<el-submenu index="53">
							<template slot="title">{{ $t("message.AnimatioPpath")}}</template>
							<el-menu-item index="53-1" onclick="mAnimation.AnimationOper(0)">{{ $t("message.CreateAnimatioPpath")}}</el-menu-item>
							<el-menu-item index="53-2" onclick="mAnimation.AnimationOper(2)">{{ $t("message.AnimationPreview")}}</el-menu-item>
							<el-menu-item index="53-3" onclick="mAnimation.AnimationOper(3)">{{ $t("message.AnimationStop")}}</el-menu-item>
							<el-menu-item index="53-4" onclick="mAnimation.AnimationOper(1)">{{ $t("message.DeleteAnimationPath")}}</el-menu-item>
						</el-submenu>-->
          <el-menu-item
            id="manyou1"
            index="51-1"
            onclick="mPluginsClass.OnRoam()"
            >{{ $t("message.Roam") + $t("") }}</el-menu-item
          >
          <el-submenu index="52">
            <template slot="title">
              <i class="icon iconfont icon-daochu"></i>
              <span>{{ $t("message.Budget") }}</span>
            </template>
            <el-menu-item index="52-1" onclick="addDatas(0)">{{
              $t("message.RapidBudget")
            }}</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="10" id="gRender">
          <i class="el-icon-camera"></i>
          <span onclick="mPluginsClass.OnSaveToRender()">{{
            $t("message.Render")
          }}</span>
        </el-menu-item>
        <el-menu-item index="11" id="gAlbum">
          <i class="el-icon-picture-outline"></i>
          <span onclick="openCreate(1)">{{
            $t("message.EffectPicture")
          }}</span>
        </el-menu-item>
        <!-- <el-menu-item  index="12" id="gEnvironmentSim">
						<i class="el-icon-camera"></i>
						<span onclick="mPluginsClass.OnSaveToCFD()">环境模拟分析</span>
					</el-menu-item>
					<el-menu-item index="13" id="gLightSim">
						<i class="el-icon-camera"></i>
						<span onclick="mPluginsClass.OnFanMeiLightSim()">灯光模拟分析</span>
					</el-menu-item> -->
      </el-menu>
    </div>
    <div class="header-help" onclick="mParamSystemDlg.ShowHelp()">
      <div class="header-help-icon">
        <i class="icon iconfont icon-bangzhu"></i>
        <span style="font-size: 14px" class="text-color">{{
          $t("message.HelpMenu")
        }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class App extends Vue {
  data() {
    return {
      header: {
        showLable: {
          wallLine: '1',
          check_coord: true,
          check_label: true,
          check_area: false,
          check_Furniture: true,
          check_RoomName: false,
          check_TransparentWall: true,
          check_Ceiling: false,
          check_ObjectAdsorption: true,
          check_kitchen: false,
          check_TransparentWall1: false, // 内墙透明
          check_WallMode: 1, // 全透明外墙
          check_ChildRoam3D: true,
          check_CoordTop: false,
          check_LockAll: false, // 锁住所有物体
          check_ChildRender: true,
          check_DelWall: false, // 连续删除墙体
        }
      },
      // ! 
      accountType: 1, // 账号权限
    }
  }
  mounted() {
    console.log('1')
  }
}
</script>
<style scoped>
</style>
