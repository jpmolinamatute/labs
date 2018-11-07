<template>
    <div>
        <p>Hola!!!!</p>
        <table>
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Effective</th>
                    <th>Fair</th>
                    <th>Ineffective</th>
                    <th>none</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in types">
                    <td>{{item._id}}</td>
                    <td>
                        <span v-for="efective in item.efective">{{efective}} </span>
                    </td>
                    <td>
                        <span v-for="fair in item.fair">{{fair}} </span>
                    </td>
                    <td>
                        <span v-for="inefective in item.inefective">{{inefective}} </span>
                    </td>
                    <td>
                        <span v-for="none in item.none">{{none}} </span>
                    </td>
                </tr>
            </tbody>
        </table>
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Type 1</th>
                    <th>Type 2</th>
                    <th>Detail</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in pokemons">
                    <td><img v-if="item.thumbnailimage" :src="`${item.thumbnailimage}`" :alt="`${item.name}`"></td>
                    <td>{{item.name}}</td>
                    <td>{{item.type1}}</td>
                    <td>{{item.type2}}</td>
                    <td><a :href="`https://www.pokemon.com/${item.detailpageurl}`" target="pokedex-display">link</a></td>
                </tr>
            </tbody>
        </table>
        <iframe frameborder="0" name="pokedex-display"></iframe>
    </div>
</template>

<script>
import API from "../Api.js";
export default {
  name: "type",
  data() {
    return {
      types: [],
      pokemons: []
    };
  },
  mounted() {
    const api = new API();
    this.getTypes(api);
    this.getPokemons(api);
  },
  methods: {
    async getTypes(api) {
      const response = await api.fetchTypes("grass");
      this.types = response.data;
    },
    async getPokemons(api) {
      const response = await api.fetchPokemons();
      this.pokemons = response.data;
    }
  }
};
</script>

<style>
</style>
