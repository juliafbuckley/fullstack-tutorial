const { paginateResults } = require("./utils");

module.exports = {
    // The resolver for a parent field always executes before the resolvers for 
    // that field's children

    // Top-level field Query type
    
    // Define resolvers in a map, where the map's keys correspond to schema's types (Query)
    // and fields (launches, launch, me)
    Query: {
        // "_" indicates they don't use the parent value
        // "__" indicates they don't use any args
        // all three use (context) - which is used to access the dataSources
        launches: async (_, { pageSize = 20, after }, { dataSources }) => {
            const allLaunches = await dataSources.launchAPI.getAllLaunches();
            allLaunches.reverse();

            const launches = paginateResults({
                after,
                pageSize,
                results: allLaunches,
            });

            return {
                launches,
                cursor: launches.length ? launches[launches.length - 1].cursor : null,
                hasMore: launches.length
                    ? launches[launches.length - 1].cursor !==
                    allLaunches[allLaunches.length - 1].cursor
                    : false,
            };
        },
        
        launch: (_, { id }, { dataSources }) =>
            dataSources.launchAPI.getLaunchById({ launchId: id }),
        me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser(),
    },

    // Mutation resolvers
    Mutation: {
        // User login - takes an email address and returns the user data
        login: async (_, { email }, { dataSources }) => {
            const user = await dataSources.userAPI.findOrCreateUser({ email });
            if (user) {
                user.token = Buffer.from(email).toString('base64');
                return user;
            }
        },

        bookTrips: async(_, { launchIds }, { dataSources }) => {
            const results = await dataSources.userAPI.bookTrips({ launchIds });
            const launches = await dataSources.launchAPI.getLaunchesByIds({
                launchIds,
            });

            return {
                success: results && results.length === launchIds.length,
                message:
                    results.length === launchIds.length
                        ? 'trips booked successfully!'
                        : `the following launches couldn't be booked: ${launchIds.filter(
                            id => !results.includes(id),
                        )}`,
                launches,
            };
        },

        cancelTrip: async(_, { launchId }, { dataSources }) => {
            // call the function
            const result = await dataSources.userAPI.cancelTrip({ launchId });
            
            if (!result)
                return {
                    success: false,
                    message: 'failed to cancel trip',
                };
            
            const launch = await dataSources.launchAPI.getLaunchById({ launchId });
            return {
                success: true,
                message: 'trip cancelled',
                launches: [launch],
            };
        },
    },


    // Parent is Launch.mission
    // Resolver gets a large or small patch from mission, which is the return object
    // from Launch.mission
    Mission: {
        // The default size is 'LARGE' if not provided
        missionPatch: (mission, { size } = { size: 'LARGE' }) => {
            return size === 'SMALL'
                ? mission.missionPatchSmall
                : mission.missionPatchLarge;
        },
    },

    Launch: {
        isBooked: async (launch, _, { dataSources }) =>
            dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id }),
    },
    User: {
        trips: async (_, __, { dataSources }) => {
            // get ids of launches by user
            const launchIds = await dataSources.userAPI.getLaunchIdsByUser();

            if (!launchIds.length) return [];

            // look up the launches by their ids
            const launches = await dataSources.launchAPI.getLaunchesByIds(launchIds);

            return (
                dataSources.launchAPI.getLaunchesByIds({ launchIds, }) || []
            );
        },
    },
};