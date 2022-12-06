<template>
  <div>
    <div class="ih_leftFrame clearfloat">
      <ul class="ih_leftFrameHeader">
        <li class="active"><img src="../assets/img/geren.png" alt="" /></li>
        <li><img src="../assets/img/chugui.png" alt="" /></li>
      </ul>
      <div class="ih_leftBody">
        <div class="ih_leftBodyHeader">
          <span class="active">{{ $t("message.Create") }}</span>
          <span>{{ $t("message.Scheme") }}</span>
          <span>{{ $t("message.ModelLibrary") }}</span>
          <span>{{ $t("message.PrototypeRoom") }}</span>
        </div>
      </div>
      <div class="ih_cupboard" style="display: none"></div>
      <div class="shrinkBar">
        <span class="el-icon-d-arrow-left"></span>
      </div>
      <div class="ih_leftBodyFrame ih_createdDemo" style="display: block">
        <el-scrollbar style="height: 100%">
        <el-collapse v-model="activeNames">
          <div class="md-itemList">
            <input
              id="ChooseCadFile"
              type="file"
              style="display: none"
              accept=".dxf"
              onchange="mHouseClass.mImportCad.OnfileImport();"
            />
            <input
              id="ChooseImageFile"
              type="file"
              style="display: none"
              onchange="mBakImage.OnUpdateImage();"
            />
          </div>
          <div class="md-itemList">
            <el-collapse-item :title="$t('message.DrawWall')" name="1">
            <ul class="itemList-imgList clearfloat">
              <li>
                <img
                  src="../assets/img/apartment_01.png"
                  alt="中线画墙"
                  @click="OnCreateWall()"
                />
                <p>{{ $t("message.cldw") }}</p>
              </li>
              <li>
                <img
                  src="../assets/img/apartment_11.png"
                  alt="内线画墙"
                  @click="OnCreateWall1()"
                />
                <p>{{ $t("message.ildw") }}</p>
              </li>
              <!--								<li><img src="../assets/img/font1.png" @click="kz_measurement_show()">
									<p>{{ $t("message.SurveyRoom")}}</p>
								</li>-->
              <li>
                <img
                  src="../assets/img/font_zh.png"
                  @click="mHouseClass.mTextClass.CreateText()"
                  class="textImg"
                />
                <p>{{ $t("message.Name") }}</p>
              </li>
            </ul>
            </el-collapse-item>
          </div>
          <div class="md-itemList">
            <el-collapse-item :title="$t('message.Stucture')" name="2">
            <ul class="itemList-imgList clearfloat">
              <li>
                <img
                  src="../assets/img/structure_01.png"
                  @click="mHouseClass.mPillarClass.CreatePillar()"
                />
                <p>{{ $t("message.柱子") }}</p>
              </li>
              <li>
                <img
                  src="../assets/img/structure_02.png"
                  @click="mHouseClass.mLiangClass.CreateLiang();"
                />
                <p>{{ $t("message.Beam") }}</p>
              </li>
              <!--<li><img src="../assets/img/structure_03.png" @click="OnCreateWallLine()">
									<p>{{ $t("message.Table")}}</p>
								</li> -->
              <li>
                <img
                  src="../assets/img/structure_05.png"
                  @click="mHouseClass.mFlueClass.CreateFlue()"
                />
                <p>{{ $t("message.Flue") }}</p>
              </li>
            </ul>
            </el-collapse-item>
          </div>
          <div class="md-itemList">
            <el-collapse-item :title="$t('message.门窗')" name="3">
            <ul class="itemList-imgList clearfloat">
              <li>
                <img
                  src="../assets/img/doorwindns_01.png"
                  @click="CreateDoor(0)"
                />
                <p>{{ $t("message.SingleLeafDoor") }}</p>
              </li>
              <li>
                <img
                  src="../assets/img/doorwindns_02.png"
                  @click="mHouseClass.mDoorClass.CreateDoor(2)"
                />
                <p>{{ $t("message.DoubleLeafDoor") }}</p>
              </li>
              <li>
                <img
                  src="../assets/img/door001.png"
                  @click="mHouseClass.mDoorClass.CreateDoor(7)"
                />
                <p>{{ $t("message.DoubleLeafDoor") }}</p>
              </li>
              <li>
                <img
                  src="../assets/img/doorwindns_03.png"
                  @click="mHouseClass.mDoorClass.CreateDoor(3)"
                />
                <p>{{ $t("message.SlidingDoor") }}</p>
              </li>
              <li>
                <img
                  src="../assets/img/structure_04.png"
                  @click="mHouseClass.mDoorClass.CreateDoor(4)"
                />
                <p>{{ $t("message.DoorOpening") }}</p>
              </li>
              <li style="display: none">
                <img
                  src="../assets/img/doorwindns_09.png"
                  @click="mHouseClass.mDoorClass.CreateDoor(5)"
                />
                <p>{{ $t("message.ArchedDoor") }}</p>
              </li>

              <li>
                <img
                  src="../assets/img/doorwindns_04.png"
                  @click="mHouseClass.mWindowClass.CreateWindow(0);"
                />
                <p>{{ $t("message.Window") }}</p>
              </li>
              <li>
                <img
                  src="../assets/img/doorwindns_05.png"
                  @click="mHouseClass.mWindowClass.CreateWindow(1);"
                />
                <p>{{ $t("message.FrenchWindows") }}</p>
              </li>
              <li>
                <img
                  src="../assets/img/doorwindns_06.png"
                  @click="mHouseClass.mWindowClass.CreateWindow(2);"
                />
                <p>{{ $t("message.BayWindow") }}</p>
              </li>
              <li>
                <img
                  src="../assets/img/doorwin.png"
                  @click="mHouseClass.mWindowClass.CreateWindow(5)"
                />
                <p>{{ $t("message.WindowOpening") }}</p>
              </li>
            </ul>
            </el-collapse-item>
          </div>
          <div class="md-itemList">
            <el-collapse-item :title="$t('message.RoomTemplate')" name="4">
            <ul class="itemList-imgList clearfloat">
              <li>
                <img
                  src="../assets/img/apartment_02.png"
                  @click="OnCreateRoom(1)"
                />
                <p>{{ $t("message.HouseType1") }}</p>
              </li>
              <li>
                <img
                  src="../assets/img/apartment_03.png"
                  @click="OnCreateRoom(2)"
                />
                <p>{{ $t("message.HouseType2") }}</p>
              </li>
              <li>
                <img
                  src="../assets/img/apartment_04.png"
                  @click="OnCreateRoom(3)"
                />
                <p>{{ $t("message.HouseType3") }}</p>
              </li>
              <li>
                <img
                  src="../assets/img/apartment_05.png"
                  @click="OnCreateRoom(4)"
                />
                <p>{{ $t("message.HouseType4") }}</p>
              </li>
            </ul>
            </el-collapse-item>
          </div>
          <div class="md-itemList">
            <el-collapse-item :title="$t('message.BoothStage')" name="5">
            <ul class="itemList-imgList clearfloat">
              <li>
                <img
                  src="../assets/img/platform.png"
                  @click="OnCreatePlatform()"
                />
                <p>{{ $t("message.DrawPlatform") }}</p>
              </li>
              <li>
                <img
                  src="../assets/img/platform1.png"
                  @click="mHouseClass.mFurnitureClass.CreateBoard()"
                />
                <p>{{ $t("message.DrawBackPanel") }}</p>
              </li>
              <li>
                <img src="../assets/img/font3D.png" @click="OnBuildText3D()" />
                <p>{{ $t("message.SolidWord") }}</p>
              </li>
            </ul>
            </el-collapse-item>
          </div>
        </el-collapse>
        </el-scrollbar>
      </div>
    </div>
    <!-- 创建 样板间 模型库 收起界面 -->
    <div class="main-left-min" showMain=".ih_leftFrame" style="display: none">
      <div class="apartmentNavigation-min-title">
        <i class="el-icon-d-arrow-right"></i>
      </div>
      <div class="apartmentNavigation-min-body">
        <i class="icon iconfont icon-yingyong2"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { i18n } from "../locales/i18n";

