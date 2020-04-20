/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAd = /* GraphQL */ `
  query GetAd($uniqueID: String!) {
    getAd(uniqueID: $uniqueID) {
      uniqueID
      campaignName
      adName
      email
      maxLat
      maxLng
      minLat
      minLng
      file {
        bucket
        region
        key
      }
      description
      numImpressions
    }
  }
`;
export const listAds = /* GraphQL */ `
  query ListAds(
    $uniqueID: String
    $filter: ModelAdFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listAds(
      uniqueID: $uniqueID
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        uniqueID
        campaignName
        adName
        email
        maxLat
        maxLng
        minLat
        minLng
        file {
          bucket
          region
          key
        }
        description
        numImpressions
      }
      nextToken
    }
  }
`;
