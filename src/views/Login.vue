<template>
  <section class="Login-user mw-1200">
    <div class="user_options-container">
      <div class="user_options-text">
        <div class="user_options-unregistered">
          <h2 class="user_unregistered-title">VUE仿网易云音乐客户端</h2>
          <p class="user_unregistered-text">使用短信验证码登录</p>
          <button
            class="user_unregistered-signup"
            id="signup-button"
            @click="toggleLoginWay"
          >
            短信验证码登录
          </button>
        </div>

        <div class="user_options-registered">
          <h2 class="user_registered-title">
            Vue Imitates Netease Cloud Music
          </h2>
          <p class="user_registered-text">使用二维码登录</p>
          <button
            class="user_registered-login"
            id="login-button"
            @click="toggleLoginWay"
          >
            二维码登录
          </button>
        </div>
      </div>
      <!-- 登录窗口 -->
      <div
        class="user_options-forms"
        :class="{ bounceRight: loginWay, bounceLeft: !loginWay }"
        id="user_options-forms"
      >
        <div class="user_forms-login">
          <h2 class="forms_title">二维码登录</h2>
          <form class="forms_form">
            <fieldset class="forms_fieldset">
              <div class="img-wrap">
                <img class="img-h" :src="imgData" />
                <div
                  class="btn-refresh pointer"
                  @click="getKey"
                  v-show="qrType === 800"
                >
                  <i class="el-icon-refresh-left"></i>
                </div>
                <div class="msg-wrap">
                  <div style="padding-left: 15px">打开</div>
                  <a
                    style="text-decoration: none"
                    href="https://music.163.com/#/download"
                    target="_blank"
                    >网易云音乐手机端</a
                  >
                  <div style="text-align: right; padding-right: 10px">
                    扫码登录
                  </div>
                </div>
              </div>
            </fieldset>
            <div class="forms_buttons">
              <div class="msg-wrap forms_buttons-forgot">
                状态：{{ message }}
              </div>
            </div>
          </form>
        </div>
        <div class="user_forms-signup">
          <h2 class="forms_title">短信验证码登录</h2>
          <el-form
            class="forms_form"
            :model="form"
            :rules="rules"
            ref="loginRef"
            label-position="top"
            hide-required-asterisk
          >
            <fieldset class="forms_fieldset">
              <!-- 手机号 -->
              <el-form-item class="forms_field" prop="phone">
                <el-input
                  v-model="form.phone"
                  prefix-icon="el-icon-mobile"
                  placeholder="请输入手机号"
                  class="forms_field-input"
                ></el-input>
              </el-form-item>
              <!-- 验证码 -->
              <div class="Code">
                <el-form-item class="forms_field" prop="captcha">
                  <el-input
                    v-model="form.captcha"
                    placeholder="请输入验证码"
                    prefix-icon="el-icon-key"
                    class="forms_field-input"
                  ></el-input>
                </el-form-item>

                <el-button
                  :disabled="time !== 0"
                  @click="getCode"
                  class="user_registered-login"
                  id="login-button"
                >
                  <span v-show="time == 0">获取验证码</span>
                  <span v-show="time != 0">{{ time }}s</span>
                </el-button>
              </div>
            </fieldset>
            <div class="forms_buttons">
              <button
                type="button"
                class="forms_buttons-action"
                @click="doLogin"
              >
                登录
              </button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {
  getQrKey,
  createQr,
  checkQr,
  doLogin,
  getCode,
} from "@/api/api-user.js";
import "@/assets/less/Login.less";
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      }
      setTimeout(() => {
        let reg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
        if (!reg.test(this.form.phone)) {
          callback(new Error("手机号错误"));
        } else {
          callback();
        }
      }, 1000);
    };
    return {
      isLoading: false,
      loginWay: false,
      key: "",
      imgData: "",
      qrType: "",
      //二维码状态
      message: "",
      first: true,
      //验证码登录表单数据
      form: { phone: "", captcha: "" },
      rules: {
        phone: [{ validator: checkPhone, trigger: "blur" }],
        captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      time: 0,
    };
  },
  created() {
    this.getKey();
  },
  beforeDestroy() {
    window.clearTimeout(this.timer);
  },
  methods: {
    toggleLoginWay() {
      this.loginWay = !this.loginWay;
      if (this.loginWay) this.createQr();
    },
    async getKey() {
      const res = await getQrKey();
      if (res.code !== 200) return this.$message.error("获取二维码失败");
      this.key = res.data.unikey;
    },
    // 生成二维码
    async createQr() {
      const res = await createQr(this.key);
      if (res.code !== 200) return this.$message.error("生成二维码失败");
      this.imgData = res.data.qrimg;
      this.checkQr();
    },
    /* 800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies) */
    /* 检查二维码状态 */
    async checkQr() {
      console.log(11);
      if (!this.loginWay) return;
      const res = await checkQr(this.key);
      console.log("二维码登陆后", res);
      this.qrType = res.code;
      this.message = res.message;
      if (res.code === 801 || res.code === 802) {
        this.timer = window.setTimeout(() => {
          this.checkQr();
        }, 5000);
      } else if (res.code === 803) {
        this.$message.success("登录成功");
        this.$store.dispatch("getAccount");
        this.$router.push("/personalrecom");
      }
    },
    doLogin() {
      this.$refs.loginRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请输入正确的信息");
        const res = await doLogin(this.form);
        console.log("验证码登录", res);
        if (res.code !== 200)
          return this.$message.error("登录失败,请检查手机号和密码");
        this.$message.success("登录成功");
        this.$store.dispatch("getAccount");

        console.log("push之前");
        this.$router.push("/personalrecom");
      });
    },
    async getCode() {
      if (this.form.phone === "") return this.$message.error("请输入手机号");
      let reg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
      if (!reg.test(this.form.phone)) return this.$message.error("手机号有误");
      this.time = 60;
      this.timer = window.setInterval(() => {
        this.time--;
        if (this.time === 0) window.clearInterval(this.timer);
      }, 1000);
      const res = await getCode(this.form.phone);
      if (res.code !== 200)
        return this.$message.error("发送失败，请检查手机号");
      this.$message.success("发送成功！请查看手机信息");
    },
  },
};
</script>

<style lang="less" scoped>
.img-wrap {
  height: 180px;
  display: flex;
  justify-content: space-between;
  img {
    width: 180px;
  }
  .msg-wrap {
    display: flex;
    flex-flow: column;
    justify-content: center;
    min-width: 180px;
    margin-right: 60px;
    margin-left: 30px;

    font-size: 18px;
    line-height: 24px;
    word-break: break-all;
    a {
      background: white;
      color: tomato;
      font-size: 22px;
    }
  }
}
.Code {
  display: grid;
  grid-template-columns: 2fr 1fr;
  column-gap: 40px;
  button {
    flex-grow: 1;
    margin-top: 0;
    white-space: nowrap;
    color: rgba(34, 34, 34, 0.85);
    background-color: white;

    &:hover {
      color: white;
      background-color: rgba(34, 34, 34, 0.85);
    }
  }
}
</style>
