/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAd = /* GraphQL */ `
  mutation CreateAd($input: CreateAdInput!, $condition: ModelAdConditionInput) {
    createAd(input: $input, condition: $condition) {
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
export const updateAd = /* GraphQL */ `
  mutation UpdateAd($input: UpdateAdInput!, $condition: ModelAdConditionInput) {
    updateAd(input: $input, condition: $condition) {
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
export const deleteAd = /* GraphQL */ `
  mutation DeleteAd($input: DeleteAdInput!, $condition: ModelAdConditionInput) {
    deleteAd(input: $input, condition: $condition) {
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
