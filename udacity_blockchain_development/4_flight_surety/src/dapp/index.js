import Contract from "./contract"
import "./flightsurety.css"
import {
  getPastAppLogs,
  getPastDataLogs,
  getAllAppEvents,
  getAllDataEvents,
  onAuthorizeAppContract,
  getDataContractStatus,
  setDataContractStatus,
  getAirlines,
  registerNewAirlines,
  fundAirline,
  voteForAirline,
  registerFlight,
  getFlightKeys,
  getFlight,
  requestFlightStatus,
  freezeFlight,
  creditInsurees,
  buyInsurance,
  filterUniqAirlines,
} from "./utils"

export { contract }

let contract = null

;(async () => {
  contract = await new Contract("localhost")

  // get events
  getPastAppLogs()
  getPastDataLogs()
  getAllAppEvents()
  getAllDataEvents()

  // set contract addresses
  $("#app-contract-address").val(contract.flightSuretyAppAddress)
  $("#data-contract-address").val(contract.flightSuretyDataAddress)

  getDataContractStatus().then((result) => {
    const operationRadios = $("input:radio[name=data-isoperational]")
    operationRadios.filter(`[value=${result}]`).prop("checked", true)
  })

  for (const airlineAddress of contract.airlines) {
    $("#new-airline-address").append(
      $("<option>", { value: airlineAddress, text: airlineAddress })
    )
  }

  for (const insureeAddress of contract.insurees) {
    $("#flight-insurance-insurees").append(
      $("<option>", { value: insureeAddress, text: insureeAddress })
    )
  }

  // onClick handler
  $("#authorize-app-contract").click(onAuthorizeAppContract)
  $("#get-data-contract-status").click(async () => {
    const mode = await getDataContractStatus()
    const operationRadios = $("input:radio[name=data-isoperational]")
    operationRadios.filter(`[value=${mode}]`).prop("checked", true)
  })
  $("#set-data-contract-status").click(() => {
    const operationRadio = $(
      "input:radio[name=data-isoperational]:checked"
    ).val()

    setDataContractStatus(operationRadio === "true" ? true : false)
  })

  $("[name=get-airlines]").each((_i, element) => {
    $(element).click(async () => {
      const airlines = await getAirlines()

      const activeAirlines = airlines.filter(
        (airline) => airline.status === "active"
      )
      const registeredAirlines = airlines.filter(
        (airline) => airline.status === "registered"
      )
      const unRegisteredAirlines = airlines.filter(
        (airline) => airline.status === "unregistered"
      )

      const activeSelection = [
        $("#active-airlines"),
        $("#flight-airlines"),
        $("#insurance-airlines"),
      ]
      activeSelection.forEach((select) => {
        activeAirlines
          .filter((airline) => filterUniqAirlines(airline, select))
          .forEach((airline) => {
            select.append(
              $("<option>", { value: airline.address, text: airline.name })
            )
          })
      })

      const registeredSelection = [
        $("#registered-airlines"),
        $("#funding-airlines"),
        $("#voting-airline"),
      ]
      registeredSelection.forEach((select) => {
        registeredAirlines
          .filter((airline) => filterUniqAirlines(airline, select))
          .forEach((airline) => {
            select.append(
              $("<option>", { value: airline.address, text: airline.name })
            )
          })
      })

      const unRegisteredSelection = [
        $("#unregistered-airlines"),
        $("#airline-to-vote-for"),
      ]
      unRegisteredSelection.forEach((select) => {
        unRegisteredAirlines
          .filter((airline) => filterUniqAirlines(airline, select))
          .forEach((airline) => {
            select.append(
              $("<option>", { value: airline.address, text: airline.name })
            )
          })
      })
    })
  })

  $("#register-new-airline").click(() => {
    const airlineName = $("#new-airline-name").val()
    const airlineAdress = $("#new-airline-address").val()

    registerNewAirlines(airlineName, airlineAdress)
  })

  $("#fund-airline").click(() => {
    const fundAirlineAddress = $("#funding-airlines").val()
    const fundAirlineAmount = $("#fund-airline-amount").val()

    fundAirline(fundAirlineAddress, fundAirlineAmount)
  })

  $("#vote-airline").click(() => {
    const airlineToVoteFor = $("#airline-to-vote-for").val()
    const votingAirline = $("#voting-airline").val()

    voteForAirline(airlineToVoteFor, votingAirline)
  })

  $("#register-flight").click(() => {
    const airlineAddress = $("#flight-airlines").val()
    const flightName = $("#flight-name").val()
    const insuranceAmount = $("#insurance-amount").val()

    registerFlight(airlineAddress, flightName, insuranceAmount)
  })

  $("[name=get-flights]").each((_i, element) =>
    $(element).click(async () => {
      const airlineAddress = $("#flight-airlines").val()

      const flightKeys = await getFlightKeys(airlineAddress)

      const flightPromises = flightKeys.map((flightKey) => {
        return getFlight(flightKey)
      })
      const flights = await Promise.all(flightPromises)

      const selector = [$("#airline-flights"), $("#insurance-flights")]

      for (const flight of flights) {
        selector.forEach((option) => {
          option.append($("<option>", { value: flight.name, text: flight.name }))
        })
      }
    })
  )

  $("#get-flight-status").click(async () => {
    const airlineAddress = $("#flight-airlines").val()
    const flightName = $("#flight-name").val()

    const flight = await getFlight(airlineAddress, flightName)

    $("#flight-status").val(flight[1])
    $("#flight-freezeTimestamp").val(flight[3])
    $("#flight-lastUpdatedTimestamp").val(flight[4])

    $("#flight-landed").val(flight[6])
    $("#flight-insurancePrice").val(flight[7])
    $("#flight-insuranceaddresses").val(flight[8].length)
  })

  $("#request-flight-status").click(() => {
    const airlineAddress = $("#flight-airlines").val()
    const flightName = $("#flight-name").val()

    requestFlightStatus(airlineAddress, flightName)
  })

  $("#freeze-flight").click(() => {
    const airlineAddress = $("#flight-airlines").val()
    const flightName = $("#flight-name").val()

    freezeFlight(airlineAddress, flightName)
  })

  $("#credit-insurees").click(() => {
    const airlineAddress = $("#flight-airlines").val()
    const flightName = $("#flight-name").val()

    creditInsurees(airlineAddress, flightName)
  })

  $("#buy-insurance").click(() => {
    const airlineAddress = $("#flight-airlines").val()
    const flightName = $("#flight-name").val()
    const insureeAddress = $("#flight-insurance-insurees").val()
    const insuranceAmount = $("#insurance-amount").val()

    buyInsurance(airlineAddress, flightName, insureeAddress, insuranceAmount)
  })
})()
