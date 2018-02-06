<template>
  <div class="home">
    <toolbar v-on:selectModule="switchSidebarModal"></toolbar>
    <sidebar v-on:selectModule="switchSidebarModal"></sidebar>
    <transition name="component-fade" mode="out-in"> 
      <keep-alive> 
        <router-view class="content-container" 
                     v-on:selectApproval="switchSidebarModal"
                     v-on:selectModule="switchSidebarModal">
        </router-view>   
      </keep-alive> 
    </transition>
    <!-- 加载动画 -->
    <loading :state="this.$store.state.loadingState"></loading>
    <!-- 侧边栏功能区 -->   
    <transition name="component-fade" mode="out-in">
      <keep-alive>
        <component v-bind:is="view"
                   v-on:closeSelf="switchSidebarModal"
                   :config="SidebarModalConfig">
        </component>
      </keep-alive>     
    </transition>
  </div>
</template>

<style scoped>
  .home{
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    position: relative;
  }
  .content-container{
    flex: 1 1 auto;
    height: 100%;
    overflow-y: scroll;
  }
</style>

<script>
import Vue from 'vue';
import Toolbar from '../common/Toolbar.vue';
import Sidebar from '../common/Sidebar.vue';
import Loading from '../common/Loading.vue';
import sidebar_Structure from '../page/Sidebar-structure.vue';
import sidebar_Plan from '../page/Sidebar-plan.vue';
import sidebar_Approval from '../page/Sidebar-approval.vue';
import sidebar_Report from '../page/Sidebar-report.vue';
import sidebar_Project from '../page/Sidebar-project.vue';

export default {
  name: 'home',
  components: {
    'toolbar': Toolbar, // 侧边快捷入口
    'sidebar': Sidebar, // 侧边栏
    'loading': Loading, // 加载动画
    'sidebar-structure': sidebar_Structure, // 侧边栏--通讯录组织架构
    'sidebar-plan': sidebar_Plan, // 侧边栏--工作计划列表
    'sidebar-approval': sidebar_Approval, // 侧边栏--审核人选择
    'sidebar-report': sidebar_Report, // 侧边栏--工作总结列表
    'sidebar-project': sidebar_Project, // 侧边栏--项目列表
  },
  data () {
    return {
      // 动态组件切换
      view: '',
      // 侧边栏功能组件配置信息
      SidebarModalConfig: {
        type: 'plan'
      }
    }
  },
  methods: {
    // Toggle sidebar功能区
    switchSidebarModal (handle, name) {
      switch(name){
        case 'address':
        if(handle == 'on'){
          this.view = 'sidebar-structure';
          // 切换功能入口高亮
          this.$eventBus.$emit('toggleEntry', {
            item: 'address',
            state: true
          });
        }else if(handle == 'off'){
          this.view = '';
        }
        break;
        case 'plan':
        if(handle == 'on'){
          this.view = 'sidebar-plan';
          // 切换功能入口高亮
          this.$eventBus.$emit('toggleEntry', {
            item: 'plan',
            state: true
          });
        }else if(handle == 'off'){
          this.view = '';
        }
        break;
        case 'planApproval':
        if(handle == 'on'){
          this.view = 'sidebar-approval';
          this.SidebarModalConfig.type = 'plan';
        }else if(handle == 'off'){
          this.view = '';
        }
        break;
        case 'reportApproval':
        if(handle == 'on'){
          this.view = 'sidebar-approval';
          this.SidebarModalConfig.type = 'report';
        }else if(handle == 'off'){
          this.view = '';
        }
        break;
        case 'projectApproval':
        if(handle == 'on'){
          this.view = 'sidebar-approval';
          this.SidebarModalConfig.type = 'project';
        }else if(handle == 'off'){
          this.view = '';
        }
        break;
        case 'childProjectApproval':
        if(handle == 'on'){
          this.view = 'sidebar-approval';
          this.SidebarModalConfig.type = 'childProject';
        }else if(handle == 'off'){
          this.view = '';
        }
        break;
        case 'report':
        if(handle == 'on'){
          this.view = 'sidebar-report';
          // 切换功能入口高亮
          this.$eventBus.$emit('toggleEntry', {
            item: 'report',
            state: true
          });
        }else if(handle == 'off'){
          this.view = '';
        }
        break;
        case 'project':
        if(handle == 'on'){
          this.view = 'sidebar-project';
          // 切换功能入口高亮
          this.$eventBus.$emit('toggleEntry', {
            item: 'project',
            state: true
          });
        }else if(handle == 'off'){
          this.view = '';
        }
        break;
      }
    }
  },
}

</script>
