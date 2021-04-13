document.addEventListener('DOMContentLoaded', function(){  //document ready de vanilla JS
  const state = {  //constante que se llama estado guarda las variables que se ejecutan en la app
    pokemons: [],  //info que contiene pokemones 
    offset: 0
  }
  const pokemons = document.querySelector('ul.pokemons')          // selecciona elementos del DOM

  document.addEventListener('click', function(e){
    if (e.target.matches('[href="#"]')){
      e.preventDefault()
    }
    
    if (e.target.matches('.more-pokemons')){
      fetchPokemons()
    }

    if (e.target.matches('.pokemon-detail')){
      e.preventDefault()
      return fetchPokemon(e.target.href)
   }

    if (e.target.closest('.pokemon-detail')){
      e.preventDefault()
      fetchPokemon(e.target.parentNode.href)
   }

  })

    function fetchPokemons(){
      fetch('https://pokeapi.co/api/v2/pokemon/' + `?offset=${state.offset}`, {   // offset 1era 0, 2da: 21, ...
        method:'GET',                                                             //get es opcional no es necesario
        headers: {
          'Content-Type': 'application/json'}
      }).then(function(data){ return data.json() })                                   //el contenido del fetch(contenido de la promesa) y lo transforma a un json
        .then(function(pokemons){ addPokemons(pokemons.results) })    //lo que se convirtio en json lo recibimos en pokemons, asignamos el reusltado (pokemons) 
        .then(function(){ state.offset += 20 })                     // ocupar otros nuevos 20  saltar para no reccibir los mismos
    }

    function fetchPokemon(url){
      fetch(url)
        .then(function(data){return data.json()})
        .then(function(pokemon){renderModal(pokemon)})
    }

    function addPokemons(pokemons){ 
      state.pokemons = [...state.pokemons,...pokemons]                  //... = antiguos pokemones y propagar stado pokemosnes en array nuevo cd 
      renderPokemons()                                                     // de todos los peokemones que hay en el momento
    }

    function renderModal(poke){
      // console.log(poke)
      const poke_modal = document.createElement('div')
      poke_modal.className = 'modal fade'

      const poke_types = poke.types.map(function(p){ return `<li>${p.type.name}</li>`})
      const poke_abilities = poke.abilities.map(function(a){ return `<li>${a.ability.name}</li>`})
      const poke_movements = poke.moves.slice(0,5).map(function(poke){return `<li>${poke.move.name}</li>`})

      const html = `<div class="modal-dialog" role="document">
          <div class="modal-content">
              <div class="modal-header border-0">
                  <h5 class="modal-title" id="pokemon-data-name">${poke.name}</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div class="modal-body px-0">
                  <table class="table">
                      <tr>
                          <th>Types</th>
                          <td>
                              <ol id="pokemon-types">${poke_types.join('')}</ol>
                          </td>
                      </tr>
                      <tr>
                          <th>Abilities</th>
                          <td>
                              <ol id="pokemon-abilities">${poke_abilities.join('')}</ol>
                          </td>
                      </tr>
                      <tr>
                          <th>5 First moves</th>
                          <td>
                              <ol id="pokemon-moves">${poke_movements.join('')}</ol>
                          </td>
                      </tr>
                  </table>
              </div>
          </div>
    </div>`

      poke_modal.innerHTML = html
      document.body.appendChild(poke_modal)

      $('.modal').modal('show')
      $('.modal').on('hidden.bs.modal', function(){
        $(this).remove()
      })
    }

    function renderPokemons(){
        state.pokemons.slice(state.offset).map(function(poke){        //pokemons del momento, 1era 0 // eliminanos los primeros elementos en relacion con el offset
          const li = document.createElement('li')
          li.className = 'list-group-item'

          const link = document.createElement('a')
          link.className = 'pokemon-detail d-flex justify-content-between align-items-center'
          link.href = poke.url  //url de detalle de pokemon

          const text = document.createTextNode(poke.name)

          const span = document.createElement('span') 
          span.className = 'badge badge-primary badge-pill'
          span.innerText = '>' //texto de modo forma mas corta se llama chevron

          link.appendChild(text) 
          link.appendChild(span)   // accinaciones 
          li.appendChild(link)
          
          pokemons.appendChild(li)
        })
    }

    fetchPokemons()
})
