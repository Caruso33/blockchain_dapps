export { filterUniqAirlines }

function filterUniqAirlines(airline, select) {
  let alreadyExist = false
  $(select)
    .children("option")
    .each((_i, option) => {
      if ($(option).val() === airline.address) alreadyExist = true
    })

  if (alreadyExist) return false

  return true
}
