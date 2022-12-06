<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <Nav/>
    <div class="cont-main">
      <Left/>
      <div class="canvas">
				<div id="container" ref="container" style="top:0px;left:0px;width:100%;height:100%;position:absolute;cursor:pointer;">
					<div id="containerChild" style="position: relative;z-index:-9999;"></div>
				</div>
			</div>
      <SwitchUI/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Nav from './pages/Nav.vue'
import Left from './pages/Left.vue'
import SwitchUI from './pages/Switch.vue'
import {renderScene2D} from './core/renderScene2D';

@Component({
  components: {
    Nav,
    Left,
    SwitchUI,
  },
})
export default class App extends Vue {
  mounted() {
    // console.log('1')
    // const dom = renderScene2D.init();
    const dom = renderScene2D.getDom();
    // this.$refs.container.append(dom);
    const container = document.body.querySelector('#container')
    container && container.append(dom);
    // renderScene2D.renderer.render();
  }
}
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
