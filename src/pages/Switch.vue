<template>
  <div class="switch-ui">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1" @click="show2D">2d</el-menu-item>
      <el-menu-item index="2" @click="show3D">3d</el-menu-item>
      <el-menu-item index="3">漫游</el-menu-item>
    </el-menu>
  </div>
</template>
<script>
  import { renderScene2D } from '@/core/renderScene2D';
import { Component, Vue } from 'vue-property-decorator';
  @Component
  export default class App extends Vue {
    data() {
      return {
        activeIndex: '1'
      }
    }
    show2D() {
      const dom = renderScene2D.getDom3D();
      // this.$refs.container.append(dom);
      const container = document.body.querySelector('#container')
      container.removeChild(dom)
      renderScene2D.m_Control3D.reset()

      const dom2 = renderScene2D.getDom()
      container.append(dom2)
      renderScene2D.render3D()
    }
    show3D() {
      const dom = renderScene2D.getDom();
      // this.$refs.container.append(dom);
      const container = document.body.querySelector('#container')
      container.removeChild(dom)
      renderScene2D.m_Control3D.saveState()

      const dom2 = renderScene2D.getDom3D()
      container.append(dom2)
    }
  }
</script>
<style scoped>
  .switch-ui {
    position: absolute;
    top: 0;
    right: 18%;
  }
</style>
