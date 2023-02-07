// The schema defines what types of data a client
// can read and write to your graph

const { gql } = require("apollo-server");

const typeDefs = gql `
    type Launch {
        # ! Means not null
        id: ID!
        site: String
        mission: Mission
        rocket: Rocket
        isBooked: Boolean!
    }

    type Rocket {
        id: ID!
        name: String
        type: String
    }

    type User {
        id: ID!
        email: String!
        trips: [Launch]!
        token: String
    }

    type Mission {
        name: String
        missionPatch(size: PatchSize): String
    }

    enum PatchSize {
        SMALL
        LARGE
    }

    # Define your graph's supported queries as fields of
    # a special type called the Query type

    type Query {
        # returns array of all upcoming launches
        # Updated to implement pagination
        launches(
            pageSize: Int
            after: String
        ): LaunchConnection!

        # returns a single launch that corresponds to id
        launch(id: ID!): Launch

        # returns details for the User that is logged in
        me: User
    }

    # Wrapper around our list of launches that contains a cursor
    # to the last item in the list. Pass the cursor to the 
    # launches query to fetch results after these
    type LaunchConnection {
        cursor: String!
        hasMore: Boolean!
        launches: [Launch]!
    }

    # Mutations enable clients to modify data

    type Mutation {
        # Enables user to book a trip on one or more launches
        bookTrips(launchIds: [ID]!): TripUpdateResponse!
        # Enables user to book a trip that they previously booked
        cancelTrip(launchId: ID!): TripUpdateResponse!
        # Enables user to log in with email
        login(email: String): User
    }

    # Define a special object type for mutation response

    type TripUpdateResponse {
        success: Boolean!
        message: String
        launches: [Launch]
    }
    
`;

module.exports = typeDefs;