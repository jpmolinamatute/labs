<template>
    <select id="pokemon-list">
        <optgroup v-for="t in types" v-bind:label="t">
            <option v-for="pokemon in getPokemon(t)" v-bind:value="pokemon._id">
                {{ pokemon.name }}
            </option>
        </optgroup>
    </select>
</template>

<script>
import API from "../Api.js";
export default {
  name: "pokemonList",
  data() {
    return {
      pokemons: [],
      types: []
    };
  },
  mounted() {
    const api = new API();
    this.getTypes(api);
    this.getAllPokemons(api);
  },
  methods: {
    async getTypes(api) {
      const response = await api.fetchAllTypes();
      this.types = response.data;
    },
    async getAllPokemons(api) {
      const response = await api.fetchAllPokemons();
      this.pokemons = response.data;
    },
    getPokemon(type) {
      let list = null;
      if (typeof type === "string" && this.pokemons.length > 0) {
        list = [];

        this.pokemons.forEach(pokemon => {
          if (pokemon.type1 === type || pokemon.type2 === type) {
            list.push({
              _id: pokemon._id,
              name: pokemon.name
            });
          }
        });
      }
      return list;
    }
  }
};
</script>
