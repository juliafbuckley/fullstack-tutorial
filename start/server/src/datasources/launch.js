// Import the REST extension of DataSource that handles data fetching from
// REST API
const { RESTDataSource } = require("apollo-datasource-rest");

// Calling the data source LaunchAPI and extending RESTDataSource
class LaunchAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = "https://api.spacexdata.com/v2/";
    }

    // We need to make methods that will correlate to all possible
    // incoming request queries

    // for launches query
    async getAllLaunches() {
        // sends a GET request to the api endpoint and stores the array
        // in response
        const response = await this.get('launches');
        return Array.isArray(response)
            // launchReducer transforms each returned launch into the
            // expected format defined in the schema
            ? response.map(launch => this.launchReducer(launch))
            : [];
    }

    launchReducer(launch) {
        return {
            id: launch.flight_number || 0,
            site: `${launch.launch_date_unix}`,
            mission: {
                name: launch.mission_name,
                missionPatchSmall: launch.links.mission_patch_small,
                missionPatchLarge: launch.links.mission_patch,
            },
            rocket: {
                id: launch.rocket.rocket_id,
                name: launch.rocket.rocket_name,
                type: launch.rocket.rocket_type,
            },
        };
    }

    // for launch (id) query
    async getLaunchById({ launchId }) {
        const response = await this.get('launches', { flight_number: launchId });
        return this.launchReducer(response[0]);
    }

    getLaunchesByIds({ launchIds }) {
        return Promise.all(
            launchIds.map(launchId => this.getLaunchById({ launchId })),
        );
    }
}

module.exports = LaunchAPI;