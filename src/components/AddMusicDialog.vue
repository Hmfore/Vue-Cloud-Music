<template>
  <div class="addmusicdialog">
    <el-dialog
      title="收藏到指定歌单"
      :visible.sync="dialogVisible"
      width="400px"
    >
      <InfoList :list="createPlaylist" @clickitem="add">
        <template #img="{ item }">
          <img
            class="sub-img mleft-10"
            v-lazy="item.coverImgUrl + '?param=100y100'"
          />
        </template>
      </InfoList>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { MusicToPlaylist } from "@/api/api-songlist";
import InfoList from "@/components/List/InfoList.vue";
export default {
  components: { InfoList },
  data() {
    return {
      dialogVisible: false,
    };
  },
  props: {
    musicIdList: {
      type: Array,
      require: true,
    },
  },
  computed: {
    ...mapGetters(["createPlaylist"]),
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
    },
    async add(item) {
      console.log(item);
      let pid = item.id;
      if (typeof pid !== "number")
        return this.$message.warning("请选择一个歌单");
      let addObj = {
        op: "add",
        pid,
        tracks: this.musicIdList.join(","),
      };
      const res = await MusicToPlaylist(addObj);
      console.log(res);
      if (res.status !== 200) return this.$message.error("收藏失败");
      this.$store.dispatch("getLikeList");
      this.dialogVisible = false;
      this.$message.success("收藏成功！");
    },
  },
};
</script>

<style lang="less" scoped></style>
