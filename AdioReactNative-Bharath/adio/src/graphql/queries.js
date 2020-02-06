/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAd = /* GraphQL */ `
  query GetAd(
    $maxLat: Float!
    $maxLng: Float!
    $minLat: Float!
    $minLng: Float!
  ) {
    getAd(maxLat: $maxLat, maxLng: $maxLng, minLat: $minLat, minLng: $minLng) {
      uniqueID
      campaignName
      adName
      owner
      maxLat
      maxLng
      minLat
      minLng
      file {
        bucket
        region
        key
      }
    }
  }
`;
export const listAds = /* GraphQL */ `
  query ListAds(
    $maxLat: Float
    $maxLngMinLatMinLng: ModelAdPrimaryCompositeKeyConditionInput
    $filter: ModelAdFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listAds(
      maxLat: $maxLat
      maxLngMinLatMinLng: $maxLngMinLatMinLng
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        uniqueID
        campaignName
        adName
        owner
        maxLat
        maxLng
        minLat
        minLng
        file {
          bucket
          region
          key
        }
      }
      nextToken
    }
  }
`;
export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      title
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
      }
      nextToken
    }
  }
`;
