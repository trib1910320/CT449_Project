<template>
  <div class="container-fluid">
    <AppHeader />
    <div class="container-fluid py-1">
      <router-view :key="$route.fullPath" />
    </div>
    <AppFooter/>
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

export default {
  components: {
    AppHeader, AppFooter
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
