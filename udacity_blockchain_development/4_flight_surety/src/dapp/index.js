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
  getFlights,
  getFlight,
  requestFlightStatus,
  freezeFlight,
  creditInsurees,
} from "./utils"

export { contract }

let contract = null

;async () => {
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

  $("#get-airlines").click(async () => {
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

    const activeSelection = [$("#active-airlines"), $("#flight-airlines")]
    activeSelection.forEach((option) => {
      activeAirlines.forEach((airline) => {
        option.append(
          $("<option>", { value: airline.address, text: airline.name })
        )
      })
    })

    const registeredSelection = [
      $("#registered-airlines"),
      $("#voting-airline"),
      $("#flight-airline-selector"),
    ]
    registeredSelection.forEach((option) => {
      registeredAirlines.forEach((airline) => {
        option.append(
          $("<option>", { value: airline.name, text: airline.name })
        )
      })
    })

    const unRegisteredSelection = [
      $("#unregistered-airlines"),
      $("#airline-to-vote-for"),
    ]
    unRegisteredSelection.forEach((option) => {
      unRegisteredAirlines.forEach((airline) => {
        option.append(
          $("<option>", { value: airline.name, text: airline.name })
        )
      })
    })
  })

  $("#register-new-airline").click(() => {
    const airlineName = $("#new-airline-name").val()
    const airlineAdress = $("#new-airline-address").val()

    registerNewAirlines(airlineName, airlineAdress)
  })

  $("#fund-airline").click(() => {
    const fundAirlineAddress = $("#fund-airline").val()
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

    registerFlight(airlineAddress, flightName)
  })

  $("#get-flights").click(async () => {
    const airlineAddress = $("#flight-airlines").val()

    const flights = await getFlights(airlineAddress)

    for (const flight of flights) {
      $("#flights-selector").append(
        $("<option>", { value: flight, text: flight })
      )
    }
  })

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
}
