<template>
  <div class="posts">
    <h1>Posts</h1>
    This file will list all the posts.
    <p>hola!!!!</p>
    <div v-for="post in posts">
      <p>
        <span><b>{{ post.title }}</b></span><br />
        <span>{{ post.description }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import PostsService from "../PostsService";
console.log("this file was loaded?");
export default {
  name: "posts",
  data() {
    return {
      posts: []
    };
  },
  mounted() {
    console.log("mounted");

    this.getPosts();
  },
  methods: {
    async getPosts() {
      const response = await PostsService.fetchPosts();
      console.log("PostsService.fetchPosts() was called");

      this.posts = response.data;
    }
  }
};
</script>
