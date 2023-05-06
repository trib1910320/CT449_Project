<template>
  <div class="container-fluid">
    <AppHeader />
    <div class="container-fluid py-1">
      <div v-if="($route.matched[0]?.name == 'manage')" class="row">
        <div class="col-lg-3">
          <NavManage/>
        </div>
        <div class="col-lg-9">
          <router-view :key="$route.fullPath" />
        </div>
      </div>
      <div v-else>
        <router-view :key="$route.fullPath" />
      </div>
    </div>
    <AppFooter />
    <div class="fixed-bottom">
      <button class="back-top btn btn-outline-primary" @click="scrollToTop()">
        <i class="fa-solid fa-arrow-up"></i>
      </button>
    </div>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
import NavManage from "@/components/NavManage.vue";
export default {
  components: {
    AppHeader, AppFooter, NavManage
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    }
  }
};
</script>

<style scoped>
.back-top {
  z-index: 1000;
  float: right;
  margin: 0 5px 5px 0;
}
</style>