import "../assets/css/mLeftBody/mLeftBodyUI.css";
// import WallClass from "@/core/components/wall/wallClass";
// import FloorClass from "@/core/components/floor/floorClass";
import mHouseClass from '@/core/houseClass'
import { renderScene2D } from "@/core/renderScene2D";
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {
  data() {
    return {
      // mHouseClass,
      i18n,
      activeNames: ['1', '2', '3', '4', '5']
    };
  }

  OnCreateWall() {
    renderScene2D.m_cPenType = 1;
  }

  async OnCreateRoom(iIndex: number) {
    let fValue = 300;
    const mWallClass = mHouseClass.wallClass
    const mFloorClass = mHouseClass.floorClass

    mWallClass.OnClear()
    mFloorClass.OnClear()

    switch(iIndex)
    {
      case 1:
      {
        fValue = 300;
        mWallClass.OnAddWall(-fValue, fValue, fValue, fValue);
        mWallClass.OnAddWall( fValue, fValue, fValue,-fValue);
        mWallClass.OnAddWall( fValue,-fValue,-fValue,-fValue);
        mWallClass.OnAddWall(-fValue,-fValue,-fValue, fValue);					
      }
      break;
      case 2:
      {
        fValue = 300;
        mWallClass.OnAddWall(-fValue, fValue,      0, fValue);
        mWallClass.OnAddWall(      0, fValue,      0,    100);
        mWallClass.OnAddWall(      0,    100, fValue,	 100);
        mWallClass.OnAddWall( fValue,    100, fValue,-fValue);
        mWallClass.OnAddWall( fValue,-fValue,-fValue,-fValue);
        mWallClass.OnAddWall(-fValue,-fValue,-fValue, fValue);
      }
      break;
      case 3:
      {
        fValue = 260;
        mWallClass.OnAddWall(-fValue+130, fValue, fValue-130, fValue);
        mWallClass.OnAddWall( fValue-130, fValue, fValue-130,      0);				
        mWallClass.OnAddWall( fValue-130,      0, fValue,     	   0);					
        mWallClass.OnAddWall( fValue,          0, fValue,	 -fValue);
        mWallClass.OnAddWall( fValue,    -fValue,-fValue,    -fValue);
        mWallClass.OnAddWall(-fValue,	 -fValue,-fValue,		   0);
        mWallClass.OnAddWall(-fValue,          0,-fValue+130,      0);
        mWallClass.OnAddWall(-fValue+130,	   0,-fValue+130, fValue);				
      }
      break;
      case 4:
      {
        fValue = 300;
        mWallClass.OnAddWall( fValue, fValue,      0, fValue);
        mWallClass.OnAddWall(      0, fValue,      0,    100);
        mWallClass.OnAddWall(      0,    100,-fValue,	 100);
        mWallClass.OnAddWall(-fValue,    100,-fValue,-fValue);
        mWallClass.OnAddWall(-fValue,-fValue, fValue,-fValue);
        mWallClass.OnAddWall( fValue,-fValue, fValue, fValue);					
      }
      break;
    }
    mWallClass.OnUpdateAllWall()
    await mFloorClass.OnUpdateFloor(mWallClass.solution_paths, 0)
    renderScene2D.render()
  }

  CreateDoor(index: number) {
    const doorClass = mHouseClass.doorClass
    doorClass.CreateDoor(index)
  }
}
</script>

