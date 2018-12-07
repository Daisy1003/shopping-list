<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import jwt_decode from 'jwt-decode'
  export default {
    name: "App",
    created() {
      if (localStorage.manageToken) {
        //解析token
        const decodedToken = jwt_decode(localStorage.manageToken);
        //vuex存储token
        this.$store.dispatch('setAuthenticated', !this.isEmpty(decodedToken));
        this.$store.dispatch('setUser', decodedToken);
      }
    },
    methods: {
      isEmpty(value) {
        return (
          value === undefined ||
          value === null ||
          (typeof value === "object" && Object.keys(value).length === 0) ||
          (typeof value === "string" && value.trim().length === 0)
        );
      }
    }
  }
</script>

<style lang="scss">
html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
