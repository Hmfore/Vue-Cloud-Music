<template>
  <div class="newmusic">
    <div class="newmusic-head">
      <div class="options">
        <button
          class="no-btn mright-10 font-16"
          v-for="item in typeList"
          :class="{ optionactive: optionactive(item.id) }"
          @click="changeOption(item.id)"
          :key="item.id"
        >
          {{ item.name }}
        </button>
      </div>
      <div class="all-btns">
        <div class="btn-wrap">
          <button class="btn btn-red" @click="playMusicAll">
            <i class="iconfont icon-bofang"></i>
            <span class="btn-text">播放全部</span>
          </button>
          <button class="btn btn-white mleft-12" @click="openAddDialog">
            <i class="el-icon-folder-add"></i>
            <span class="btn-text">收藏全部</span>
          </button>
        </div>
      </div>
    </div>

    <div class="newmusic-view">
      <el-skeleton v-show="isLoading" :rows="6" animated />
      <InfoList v-show="!isLoading" :list="list" @clickitem="playMusic">
        <template #index="{ index }">
          <div class="sub-index">
            {{ index > 8 ? index + 1 : "0" + (index + 1) }}
          </div>
        </template>
        <template #img="{ item }">
          <img
            class="sub-img mleft-10"
            v-lazy="item.al.picUrl + '?param=100y100'"
          />
        </template>
        <template #title="{ item }">
          {{ item.name }}
        </template>
        <template #item1="{ item }">
          <span
            class="pointer artist-list"
            @click="toArtistDetail(a.id)"
            v-for="a in item.ar"
            :key="a.name"
            >{{ a.name }}</span
          >
        </template>
        <template #item2="{ item }">
          <span @click.stop="toAlbumDetail(item.al.id)">
            {{ item.al.name }}
          </span>
        </template>
        <template #item3="{ item }">
          {{ (item.dt / 1000) | timeFormat }}
        </template>
      </InfoList>
    </div>
    <AddMusicDialog ref="addDialog" :musicIdList="idList" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import InfoList from "@/components/List/InfoList.vue";
import { getTopSong } from "@/api/api-music";
import AddMusicDialog from "@/components/AddMusicDialog.vue";
export default {
  data() {
    return {
      list: [],
      typeList: [
        { id: 0, name: "全部" },
        { id: 7, name: "华语" },
        { id: 96, name: "欧美" },
        { id: 8, name: "日本" },
        { id: 16, name: "韩国" },
      ],
      type: 0,
      isLoading: false,
    };
  },
  components: {
    InfoList,
    AddMusicDialog,
  },
  created() {
    this.getTopSong();
  },
  watch: {
    type() {
      this.getTopSong();
    },
  },
  computed: {
    ...mapState(["musicList"]),
    optionactive() {
      return function (id) {
        return this.type === id;
      };
    },
    idList() {
      return this.list.map((item) => item.id);
    },
    AuthorList() {
      return function (arr) {
        if (arr instanceof Array) {
          const res = [];
          arr.forEach((item) => {
            if (item.name) res.push(item.name);
          });
          return res.join(" / ");
        }
        return arr.name;
      };
    },
  },
  methods: {
    changeOption(id) {
      this.type = id;
    },
    playMusicAll() {
      console.log("调用了");
      if (this.list.length == 0) return;
      let id = this.list[0].id;
      console.log("列表没变", this.list == this.musicList);
      this.$store.commit("setMusicList", this.list);
      this.$store.commit("setCurrenMusicId", id);
      this.$store.commit("setPlayState", true);
      this.getIndex(id);
    },
    openAddDialog() {
      if (this.idList.length === 0) return this.$message.error("歌曲列表为空");
      this.$refs["addDialog"].openDialog();
    },
    playMusic(row) {
      this.$store.commit("setMusicList", this.list);
      this.$store.commit("setCurrenMusicId", row.id);
      this.$store.commit("setPlayState", true);
      this.getIndex(row.id);
    },
    getIndex(id) {
      if (this.musicList.length === 0) return;
      let index = this.musicList.findIndex((item) => item.id == id);
      console.log(index);
      this.$store.commit("setCurrenIndex", index);
    },
    async getTopSong() {
      if (typeof this.type !== "number") return;
      this.isLoading = true;
      const res = await getTopSong(this.type);
      if (res.code != 200) return;
      console.log(res);
      let list = [];
      res.data.forEach((item) => {
        list.push({
          id: item.id,
          dt: item.duration,
          alia: item.alias,
          al: item.album,
          ar: item.artists,
          name: item.name,
          fee: item.fee,
        });
      });
      this.list = Object.freeze(list);
      this.isLoading = false;
    },
    toArtistDetail(id) {
      if (typeof id === "number" && id !== 0)
        this.$router.push("/singerdetail/" + id);
    },
    toAlbumDetail(id) {
      if (typeof id === "number") this.$router.push("/albumdetail/" + id);
    },
  },
};
</script>

<style lang="less" scoped>
.newmusic-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}
.optionactive {
  font-weight: bold;
}
.artist-list {
  display: inline-block;
  &::after {
    display: inline;
    margin: 2px;
    content: "/";
  }
  &:last-child::after {
    content: " ";
  }
}
</style>
