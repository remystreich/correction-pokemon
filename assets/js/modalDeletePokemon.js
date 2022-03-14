//me permet d'afficher la modal de suppression
var modal = document.getElementById('modal')
modal.addEventListener('show.bs.modal', function (event) {
  var button = event.relatedTarget
  var pokeId = button.getAttribute('data-bs-pokeId')
  var modalForm = modal.querySelector('#modalForm')
  modalForm.action = `/deletePokemon/${pokeId}`

})