Brighte GraphQL API for leads of services.

Commands

Run `npm start` to run locally

Run `npm test` to run unit testing.

1 mutation for registering a new service

Example mutation request


mutation {
  register(input: {
    name: "John Doe"
    email: "john@example.com"
    mobile: "+61412345678"
    postcode: "2000"
    interestedServices: [DELIVERY, PICKUP]
  }) {
    id
    name
    email
    mobile
    postcode
    interestedServices
  }
}

2 query request 

Example lead request


query {
  leads {
    id
    name
    email
    mobile
    postcode
    interestedServices
  }
}


query {
  lead(id: 1) {
    id
    name
    email
    mobile
    postcode
    interestedServices
  }
}
