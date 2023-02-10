import React, { Fragment } from 'react';
import { gql, useQuery } from '@apollo/client';
import { LaunchTile, Header, Button, Loading } from '../components';
// Because we are using TypeScript we need to import the types generated
// from server's schema definitions
import * as GetLaunchListTypes from './__generated__/GetLaunchList';

// Defines a GraphQL fragment LaunchTile
// YOu can include the fragment across multiple queries
export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    __typename
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;

// Define the query
export const GET_LAUNCHES = gql`
  query GetLaunchList($after: String) {
    # $after variable is the most recent cursor value
    # Used to fetch the next set of launches
    launches(after: $after) {
      # Paginated results need hasMore and cursor
      cursor
      hasMore
      launches {
      # Including the above defined LaunchTile fragment
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

interface LaunchesProps {}

// Passes GET_LAUNCHES query to useQuery and obtains data, loading, 
// and error properties
// Based on the states of the properties, the display is different

const Launches: React.FC<LaunchesProps> = () => {
  const { data, loading, error } = useQuery<GetLaunchListTypes.GetLaunchList, GetLaunchListTypes.GetLaunchListVariables>(GET_LAUNCHES);
  console.log(data);
  console.log(loading);
  console.log(error);
  
  if (loading) return <Loading />;
  if (error || !data) return <p>ERROR</p>;

  return (
    <Fragment>
      <Header />
      {data.launches &&
        data.launches.launches &&
        data.launches.launches.map((launch: any) => (
          <LaunchTile key={launch.id} launch={launch} />
        ))}
    </Fragment>
  );
};

export default Launches;
