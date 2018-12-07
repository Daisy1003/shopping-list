<template>
  <div class="login">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">购物清单管理</span>
      </div>
      <el-form :model="loginUser" :rules="rules" ref="loginForm" label-width="80px" class="loginForm">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="loginUser.email" placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginUser.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登录</el-button>
        </el-form-item>
        <div class="tiparea">
          <p>还没有账号？现在<router-link to='/register'>注册</router-link></p>
        </div>
      </el-form>
    </section>
  </div>
</template>

<script>
  import jwt_decode from 'jwt-decode'
  export default {
    name: "Login",
    data() {
      return {
        loginUser: {
          email: '',
          password: ''
        },
        rules: {
          email: [
            {
              required: true,
              type: 'email',
              message: '邮箱格式不正确',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 20,
              message: '密码长度为6-20位字符',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post('/api/users/login', this.loginUser)
              .then(res => {
                // console.log(res);
                //本地存储token
                const {token} = res.data;
                localStorage.setItem('manageToken', token);
                //解析token
                const decodedToken = jwt_decode(token);
                // console.log(decodedToken);
                //vuex存储token
                this.$store.dispatch('setAuthenticated', !this.isEmpty(decodedToken));
                this.$store.dispatch('setUser', decodedToken);
                this.$router.push('/');
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
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

<style scoped>
  .login {
    position: relative;
    width: 100%;
    height: 100%;
    background: url(../assets/bg.jpg) no-repeat center center;
    background-size: 100% 100%;
  }

  .form_container {
    width: 370px;
    height: 210px;
    position: absolute;
    top: 10%;
    left: 50%;
    margin-left: -185px;
    padding: 25px;
    border-radius: 5px;
    text-align: center;
  }

  .form_container .manage_tip .title {
    font-family: "Microsoft YaHei";
    font-weight: bold;
    font-size: 26px;
    color: #fff;
  }

  .loginForm {
    margin-top: 20px;
    background-color: #fff;
    padding: 20px 40px 20px 20px;
    border-radius: 5px;
    box-shadow: 0px 5px 10px #cccc;
  }

  .submit_btn {
    width: 100%;
  }

  .tiparea {
    text-align: right;
    font-size: 12px;
    color: #333;
  }

  .tiparea p a {
    color: #409eff;
  }
</style>