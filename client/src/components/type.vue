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
                    <th>Name</th>
                    <th>Type 1</th>
                    <th>Type 2</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in pokemons">
                    <td>{{item.name}}</td>
                    <td>{{item.type1}}</td>
                    <td>{{item.type2}}</td>
                </tr>
            </tbody>
        </table>
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
      const response = await api.fetchTypes();
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
